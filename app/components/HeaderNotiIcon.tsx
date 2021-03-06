import { beforeDays, threeeMonthDays, twoMonthDays } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading6w } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { setFavouriteAdvices, setFavouriteGames } from '../redux/reducers/childSlice';
import { setAllLocalNotificationData, setAllLocalNotificationGenerateType, setAllNotificationData, setAllScheduledLocalNotificationData } from '../redux/reducers/notificationSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getAllChildren, isFutureDate, isFutureDateTime } from '../services/childCRUD';
import LocalNotifications from '../services/LocalNotifications';
import { createAllLocalNotificatoins, getChildNotification, getChildReminderNotifications, getNextChildNotification, isPeriodsMovedAhead } from '../services/notificationService';
import Icon from './shared/Icon';
import { BubbleContainer, BubbleView, BubbleView1 } from './shared/NavigationDrawer';
const headerHeight = 50;
const HeaderNotiIcon = (props: any) => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  const isVisibleIcon = props.isVisibleIcon;
  let allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  let localNotifications = useAppSelector((state: any) => state.notificationData.localNotifications);
  let scheduledlocalNotifications = useAppSelector((state: any) => state.notificationData.scheduledlocalNotifications);
  let localNotificationGenerateType = useAppSelector((state: any) => state.notificationData.localNotificationGenerateType);

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
  const allchildList = useAppSelector((state: any) =>	
    state.childData.childDataSet.allChild != ''	
      ? JSON.parse(state.childData.childDataSet.allChild)	
      : state.childData.childDataSet.allChild,	
  );
  let allGrowthPeriods = taxonomy?.growth_period;
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  );
  const allVaccineData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    // console.log("in useeffect 1");
    if (generateNotificationsFlag == true) {
      // console.log("in useeffect if 1");
      const fetchData = async () => {
        let childList = await getAllChildren(dispatch, childAge, 1);
        let allchildNotis: any[] = [];
      //  console.log(allnotis, "..allnotis in header noti2..",childList);
        childList?.map((child: any) => {
          const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
        //  console.log(child,"notiExist2---", notiExist);
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
              const checkIfNewCalcRequired = isPeriodsMovedAhead(childAge, notiExist, child, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData)
            //  console.log(checkIfNewCalcRequired, "checkIfNewCalcRequired222")
              if (checkIfNewCalcRequired) {
              //  console.log("NEWCALCREQUIRED")
               // console.log(notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis, "EXISTINGNOTI");
              //  console.log(child, "passed <<child>>")
               let reminderNotis = getChildReminderNotifications(child, notiExist.reminderNotis, vchcEnabledFlag);
                const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getNextChildNotification(notiExist.lastgwperiodid, notiExist.lastvcperiodid, notiExist.lasthcperiodid, child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods, growthEnabledFlag, developmentEnabledFlag, vchcEnabledFlag);

                // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "NEWNOTI2");

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
                // console.log(activeChild, "passed <<activeChild>>")
                let reminderNotis = getChildReminderNotifications(child, notiExist.reminderNotis, vchcEnabledFlag);
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
            //  console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, "childNotis")
            //  console.log(child, "passed <<child>>2")
              let reminderNotis = getChildReminderNotifications(child, [], vchcEnabledFlag);
             // console.log(reminderNotis, "childNotis")
             // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "childNotis")
              allchildNotis.push({ childuuid: child.uuid, lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis: gwcdnotis, vcnotis: vcnotis, hcnotis: hcnotis, reminderNotis: reminderNotis })
            } else {
              //for expecting child no notifications
            }
          }

        })
        // console.log(JSON.stringify(allchildNotis),"allchildNotis--")
        dispatch(setAllNotificationData(allchildNotis))
        //generate notifications for all childs 
        //get all notifications for all childfrom slice, if [],then generate as per their DOB/createdate,
        //if already exist, then for each module get last period, and generate afterwards period's notifications
        //after generating notifications make it false
        let notiFlagObj = { key: 'generateNotifications', value: false };
        dispatch(setInfoModalOpened(notiFlagObj));

        //createAllLocalNotificatoins(allchildList, childAge, developmentEnabledFlag, growthEnabledFlag, vchcEnabledFlag, t, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData, allVaccineData);
      }
      fetchData()
    }

  }, [generateNotificationsFlag]);
  
  
  useFocusEffect(
    React.useCallback(() => {
      // Your dismiss logic here 
      // console.log("in useeffect 2");
      // console.log("allnotis3----",JSON.stringify(allnotis));
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
             let combinedNotis1:any = currentChildallnoti.sort(
              (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
            )
            // console.log(combinedNotis1, "before combinedNotis1")
           
            let combinedNotis = currentChildallnoti.sort(
              (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
            ).filter((item) => {
              // console.log(item.type,"..type")
              //   console.log(item.isRead,"..isRead")
              //   console.log(toDay,"..toDay")
              //   console.log(DateTime.fromJSDate(new Date(item.notificationDate)).toMillis(),"..notificationDate")
              //   console.log(childBirthDate,"..childBirthDate")
              //   console.log(DateTime.fromJSDate(new Date(item.notificationDate)).toMillis(),"..childBirthDate")
               return item.isRead == false && item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis()) 
              });
            // console.log(combinedNotis, "combinedNotis")
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
      // console.log("--localNotificationGenerateType change4",localNotificationGenerateType);
      let currscheduledlocalNotifications = [...scheduledlocalNotifications];
      if(localNotificationGenerateType.generateFlag == true) {
        if(localNotificationGenerateType.generateType == 'onAppStart') {
           dispatch(setAllLocalNotificationData(localNotifications));
              let localnotiFlagObj = { generateFlag: false,generateType: 'add',childuuid: 'all'};
              dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
        }else {
          // console.log(developmentEnabledFlag,"flag1--",growthEnabledFlag, "flag2--" ,vchcEnabledFlag);
          // console.log(JSON.stringify(localNotifications),"--localNotifications change4");

          const childList = await getAllChildren(dispatch, childAge, 1);
          // console.log("childList in headernoti---",childList);
          if(childList && childList.length > 0) {
            if(localNotificationGenerateType.childuuid == 'all') {
              let allChildNotis: any[] = [];
              const resolvedPromises = childList.map(async (child:any)=> {
                const noti = await createAllLocalNotificatoins(child, childAge, developmentEnabledFlag, growthEnabledFlag, vchcEnabledFlag, t, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData, allVaccineData,localNotifications);
                // allChildNotis.push(noti);
                return noti;
              });
              // console.log("resolvedPromises--",resolvedPromises);
              const results = await Promise.all(resolvedPromises);
              // console.log("results4---",results);
              results.map((x:any)=>allChildNotis.push(x));
              // console.log("in headernoti allChildNotis---",allChildNotis);
              currscheduledlocalNotifications.map((m:any)=>{
                LocalNotifications.cancelReminderLocalNotification(m.notiid);
              })
              dispatch(setAllScheduledLocalNotificationData([]));
              dispatch(setAllLocalNotificationData(allChildNotis));
              let localnotiFlagObj = { generateFlag: false,generateType: 'add',childuuid: 'all'};
              dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
            }else {
              let allChildNotis: any[] = [];
              const currchildnoti = localNotifications.find((x:any) => x.key == localNotificationGenerateType.childuuid);
              // console.log("currchildnoti2---",currchildnoti);
              if(currchildnoti && currchildnoti != null && currchildnoti != undefined) {
                //delete existing notifications
                // create new ones and add in existing array
                currchildnoti.data.map((n:any)=>{
                  // console.log("n.notiid---",n.notiid);
                  if((currscheduledlocalNotifications.findIndex((m:any)=> m.notiid == n.notiid)) > -1)
                  {
                    LocalNotifications.cancelReminderLocalNotification(n.notiid);
                    currscheduledlocalNotifications = currscheduledlocalNotifications.filter((m:any)=> m.notiid != n.notiid);
                    console.log("removed noti---",currscheduledlocalNotifications);
                  }
                })
              }
              // else {
                // create new one and add in existing array
                const newchild = childList.find((z:any)=>z.uuid == localNotificationGenerateType.childuuid);
                console.log("newchild in edit--",newchild);
                if(newchild && newchild != {}) {
                  const newchildnoti = await createAllLocalNotificatoins(newchild, childAge, developmentEnabledFlag, growthEnabledFlag, vchcEnabledFlag, t, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData, allVaccineData,localNotifications);
                  // console.log("newchildnoti2---",newchildnoti);
                  localNotifications.map((y:any)=>{
                    if(y.key != localNotificationGenerateType.childuuid) {
                      allChildNotis.push(y);
                    }
                  })
                  allChildNotis.push(newchildnoti);
                  // console.log("in headernoti allChildNotis 2nd else---",allChildNotis);
                  // dispatch(setAllLocalNotificationData(allChildNotis));
                  // let localnotiFlagObj = { generateFlag: false,generateType: 'add',childuuid: 'all'};
                  // dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
                }else {
                  localNotifications.map((y:any)=>{
                    if(y.key != localNotificationGenerateType.childuuid) {
                      allChildNotis.push(y);
                    }
                  });
                  // dispatch(setAllLocalNotificationData(allChildNotis));
                  // let localnotiFlagObj = { generateFlag: false,generateType: 'add',childuuid: 'all'};
                  // dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
                }
                //cancelled all scheduled notifications as when new child added or edited the noti should come for all child.
                currscheduledlocalNotifications.map((m:any)=>{
                  LocalNotifications.cancelReminderLocalNotification(m.notiid);
                })
                dispatch(setAllScheduledLocalNotificationData([]));
                dispatch(setAllLocalNotificationData(allChildNotis));
                let localnotiFlagObj = { generateFlag: false,generateType: 'add',childuuid: 'all'};
                dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
              // }
            }
            // LocalNotifications.getAllScheduledLocalNotifications();
          }
          //make flag false at the end
        }
      }     
    }	
    fetchData()	
  }, [localNotificationGenerateType]);

  
  useEffect(() => {
    // const allNotiDates = findAllByKey(localNotifications,'notiDate');
    console.log("localNotifications val changed2",localNotifications);
    const fetchData2 = async () => {
      let allnotiobj: any[]=[];
      let currschedulednotiobj: any[]=[];
      localNotifications.map((x:any)=>{
        x.data.map((y:any) => {
          allnotiobj.push(y)
        })
      });
      console.log(allnotiobj)
      const sortedallnotiobj:any =  allnotiobj.sort((a:any, b:any) => new Date(a.notiDate) - new Date(b.notiDate),);

      // if(scheduledlocalNotifications && scheduledlocalNotifications.length > 0) {
        let filteredschedulednoti =  scheduledlocalNotifications.filter((x:any)=>isFutureDateTime(new Date(x.notiDate)) == true);
        sortedallnotiobj.map((x:any) => {
          if(filteredschedulednoti && filteredschedulednoti.length < 55) {
            if(isFutureDateTime(new Date(x.notiDate))) {
              if((scheduledlocalNotifications.findIndex((y:any)=>y.notiDate == x.notiDate)) == -1) {
                filteredschedulednoti.push({"notiid":x.notiid,"notiDate":x.notiDate});
                LocalNotifications.schduleNotification(new Date(x.notiDate),t('remindersAlertTitle'),x.notiMsg,x.notiid,x.type);
              }
            }
          }else {
            return;
          }
        })
        dispatch(setAllScheduledLocalNotificationData(filteredschedulednoti));
        // if(isFutureDateTime(new Date(notificationDate)))
      // }

      // currschedulednotiobj = sortedallnotiobj.slice(0, 63);
      // console.log("currschedulednotiobj--",currschedulednotiobj);
    }
    fetchData2()	
  },[localNotifications]);

  useEffect(() => {
    LocalNotifications.getAllScheduledLocalNotifications();
    LocalNotifications.getDeliveredNotifications();
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

