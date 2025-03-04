import { BgPrimary } from "@components/shared/BackgroundColors";
import { MainContainer } from "@components/shared/Container";
import { Flex1, FlexDirRowStart } from "@components/shared/FlexBoxStyle";
import Icon, { OuterIconLeft, OuterIconRow } from "@components/shared/Icon";
import {
  Heading3Regularw,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../App";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";
const styles = StyleSheet.create({
  shiftFromBottom: { flex: 1, flexDirection: "column" },
});
const DailyHomeNotification = (): any => {
  const [notification, setNotification] = useState<any>();
  const dispatch = useAppDispatch();
  const records = useAppSelector((state: any) =>
    state.utilsData.dailymessages != ""
      ? JSON.parse(state.utilsData.dailymessages)
      : state.utilsData.dailymessages
  );
  const currentNotification = useAppSelector(
    (state: any) => state.utilsData.dailyMessageNotification
  );
  const setNotiInDB = async (noti: {
    messageId: any;
    messageText: any;
    day: number;
    month: number;
    year: number;
  }): Promise<any> => {
    dispatch(
      setInfoModalOpened({
        key: "dailyMessageNotification",
        value: JSON.stringify(noti),
      })
    );
  };

  useEffect(() => {
    const currentDate = DateTime.local();
    //for testing next day noti change
    if (
      currentNotification != null &&
      currentNotification != undefined &&
      currentNotification != ""
    ) {
      const currentNotificationVal =
        currentNotification != "" ? JSON.parse(currentNotification) : null;
      // CHECK IF DAILY MESSAGE VARIABLE NEEDS TO BE UPDATED
      if (records.length > 0) {
        if (
          currentNotificationVal.day != currentDate.day ||
          currentNotificationVal.month != currentDate.month ||
          currentNotificationVal.year != currentDate.year
        ) {
          const currentMessageIndex = records.findIndex(
            (item: any) => item.id === currentNotificationVal.messageId
          );
          // Set next daily message
          if (currentMessageIndex > -1 && records[currentMessageIndex + 1]) {
            const newNotification = {
              messageId: records[currentMessageIndex + 1]?.id,
              messageText: records[currentMessageIndex + 1]?.title,
              day: currentDate.day,
              month: currentDate.month,
              year: currentDate.year,
            };
            setNotiInDB(newNotification);
            setNotification(newNotification);
          } else {
            const firstNotification = {
              messageId: records.length > 0 ? records[0]?.id : "",
              messageText: records.length > 0 ? records[0]?.title : "",
              day: currentDate.day,
              month: currentDate.month,
              year: currentDate.year,
            };
            // firstNotification
            setNotiInDB(firstNotification);
            setNotification(firstNotification);
          }
        } else {
          //DAILY MESSAGE VARIABLE IS CurrentNotification
          setNotification(currentNotificationVal);
        }
      } else {
        //DAILY MESSAGE VARIABLE WAS NEVER SET
        const firstNotification = {
          messageId: records.length > 0 ? records[0]?.id : "",
          messageText: records.length > 0 ? records[0]?.title : "",
          day: currentDate.day,
          month: currentDate.month,
          year: currentDate.year,
        };
        setNotiInDB(firstNotification);
        setNotification(firstNotification);
      }
    } else {
      if (records.length > 0) {
        const firstNotification = {
          messageId: records ? records[0]?.id : "",
          messageText: records ? records[0]?.title : "",
          day: currentDate.day,
          month: currentDate.month,
          year: currentDate.year,
        };
        setNotiInDB(firstNotification);
        setNotification(firstNotification);
      }
    }
  }, [records.length]);

  return (
    <>
      {records.length > 0 ? (
        <BgPrimary>
          <MainContainer>
            <ShiftFromTopBottom10 style={styles.shiftFromBottom}>
              <FlexDirRowStart>
                <OuterIconRow>
                  <OuterIconLeft>
                    <Icon name="ic_sb_loveapp" size={24} color="#fff" />
                  </OuterIconLeft>
                </OuterIconRow>
                <Flex1>
                  <Heading3Regularw>
                    {notification?.messageText}
                  </Heading3Regularw>
                </Flex1>
              </FlexDirRowStart>
            </ShiftFromTopBottom10>
          </MainContainer>
        </BgPrimary>
      ) : null}
    </>
  );
};

export default DailyHomeNotification;
