import { chartInnerViewBg, outerViewbg } from '@styles/style';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryAreaProps } from 'victory-area';
import { LabelProps, VictoryAxisCommonProps } from 'victory-core';
import { VictoryLineProps } from 'victory-line';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory-native';
import { VictoryScatterProps } from 'victory-scatter';
import { VictoryTooltipProps } from 'victory-tooltip';
import useDigitConverter from '../../customHooks/useDigitConvert';
import { convertMeasuresData } from '../../services/growthService';
export interface LineChartData {
  x: number;
  y: number;
}
export interface ChartData {
  measurementDate: number;
  weight: number;
  length: number;
}
export interface GrowtChartStyles {
  container?: ViewStyle;
  contentWrapper?: ViewStyle;
  chartLegend: ViewStyle;
  chartLegendItem: ViewStyle;
  chartHeader: ViewStyle;
  mainView: ViewStyle;
  chartInnerView: ViewStyle;
  textFont: ViewStyle;
  outerView: ViewStyle;
}
export interface VictoryStyles {
  VictoryAxis: VictoryAxisCommonProps['style'];
  VictoryAxisVertical: VictoryAxisCommonProps['style'];
  VictoryLine: VictoryLineProps['style'];
  VictoryScatter: VictoryScatterProps['style'];
  VictoryArea: VictoryAreaProps['style'];
  axisLabel?: LabelProps;
  VictoryTooltip: VictoryTooltipProps;
}
export enum chartTypes {
  WeightForHeight,
  HeightForAge,
}
const styles = StyleSheet.create<GrowtChartStyles>({
  chartHeader: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 20,
  },
  chartInnerView: {
    backgroundColor: chartInnerViewBg,
    height: 12,
    margin: 10,
    width: 27,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  chartLegendItem: {
    alignItems: 'center',
    flexDirection: 'row',

  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  contentWrapper: {
    paddingLeft: 15,
    paddingRight: 15,

  },
  mainView: { alignItems: 'center', flexDirection: 'column' },
  outerView: {
    backgroundColor: outerViewbg,
    height: 12,
    margin: 10,
    width: 27,
  },
  textFont: { fontSize: 11, opacity: 0.5 }
});
const victoryStyles: VictoryStyles = {
  VictoryAxis: {
    grid: { stroke: 'transparent' },
    axis: { stroke: 'none' }
  },
  VictoryAxisVertical: {
    grid: { stroke: 'transparent' },
    axis: { stroke: 'none' },
    axisLabel: { angle: 0 }
  },
  VictoryLine: {
    data: { stroke: '#0C66FF', strokeWidth: 9, strokeLinecap: 'round' },
  },
  VictoryScatter: {
    data: { fill: 'white', stroke: '#ACACAC', strokeWidth: 3 },
    labels: { fill: 'red' }
  },
  VictoryArea: {
    data: { fill: '#D8D8D8' },
  },

  VictoryTooltip: {
    flyoutStyle: {
      stroke: 'none',
      fill: '#262626',
      opacity: 85,
    },
    style: {
      padding: 15,
      fill: 'white',
    },
  },
};
const GrowthChart = (props: any): any => {
  const { activeChild, chartType, bgObj, windowWidth, windowHeight } = props;
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter()
  const childBirthDate = activeChild?.taxonomyData?.prematureTaxonomyId ? activeChild.plannedTermDate : activeChild.birthDate;
  const labelX = props.chartType == chartTypes.WeightForHeight ? t('growthScreencmText') : t('month');
  const labelY = props.chartType == chartTypes.WeightForHeight ? t('growthScreenkgText') : t('growthScreencmText');
  const [deviceOrientation, setDeviceOrientation] = useState(
    windowWidth < windowHeight
      ? 'portrait'
      : 'landscape'
  );


  useEffect(() => {
    setDeviceOrientation(windowWidth < windowHeight
      ? 'portrait'
      : 'landscape')
  }, [windowWidth, windowHeight]);
  useEffect(() => {
    const deviceOrientation = (): any => {
      if (windowWidth < windowHeight) {
        setDeviceOrientation('portrait');
      } else {
        setDeviceOrientation('landscape');
      }
    };
    const subscription = Dimensions.addEventListener('change', deviceOrientation);

    return (): any => {
      //cleanup work
      subscription.remove()
    };
  }, [deviceOrientation]);


  const growthMeasures = activeChild.measures.filter((item: any) => item.isChildMeasured == true && item.weight > 0 && item.height > 0);
  const convertedMeasures: any = convertMeasuresData(
    growthMeasures,
    childBirthDate
  );
  /* Create line chart array fochartDatar type chart */
  const chartData: any[] = [];
  convertedMeasures.map((item: any) => {
    chartData.push(
      chartType == chartTypes.WeightForHeight
        ? { x: item.height, y: item.weight }
        : { x: item.measurementDate / 30, y: item.height },
    );
  });
  const { topArea, bottomArea, middleArea } = bgObj;
  console.log('[chart]', bgObj)
  const ChartClick = Platform.OS == "android" ? Svg : View;
  return (
    <>
      <View style={styles.mainView}>
        <ChartClick width={deviceOrientation === 'portrait' ? windowWidth - 30 : windowWidth - 60}
          height={deviceOrientation === 'portrait' ?
            windowWidth - 60
            : windowHeight - 50}>
          <VictoryChart
            containerComponent={<VictoryVoronoiContainer />}
            theme={VictoryTheme.material}
            width={deviceOrientation === 'portrait' ? windowWidth - 30 : windowWidth - 60}
            height={deviceOrientation === 'portrait' ?
              windowWidth - 60
              : windowHeight - 50}>

            {/* ********* AXIS HORIZONTAL ********* */}

            <VictoryAxis
              style={victoryStyles.VictoryAxis}
              label={labelX}
              axisLabelComponent={<VictoryLabel x={deviceOrientation === 'portrait' ? windowWidth - 180 : windowHeight - 30} y={deviceOrientation === 'portrait' ? windowWidth - 75 : windowHeight - 70} />}
              tickFormat={(t) => convertDigits(t)}
            />
            {/* ********* AXIS VERTICAL ********* */}
            <VictoryAxis
              style={victoryStyles.VictoryAxisVertical}
              axisLabelComponent={<VictoryLabel y={deviceOrientation === 'portrait' ? 15 : 30} />}
              dependentAxis
              label={labelY}
              tickFormat={(t) => convertDigits(t)}
            />
            {/* ********* TOP AREA ********* */}
            <VictoryArea
              interpolation="natural"
              style={{ data: deviceOrientation !== 'portrait' ? { fill: '#F9C49E' } : { fill: '#D8D8D8' } }}
              data={topArea}
            />
            {/* ********* BOTTOM AREA ********* */}
            <VictoryArea
              interpolation="natural"
              style={{ data: deviceOrientation !== 'portrait' ? { fill: '#F9C49E' } : { fill: '#D8D8D8' } }}
              data={bottomArea}
            />
            {/* ********* MIDDLE AREA ********* */}
            <VictoryArea
              interpolation="natural"
              style={victoryStyles.VictoryArea}
              data={middleArea}
            />

            {/* ********* LINE CHART ********* */}
            {chartData.length < 2 ? null : (
              <VictoryLine
                data={chartData}
                interpolation="natural"
                style={victoryStyles.VictoryLine}
              />
            )}

            {/********** SCATTER ********* */}
            <VictoryScatter
              data={chartData}
              size={9}
              style={victoryStyles.VictoryScatter}
              labelComponent={
                <VictoryTooltip
                  renderInPortal={false}
                  style={victoryStyles.VictoryTooltip.style}
                  flyoutStyle={victoryStyles.VictoryTooltip.flyoutStyle}
                />
              }
              labels={(props: any): any =>
                convertDigits(props.datum.y) +
                ' ' +
                labelY +
                ' / \n' +
                convertDigits(Math.round((props.datum.x + Number.EPSILON) * 100) / 100) +
                ' ' +
                labelX
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: (evt: any, pressedProps: any): any => {
                      const selectedDataIndex = pressedProps.index;
                      return [
                        {
                          eventKey: selectedDataIndex,
                          target: 'labels',
                          mutation: (props: any): any => {
                            let activeState: boolean | null = true;
                            if (props.active === true) {
                              activeState = null;
                            }
                            return props.index === selectedDataIndex
                              ? { active: activeState }
                              : { active: false };
                          },
                        },
                        {
                          eventKey: selectedDataIndex,
                          target: 'data',
                          mutation: (props: any): any => {
                            const stroke = props.style && props.style.stroke;
                            let st;
                            let activeState: boolean | null = true;
                            if (props.active === true) {
                              activeState = null;
                            }
                            console.log(activeState, "..activeState..")
                            if (stroke === 'orange') {
                              st = '#ACACAC';
                            } else {
                              st = 'orange';
                            }

                            return props.index === selectedDataIndex
                              ? { style: { stroke: st, strokeWidth: 3, fill: 'white' } }
                              : null;
                          },
                        },
                      ];
                    },
                    onPressOut: (evt: any, pressedProps: any): any => {
                      const selectedDataIndex = pressedProps.index;
                      return [
                        {
                          eventKey: selectedDataIndex,
                          target: 'labels',
                          mutation: (props: any): any => {
                            return props.index === selectedDataIndex
                              ? { active: props.active }
                              : null;
                          },
                        },
                        {
                          eventKey: selectedDataIndex,
                          target: 'data',
                          mutation: (props: any): any => {
                            return props.index === selectedDataIndex
                              ? {
                                style: {
                                  fill: 'white',
                                  stroke: props.style.stroke,
                                  strokeWidth: 3,
                                },
                              }
                              : null;
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </ChartClick>
        <View style={styles.chartLegend}>
          <View style={styles.chartLegendItem}>
            <View
              style={styles.chartInnerView}></View>
            <Text style={styles.textFont}>
              {t('growthChartLegendSilverLabel')}
            </Text>
          </View>
          {deviceOrientation != 'portrait' && (
            <View style={styles.chartLegendItem}>
              <View
                style={styles.outerView}></View>
              <Text style={styles.textFont}>
                {t('growthChartLegendOrangeLabel')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>

  );
};
export default GrowthChart;

