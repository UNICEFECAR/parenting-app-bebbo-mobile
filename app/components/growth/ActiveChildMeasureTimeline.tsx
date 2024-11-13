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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { bgcolorWhite2, grayCode } from '@styles/style';
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
import { Pressable, StyleSheet } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { ThemeContext } from 'styled-components/native';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';
import { formatStringDate } from '../../services/Utils';
import useDigitConverter from '../../customHooks/useDigitConvert';
const styles = StyleSheet.create({
  btnTextDeco: {
    textDecorationLine:"none"
  },
  evntDetailStyle: {
    backgroundColor: bgcolorWhite2,
    borderRadius: 4,
    marginBottom: 10,
    padding: 15,
  },
  grayColor: {
    color: grayCode
  }
})
const ActiveChildMeasureTimeline = (props: any):any => {
  const {activeChild} = props;
  const {convertDigits} = useDigitConverter()
  const navigation = useNavigation<any>();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const [childmeasures, setChildmeasures] = React.useState<any[]>([]);
  const {t} = useTranslation();
  const setNewChildMeasureUpdates = ():any => {
    const measures = activeChild.measures.filter((item:any)=>item.isChildMeasured== true && item.weight>0 && item.height>0);
    let measurementDate: DateTime = DateTime.local();
    let allMeasurements = measures.map((item: MeasuresEntity) => {
      if (item.measurementDate) {
        measurementDate = DateTime.fromJSDate(new Date(item.measurementDate));
      }

      let month: any = 0;

      if (activeChild?.birthDate) {
        const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
        month = Math.round(measurementDate.diff(birthDay, 'month').months);
      }

      return {
        uuid:item.uuid,
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: formatStringDate(item?.measurementDate),
        dateToMilis: measurementDate.toMillis(),
        isChildMeasured:item.isChildMeasured,
        titleDateInMonth: month,
        measurementPlace:item.measurementPlace,
        doctorComment:item.doctorComment,
        didChildGetVaccines:item.didChildGetVaccines,
        vaccineIds:item.vaccineIds,
      };
    });

    allMeasurements = allMeasurements.sort(
      (a: any, b: any) => a.dateToMilis - b.dateToMilis,
    );
    setChildmeasures(allMeasurements.reverse());
   
  };
  useFocusEffect(
    React.useCallback(() => {
      setNewChildMeasureUpdates();
    }, [activeChild]),
  );

  const renderDetail = (rowData:any, sectionID:any):any => {
    const renderTitle = (key: number, titleDateInMonth: number):any => {
      // if (key === 0) {
      if (titleDateInMonth === 0) {
        return t('onBirthDay');
      } else {
       const monthText =  (titleDateInMonth>1)?(titleDateInMonth >=5? t('months5tag'):t('monthstag')):t('monthtag')
       return titleDateInMonth.toString() + ' ' + monthText;
        
        
      }
    };
    const title = (
      <FDirRow>
        <Heading3>
          {convertDigits(renderTitle(
            sectionID,
            rowData.titleDateInMonth ? rowData.titleDateInMonth : 0,
          ))}{' '}
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
                    {convertDigits(rowData.weight)} {t('growthScreenkgText')}
                  </Heading2>
                </FlexDirColStart>

                <FlexDirColStart>
                  <Heading4Regular>{t('growthScreenhText')}</Heading4Regular>
                  <Heading2>
                    {convertDigits(rowData.height)} {t('growthScreencmText')}
                  </Heading2>
                </FlexDirColStart>
              </FlexFDirRowSpace>
            </Flex2>
            <Flex1>
              <Pressable
                onPress={():any => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreeneditNewBtntxt'),
                    editMeasurementDate: rowData.dateToMilis
                  })
                }}>
                <FlexDirRowEnd>
                  <ButtonTextMdLine numberOfLines={2} style={styles.btnTextDeco}><Icon
                      name="ic_edit"
                      size={16}
                      color="#000"
                    /></ButtonTextMdLine>
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
        descriptionStyle={styles.grayColor}
        renderDetail={renderDetail}
        innerCircle={'icon'}
        iconDefault={<Icon name={'ic_tick'} color="#000" size={10} />}
        eventDetailStyle={styles.evntDetailStyle}
      />
    </>
  );
};
export default ActiveChildMeasureTimeline;

