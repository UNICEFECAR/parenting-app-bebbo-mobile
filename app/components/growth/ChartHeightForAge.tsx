import { FlexCol, FlexDirRowEnd, FlexRowEnd } from '@components/shared/FlexBoxStyle';
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
import { getInterpretationHeightForAge } from '../../services/interpretationService';
import GrowthChart, { chartTypes } from './GrowthChart';


const ChartHeightForAge = () => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const navigation = useNavigation();
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
      (item) => item.growth_type == 32786 && item.child_gender == 40,
    );
    standardDeviation = genderBoyData;
    obj = formatHeightData(genderBoyData);
  } else {
    //girl
    // standardDeviation = require('../../assets/translations/appOfflineData/girlstandardDeviation.json');
    const genderGirlData = standardDevData.filter(
      (item) => item.growth_type == 32786 && item.child_gender == 41,
    );
    standardDeviation = genderGirlData;
    obj = formatHeightData(genderGirlData);
  }
  const childBirthDate = activeChild.birthDate;
  const childTaxonomyData = activeChild.taxonomyData;
  const sortedMeasurements = activeChild.measures.sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];
  const item: any = getInterpretationHeightForAge(
    standardDeviation,
    childBirthDate,
    childTaxonomyData,
    lastMeasurements,
  );
     console.log(item);
  return (
    
      <FlexCol>
      <FlexCol>
        <FlexRowEnd>
            <Pressable  style={{padding:7,marginTop:5}}
              onPress={() =>
                fullScreenChart(chartTypes.heightForAge, obj, standardDeviation)
              }>
              <Icon name="ic_fullscreen" size={16} />
            </Pressable>
          </FlexRowEnd>
          </FlexCol>
          <FlexCol>
        <GrowthChart
          activeChild={activeChild}
          chartType={chartTypes.heightForAge}
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
      </FlexCol>
      <FlexCol style={{backgroundColor:backgroundColor,marginLeft:-20,marginRight:-20}}>
      <RelatedArticles
        fromScreen={'ChildgrowthTab'}
        related_articles={item?.interpretationText?.articleID}
        category={5}
        currentId={chartTypes.heightForAge}
        headerColor={headerColor}
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      </FlexCol>
      </FlexCol>
    
  );
};
export default ChartHeightForAge;
