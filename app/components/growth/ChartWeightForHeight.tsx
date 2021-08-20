import { FlexCol, FlexColEnd } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, ShiftFromTop10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Pressable, View ,Text} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { formatHeightData } from '../../services/growthService';
import { getInterpretationWeightForHeight } from '../../services/interpretationService';
import GrowthChart, { chartTypes } from './GrowthChart';
const ChartWeightForHeight = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const fullScreenChart = (chartType, obj) => {
    // console.log((activeChild,chartType,obj,standardDeviation));
    navigation.navigate('ChartFullScreen', {
      activeChild,
      chartType,
      obj,
    });
  };
  // const standardDevData = useAppSelector((state: any) =>
  //   JSON.parse(state.utilsData.taxonomy.standardDevData),
  // );
  const standardDevData: any[] = require('../../assets/translations/appOfflineData/standardDeviation.json');
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  let obj: any;
  let standardDeviation: any;
  if (activeChild?.gender == '40' || activeChild?.gender == '') {
    //boy or no gender added
    // standardDeviation = require('../../assets/translations/appOfflineData/boystandardDeviation.json');
    const genderBoyData = standardDevData?.filter(
      (item) => item.growth_type == 6461 && item.child_gender == 40,
    );
    standardDeviation = genderBoyData;
    obj = formatHeightData(genderBoyData,'weight');
  } else {
    //girl
    // standardDeviation = require('../../assets/translations/appOfflineData/girlstandardDeviation.json');
    const genderGirlData = standardDevData?.filter(
      (item) => item.growth_type == 6461 && item.child_gender == 41,
    );
    standardDeviation = genderGirlData;
    obj = formatHeightData(genderGirlData,'weight');
  }
  const childTaxonomyData = activeChild.taxonomyData;
  const sortedMeasurements = activeChild.measures.sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];
  const item: any = getInterpretationWeightForHeight(
    standardDeviation,
    childTaxonomyData,
    lastMeasurements,
  );
  console.log(item);
  const [isChartVisible, setIsChartVisible] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        setIsChartVisible(true);
      }, 2000);
    }, []),
  );
  let windowWidth = Dimensions.get('window').width;
  let windowHeight = Dimensions.get('window').height;
  const [deviceOrientation, setDeviceOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'portrait'
      : 'landscape'
  );
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
  return (
    <FlexCol>
      <FlexCol>
        <FlexColEnd>
          <Pressable
            style={{padding: 7, marginTop: 5}}
            onPress={() => fullScreenChart(chartTypes.weightForHeight, obj)}>
            <Icon name="ic_fullscreen" size={16} />
          </Pressable>
        </FlexColEnd>
      </FlexCol>

      <FlexCol>
        {isChartVisible && deviceOrientation=='portrait' ? (
          <GrowthChart
            activeChild={activeChild}
            chartType={chartTypes.weightForHeight}
            bgObj={obj}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            // standardDeviation={standardDeviation}
          />
        ) : (
          <View style={{marginTop:50}}>
          <ActivityIndicator size="large" color={headerColor} />
          </View>
        )}
        <ShiftFromTop10>
          {item?.interpretationText ? (
            <>
              <Heading2>{t('growthScreensumHeading')}</Heading2>
              <Heading4> {item?.interpretationText?.name}</Heading4>
              {item?.interpretationText?.text ? (
                <HTML
                  source={{html: item?.interpretationText?.text}}
                  baseFontStyle={{fontSize: 16}}
                  ignoredStyles={['color', 'font-size', 'font-family']}
                />
              ) : null}
            </>
          ) : null}
        </ShiftFromTop10>
      </FlexCol>

      <FlexCol
        style={{
          backgroundColor: backgroundColor,
          marginLeft: -20,
          marginRight: -20,
        }}>
        <RelatedArticles
          fromScreen={'ChildgrowthTab'}
          related_articles={item?.interpretationText?.articleID}
          category={5}
          currentId={chartTypes.weightForHeight}
          headerColor={headerColor}
          backgroundColor={backgroundColor}
          navigation={navigation}
        />
      </FlexCol>
    </FlexCol>
  );
};
export default ChartWeightForHeight;
