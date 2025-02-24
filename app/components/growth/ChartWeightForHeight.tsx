// import { boyChildGender, girlChildGender, heightGrowthType } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from '../../instance';
import { FlexCol, FlexColChart, FlexColEnd } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3Regular, Heading4, ShiftFromTopBottom15 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { formatHeightData } from '../../services/growthService';
import { getInterpretationWeightForHeight } from '../../services/interpretationService';
import GrowthChart, { chartTypes } from './GrowthChart';
import { standardDevDataForChart } from "../../instance/index"
export const standardDevDataLoad = standardDevDataForChart;

const LANDSCAPE = "landscape"
const PORTRAIT = "portrait"
const BOYGENDER = 'boy'
const WINDOW = 'window'
const WEIGHT = 'weight'

const styles = StyleSheet.create({
  flexColChart: {
    marginLeft: -20,
    marginRight: -20,
  },
  fullScreenPressable: {
    marginTop: 5,
    padding: 7
  },
  loadingContainer: {
    marginTop: 50
  }
})

const ChartWeightForHeight = (props: any): any => {
  const navigation = useNavigation<any>();
  const themeContext = useContext(ThemeContext);
  const taxonomyIds = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomyIds,
  );
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext?.colors.CHILDGROWTH_TINTCOLOR;
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const fullScreenChart = (chartType: any, obj: any): any => {
    navigation.navigate('ChartFullScreen', {
      activeChild,
      chartType,
      obj,
    });
  };
  //const standardDevData: any[] = require('../../assets/translations/appOfflineData/standardDeviation.json');

  const standardDevData = standardDevDataLoad;
  //console.log(standardDevData,"..standardDevData..")
  let obj: any;
  let standardDeviation: any;
  if (taxonomyIds?.boyChildGender == BOYGENDER || activeChild?.gender == '') {
    //boy or no gender added
    const genderBoyData = standardDevData?.filter(
      (item: any) => item.growth_type == appConfig.heightForAge && item.child_gender == taxonomyIds?.boyChildGender || item.child_gender == appConfig.boyChildGender,
    );
    standardDeviation = genderBoyData;
    obj = formatHeightData(genderBoyData, WEIGHT);
  } else {
    //girl
    const genderGirlData = standardDevData?.filter(
      (item: any) => item.growth_type == appConfig.heightForAge && item.child_gender == taxonomyIds?.girlChildGender || item.child_gender == appConfig.girlChildGender,
    );
    standardDeviation = genderGirlData;
    obj = formatHeightData(genderGirlData, WEIGHT);
  }
  const childTaxonomyData = activeChild.taxonomyData;
  const sortedMeasurements = activeChild.measures.filter((item: { isChildMeasured: boolean; weight: number; height: number }) => item.isChildMeasured == true && item.weight > 0 && item.height > 0).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];
  const item: any = getInterpretationWeightForHeight(
    standardDeviation,
    childTaxonomyData,
    lastMeasurements,
  );
  const [isChartVisible, setIsChartVisible] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        setIsChartVisible(true);
      }, 2000);
    }, []),
  );
  const windowWidth = Dimensions.get(WINDOW).width;
  const windowHeight = Dimensions.get(WINDOW).height;
  const [deviceOrientation, setDeviceOrientation] = useState(
    Dimensions.get(WINDOW).width < Dimensions.get(WINDOW).height
      ? PORTRAIT
      : LANDSCAPE
  );
  useEffect(() => {
    const deviceOrientation = (): any => {
      if (Dimensions.get(WINDOW).width < Dimensions.get(WINDOW).height) {
        setDeviceOrientation(PORTRAIT);
      } else {
        setDeviceOrientation(LANDSCAPE);
      }
    };
    const listenerEvent = Dimensions.addEventListener('change', deviceOrientation);
    return (): any => {
      //cleanup work
      listenerEvent.remove()
    };
  }, [deviceOrientation]);
  return (
    <FlexCol>
      <FlexCol>
        <FlexColEnd>
          <Pressable
            style={styles.fullScreenPressable}
            onPress={(): any => fullScreenChart(chartTypes.WeightForHeight, obj)}>
            <Icon name="ic_fullscreen" size={16} />
          </Pressable>
        </FlexColEnd>
      </FlexCol>

      <FlexCol>
        {isChartVisible && deviceOrientation == PORTRAIT ? (
          <GrowthChart
            activeChild={activeChild}
            chartType={chartTypes.WeightForHeight}
            bgObj={obj}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={headerColor} />
          </View>
        )}
        <ShiftFromTopBottom15>
          {item && (props.days >= activeChild.taxonomyData.days_from) && (
            <>
              <Heading4>{item?.interpretationText?.name}</Heading4>
              {item?.interpretationText?.text ? (
                <>
                  <Heading3Regular>{item?.interpretationText?.text}</Heading3Regular>
                </>
              ) : null}
            </>
          )}
        </ShiftFromTopBottom15>
      </FlexCol>
      {(props.days < activeChild.taxonomyData.days_from) ?
        null :
        <FlexColChart
          style={[styles.flexColChart, {
            backgroundColor: backgroundColor
          }]}>
          <RelatedArticles
            fromScreen={'ChildgrowthTab'}
            relatedArticles={item?.interpretationText?.articleID}
            category={5}
            currentId={chartTypes.WeightForHeight}
            headerColor={headerColor}
            backgroundColor={backgroundColor}
            navigation={navigation}
          />
        </FlexColChart>

      }
    </FlexCol>
  );
};
export default ChartWeightForHeight;
