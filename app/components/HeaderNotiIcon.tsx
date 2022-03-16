import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading6w } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { setFavouriteAdvices, setFavouriteGames } from '../redux/reducers/childSlice';
import { setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getAllChildren, isFutureDate } from '../services/childCRUD';
import { getChildNotification, getChildReminderNotifications, getNextChildNotification, isPeriodsMovedAhead } from '../services/notificationService';
import Icon from './shared/Icon';
import { BubbleContainer, BubbleView, BubbleView1 } from './shared/NavigationDrawer';
const headerHeight = 50;
const HeaderNotiIcon = (props: any) => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  const isVisibleIcon = props.isVisibleIcon;
  let allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const dispatch = useAppDispatch();
  let childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const generateNotificationsFlag = useAppSelector((state: any) =>
    (state.utilsData.generateNotifications),
  );
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      state.utilsData.healthCheckupsData != '' ? JSON.parse(state.utilsData.healthCheckupsData) : [],
  );
  const growthEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.growthEnabled),
  );
  const developmentEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.developmentEnabled),
  );
  const vchcEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.vchcEnabled),
  );
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  let allGrowthPeriods = taxonomy?.growth_period;
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  );
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    if (generateNotificationsFlag == true) {
      const fetchData = async () => {
        let childList = await getAllChildren(dispatch, childAge, 1);
        let allchildNotis: any[] = [];
       // console.log(childList, "..childList..")
        childList?.map((child: any) => {
         // console.log(child, "<<child>>")
          const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
         console.log("notiExist---", notiExist);
          if (notiExist != undefined) {
            // notiExist.gwcdnotis?.forEach((item) => {
            //   allgwcdnotis.push(item)
            // })
            //remove reminder notis
            // dispatch(setAllNotificationData(notiExist))
            if (isFutureDate(child?.birthDate)) {
              // do not calculate for expecting child
              //empty childNotis // find and remove child from notification slice
              //console.log("CHILD_ISEXPECTING_REMOVEALLNOTIREQUIRED")
            } else {
              let reminderNotis = getChildReminderNotifications(child, notiExist.reminderNotis, vchcEnabledFlag);
              const checkIfNewCalcRequired = isPeriodsMovedAhead(childAge, notiExist, child, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData)
            //  console.log(checkIfNewCalcRequired, "checkIfNewCalcRequired")
              if (checkIfNewCalcRequired) {
              //  console.log("NEWCALCREQUIRED")
               // console.log(notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis, "EXISTINGNOTI");
                const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getNextChildNotification(notiExist.lastgwperiodid, notiExist.lastvcperiodid, notiExist.lasthcperiodid, child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods, growthEnabledFlag, developmentEnabledFlag, vchcEnabledFlag);

                //console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "NEWNOTI2");

                ////  append new notifications for child 
                let allgwcdnotis: any = [];
                let allvcnotis: any = [];
                let allhcnotis: any = [];
                gwcdnotis.reverse().forEach((item) => {
                  allgwcdnotis.push(item)
                })
                if (notiExist.gwcdnotis) {
                  notiExist.gwcdnotis?.forEach((item) => {
                    allgwcdnotis.push(item)
                  })
                }
                vcnotis.reverse().forEach((item) => {
                  allvcnotis.push(item)
                })
                if (notiExist.vcnotis) {
                  notiExist.vcnotis?.forEach((item) => {
                    allvcnotis.push(item)
                  })
                }
                hcnotis.reverse().forEach((item) => {
                  allhcnotis.push(item)
                })
                if (notiExist.hcnotis) {
                  notiExist.hcnotis?.forEach((item) => {
                    allhcnotis.push(item)
                  })
                }
                let allreminderNotis: any = []
                // if (notiExist.reminderNotis) {
                //   notiExist.reminderNotis?.forEach((item) => {
                //     allreminderNotis.push(item)
                //   })
                // }
                reminderNotis.reverse().forEach((item) => {
                  allreminderNotis.push(item)
                })
                // remove duplicates by key of growth_period,periodName from reminderNotis
               // console.log(allhcnotis, allvcnotis, allgwcdnotis, allreminderNotis, "ONLYnewnoti");
                allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: lastgwperiodid, lastvcperiodid: lastvcperiodid, lasthcperiodid: lasthcperiodid, gwcdnotis: allgwcdnotis, vcnotis: allvcnotis, hcnotis: allhcnotis, reminderNotis: allreminderNotis })

              } else {

                //for child dob taken from 2years to 3 months, calculate new notifications from 3 months onwards
                //find and remove child from notification slice
                //clear notification which are already generated, 
                //generate for new notifications
                let allreminderNotis: any = []
                let reminderNotis = getChildReminderNotifications(activeChild, notiExist.reminderNotis, vchcEnabledFlag);
                // if (notiExist.reminderNotis) {
                //   notiExist.reminderNotis?.forEach((item) => {
                //     allreminderNotis.push(item)
                //   })
                // }
               // console.log("Periods Not Moved Ahead", notiExist);

                reminderNotis.reverse().forEach((item) => {
                  allreminderNotis.push(item)
                })
                allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: notiExist.lastgwperiodid, lastvcperiodid: notiExist.lastvcperiodid, lasthcperiodid: notiExist.lasthcperiodid, gwcdnotis: notiExist.gwcdnotis, vcnotis: notiExist.vcnotis, hcnotis: notiExist.hcnotis, reminderNotis: allreminderNotis })
              }
            }
          } else {
           // console.log("noti does not exist for child")
            // create notification for that child first time
            if (!isFutureDate(child?.birthDate)) {
              const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getChildNotification(child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods, growthEnabledFlag, developmentEnabledFlag, vchcEnabledFlag);
             // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, "childNotis")
              let reminderNotis = getChildReminderNotifications(child, [], vchcEnabledFlag);
             // console.log(reminderNotis, "childNotis")
             // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "childNotis")
              allchildNotis.push({ childuuid: child.uuid, lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis: gwcdnotis, vcnotis: vcnotis, hcnotis: hcnotis, reminderNotis: reminderNotis })
            } else {
              //for expecting child no notifications
            }
          }

        })
        // console.log(allchildNotis,"allchildNotis")
        dispatch(setAllNotificationData(allchildNotis))
        //generate notifications for all childs 
        //get all notifications for all childfrom slice, if [],then generate as per their DOB/createdate,
        //if already exist, then for each module get last period, and generate afterwards period's notifications
        //after generating notifications make it false
        let notiFlagObj = { key: 'generateNotifications', value: false };
        dispatch(setInfoModalOpened(notiFlagObj));
      }
      fetchData()
    }

  }, [generateNotificationsFlag]);
  useFocusEffect(
    React.useCallback(() => {
      // Your dismiss logic here 

      if (allnotis.length > 0) {
        const currentChildNotis = allnotis?.find((item) => item.childuuid == activeChild.uuid)
       // console.log(currentChildNotis, "allfilteredNotis")
        //notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis
        if (!isFutureDate(activeChild?.birthDate)) {
          if (currentChildNotis) {
            let currentChildallnoti: any = [];
            if (currentChildNotis.gwcdnotis) {
              currentChildNotis.gwcdnotis.forEach((item) => {
                currentChildallnoti.push(item)
              })
            }
            // // notiExist.gwcdnotis?.forEach((item)=>{
            // //   allgwnoti.push(item)
            // // })
            if (currentChildNotis.hcnotis) {
              currentChildNotis.hcnotis.forEach((item) => {
                currentChildallnoti.push(item)
              })
            }
            // // notiExist.vcnotis?.forEach((item)=>{
            // //   allvcnotis.push(item)
            // // })
            if (currentChildNotis.vcnotis) {
              currentChildNotis.vcnotis.forEach((item) => {
                currentChildallnoti.push(item)
              })
            }
            if (currentChildNotis.reminderNotis) {
              currentChildNotis.reminderNotis.forEach((item) => {
                currentChildallnoti.push(item)
              })
            }
            // console.log(allnotis)

            // let fromDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).plus({ days: item.days_from });
            // let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
            let childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
            //  (item.days_from < childAgeInDays && childCrateDate <= fromDate)
            let toDay = DateTime.fromJSDate(new Date()).toMillis();
             let combinedNotis1 = currentChildallnoti.sort(
              (a: any, b: any) => a.days_from - b.days_from,
            )
            console.log(combinedNotis1, "before combinedNotis1")
           
            let combinedNotis = currentChildallnoti.sort(
              (a: any, b: any) => a.days_from - b.days_from,
            ).filter((item) => {
              console.log(item.type,"..type")
                console.log(item.isRead,"..isRead")
                console.log(toDay,"..toDay")
                console.log(DateTime.fromJSDate(new Date(item.notificationDate)).toMillis(),"..notificationDate")
                console.log(childBirthDate,"..childBirthDate")
                console.log(DateTime.fromJSDate(new Date(item.notificationDate)).toMillis(),"..childBirthDate")
               return item.isRead == false && item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis()) 
              });
            console.log(combinedNotis, "combinedNotis")
            // const toRemove = combinedNotis.filter(item => item.title == "cdNoti2" && item.days_to >= childAgeInDays)
            // console.log(toRemove, "findcdNoti")
            // combinedNotis = combinedNotis.filter(function (el) {
            //   return !toRemove.includes(el);
            // });
            // delete item from combinedNotis item => { item.title == 'cdNoti2' && childAgeInDays >= item.days_to })
            setNotifications(currentChildallnoti.length > 0 ? combinedNotis : [])
          }
        } else {
          setNotifications([]);
        }
      }

    }, [activeChild.uuid, allnotis]),
  );

  useEffect(() => {
      const fetchData = async () => {
        const filterQuery = 'uuid == "'+activeChild.uuid+'"';
        const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
        dispatch(setFavouriteAdvices(childData[0].favoriteadvices));
        dispatch(setFavouriteGames(childData[0].favoritegames));
        // Alert.alert("in header noti");
       // console.log(childData[0].favoritegames,"in headernoti fav usefocuseffect",childData[0].favoriteadvices)
      }
      fetchData()
    }, [activeChild.uuid]);
  const navigation = useNavigation();
  return (
    <>
    {
    props.isVisibleIcon?
      <Pressable onPress={() => navigation.navigate('NotificationsScreen')} style={{ flexDirection: 'row' }}>
        <Icon name="ic_sb_notification" size={32} color={props.color} style={{ position: 'relative' }} />
        {notifications.length > 0 ?
          <BubbleContainer style={{ position: 'absolute', right: -12, top: -5, justifyContent: 'center', alignItems: 'center' }}>
            <BubbleView1>
              <Heading6w>{notifications.length}</Heading6w>
            </BubbleView1>
          </BubbleContainer>
          : null}
      </Pressable>:null
     }
    </>
  );
};
export default HeaderNotiIcon;

