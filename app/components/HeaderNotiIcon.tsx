import {usePendingLocalNotifications} from "../customHooks/usePendingLocalNotifications";
import {useCommittedRef} from "../customHooks/useCommittedRef";
import { scheduleIdleTask } from "../services/scheduleIdleTask";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Heading6w } from "@styles/typography";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../../App";
import useDigitConverter from "../customHooks/useDigitConvert";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
import {
  setFavouriteAdvices,
  setFavouriteGames,
} from "../redux/reducers/childSlice";
import {
  setAllLocalNotificationData,
  setAllLocalNotificationGenerateType,
  setAllNotificationData,
  setAllScheduledLocalNotificationData,
} from "../redux/reducers/notificationSlice";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
import {
  getAllChildrenDetails,
  isFutureDate,
  isFutureDateTime,
} from "../services/childCRUD";
import LocalNotifications from "../services/LocalNotifications";
import {
  createAllLocalNotificatoins,
  getChildNotification,
  getChildReminderNotifications,
  getNextChildNotification,
  getVaccinesForPeriodCount,
  isPeriodsMovedAhead,
} from "../services/notificationService";
import Icon from "./shared/Icon";
import { BubbleContainer, BubbleView1 } from "./shared/NavigationDrawer";
import { selectActiveChild, selectAllTaxonomyData, selectChildAge, selectHealthCheckupsData, selectVaccineData } from "../services/selectors";
const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -12,
    top: -5,
  },
  iconStyle: { position: "relative" },
  outerPressable: {
    flexDirection: "row",
  },
});
const HeaderNotiIcon = (props: any): any => {
  const { convertDigits } = useDigitConverter();
  const allnotis = useAppSelector(
    (state: any) => state.notificationData.notifications
  );
  const localNotifications = useAppSelector(
    (state: any) => state.notificationData.localNotifications
  );
  const scheduledlocalNotifications = useAppSelector(
    (state: any) => state.notificationData.scheduledlocalNotifications
  );
  const localNotificationGenerateType = useAppSelector(
    (state: any) => state.notificationData.localNotificationGenerateType
  );

  const activeChild = useAppSelector(selectActiveChild);
  const dispatch = useAppDispatch();
  const childAge = useAppSelector(selectChildAge);
  const generateNotificationsFlag = useAppSelector(
    (state: any) => state.utilsData.generateNotifications
  );
  const allHealthCheckupsData = useAppSelector(selectHealthCheckupsData);
  const growthEnabledFlag = useAppSelector(
    (state: any) => state.notificationData.growthEnabled
  );
  const developmentEnabledFlag = useAppSelector(
    (state: any) => state.notificationData.developmentEnabled
  );
  const vchcEnabledFlag = useAppSelector(
    (state: any) => state.notificationData.vchcEnabled
  );
  const taxonomy = useAppSelector(selectAllTaxonomyData);
  const allGrowthPeriods = taxonomy?.growth_period;
  const allVaccinePeriods = useAppSelector(selectVaccineData);
  const allVaccineData = useAppSelector(selectVaccineData);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newAllChildNotis, setAllChildNotis] = useState<any>([]);
  const [flagValue, setFlagValue] = useState<boolean>(false);
  const generationInputs = useCommittedRef({allGrowthPeriods, allHealthCheckupsData, allVaccinePeriods, allnotis, childAge, developmentEnabledFlag, dispatch, growthEnabledFlag, vchcEnabledFlag});
  useEffect(() => {
      const {allGrowthPeriods: inputAllGrowthPeriods, allHealthCheckupsData: inputAllHealthCheckupsData, allVaccinePeriods: inputAllVaccinePeriods, allnotis: inputAllnotis, childAge: inputChildAge, developmentEnabledFlag: inputDevelopmentEnabledFlag, dispatch: inputDispatch, growthEnabledFlag: inputGrowthEnabledFlag, vchcEnabledFlag: inputVchcEnabledFlag} = generationInputs.current;

    console.log("firstuseeffect", generateNotificationsFlag);
    const task = scheduleIdleTask(() => {
      if (generateNotificationsFlag == true) {
        const fetchDataOfNotifications = async (): Promise<any> => {
          const childList = await getAllChildrenDetails(inputDispatch, inputChildAge, 1);
          const allchildNotis: any[] = [];
          childList?.map((child: any) => {
            const notiExist = inputAllnotis.find(
              (item: any) => String(item.childuuid) == String(child.uuid)
            );
            if (notiExist != undefined) {
              //remove reminder notis
              if (isFutureDate(child?.birthDate)) {
                // do not calculate for expecting child
                //empty childNotis // find and remove child from notification slice
              } else {
                const checkIfNewCalcRequired = isPeriodsMovedAhead(
                  inputChildAge,
                  notiExist,
                  child,
                  inputAllVaccinePeriods,
                  inputAllGrowthPeriods,
                  inputAllHealthCheckupsData
                );
                if (checkIfNewCalcRequired) {
                  const reminderNotis = getChildReminderNotifications(
                    child,
                    notiExist.reminderNotis,
                    inputVchcEnabledFlag
                  );
                  const {
                    lastgwperiodid,
                    lastvcperiodid,
                    lasthcperiodid,
                    gwcdnotis,
                    vcnotis,
                    hcnotis,
                  } = getNextChildNotification(
                    notiExist.lastgwperiodid,
                    notiExist.lastvcperiodid,
                    notiExist.lasthcperiodid,
                    child,
                    inputChildAge,
                    inputAllHealthCheckupsData,
                    inputAllVaccinePeriods,
                    inputAllGrowthPeriods,
                    inputGrowthEnabledFlag,
                    inputDevelopmentEnabledFlag,
                    inputVchcEnabledFlag
                  );
                  ////  append new notifications for child
                  const allgwcdnotis: any = [];
                  const allvcnotis: any = [];
                  const allhcnotis: any = [];
                  gwcdnotis.reverse().forEach((item: any) => {
                    allgwcdnotis.push(item);
                  });
                  if (notiExist.gwcdnotis) {
                    notiExist.gwcdnotis?.forEach((item: any) => {
                      allgwcdnotis.push(item);
                    });
                  }
                  vcnotis.reverse().forEach((item: any) => {
                    allvcnotis.push(item);
                  });
                  if (notiExist.vcnotis) {
                    notiExist.vcnotis?.forEach((item: any) => {
                      allvcnotis.push(item);
                    });
                  }
                  hcnotis.reverse().forEach((item: any) => {
                    allhcnotis.push(item);
                  });
                  if (notiExist.hcnotis) {
                    notiExist.hcnotis?.forEach((item: any) => {
                      allhcnotis.push(item);
                    });
                  }
                  const allreminderNotis: any = [];
                  reminderNotis.reverse().forEach((item: any) => {
                    allreminderNotis.push(item);
                  });
                  // remove duplicates by key of growth_period,periodName from reminderNotis
                  allchildNotis.push({
                    childuuid: notiExist.childuuid,
                    lastgwperiodid: lastgwperiodid,
                    lastvcperiodid: lastvcperiodid,
                    lasthcperiodid: lasthcperiodid,
                    gwcdnotis: allgwcdnotis,
                    vcnotis: allvcnotis,
                    hcnotis: allhcnotis,
                    reminderNotis: allreminderNotis,
                  });
                } else {
                  //for child dob taken from 2years to 3 months, calculate new notifications from 3 months onwards
                  //find and remove child from notification slice
                  //clear notification which are already generated,
                  //generate for new notifications
                  const allreminderNotis: any = [];
                  const reminderNotis = getChildReminderNotifications(
                    child,
                    notiExist.reminderNotis,
                    inputVchcEnabledFlag
                  );
                  reminderNotis.reverse().forEach((item: unknown) => {
                    allreminderNotis.push(item);
                  });
                  allchildNotis.push({
                    childuuid: notiExist.childuuid,
                    lastgwperiodid: notiExist.lastgwperiodid,
                    lastvcperiodid: notiExist.lastvcperiodid,
                    lasthcperiodid: notiExist.lasthcperiodid,
                    gwcdnotis: notiExist.gwcdnotis,
                    vcnotis: notiExist.vcnotis,
                    hcnotis: notiExist.hcnotis,
                    reminderNotis: allreminderNotis,
                  });
                }
              }
            } else {
              // create notification for that child first time
              if (!isFutureDate(child?.birthDate)) {
                const {
                  lastgwperiodid,
                  lastvcperiodid,
                  lasthcperiodid,
                  gwcdnotis,
                  vcnotis,
                  hcnotis,
                }: any = getChildNotification(
                  child,
                  inputChildAge,
                  inputAllHealthCheckupsData,
                  inputAllVaccinePeriods,
                  inputAllGrowthPeriods,
                  inputGrowthEnabledFlag,
                  inputDevelopmentEnabledFlag,
                  inputVchcEnabledFlag
                );
                const reminderNotis = getChildReminderNotifications(
                  child,
                  [],
                  inputVchcEnabledFlag
                );
                allchildNotis.push({
                  childuuid: child.uuid,
                  lastgwperiodid,
                  lastvcperiodid,
                  lasthcperiodid,
                  gwcdnotis: gwcdnotis,
                  vcnotis: vcnotis,
                  hcnotis: hcnotis,
                  reminderNotis: reminderNotis,
                });
              } else {
                //for expecting child no notifications
              }
            }
          });
          inputDispatch(setAllNotificationData(allchildNotis));
          //generate notifications for all childs
          //get all notifications for all childfrom slice, if [],then generate as per their DOB/createdate,
          //if already exist, then for each module get last period, and generate afterwards period's notifications
          //after generating notifications make it false
          const notiFlagObj = { key: "generateNotifications", value: false };
          inputDispatch(setInfoModalOpened(notiFlagObj));
        };
        fetchDataOfNotifications();
      }
    });

    return () => task.cancel();
  }, [generateNotificationsFlag, generationInputs]);

  useFocusEffect(
    React.useCallback(() => {
      // Your dismiss logic here
      const task = scheduleIdleTask(() => {
        if (allnotis.length > 0) {
          const currentChildNotis = allnotis?.find(
            (item: any) => item.childuuid == activeChild.uuid
          );
          //notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis
          if (!isFutureDate(activeChild?.birthDate)) {
            if (currentChildNotis) {
              const currentChildallnoti: any = [];
              if (currentChildNotis.gwcdnotis) {
                currentChildNotis.gwcdnotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              if (currentChildNotis.hcnotis) {
                currentChildNotis.hcnotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              if (currentChildNotis.vcnotis) {
                //
                currentChildNotis.vcnotis.forEach((item: any) => {
                  if (item.title == "vcNoti1") {
                    const vcNotisExists = getVaccinesForPeriodCount(
                      allVaccineData,
                      item.growth_period
                    );
                    if (
                      vcNotisExists != "" &&
                      vcNotisExists != null &&
                      vcNotisExists != undefined
                    ) {
                      currentChildallnoti.push(item);
                    }
                  } else {
                    currentChildallnoti.push(item);
                  }
                });
              }
              if (currentChildNotis.reminderNotis) {
                currentChildNotis.reminderNotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              const childBirthDate = DateTime.fromJSDate(
                new Date(activeChild.birthDate)
              ).toMillis();
              //  (item.days_from < childAgeInDays && childCrateDate <= fromDate)
              const toDay = DateTime.fromJSDate(new Date()).toMillis();
              const combinedNotis = currentChildallnoti
                .sort(
                  (a: any, b: any) =>
                    new Date(a.notificationDate).getTime() - new Date(b.notificationDate).getTime()
                )
                .filter((item: any) => {
                  return (
                    item.isRead == false &&
                    item.isDeleted == false &&
                    toDay >=
                      DateTime.fromJSDate(
                        new Date(item.notificationDate)
                      ).toMillis() &&
                    childBirthDate <=
                      DateTime.fromJSDate(
                        new Date(item.notificationDate)
                      ).toMillis()
                  );
                });
              // delete item from combinedNotis item => { item.title == 'cdNoti2' && childAgeInDays >= item.days_to })
              setNotifications(
                currentChildallnoti.length > 0 ? combinedNotis : []
              );
            }
          } else {
            setNotifications([]);
          }
        }
      });
      return () => task.cancel();
    }, [activeChild.uuid, activeChild.birthDate, allnotis, allVaccineData])
  );
  const localGenerationInputs = useCommittedRef({allGrowthPeriods, allHealthCheckupsData, allVaccineData, allVaccinePeriods, childAge, developmentEnabledFlag, dispatch, growthEnabledFlag, localNotifications, scheduledlocalNotifications, t, vchcEnabledFlag});
  useFocusEffect(
    React.useCallback(() => {
      const {allGrowthPeriods: inputAllGrowthPeriods, allHealthCheckupsData: inputAllHealthCheckupsData, allVaccineData: inputAllVaccineData, allVaccinePeriods: inputAllVaccinePeriods, childAge: inputChildAge, developmentEnabledFlag: inputDevelopmentEnabledFlag, dispatch: inputDispatch, growthEnabledFlag: inputGrowthEnabledFlag, localNotifications: inputLocalNotifications, scheduledlocalNotifications: inputScheduledlocalNotifications, t: inputT, vchcEnabledFlag: inputVchcEnabledFlag} = localGenerationInputs.current;

      const fetchData = async (): Promise<any> => {
        const currscheduledlocalNotifications = [
          ...inputScheduledlocalNotifications,
        ];
        if (localNotificationGenerateType.generateFlag == true) {
          if (localNotificationGenerateType.generateType == "onAppStart") {
            LocalNotifications.removeAllDeliveredLocalNotifications();
            inputDispatch(setAllLocalNotificationData(inputLocalNotifications));
            const localnotiFlagObj = {
              generateFlag: false,
              generateType: "add",
              childuuid: "all",
            };
            inputDispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          } else {
            const childList = await getAllChildrenDetails(
              inputDispatch,
              inputChildAge,
              1
            );
            if (childList && childList.length > 0) {
              if (localNotificationGenerateType.childuuid == "all") {
                const allChildNotis: any[] = [];
                const resolvedPromises = childList.map(async (child: any) => {
                  const noti = await createAllLocalNotificatoins(
                    child,
                    inputChildAge,
                    inputDevelopmentEnabledFlag,
                    inputGrowthEnabledFlag,
                    inputVchcEnabledFlag,
                    inputT,
                    inputAllVaccinePeriods,
                    inputAllGrowthPeriods,
                    inputAllHealthCheckupsData,
                    inputAllVaccineData,
                    inputLocalNotifications
                  );
                  return noti;
                });
                const results = await Promise.all(resolvedPromises);
                results.map((x: any) => allChildNotis.push(x));
                currscheduledlocalNotifications.map((m: any) => {
                  LocalNotifications.cancelReminderLocalNotification(m.notiid);
                });
                inputDispatch(setAllScheduledLocalNotificationData([]));
                inputDispatch(setAllLocalNotificationData(allChildNotis));
                const localnotiFlagObj = {
                  generateFlag: false,
                  generateType: "add",
                  childuuid: "all",
                };
                inputDispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
              } else {
                const allChildNotis: any[] = [];
                //create new one and add in existing array
                const newchild = childList.find(
                  (z: any) => z.uuid == localNotificationGenerateType.childuuid
                );
                if (newchild) {
                  const newchildnoti = await createAllLocalNotificatoins(
                    newchild,
                    inputChildAge,
                    inputDevelopmentEnabledFlag,
                    inputGrowthEnabledFlag,
                    inputVchcEnabledFlag,
                    inputT,
                    inputAllVaccinePeriods,
                    inputAllGrowthPeriods,
                    inputAllHealthCheckupsData,
                    inputAllVaccineData,
                    inputLocalNotifications
                  );
                  inputLocalNotifications.map((y: any) => {
                    if (y.key != localNotificationGenerateType.childuuid) {
                      allChildNotis.push(y);
                    }
                  });
                  allChildNotis.push(newchildnoti);
                } else {
                  inputLocalNotifications.map((y: any) => {
                    if (y.key != localNotificationGenerateType.childuuid) {
                      allChildNotis.push(y);
                    }
                  });
                }
                // //cancelled all scheduled notifications as when new child added or edited the noti should come for all child.
                currscheduledlocalNotifications.map((m: any) => {
                  LocalNotifications.cancelReminderLocalNotification(m.notiid);
                });
                setAllChildNotis(allChildNotis);
                setFlagValue(true);
              }
            }
            //make flag false at the end
          }
        }
      };
      const task = scheduleIdleTask(() => {
        fetchData();
      });
      return () => task.cancel();
    }, [localNotificationGenerateType, localGenerationInputs])
  );
  usePendingLocalNotifications(flagValue, newAllChildNotis, setFlagValue, dispatch);
  const scheduleInputs = useCommittedRef({dispatch, scheduledlocalNotifications, t});
  useEffect(() => {
      const {dispatch: inputDispatch, scheduledlocalNotifications: inputScheduledlocalNotifications, t: inputT} = scheduleInputs.current;

    const fetchDataOfScheduled = async (): Promise<any> => {
      const allnotiobj: any[] = [];
      localNotifications.map((x: any) => {
        x.data.map((y: any) => {
          allnotiobj.push(y);
        });
      });
      const sortedallnotiobj: any = allnotiobj.sort(
        (a: any, b: any) => new Date(a.notiDate).getTime() - new Date(b.notiDate).getTime()
      );
      const filteredschedulednoti = inputScheduledlocalNotifications.filter(
        (x: any) => isFutureDateTime(new Date(x.notiDate)) == true
      );
      sortedallnotiobj.map((x: any) => {
        if (filteredschedulednoti && filteredschedulednoti.length < 55) {
          if (isFutureDateTime(new Date(x.notiDate))) {
            if (
              inputScheduledlocalNotifications.findIndex(
                (y: any) => y.notiDate == x.notiDate
              ) == -1
            ) {
              filteredschedulednoti.push({
                notiid: x.notiid,
                notiDate: x.notiDate,
              });
              LocalNotifications.schduleNotification(
                new Date(x.notiDate),
                inputT("remindersAlertTitle"),
                x.notiMsg,
                x.notiid,
                x.type,
                x.childUuid
              );
            }
          }
        } else {
          return;
        }
      });
      inputDispatch(setAllScheduledLocalNotificationData(filteredschedulednoti));
    };
    const task = scheduleIdleTask(() => {
      fetchDataOfScheduled();
    });
    return () => task.cancel();
  }, [localNotifications, scheduleInputs]);

  useEffect(() => {
    // LocalNotifications.getAllScheduledLocalNotifications();
    // LocalNotifications.getDeliveredNotifications();
    const fetchDataFav = async (): Promise<any> => {
      const filterQuery = 'uuid == "' + activeChild.uuid + '"';
      const childData = await userRealmCommon.getFilteredData<ChildEntity>(
        ChildEntitySchema,
        filterQuery
      );
      childData[0]?.favoriteadvices &&
        dispatch(
          setFavouriteAdvices(
            Object.values(childData[0]?.favoriteadvices) || []
          )
        );
      childData[0]?.favoritegames &&
        dispatch(
          setFavouriteGames(Object.values(childData[0]?.favoritegames) || [])
        );
    };
    const task = scheduleIdleTask(() => {
      fetchDataFav();
    });
    return () => task.cancel();
  }, [activeChild.uuid, dispatch]);
  const navigation = useNavigation<any>();
  return (
    <>
      {props.isVisibleIcon ? (
        <Pressable
          onPress={(): any => navigation.navigate("NotificationsScreen")}
          style={styles.outerPressable}
        >
          <Icon
            name="ic_sb_notification"
            size={32}
            color={props.color}
            style={styles.iconStyle}
          />
          {notifications.length > 0 ? (
            <BubbleContainer style={styles.bubbleContainer}>
              <BubbleView1>
                <Heading6w>{convertDigits(notifications.length)}</Heading6w>
              </BubbleView1>
            </BubbleContainer>
          ) : null}
        </Pressable>
      ) : null}
    </>
  );
};
export default HeaderNotiIcon;
