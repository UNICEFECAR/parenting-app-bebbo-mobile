import { ButtonTextMdLine } from '@components/shared/ButtonGlobal';
import { BannerContainer1 } from '@components/shared/Container';
import {
  FDirRow,
  FDirRowStart,
  Flex1,
  Flex2,
  Flex3, FlexColEnd, FlexDirColStart, FlexDirRowEnd, FlexDirRowSpace, FlexDirRowSpaceStart
} from '@components/shared/FlexBoxStyle';
import Icon, {  OuterIconLeft, OuterIconRow,  IconViewAlert } from '@components/shared/Icon';
import { PrematureTagGrowth } from '@components/shared/PrematureTag';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2,
  Heading3,
  Heading4,
  Heading4Regular,
  Heading5,
  Heading5Bold,
  ShiftFromTop20
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';
import { formatStringDate } from '../../services/Utils';

const LastChildMeasure = (props: any) => {
  // let {activeChild} = props;
  const {t} = useTranslation();
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  console.log(activeChild,"LastChildMeasureactiveChild")
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  // const [childmeasures, setChildmeasures] = React.useState<any[]>(activeChild.measures);
 
  // const setNewChildMeasureUpdates = () => {
    // let measures = activeChild.measures;
      //filter measures by didChildGetVaccines

    let measures:any=[];
    if(activeChild?.measures.length>0){
     measures = activeChild.measures.filter((item) => item.isChildMeasured == true);
    }

    let measurementDate: DateTime = DateTime.local();
    const timeNow = DateTime.local();
    let childmeasures = measures.map((item: MeasuresEntity) => {
      if (item.measurementDate) {
        measurementDate = DateTime.fromJSDate(new Date(item.measurementDate));
      }

      let month: number = 0;

      if (activeChild?.birthDate) {
        let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
        month = Math.round(measurementDate.diff(birthDay, 'month').months);
      }

      return {
        uuid:item.uuid,
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: formatStringDate(item?.measurementDate, luxonLocale),
        dateToMilis: measurementDate.toMillis(),
        titleDateInMonth: month,
        measurementPlace:item.measurementPlace,
        doctorComment:item.doctorComment
      };
    });

    childmeasures = childmeasures.sort(
      (a: any, b: any) => a.dateToMilis - b.dateToMilis,
    );
    // console.log(childmeasures,"childmeasures");
    // setChildmeasures(allMeasurements);
    // activeChild.measures = allMeasurements;
    // console.log(activeChild.measures, allMeasurements, 'NewMeasures');
  // };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setNewChildMeasureUpdates();
  //   }, [activeChild]),
  // );

 let lastmeasurementDate =  DateTime.fromMillis(childmeasures[
    childmeasures.length - 1
  ]?.dateToMilis)
  let date = DateTime.fromISO(activeChild.birthDate);
  // console.log(date,"DOB");
  let convertInDays = lastmeasurementDate.diff(date, "days").days;
  let days = 0;
  if (convertInDays !== undefined) {days = Math.round(convertInDays)};
  console.log(days,"daysfrom",activeChild?.taxonomyData?.days_from)
  return (
    <>
      <BannerContainer1>
        <FlexDirRowSpaceStart>
        <Flex3>
          <View>
          <Heading3>{t('growthScreensubHeading')}</Heading3>
          <Heading5>
            {/* {' '} */}
            {t('growthScreenlastMeasureText', {
              measureDate:childmeasures[
                    childmeasures.length - 1
                  ]?.measurementDate,
              
            })}
          </Heading5>

          </View>
          </Flex3>
          <Flex2>
          <FlexColEnd>
          
          {activeChild.isPremature === 'true' ? (
            <PrematureTagGrowth>
              <Heading5Bold>{t('growthScreenprematureText')}</Heading5Bold>
            </PrematureTagGrowth>
          ) : null}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('AllChildgrowthMeasures');
            }}>
            <ButtonTextMdLine numberOfLines={2}>
              {t('growthScreenallMeasureHeader')}
            </ButtonTextMdLine>
          </Pressable>
          </FlexColEnd>
          </Flex2>
        </FlexDirRowSpaceStart>
        

        <ShiftFromTop20>
          <FlexDirRowSpace>
            <Flex2>
              <FlexDirRowSpace>
                <FlexDirColStart>
                  <Heading4Regular>{t('growthScreenwText')}</Heading4Regular>
                  <Heading2>
                    {
                      childmeasures[childmeasures.length - 1]
                        ?.weight
                    }{' '}
                    {t('growthScreenkgText')}
                  </Heading2>
                </FlexDirColStart>

                <FlexDirColStart>
                  <Heading4Regular>{t('growthScreenhText')}</Heading4Regular>
                  <Heading2>
                    {
                      childmeasures[childmeasures.length - 1]
                        ?.height
                    }{' '}
                    {t('growthScreencmText')}
                  </Heading2>
                </FlexDirColStart>
              </FlexDirRowSpace>
            </Flex2>
            <Flex1>
              <FlexDirRowEnd>
              <Pressable
                onPress={() => {
                  const lastmeasure =  childmeasures[childmeasures.length - 1];
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreeneditNewBtntxt'),
                    editGrowthItem:( {"uuid": lastmeasure.uuid,
                    "weight": lastmeasure.weight,
                    "height": lastmeasure.height,
                    "measurementDate": lastmeasure.dateToMilis,
                    "titleDateInMonth": lastmeasure.titleDateInMonth,
                    "measurementPlace": lastmeasure.measurementPlace,
                    "doctorComment": lastmeasure.doctorComment})
                  })
                }}>
                {/* <FlexDirRowEnd>
                  <ButtonTextMdLine> */}
                   <ButtonTextMdLine numberOfLines={2}> {t('growthScreeneditText')}</ButtonTextMdLine>
                  {/* </ButtonTextMdLine>
                </FlexDirRowEnd> */}
              </Pressable>
              </FlexDirRowEnd>
            </Flex1>
          </FlexDirRowSpace>
          <ShiftFromTop20>
          <FDirRowStart>
          <OuterIconRow>
                        <OuterIconLeft>
                            <IconViewAlert>
                              <Icon
                                name="ic_incom"
                                size={24}
                                color="#FFF"
                              /></IconViewAlert>
                        </OuterIconLeft>
                      </OuterIconRow>
                      <Heading4 style={{flexShrink:1}}> {(days< activeChild.taxonomyData.days_from) ?<Text>{t('noRecentGrowthMeasure')}</Text>:null}</Heading4>
          </FDirRowStart>
          </ShiftFromTop20>
        </ShiftFromTop20>
      </BannerContainer1>
    </>
  );
};
export default LastChildMeasure;
