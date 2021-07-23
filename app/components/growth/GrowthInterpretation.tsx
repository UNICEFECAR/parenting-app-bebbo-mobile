import RelatedArticles from '@components/shared/RelatedArticles';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4,ShiftFromTop10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import {
  getInterpretationHeightForAge,
  getInterpretationWeightForHeight
} from '../../services/interpretationService';
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
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  // console.table(sortedMeasurements)
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];

  const item: any =
    chartTypes.weightForHeight == chartType
      ? getInterpretationWeightForHeight(
          standardDeviation,
          childTaxonomyData,
          lastMeasurements,
        )
      : getInterpretationHeightForAge(
          standardDeviation,
          childBirthDate,
          childTaxonomyData,
          lastMeasurements,
        );
  // console.log(item, 'GrowthInterpretation');

  // useFocusEffect(
  //     React.useCallback(() => {

  //     },[])
  //   );
  // useEffect(()=>{
  //   if(item){
  //     props.getrelatedArticles(item?.interpretationText?.articleID)
  console.log(item, chartType, 'GrowthInterpretation');
  //   }
  // }, [])
  // const uniqueID = uuidv4();
  // console.log(uniqueID,"uniqueID");
  // chartType == chartTypes.heightForAge
  // chartType == chartTypes.weightForHeight
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  return (
    <>
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
        currentId={uuidv4()}
        headerColor={headerColor}
        backgroundColor={backgroundColor}
        navigation={navigation}
      />
      </View>

      {/* <Paragraph>{item?.interpretationText?.text}</Paragraph> */}
    </>
  );
};
export default GrowthInterpretation;
