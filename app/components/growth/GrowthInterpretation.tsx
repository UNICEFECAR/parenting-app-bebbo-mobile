import { Heading2, Heading4 } from '@styles/typography';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { getInterpretationHeightForAge, getInterpretationWeightForHeight } from '../../services/interpretationService';
import { chartTypes } from './GrowthChart';
const GrowthInterpretation = (props: any) => {
  let {activeChild, chartType, standardDeviation,getrelatedArticles} = props;
  const {t} = useTranslation();
  //
  // console.log(activeChild, chartType, standardDeviation, 'heightForAge');
  const childBirthDate = activeChild.birthDate;
  const childGender = activeChild.gender;
  const childTaxonomyData = activeChild.taxonomyData;
  const sortedMeasurements = activeChild.measures.sort(
    (a: any, b: any) =>
      a.measurementDate - b.measurementDate,
  );
  // console.table(sortedMeasurements)
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];

  const item:any =  chartTypes.weightForHeight == chartType?
  getInterpretationWeightForHeight(
    standardDeviation,
    childTaxonomyData,
    lastMeasurements,
  ) :  getInterpretationHeightForAge(
    standardDeviation,
    childBirthDate,
    childTaxonomyData,
    lastMeasurements,
  ) 
  useEffect(()=>{
    props.getrelatedArticles(item?.interpretationText?.articleID)
  console.log(item, 'GrowthInterpretation');
  },[])
  
  // chartType == chartTypes.heightForAge
  // chartType == chartTypes.weightForHeight
// const navigation = useNavigation();
// const themeContext = useContext(ThemeContext);
// const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
// const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  return (
    <>
      <Heading2>{t('growthScreensumHeading')}</Heading2>
      <Heading4> {item?.interpretationText?.name}</Heading4>
      <HTML
              source={{html: item?.interpretationText?.text}}
              baseFontStyle={{fontSize: 16}}
            />

            
      {/* <Paragraph>{item?.interpretationText?.text}</Paragraph> */}
    </>
  );
};
export default GrowthInterpretation;
