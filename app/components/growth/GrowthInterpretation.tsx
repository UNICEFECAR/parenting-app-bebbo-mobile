import { Heading2, Heading4, Paragraph } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
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
      a.measurementDate.toMillis() - b.measurementDate.toMillis(),
  );
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];

  let windowWidth = Dimensions.get('window').width;
  let windowHeight = Dimensions.get('window').height;
  const item:any =  chartTypes.weightForHeight == chartType?
  getInterpretationWeightForHeight(
    standardDeviation,
    childGender,
    childBirthDate,
    childTaxonomyData,
    lastMeasurements,
  ) :  getInterpretationHeightForAge(
    standardDeviation,
    childGender,
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
      <Heading4> {item?.interpretationText.name}</Heading4>
      <Paragraph>{item?.interpretationText.text}</Paragraph>
    </>
  );
};
export default GrowthInterpretation;
