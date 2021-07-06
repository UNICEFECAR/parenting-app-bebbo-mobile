import { dailyHomeNotificationdata } from '@assets/translations/appOfflineData/dailyHomeNotification';
import useToGetOfflineData from '@assets/translations/appOfflineData/useToGetOfflineData';
import { BgPrimary } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { Flex1, FlexDirRowStart } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { useFocusEffect } from '@react-navigation/native';
import { Heading3Regularw, ShiftFromTopBottom10 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import {
  ConfigSettingsEntity,
  ConfigSettingsSchema
} from '../../database/schema/ConfigSettingsSchema';
import {
  DailyHomeMessagesEntity,
  DailyHomeMessagesSchema
} from '../../database/schema/DailyHomeMessagesSchema';
import { setDailyMessagesData } from '../../redux/reducers/utilsSlice';
import { getAllConfigData } from '../../services/childCRUD';
const DailyHomeNotification = () => {
  const [notification, setNotification] = useState<any>('');
  const dispatch = useAppDispatch();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const records = useAppSelector((state: any) => state.utilsData.dailymessages);

  console.log(records);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
  );
  console.log(allConfigData, '..allConfigData..');
  const currentNotification =
    allConfigData?.length > 0
      ? allConfigData.find((item) => item.key == 'dailyNotification')
      : [];
const currentNotificationVal = currentNotification?.value
  // console.log(currentNotificationConfig);
  // const currentNotification = JSON.parse(currentNotificationConfig?.value);
  console.log('currentNotification', currentNotification,currentNotificationVal);
  const getNotification = async () => {
    let currentDate = DateTime.local();
    if (currentNotificationVal) {
      // CHECK IF DAILY MESSAGE VARIABLE NEEDS TO BE UPDATED
     
      if (
        currentNotificationVal.day != currentDate.day ||
        currentNotificationVal.month != currentDate.month ||
        currentNotificationVal.year != currentDate.year
      ) {
        const currentMessageIndex = records.findIndex(
          (item: any) => item.id === currentNotificationVal.messageId,
        );
        // Set next daily message
        let newNotification = {
          messageId: records[currentMessageIndex + 1].id,
          messageText: records[currentMessageIndex + 1].title,
          day: currentDate.day,
          month: currentDate.month,
          year: currentDate.year,
        };
        let updateNotifcation =
          await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
            ConfigSettingsSchema,
            'dailyNotification',
            JSON.stringify(newNotification),
          );
        console.log(updateNotifcation);
        setNotification(newNotification);
        return newNotification;
      } else {
        setNotification(currentNotificationVal);
        return currentNotificationVal;
      }
    } else {
      console.log('DAILY MESSAGE VARIABLE WAS NEVER SET', records);
      let firstNotification = {
        messageId: records[0].id,
        messageText: records[0].title,
        day: currentDate.day,
        month: currentDate.month,
        year: currentDate.year,
      };
      console.log(firstNotification);
      let updateNotifcation =
        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
          ConfigSettingsSchema,
          'dailyNotification',
          JSON.stringify(firstNotification),
        );
      console.log(updateNotifcation);
      setNotification(firstNotification);
      return firstNotification;
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getAllConfigData(dispatch);
      async function fetchData() {
        let Entity: any;
        // Entity = Entity as DailyHomeMessagesEntity
        const dailyNotiData = await useToGetOfflineData(
          languageCode,
          dispatch,
          DailyHomeMessagesSchema,
          Entity as DailyHomeMessagesEntity,
          dailyHomeNotificationdata,
          setDailyMessagesData,
          'id',
        );
      }
      fetchData().then(() => {
        getNotification();
      });
    }, [languageCode]),
  );

  return (
    <>
      <BgPrimary>
        <MainContainer>
          <ShiftFromTopBottom10>
            <FlexDirRowStart>
              <OuterIconRow>
                <OuterIconLeft>
                  <Pressable onPress={() => getNotification()}>
                    <Icon name="ic_sb_loveapp" size={24} color="#fff" />
                  </Pressable>
                </OuterIconLeft>
              </OuterIconRow>
              <Flex1>
                <Heading3Regularw>{notification?.messageText}</Heading3Regularw>
              </Flex1>
            </FlexDirRowStart>
          </ShiftFromTopBottom10>
        </MainContainer>
      </BgPrimary>
    </>
  );
};

export default DailyHomeNotification;
