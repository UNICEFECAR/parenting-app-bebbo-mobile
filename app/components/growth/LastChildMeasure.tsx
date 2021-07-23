import { ButtonTextMdLine } from '@components/shared/ButtonGlobal';
import { BannerContainer1 } from '@components/shared/Container';
import {
  Flex1,
  Flex2,
  Flex3,
  FlexDirColStart,
  FlexDirRowEnd,
  FlexDirRowSpace,
  FlexFDirRowSpace,
  FlexDirRowSpaceStart,
  FlexColEnd
} from '@components/shared/FlexBoxStyle';
import { PrematureTagGrowth } from '@components/shared/PrematureTag';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Heading2,
  Heading3,
  Heading4Regular,
  Heading5,
  Heading5Bold,
  ShiftFromTop20
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable,View,Text } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';

const LastChildMeasure = (props: any) => {
  let {activeChild} = props;
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const [childmeasures, setChildmeasures] = React.useState<any[]>(activeChild.measures);
  const {t} = useTranslation();
  const setNewChildMeasureUpdates = () => {
    let measures = activeChild.measures;
    let measurementDate: DateTime = DateTime.local();
    const timeNow = DateTime.local();
    let allMeasurements = measures.map((item: MeasuresEntity) => {
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
        measurementDate: measurementDate.toFormat("dd.MM.yyyy"),
        dateToMilis: measurementDate.toMillis(),
        titleDateInMonth: month,
        measurementPlace:item.measurementPlace,
        doctorComment:item.doctorComment
      };
    });

    allMeasurements = allMeasurements.sort(
      (a: any, b: any) => a.dateToMilis - b.dateToMilis,
    );
    setChildmeasures(allMeasurements);
    // activeChild.measures = allMeasurements;
    // console.log(activeChild.measures, allMeasurements, 'NewMeasures');
  };
  useFocusEffect(
    React.useCallback(() => {
      setNewChildMeasureUpdates();
    }, [activeChild]),
  );

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
              <Heading5Bold>{t('developScreenprematureText')}</Heading5Bold>
            </PrematureTagGrowth>
          ) : null}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('AllChildgrowthMeasures');
            }}>
            <ButtonTextMdLine>
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
              <Pressable
                onPress={() => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreeneditNewBtntxt'),
                    editGrowthItem:
                    childmeasures[childmeasures.length - 1],
                  });
                }}>
                <FlexDirRowEnd>
                  <ButtonTextMdLine>
                    {t('growthScreeneditText')}
                  </ButtonTextMdLine>
                </FlexDirRowEnd>
              </Pressable>
            </Flex1>
          </FlexDirRowSpace>
        </ShiftFromTop20>
      </BannerContainer1>
    </>
  );
};
export default LastChildMeasure;
