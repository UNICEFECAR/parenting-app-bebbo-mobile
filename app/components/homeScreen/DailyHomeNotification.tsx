import { BgPrimary } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { Flex1, FlexDirRowStart } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { Heading3Regularw, ShiftFromTopBottom10 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
const DailyHomeNotification = () => {
  const [notification, setNotification] = useState<any>();
  const dispatch = useAppDispatch();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  // const records = useAppSelector((state: any) => state.utilsData.dailymessages);
  // const utilsDatarecordConsts = useAppSelector((state: any) =>
  //   state.utilsData != '' ? state.utilsData : state.utilsData,
  // );
  // console.log(utilsDatarecordConsts, 'utilsDatarecordConsts<>');
  const records = useAppSelector((state: any) =>
    state.utilsData.dailymessages != ''
      ? JSON.parse(state.utilsData.dailymessages)
      : state.utilsData.dailymessages,
  );
  console.log(records, '<<records>>');
  const currentNotification = useAppSelector((state: any) =>
  (state.utilsData.dailyMessageNotification),
);
  // const allConfigData = useAppSelector((state: any) =>
  //   state.variableData?.variableData != ''
  //     ? JSON.parse(state.variableData?.variableData)
  //     : state.variableData?.variableData,
  // );
  // console.log(allConfigData, '..allConfigData..');
  const setNotiInDB = async (noti: { messageId: any; messageText: any; day: number; month: number; year: number; }) => {
    // await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
    //   ConfigSettingsSchema,
    //   'dailyNotification',
    //   JSON.stringify(noti),
    // );
    // console.log('setNotiInDB', noti);
    dispatch(setInfoModalOpened({key:'dailyMessageNotification', value: JSON.stringify(noti)}));
    // let dailymessage = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "dailyNotification", JSON.stringify(noti));
    // console.log(dailymessage, 'dailymessageAdded');
    // getAllConfigData(dispatch);
  };

  useEffect(() => {
    console.log(currentNotification, 'currentNotification<>');
    let currentDate = DateTime.local();
    // let currentDate = DateTime.local().plus({days: 4});//for testing next day noti change
    if (currentNotification != null && currentNotification != undefined && currentNotification != '') {
      console.log(currentNotification, 'currentNotification<>');
      const currentNotificationVal = currentNotification!=''
        ? JSON.parse(currentNotification)
        : null;
      // console.log('currentNotificationVal', currentNotificationVal);
      // CHECK IF DAILY MESSAGE VARIABLE NEEDS TO BE UPDATED
      if (records.length > 0) {
        if (
          currentNotificationVal.day != currentDate.day ||
          currentNotificationVal.month != currentDate.month ||
          currentNotificationVal.year != currentDate.year
        ) {
          const currentMessageIndex = records.findIndex(
            (item: any) => item.id === currentNotificationVal.messageId,
          );
          // console.log(currentMessageIndex, 'currentMessageIndex');
          // Set next daily message
          let newNotification = {
            messageId: records[currentMessageIndex + 1].id,
            messageText: records[currentMessageIndex + 1].title,
            day: currentDate.day,
            month: currentDate.month,
            year: currentDate.year,
          };
          let updateNotifcation = setNotiInDB(newNotification);
          // console.log(updateNotifcation);
          setNotification(newNotification);
          // console.log(
          //   'DAILY MESSAGE VARIABLE IS updated  Set next daily message',
          //   newNotification,
          // );
        } else {
          // console.log('DAILY MESSAGE VARIABLE IS CurrentNotification', records);
          setNotification(currentNotificationVal);
        }
      } else {
        // console.log('DAILY MESSAGE VARIABLE WAS NEVER SET', records);
        let firstNotification = {
          messageId: records ? records[0].id : '',
          messageText: records ? records[0].title : '',
          day: currentDate.day,
          month: currentDate.month,
          year: currentDate.year,
        };
        // console.log(firstNotification,"firstNotification");
        let updateNotifcation = setNotiInDB(firstNotification);
        setNotification(firstNotification);
        // console.log(updateNotifcation);
      }
    }else{
      if (records.length > 0) {
      let firstNotification = {
        messageId: records ? records[0].id : '',
        messageText: records ? records[0].title : '',
        day: currentDate.day,
        month: currentDate.month,
        year: currentDate.year,
      };
      console.log(firstNotification,"firstNotification");
      let updateNotifcation = setNotiInDB(firstNotification);
      setNotification(firstNotification);
    }
    }
  }, [records.length]);

  return (
    <>
    {records.length > 0?
      <BgPrimary>
        <MainContainer>
          <ShiftFromTopBottom10>
            <FlexDirRowStart>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_sb_loveapp" size={24} color="#fff" />
                </OuterIconLeft>
              </OuterIconRow>
              <Flex1>
                <Heading3Regularw>{notification?.messageText}</Heading3Regularw>
              </Flex1>
            </FlexDirRowStart>
          </ShiftFromTopBottom10>
        </MainContainer>
      </BgPrimary>
       : null}
    </>
  );
};

export default DailyHomeNotification;
