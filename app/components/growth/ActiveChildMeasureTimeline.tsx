import { ButtonTextMdLine } from '@components/shared/ButtonGlobal';
import {
  FDirRow,
  Flex1,
  Flex2,
  FlexDirColStart,
  FlexDirRowEnd,
  FlexDirRowSpace,
  FlexFDirRowSpace
} from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import { useFocusEffect } from '@react-navigation/native';
import {
  Heading2,
  Heading3,
  Heading4Regular,
  Heading5,
  ShiftFromTop10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { ThemeContext } from 'styled-components/native';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';
const ActiveChildMeasureTimeline = (props: any) => {
  const {activeChild} = props;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const [childmeasures, setChildmeasures] = React.useState<any[]>([]);
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
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: measurementDate.toFormat("dd'.'MM'.'yyyy"),
        dateToMilis: measurementDate.toMillis(),
        titleDateInMonth: month,
      };
    });

    allMeasurements = allMeasurements.sort(
      (a: any, b: any) => a.dateToMilis - b.dateToMilis,
    );
    setChildmeasures(allMeasurements.reverse());
    // activeChild.measures = allMeasurements;
    // console.log(activeChild.measures, allMeasurements, 'NewMeasures');
  };
  useFocusEffect(
    React.useCallback(() => {
      setNewChildMeasureUpdates();
    }, [activeChild]),
  );

  const renderDetail = (rowData, sectionID, rowID) => {
    // console.log(sectionID,rowID);
    // console.log(toFormat("DD MMM YYYY"))
    // console.log(DateTime.fromISO(rowData.measurementDate).toFormat('dd MMM yyyy'))
    const renderTitle = (key: number, titleDateInMonth: number) => {
      // if (key === 0) {
      if (titleDateInMonth === 0) {
        return t('onBirthDay');
      } else {
        return `${titleDateInMonth} ${t('month')}`;
      }
    };
    let title = (
      <FDirRow>
        <Heading3>
          {renderTitle(
            sectionID,
            rowData.titleDateInMonth ? rowData.titleDateInMonth : 0,
          )}{' '}
        </Heading3>
        <Heading5>{rowData.measurementDate}</Heading5>
      </FDirRow>
    );

    return (
      <Flex1>
        {title}
        <ShiftFromTop10>
          <FlexDirRowSpace>
            <Flex2>
              <FlexFDirRowSpace>
                <FlexDirColStart>
                  <Heading4Regular>{t('growthScreenwText')}</Heading4Regular>
                  <Heading2>
                    {rowData.weight} {t('growthScreenkgText')}
                  </Heading2>
                </FlexDirColStart>

                <FlexDirColStart>
                  <Heading4Regular>{t('growthScreenhText')}</Heading4Regular>
                  <Heading2>
                    {rowData.height} {t('growthScreencmText')}
                  </Heading2>
                </FlexDirColStart>
              </FlexFDirRowSpace>
            </Flex2>
            <Flex1>
              <Pressable
                onPress={() => {
                  // navigation.navigate('AddNewChildgrowth', {
                  //   headerTitle: t('growthScreeneditNewBtntxt'),
                  //   editData :rowData
                  // });
                }}>
                <FlexDirRowEnd>
                  <ButtonTextMdLine>
                    {t('growthScreeneditText')}
                  </ButtonTextMdLine>
                </FlexDirRowEnd>
              </Pressable>
            </Flex1>
          </FlexDirRowSpace>
        </ShiftFromTop10>
      </Flex1>
    );
  };
  return (
    <>
      <Timeline
        data={childmeasures}
        circleSize={20}
        circleColor={headerColor}
        lineColor="#000"
        showTime={false}
        lineWidth={1}
        descriptionStyle={{color: 'gray'}}
        renderDetail={renderDetail}
        innerCircle={'icon'}
        iconDefault={<Icon name={'ic_tick'} color="#000" size={10} />}
        eventDetailStyle={{
          backgroundColor: '#FFF',
          marginBottom: 10,
          padding: 15,
          borderRadius: 4,
        }}
      />
    </>
  );
};
export default ActiveChildMeasureTimeline;
