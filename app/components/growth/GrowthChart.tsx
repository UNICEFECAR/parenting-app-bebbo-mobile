import {chartInnerViewBg, outerViewbg} from '@styles/style';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Circle, Path, Skia} from 'react-native-skia';
import {area, curveNatural} from 'd3-shape';
import {
  CartesianChart,
  Line,
  type CartesianChartRenderArg,
} from 'victory-native';
import useDigitConverter from '../../customHooks/useDigitConvert';
import {
  convertMeasuresData,
  type ChartAreaDataFormat,
} from '../../services/growthService';
import {
  clampTooltipPosition,
  getGrowthChartDomain,
  getOuterReferenceBand,
  prepareGrowthChartData,
} from './growthChartData';

export enum chartTypes {
  WeightForHeight,
  HeightForAge,
}

type Scales = Pick<
  CartesianChartRenderArg<{x: number; y: number}, 'y'>,
  'xScale' | 'yScale'
>;
type Props = {
  activeChild: any;
  chartType: chartTypes;
  bgObj: ChartAreaDataFormat;
  windowWidth: number;
  windowHeight: number;
};

const styles = StyleSheet.create({
  mainView: {alignItems: 'center'},
  chart: {direction: 'ltr'},
  axisText: {
    position: 'absolute',
    color: '#455A64',
    fontSize: 12,
    textAlign: 'center',
  },
  yTick: {left: 0, width: 42, textAlign: 'right'},
  xTick: {width: 50},
  unitX: {bottom: 12, width: 120},
  tickX: {
    position: 'absolute',
    width: 1,
    height: 5,
    backgroundColor: '#90A4AE',
  },
  tickY: {
    left: 45,
    position: 'absolute',
    width: 5,
    height: 1,
    backgroundColor: '#90A4AE',
  },
  unitY: {left: 4, top: 12, width: 70},
  measurement: {position: 'absolute', width: 42, height: 42, borderRadius: 21},
  tooltip: {
    position: 'absolute',
    backgroundColor: '#262626',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'center',
  },
  pointerBelow: {top: -10, borderBottomWidth: 10, borderBottomColor: '#262626'},
  pointerAbove: {bottom: -10, borderTopWidth: 10, borderTopColor: '#262626'},
  tooltipPointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  chartLegendItem: {alignItems: 'center', flexDirection: 'row'},
  chartInnerView: {
    backgroundColor: chartInnerViewBg,
    height: 12,
    margin: 10,
    width: 27,
  },
  outerView: {backgroundColor: outerViewbg, height: 12, margin: 10, width: 27},
  textFont: {fontSize: 11, opacity: 0.5},
});

// Measure each tooltip's text instead of stretching every tooltip to a fixed width.
const MeasurementTooltip = ({
  x,
  y,
  width,
  height,
  text,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}): React.JSX.Element => {
  const [size, setSize] = useState({width: 54, height: 40});
  const position = clampTooltipPosition(
    x,
    y,
    width,
    height,
    size.width,
    size.height,
  );
  const below = position.top > y;
  const pointerLeft = Math.max(
    6,
    Math.min(x - position.left - 5, size.width - 16),
  );
  return (
    <View
      pointerEvents="none"
      testID="growth-measurement-tooltip"
      onLayout={({nativeEvent: {layout}}) =>
        setSize(previous =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : {width: layout.width, height: layout.height},
        )
      }
      style={[styles.tooltip, position, {maxWidth: Math.min(190, width - 8)}]}>
      <Text style={styles.tooltipText}>{text}</Text>
      <View
        style={[
          styles.tooltipPointer,
          {left: pointerLeft},
          below ? styles.pointerBelow : styles.pointerAbove,
        ]}
      />
    </View>
  );
};

// Use d3's area generator with a Y0 at every reference point, just as the
// legacy chart did. A constant baseline would distort the reference bands.
const ReferenceBands = React.memo(
  ({
    reference,
    xScale,
    yScale,
    portrait,
  }: Scales & {
    reference: ChartAreaDataFormat;
    portrait: boolean;
  }) => {
    const paths = useMemo(() => {
      const generator = area<ChartAreaDataFormat['topArea'][number]>()
        .defined(
          point =>
            typeof point.x === 'number' &&
            Number.isFinite(point.x) &&
            typeof point.y === 'number' &&
            Number.isFinite(point.y) &&
            typeof point.y0 === 'number' &&
            Number.isFinite(point.y0),
        )
        .x(point => xScale(point.x!))
        .y1(point => yScale(point.y!))
        .y0(point => yScale(point.y0!))
        .curve(curveNatural);
      const outer = getOuterReferenceBand(reference);
      const bands = outer
        ? [
            {data: outer, outer: true},
            {data: reference.middleArea, outer: false},
          ]
        : [
            {data: reference.topArea, outer: true},
            {data: reference.bottomArea, outer: true},
            {data: reference.middleArea, outer: false},
          ];
      return bands.map(band => {
        const svg = generator(
          band.data.slice().sort((a, b) => (a.x ?? 0) - (b.x ?? 0)),
        );
        return {
          path: svg ? Skia.Path.MakeFromSVGString(svg) : null,
          outer: band.outer,
        };
      });
    }, [reference, xScale, yScale]);
    return (
      <>
        {paths.map(
          ({path, outer}, index) =>
            path && (
              <Path
                key={index}
                path={path}
                color={outer && !portrait ? '#F9C49E' : '#D8D8D8'}
              />
            ),
        )}
      </>
    );
  },
);

const GrowthChart = ({
  activeChild,
  chartType,
  bgObj,
  windowWidth,
  windowHeight,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {convertDigits} = useDigitConverter();
  const portrait = windowWidth < windowHeight;
  const width = Math.max(120, windowWidth - (portrait ? 30 : 60));
  const height = Math.max(120, portrait ? windowWidth - 60 : windowHeight - 50);
  const childBirthDate = activeChild?.taxonomyData?.prematureTaxonomyId
    ? activeChild.plannedTermDate
    : activeChild.birthDate;
  const weightForHeight = chartType === chartTypes.WeightForHeight;
  const labelX = weightForHeight ? t('growthScreencmText') : t('month');
  const labelY = weightForHeight
    ? t('growthScreenkgText')
    : t('growthScreencmText');
  const {measurements, domainData} = useMemo(() => {
    const eligible = activeChild.measures.filter(
      (item: any) =>
        item.isChildMeasured == true && item.weight > 0 && item.height > 0,
    );
    const converted = convertMeasuresData(eligible, childBirthDate);
    return prepareGrowthChartData(
      converted.map((item: any) =>
        weightForHeight
          ? {x: item.height, y: item.weight}
          : {x: item.measurementDate / 30, y: item.height},
      ),
      bgObj,
    );
  }, [activeChild.measures, childBirthDate, weightForHeight, bgObj]);
  const domain = useMemo(() => getGrowthChartDomain(domainData), [domainData]);
  const [rawScales, setRawScales] = useState<Scales | null>(null);
  // CartesianChart automatically calls nice() on its Y scale. Use a copy with
  // the exact legacy data extent for all geometry, labels and touch targets.
  const scales = useMemo(
    () =>
      rawScales
        ? {
            xScale: rawScales.xScale.copy().domain(domain.x),
            yScale: rawScales.yScale.copy().domain([domain.y[1], domain.y[0]]),
          }
        : null,
    [rawScales, domain],
  );
  const [selected, setSelected] = useState<number[]>([]);
  const onScaleChange = useCallback(
    (xScale: Scales['xScale'], yScale: Scales['yScale']) => {
      setRawScales({xScale, yScale});
    },
    [],
  );
  useEffect(() => {
    setSelected([]);
  }, [measurements, width, height]);
  const describe = (point: {x: number; y: number}): string =>
    `${convertDigits(point.y)} ${labelY} / \n${convertDigits(
      Math.round((point.x + Number.EPSILON) * 100) / 100,
    )} ${labelX}`;
  return (
    <View style={styles.mainView}>
      <View style={[styles.chart, {width, height}]}>
        <CartesianChart
          data={domainData}
          xKey="x"
          yKeys={['y']}
          padding={50}
          xAxis={{lineWidth: 0, lineColor: 'transparent'}}
          yAxis={[{lineWidth: 0, lineColor: 'transparent'}]}
          onScaleChange={onScaleChange}
          renderOutside={() =>
            scales &&
            measurements.map((point, index) => (
              <React.Fragment key={index}>
                <Circle
                  cx={scales.xScale(point.x)}
                  cy={scales.yScale(point.y)}
                  r={9}
                  color="white"
                />
                <Circle
                  cx={scales.xScale(point.x)}
                  cy={scales.yScale(point.y)}
                  r={9}
                  style="stroke"
                  strokeWidth={3}
                  color={selected.includes(index) ? 'orange' : '#ACACAC'}
                />
              </React.Fragment>
            ))
          }>
          {() => {
            if (!scales) return null;
            const {xScale, yScale} = scales;
            const points = measurements.map(point => ({
              x: xScale(point.x),
              y: yScale(point.y),
              xValue: point.x,
              yValue: point.y,
            }));
            return (
              <>
                <ReferenceBands
                  reference={bgObj}
                  xScale={xScale}
                  yScale={yScale}
                  portrait={portrait}
                />
                {points.length > 1 && (
                  <Line
                    points={points}
                    curveType="natural"
                    color="#0C66FF"
                    strokeWidth={9}
                    strokeCap="round"
                  />
                )}
              </>
            );
          }}
        </CartesianChart>
        {/* Native text retains system font fallback for all translated digits.
            Only measurement dots receive presses; reference curves never do. */}
        {scales && (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              {scales.xScale.ticks(5).map(value => (
                <React.Fragment key={value}>
                  <View
                    style={[
                      styles.tickX,
                      {left: scales.xScale(value), top: height - 50},
                    ]}
                  />
                  <Text
                    key={value}
                    style={[
                      styles.axisText,
                      styles.xTick,
                      {left: scales.xScale(value) - 25, top: height - 40},
                    ]}>
                    {convertDigits(value)}
                  </Text>
                </React.Fragment>
              ))}
              {scales.yScale.ticks(5).map(value => (
                <React.Fragment key={value}>
                  <View style={[styles.tickY, {top: scales.yScale(value)}]} />
                  <Text
                    key={value}
                    style={[
                      styles.axisText,
                      styles.yTick,
                      {top: scales.yScale(value) - 8},
                    ]}>
                    {convertDigits(value)}
                  </Text>
                </React.Fragment>
              ))}
              <Text
                style={[
                  styles.axisText,
                  styles.unitX,
                  {
                    left:
                      (portrait ? windowWidth - 180 : windowHeight - 30) - 60,
                  },
                ]}>
                {labelX}
              </Text>
              <Text style={[styles.axisText, styles.unitY]}>{labelY}</Text>
            </View>
            {measurements.map((point, index) => (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={describe(point)}
                accessibilityState={{selected: selected.includes(index)}}
                testID={`growth-measurement-${index}`}
                onPress={() =>
                  setSelected(previous =>
                    previous.includes(index)
                      ? previous.filter(value => value !== index)
                      : [...previous, index],
                  )
                }
                style={[
                  styles.measurement,
                  {
                    left: scales.xScale(point.x) - 21,
                    top: scales.yScale(point.y) - 21,
                  },
                ]}
              />
            ))}
            {selected.map(
              index =>
                measurements[index] && (
                  <MeasurementTooltip
                    key={index}
                    x={scales.xScale(measurements[index].x)}
                    y={scales.yScale(measurements[index].y)}
                    width={width}
                    height={height}
                    text={describe(measurements[index])}
                  />
                ),
            )}
          </View>
        )}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.chartLegendItem}>
          <View style={styles.chartInnerView} />
          <Text style={styles.textFont}>
            {t('growthChartLegendSilverLabel')}
          </Text>
        </View>
        {!portrait && (
          <View style={styles.chartLegendItem}>
            <View style={styles.outerView} />
            <Text style={styles.textFont}>
              {t('growthChartLegendOrangeLabel')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default React.memo(GrowthChart);
