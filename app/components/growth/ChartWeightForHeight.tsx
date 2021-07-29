import { FlexCol, FlexDirRowEnd } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, ShiftFromTop10, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
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
  const fullScreenChart = (chartType, obj, standardDeviation) => {
    // console.log((activeChild,chartType,obj,standardDeviation));
    navigation.navigate('ChartFullScreen', {
      activeChild,
      chartType,
      obj,
      standardDeviation,
    });
  };
  const standardDevData = useAppSelector((state: any) =>
    JSON.parse(state.utilsData.taxonomy.standardDevData),
  );
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
    const genderBoyData = standardDevData.filter(
      (item) => item.growth_type == 6461 && item.child_gender == 40,
    );
    standardDeviation = genderBoyData;
    obj = formatHeightData(genderBoyData);
  } else {
    //girl
    // standardDeviation = require('../../assets/translations/appOfflineData/girlstandardDeviation.json');
    const genderGirlData = standardDevData.filter(
      (item) => item.growth_type == 6461 && item.child_gender == 41,
    );
    standardDeviation = genderGirlData;
    obj = formatHeightData(genderGirlData);
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
        )
     console.log(item);
  return (
    <View
     
      style={{
        flexDirection: 'column',
      }}>
      <FlexCol>
        <ShiftFromTopBottom10>
          <FlexDirRowEnd>
            <Pressable
              onPress={() =>
                fullScreenChart(
                  chartTypes.weightForHeight,
                  obj,
                  standardDeviation,
                )
              }>
              <Icon name="ic_fullscreen" size={16} />
            </Pressable>
          </FlexDirRowEnd>
        </ShiftFromTopBottom10>
        <GrowthChart
          activeChild={activeChild}
          chartType={chartTypes.weightForHeight}
          bgObj={obj}
          standardDeviation={standardDeviation}
        />
        <ShiftFromTop10>
        <Heading2>{t('growthScreensumHeading')}</Heading2>
        <Heading4> {item?.interpretationText?.name}</Heading4>
        <HTML
          source={{html: item?.interpretationText?.text}}
          baseFontStyle={{fontSize: 16}}
        />
      </ShiftFromTop10>
      <View style={{backgroundColor:backgroundColor,marginLeft:-20,marginRight:-20}}>
      <RelatedArticles
        fromScreen={'ChildgrowthTab'}
        related_articles={item?.interpretationText?.articleID}
        category={5}
        currentId={chartTypes.weightForHeight}
        headerColor={headerColor}
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      </View>
      </FlexCol>
    </View>
  );
};
export default ChartWeightForHeight;
