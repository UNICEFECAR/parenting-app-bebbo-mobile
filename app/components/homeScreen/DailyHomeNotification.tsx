import {dailyMessage} from "../../services/dailyMessage";
import {useFocusEffect} from "@react-navigation/native";
import { BgPrimary } from "@components/shared/BackgroundColors";
import { MainContainer } from "@components/shared/Container";
import { Flex1, FlexDirRowStart } from "@components/shared/FlexBoxStyle";
import Icon, { OuterIconLeft, OuterIconRow } from "@components/shared/Icon";
import {
  Heading3Regularw,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../App";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";
import { selectDailyMessages } from "../../services/selectors";
const styles = StyleSheet.create({
  shiftFromBottom: { flex: 1, flexDirection: "column" },
});
const DailyHomeNotification = (): any => {
  const [calendar, setCalendar] = useState(() => DateTime.local());
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectDailyMessages);
  const currentNotification = useAppSelector(
    (state: any) => state.utilsData.dailyMessageNotification
  );
  useFocusEffect(useCallback(() => {setCalendar(DateTime.local());}, []));
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') setCalendar(DateTime.local());
    });
    return () => subscription.remove();
  }, []);
  const {day, month, year} = calendar;
  const notification = useMemo(() => dailyMessage(records, currentNotification, {day, month, year}),
    [records, currentNotification, day, month, year]);
  useEffect(() => {
    if (!notification) return;
    const value = JSON.stringify(notification);
    if (value !== currentNotification) dispatch(setInfoModalOpened({key: "dailyMessageNotification", value}));
  }, [notification, currentNotification, dispatch]);

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
