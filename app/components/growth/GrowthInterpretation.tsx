import { Heading2, Heading4 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { getInterpretationHeightForAge, getInterpretationWeightForHeight } from '../../services/interpretationService';
import { chartTypes } from './GrowthChart';

const GrowthInterpretation = (props: any) => {
  let {activeChild, chartType, standardDeviation} = props;
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
  console.log(item, 'GrowthInterpretation');
  // chartType == chartTypes.heightForAge
  // chartType == chartTypes.weightForHeight

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
