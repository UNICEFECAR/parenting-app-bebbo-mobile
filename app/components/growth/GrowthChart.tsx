import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { VictoryAreaProps } from 'victory-area';
import { TickLabelProps, VictoryAxisCommonProps } from 'victory-core';
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
}
export interface VictoryStyles {
  VictoryAxis: VictoryAxisCommonProps['style'];
  VictoryAxisVertical: VictoryAxisCommonProps['style'];
  VictoryLine: VictoryLineProps['style'];
  VictoryScatter: VictoryScatterProps['style'];
  VictoryArea: VictoryAreaProps['style'];
  axisLabel?: TickLabelProps;
  VictoryTooltip: VictoryTooltipProps;
}
export enum chartTypes {
  weightForHeight,
  heightForAge,
}
// export enum chartTypes {
//     heightLength,
//     lengthAge
// }

const GrowthChart = (props: any) => {
  let {activeChild, chartType, bgObj,windowWidth,windowHeight} = props;
  const {t} = useTranslation();
  // console.log(chartType, 'chartType0');
  const childBirthDate = activeChild.birthDate;

  // const labelX = props.chartType == chartTypes.heightForAge ? t('month') : t('growthScreencmText');
  // const labelY = props.chartType == chartTypes.weightForHeight ? t('growthScreenkgText') : t('growthScreencmText');
  const labelX = props.chartType == chartTypes.weightForHeight ? t('growthScreencmText'):t('month') ;
  const labelY = props.chartType == chartTypes.weightForHeight ? t('growthScreenkgText') : t('growthScreencmText');
  // console.log(labelX, labelY);
//   const [obj, setObj] = useState([]);


const [deviceOrientation, setDeviceOrientation] = useState(
  Dimensions.get('window').width < Dimensions.get('window').height
    ? 'portrait'
    : 'landscape'
);
// const [deviceHeight, setDeviceHeight] = useState(
//   Dimensions.get('window').width < Dimensions.get('window').height
//     ? Dimensions.get('window').height
//     : Dimensions.get('window').width
// );
// let windowWidth = Dimensions.get('window').width;
// let windowHeight = Dimensions.get('window').height;
// console.log(windowWidth,windowHeight,"window");
// const [showFullscreen, setShowFullscreen] = React.useState(false);
// let orientation: 'portrait' | 'landscape' =
// windowHeight > windowWidth ?  'portrait':'landscape' ;
// useFocusEffect(
//   React.useCallback(() => {
// useEffect(() => {
//   const setDeviceHeightAsOrientation = () => {
//     if (Dimensions.get('window').width < Dimensions.get('window').height) {
//       setDeviceHeight(Dimensions.get('window').height);
//     } else {
//       setDeviceHeight(Dimensions.get('window').width);
//     }
//   };
//   Dimensions.addEventListener('change', setDeviceHeightAsOrientation);
//   return () => {
//     //cleanup work
//     Dimensions.removeEventListener('change', setDeviceHeightAsOrientation);
//   };
// // });
// }, []);
// );
// useFocusEffect(
//   React.useCallback(() => {
useEffect(() => {
  const deviceOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      setDeviceOrientation('portrait');
    } else {
      setDeviceOrientation('landscape');
    }
  };
  Dimensions.addEventListener('change', deviceOrientation);
  return () => {
    //cleanup work
    Dimensions.removeEventListener('change', deviceOrientation);
  };
// });
}, [deviceOrientation]);
// );


 




// console.log(deviceOrientation,"orientation");

const growthMeasures =activeChild.measures.filter((item) => item.isChildMeasured == true);
  let convertedMeasures:any = convertMeasuresData(
    growthMeasures,
    childBirthDate
  );
  /* Create line chart array for type chart */
  let chartData: any[] = [];
  convertedMeasures.map((item) => {
    chartData.push(
      chartType == chartTypes.weightForHeight
        ? {x: item.height, y: item.weight}
        : {x: item.measurementDate / 30, y: item.height},
    );
  });
//   console.log(convertedMeasures, 'convertedMeasures');
// console.log(chartType, 'chartType1');
  let {topArea, bottomArea, middleArea} = bgObj;
  return (
    <>
   
  

      <VictoryChart containerComponent={<VictoryVoronoiContainer />} 
        theme={VictoryTheme.material}
        width={deviceOrientation === 'portrait' ? windowWidth-30 : windowWidth-60}
        height={deviceOrientation === 'portrait' ?
        windowHeight - 340
          : windowHeight-50}>
        {/* ********* AXIS HORIZONTAL ********* */}
        <VictoryAxis
          style={victoryStyles.VictoryAxis}
          label={labelX}
          axisLabelComponent={<VictoryLabel x={deviceOrientation === 'portrait' ? windowWidth-60 : windowHeight-30} y={deviceOrientation === 'portrait' ? windowWidth: windowHeight-70}/>}
        />

        {/* ********* AXIS VERTICAL ********* */}
        <VictoryAxis
          style={victoryStyles.VictoryAxisVertical}
          axisLabelComponent={<VictoryLabel y={deviceOrientation === 'portrait' ? 25 :30} />}
          dependentAxis
          label={labelY}
        />

        {/* ********* TOP AREA ********* */}
        <VictoryArea
          interpolation="natural"
          style={{data: deviceOrientation === 'portrait'  ? {fill: '#F9C49E'} : {fill: '#D8D8D8'}}}
          data={topArea}
        />
        {/* ********* BOTTOM AREA ********* */}
        <VictoryArea
          interpolation="natural"
          style={{data: deviceOrientation === 'portrait' ? {fill: '#F9C49E'} : {fill: '#D8D8D8'}}}
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
        {/* @ts-ignore */}
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
          labels={(props) =>
            props.datum.y +
            ' ' +
            labelY +
            ' / ' +
            Math.round((props.datum.x + Number.EPSILON) * 100) / 100 +
            ' ' +
            labelX
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: (evt: any, pressedProps: any) => {
                  const selectedDataIndex = pressedProps.index;
                  return [
                    {
                      eventKey: 'all',
                      target: 'labels',
                      mutation: (props: any) => {
                        let activeState: boolean | null = true;
                        if (props.active === true) {
                          activeState = null;
                        }
                        return props.index === selectedDataIndex
                          ? {active: activeState}
                          : {active: false};
                      },
                    },
                    {
                      eventKey: 'all',
                      target: 'data',
                      mutation: (props: any) => {
                        const stroke = props.style && props.style.stroke;
                        let st;
                        let activeState: boolean | null = true;
                        if (props.active === true) {
                          activeState = null;
                        }
                        if (stroke === 'orange') {
                          st = '#ACACAC';
                        } else {
                          st = 'orange';
                        }

                        return props.index === selectedDataIndex
                          ? {style: {stroke: st, strokeWidth: 3, fill: 'white'}}
                          : null;
                      },
                    },
                  ];
                },
                onPressOut: (evt: any, pressedProps: any) => {
                  const selectedDataIndex = pressedProps.index;
                  return [
                    {
                      eventKey: 'all',
                      target: 'labels',
                      mutation: (props: any) => {
                        return props.index === selectedDataIndex
                          ? {active: props.active}
                          : null;
                      },
                    },
                    {
                      eventKey: 'all',
                      target: 'data',
                      mutation: (props: any) => {
                        const stroke = props.style && props.style.stroke;
                        // return stroke === "orange" ? null : { style: { stroke: "orange", strokeWidth: 4, fill: 'white' } };
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
      <View style={styles.chartLegend}>
        <View style={styles.chartLegendItem}>
          <View
            style={{
              width: 27,
              height: 12,
              backgroundColor: '#D8D8D8',
              margin: 10,
            }}></View>
          <Text style={{fontSize: 11, opacity: 0.5}}>
            {t('growthChartLegendSilverLabel')}
          </Text>
        </View>
        {deviceOrientation != 'portrait' && (
          <View style={styles.chartLegendItem}>
            <View
              style={{
                width: 27,
                height: 12,
                backgroundColor: '#F9C49E',
                margin: 10,
              }}></View>
            <Text style={{fontSize: 11, opacity: 0.5}}>
              {t('growthChartLegendOrangeLabel')}
            </Text>
          </View>
        )}
      </View>
      {/* </Suspense> */}
    </>
   
  );
};
export default GrowthChart;
const styles = StyleSheet.create<GrowtChartStyles>({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  chartHeader: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 20,
  },
  contentWrapper: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  chartLegend: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
const victoryStyles: VictoryStyles = {
  VictoryAxis: {
    grid: {stroke: 'transparent'},
    axis: {stroke: 'none'},
    // axisLabel: { fontFamily: fontFamily, },
    // tickLabels: { fontFamily: fontFamily }
  },
  VictoryAxisVertical: {
    grid: {stroke: 'transparent'},
    axis: {stroke: 'none'},
    // @ts-ignore
    axisLabel: {angle: 0},
    // axisLabel: { angle: 0, fontFamily: fontFamily },
    // tickLabels: { fontFamily: fontFamily }
  },
  VictoryLine: {
    data: {stroke: '#0C66FF', strokeWidth: 9, strokeLinecap: 'round'},
  },
  VictoryScatter: {
    data: {fill: 'white', stroke: '#ACACAC', strokeWidth: 3},
    labels: {fill: 'red'},
    // labels: { fill: "red", fontFamily: fontFamily },
  },
  VictoryArea: {
    data: {fill: '#D8D8D8'},
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
