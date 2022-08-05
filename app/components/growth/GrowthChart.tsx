import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg from 'react-native-svg';
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
const GrowthChart = (props: any) => {
  let {activeChild, chartType, bgObj,windowWidth,windowHeight} = props;
  const {t} = useTranslation();
   const childBirthDate =activeChild?.taxonomyData.prematureTaxonomyId!=null && activeChild?.taxonomyData.prematureTaxonomyId!="" && activeChild?.taxonomyData.prematureTaxonomyId!=undefined?  activeChild.plannedTermDate: activeChild.birthDate; 
  const labelX = props.chartType == chartTypes.weightForHeight ? t('growthScreencmText'):t('month') ;
  const labelY = props.chartType == chartTypes.weightForHeight ? t('growthScreenkgText') : t('growthScreencmText');
const [deviceOrientation, setDeviceOrientation] = useState(
  windowWidth < windowHeight
    ? 'portrait'
    : 'landscape'
);


  useEffect(() => {
   setDeviceOrientation( windowWidth < windowHeight
      ? 'portrait'
      : 'landscape')
  },[windowWidth,windowHeight]);
useEffect(() => {
  const deviceOrientation = () => {
    if (windowWidth < windowHeight) {
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
}, [deviceOrientation]);


    let growthMeasures = activeChild.measures.filter((item)=>item.isChildMeasured== true&& item.weight>0 && item.height>0);
  let convertedMeasures:any = convertMeasuresData(
    growthMeasures,
    childBirthDate
  );
  /* Create line chart array fochartDatar type chart */
  let chartData: any[] = [];
  convertedMeasures.map((item) => {
    chartData.push(
      chartType == chartTypes.weightForHeight
        ? {x: item.height, y: item.weight}
        : {x: item.measurementDate / 30, y: item.height},
    );
  });
  let {topArea, bottomArea, middleArea} = bgObj;
  const ChartClick=Platform.OS=="android"?Svg:View;

  return (
    <>
   <View style={{flexDirection:'column',alignItems:'center'}}>
   <ChartClick width={deviceOrientation === 'portrait' ? windowWidth-30 : windowWidth-60}
        height={deviceOrientation === 'portrait' ?
        windowWidth - 60
          : windowHeight-50}>
      <VictoryChart 
      containerComponent={<VictoryVoronoiContainer/>}
        theme={VictoryTheme.material}
        width={deviceOrientation === 'portrait' ? windowWidth-30 : windowWidth-60}
        height={deviceOrientation === 'portrait' ?
        windowWidth - 60
          : windowHeight-50}>
           
        {/* ********* AXIS HORIZONTAL ********* */}
        
        <VictoryAxis
          style={victoryStyles.VictoryAxis}
          label={labelX}
          axisLabelComponent={<VictoryLabel x={deviceOrientation === 'portrait' ? windowWidth-180 : windowHeight-30} y={deviceOrientation === 'portrait' ? windowWidth-75: windowHeight-70}/>}
        />
        {/* ********* AXIS VERTICAL ********* */}
        <VictoryAxis
          style={victoryStyles.VictoryAxisVertical}
          axisLabelComponent={<VictoryLabel  y={deviceOrientation === 'portrait' ? 15 :30} />}
          dependentAxis
          label={labelY}
        />
        {/* ********* TOP AREA ********* */}
        <VictoryArea
          interpolation="natural"
          style={{data: deviceOrientation !== 'portrait'  ? {fill: '#F9C49E'} : {fill: '#D8D8D8'}}}
          data={topArea}
        />
        {/* ********* BOTTOM AREA ********* */}
        <VictoryArea
          interpolation="natural"
          style={{data: deviceOrientation !== 'portrait' ? {fill: '#F9C49E'} : {fill: '#D8D8D8'}}}
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
      </View>
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
    axis: {stroke: 'none'}
  },
  VictoryAxisVertical: {
    grid: {stroke: 'transparent'},
    axis: {stroke: 'none'},
    // @ts-ignore
    axisLabel: {angle: 0}
  },
  VictoryLine: {
    data: {stroke: '#0C66FF', strokeWidth: 9, strokeLinecap: 'round'},
  },
  VictoryScatter: {
    data: {fill: 'white', stroke: '#ACACAC', strokeWidth: 3},
    labels: {fill: 'red'}
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
