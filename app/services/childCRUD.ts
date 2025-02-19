import { EXPECTED_CHILD_ENTERED, ONBOARDING_SKIPPED } from '@assets/data/firebaseEvents';
import { appConfig } from '../instance';
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
import analytics from '@react-native-firebase/analytics';
import { DateTime } from 'luxon';
import { Alert, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { store, useAppSelector } from '../../App';
import { ToastAndroidLocal } from '../android/sharedAndroid.android';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { setActiveChildData, setAllChildData } from '../redux/reducers/childSlice';
import { setAllLocalNotificationGenerateType, setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getVariableData } from '../redux/reducers/variableSlice';
import LocalNotifications from './LocalNotifications';
import { logEvent } from './EventSyncService';

export const apiJsonDataGet = (parentGender: any, isDatetimeReq?: any, dateTimeObj?: any): any => {
  const postData = {
    childGender: 'all',
    childAge: "all", //childAge != "" && childAge != undefined && childAge != null ? childAge : "all"
    parentGender: parentGender != "" && parentGender != undefined && parentGender != null ? parentGender : "all",
    category: "all" //articleCategory != undefined && articleCategory != null ? articleCategory : "all"
  }
  return [
    {
      apiEndpoint: appConfig.apiConfig.articles,
      method: 'get',
      postdata: isDatetimeReq == true && dateTimeObj.articlesDatetime != '' ? { ...postData, datetime: dateTimeObj.articlesDatetime } : { ...postData },
      saveinDB: true,
    }
  ];
}
export const getNewChild = async (uuidGet: string, autoChild?: string, isExpected?: any, plannedTermDate?: any, isPremature?: string, birthDate?: any, name?: string, photoUri?: string, gender?: any, createdAt?: any): Promise<ChildEntity> => {
  return {
    uuid: uuidGet ? uuidGet : uuidv4(),
    childName: (name != "" && name != null && name != undefined) ? name.trim() : '',
    photoUri: photoUri ? photoUri : '',
    plannedTermDate: plannedTermDate ? plannedTermDate : null,
    birthDate: birthDate,
    isPremature: (isPremature != '' && isPremature != null && isPremature != undefined) ? isPremature : "false",
    gender: gender ? gender : 0,
    createdAt: createdAt ? createdAt : new Date(),
    updatedAt: new Date(),
    measurementPlace: "doctor",
    isMigrated: false,
    isExpected: (isExpected != '' && isExpected != null && isExpected != undefined) ? isExpected : "false",
    autoChild: (autoChild != '' && autoChild != null && autoChild != undefined) ? autoChild : "false"
  };

}
export const getCurrentChildAgeInDays = (birthDayMillis: number): any => {
  const childBirthDay = birthDayMillis;
  let timeNow: any = DateTime.local().toMillis();
  timeNow = DateTime.fromMillis(timeNow);
  let days = 0;
  if (childBirthDay) {
    const date = DateTime.fromMillis(childBirthDay);
    const convertInDays = timeNow.diff(date, "days").toObject().days;
    if (convertInDays !== undefined && convertInDays > 0) {
      days = Math.round(convertInDays);
    }
    else {
      days = 0;
    }
  }
  return days;
};
export const between = (x: any, min: any, max: any): any => {
  return x >= min && x <= max;
}
export const checkBetween = async (param: any, users: any, childAge: any): Promise<any> => {
  let ageData: any = [];
  await Promise.all(users.map(async (itemset: any) => {
    if (childAge.length > 0) {
      if (itemset > childAge[childAge.length - 1].days_to) {
        if (param == 0) {
          ageData.push(childAge[childAge.length - 1].id);
        }
        else {
          ageData.push(childAge[childAge.length - 1]);
        }
      }
      else {
        const result = await Promise.all(childAge.map((item: any) => {
          if (between(itemset, parseInt(item["days_from"]), parseInt(item["days_to"]))) {
            if (item.id != "446") {
              if (param == 0) {
                if (item.age_bracket.length > 0) {
                  item.age_bracket.map((ages: any) => {
                    ageData.push(ages);
                  })
                }
              }
              else {
                ageData.push(item);
              }
              ageData = [...new Set(ageData)];
            }
          }
          return ageData;
        }));
        return result;
      }
    }

  }));
  return ageData;
}
export const getTaxonomyData = async (param: any, birthDate: any, childAge: any, plannedTermDate: any, isPremature: any): Promise<any> => {
  if (birthDate != null && birthDate != undefined && birthDate != "") {
    const ageLimit = [];
    ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(birthDate)).toMillis()));
    const prematureageLimit = [];
    if (isPremature == "true" && plannedTermDate != null && plannedTermDate != undefined && plannedTermDate != "") {
      prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(plannedTermDate)).toMillis()));
    }
    const taxonomyData = await checkBetween(param, ageLimit, childAge);
    let prematureTaxonomyData: any = [];
    if (prematureageLimit && prematureageLimit.length > 0) {
      prematureTaxonomyData = await checkBetween(param, prematureageLimit, childAge);
    }
    if (taxonomyData?.length > 0) {
      if (prematureTaxonomyData && prematureTaxonomyData.length > 0) {
        taxonomyData[0].prematureTaxonomyId = prematureTaxonomyData[0]?.id;
      }
      else {
        taxonomyData[0].prematureTaxonomyId = null;
      }
      return taxonomyData[0];
    }
    else {
      return [];
    }
  }
}
export const setActiveChild = async (languageCode: any, uuid: any, dispatch: any, childAge: any, activeset?: any, boyChildGender?: any): Promise<any> => {

  const userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");
  let userRelationToParent = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userRelationToParent'");
  userRelationToParent = userRelationToParent.length > 0 ? userRelationToParent[0].value : ''
  if (uuid != "" && uuid != null && uuid != undefined) {
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", uuid);
    let child = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${uuid}'`);
    if (child?.length > 0) {
      child = child.map((item: any) => item)[0];
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        const ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        const prematureageLimit = [];
        if (child.isPremature == "true" && child.plannedTermDate != null && child.plannedTermDate != undefined && child.plannedTermDate != "") {
          prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
        }
        const taxonomyData = await checkBetween(1, ageLimit, childAge);
        let prematureTaxonomyData: any = [];
        if (prematureageLimit && prematureageLimit.length > 0) {
          prematureTaxonomyData = await checkBetween(1, prematureageLimit, childAge);
        }
        if (taxonomyData?.length > 0) {
          if (prematureTaxonomyData && prematureTaxonomyData.length > 0) {
            taxonomyData[0].prematureTaxonomyId = prematureTaxonomyData[0].id;
          }
          else {
            taxonomyData[0].prematureTaxonomyId = null;
          }
          child.taxonomyData = taxonomyData[0];
        }
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      dispatch(setActiveChildData(child));
      analytics().setUserProperties({
        ageid: String(child.taxonomyData.id),
        is_premature: child.isPremature,
        child_gender: child.gender == boyChildGender ? "Boy" : "Girl",
        relationship_with_child: userRelationToParent,
        parent_gender: child.parent_gender,
        auto_child: child.autoChild
      }) // relationship_with_child:monther/father


    }
    else {
      let child = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
      child = child.find((record: any, index: number) => index === 0);
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        const ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        const prematureageLimit = [];
        if (child.isPremature == "true" && child.plannedTermDate != null && child.plannedTermDate != undefined && child.plannedTermDate != "") {
          prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
        }
        const taxonomyData = await checkBetween(1, ageLimit, childAge);
        let prematureTaxonomyData: any = [];
        if (prematureageLimit && prematureageLimit.length > 0) {
          prematureTaxonomyData = await checkBetween(1, prematureageLimit, childAge);
        }
        if (taxonomyData?.length > 0) {
          if (prematureTaxonomyData && prematureTaxonomyData.length > 0) {
            taxonomyData[0].prematureTaxonomyId = prematureTaxonomyData[0].id;
          }
          else {
            taxonomyData[0].prematureTaxonomyId = null;
          }
          child.taxonomyData = taxonomyData[0];
        }
        //if notif.length>0 child.notifications.append
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      if (child) {
        const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
        dispatch(setActiveChildData(child));
        const autoChild = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='autoChild'");
        analytics().setUserProperties({
          ageid: String(child.taxonomyData.id),
          is_premature: child.isPremature,
          child_gender: child.gender == boyChildGender ? "Boy" : "Girl",
          relationship_with_child: userRelationToParent,
          parent_gender: child.parent_gender,
          auto_child: child.autoChild
        }) // relationship_with_child:monther/father

      }
    }
  }
  else {
    let child = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    child = child.find((record: any, index: number) => index === 0);
    if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", child.uuid);
      const ageLimit = [];
      ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
      const prematureageLimit = [];
      if (child.isPremature == "true" && child.plannedTermDate != null && child.plannedTermDate != undefined && child.plannedTermDate != "") {
        prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
      }
      const taxonomyData = await checkBetween(1, ageLimit, childAge);
      let prematureTaxonomyData: any = [];
      if (prematureageLimit && prematureageLimit.length > 0) {
        prematureTaxonomyData = await checkBetween(1, prematureageLimit, childAge);
      }
      if (taxonomyData?.length > 0) {
        if (prematureTaxonomyData && prematureTaxonomyData.length > 0) {
          taxonomyData[0].prematureTaxonomyId = prematureTaxonomyData[0].id;
        }
        else {
          taxonomyData[0].prematureTaxonomyId = null;
        }
        child.taxonomyData = taxonomyData[0];
      }
    }
    if (userParentalRole?.length > 0) {
      child.parent_gender = userParentalRole[0].value
    }
    if (child) {
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      const autoChild = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='autoChild'");
      dispatch(setActiveChildData(child));
      analytics().setUserProperties({
        ageid: String(child.taxonomyData.id),
        is_premature: child.isPremature,
        child_gender: child.gender == boyChildGender ? "Boy" : "Girl",
        relationship_with_child: userRelationToParent,
        parent_gender: child.parent_gender,
        auto_child: child.autoChild
      }) // relationship_with_child:monther/father
    }
  }
  const notiFlagObj = { key: 'generateNotifications', value: true };
  dispatch(setInfoModalOpened(notiFlagObj));
  if (activeset == true) {
    return "activeset";
  }
}

export const getAge = (childList: any, childAge: any): any => {
  if (childList.length > 0) {
    const promises = childList.map((item: any) => {
      if (item.birthDate != null && item.birthDate != undefined && item.birthDate != "") {
        return getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(item.birthDate)).toMillis());
      }
    })
    return Promise.all(promises).then(async (results: any) => {
      const data = await checkBetween(0, results, childAge);
      return data;
    })
  }
}

export const getDiffinDays = (day1millis: number, day2millis: number): any => {
  let days = 0;
  if (day1millis && day2millis) {
    const date1 = DateTime.fromMillis(day1millis);
    const date2 = DateTime.fromMillis(day2millis);
    let convertInDays = date2.diff(date1, "days").toObject().days;
    if (convertInDays == undefined || convertInDays == null) {
      convertInDays = -1;
    }
    days = Math.round(convertInDays);
  }
  return days;
};

export const getCurrentChildAgeInYears = (birthDayMillis: number): any => {
  const childBirthDay = birthDayMillis;
  let timeNow: any = DateTime.local().toMillis();
  timeNow = DateTime.fromMillis(timeNow);
  let years = 0;
  if (childBirthDay) {
    const date = DateTime.fromMillis(childBirthDay);
    const convertInDays = timeNow.diff(date, "years").toObject().years;
    if (convertInDays !== undefined && convertInDays > 0) {
      years = convertInDays;
    }
    else {
      years = 0;
    }
  }
  return years;
};
export const isFutureDate = (date: Date): any => {
  return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
};
export const isFutureDateTime = (date: any): any => {
  return new Date(date) > new Date()
};

export const getCurrentChildAgeInMonths = (t: any, birthDate: string, pluralShow: boolean): any => {
  const date1 = DateTime.fromISO(DateTime.local().toISODate());
  const date2 = DateTime.fromISO(String(birthDate).split('T')[0])
  const diff: any = date1.diff(date2, ["years", "months", "days"])
  let ageStr = "";
  if (diff.years < 0 && diff.months < 0 && (diff.days) < 0) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));

    }
    if (diff.months > 0) {
      if (ageStr != "" && ageStr != null && ageStr != undefined) {
        ageStr += ' ' + t('childInfoAndText') + ' ';
      }
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    if (diff.days >= 1 && diff.months == "" && diff.years == "") {
      if (pluralShow == true) {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25 ? ' ' + t('days5tag') : Math.round(diff.days) == 21 ? ' ' + t('daytag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
      else {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
    }
    if (ageStr == "") {
      ageStr = t('noday');
    }

  }
  return ageStr;

};

export const getNotificationDateInString = (t: any, birthDate: string, pluralShow: boolean): any => {
  const date1 = DateTime.fromISO(DateTime.local().toISODate());
  const date2 = DateTime.fromISO(String(birthDate).split('T')[0])
  const diff: any = date1.diff(date2, ["years", "months", "days"])
  let ageStr = "";
  if (diff.years < 0 && diff.months < 0 && (diff.days) < 0) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));

    }
    if (diff.months > 0) {
      if (ageStr != "" && ageStr != null && ageStr != undefined) {
        ageStr += ' ' + t('childInfoAndText') + ' ';
      }
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    if (diff.days >= 1 && diff.months == "" && diff.years == "") {
      if (pluralShow == true) {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25 ? ' ' + t('days5tag') : Math.round(diff.days) == 21 ? ' ' + t('daytag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
      else {
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
    }
    if (ageStr == "") {
      ageStr = t('todayTxt');
    } else {
      ageStr = t('notiTimeAgoTxt', { ageStr: ageStr })
    }

  }
  return ageStr

};
export const dateTimesAreSameDay = (dateTime1: any, dateTime2: any): any => {
  const month1 = dateTime1.getUTCMonth() + 1; //months from 1-12
  const day1 = dateTime1.getUTCDate();
  const year1 = dateTime1.getUTCFullYear();
  const month2 = dateTime2.getUTCMonth() + 1; //months from 1-12
  const day2 = dateTime2.getUTCDate();
  const year2 = dateTime2.getUTCFullYear();
  return month1 === month2 && year1 === year2 && day1 === day2;
}

export const addChild = async (languageCode: any, editScreen: boolean, param: number, data: any, dispatch: any, navigation: any, childAge: any, relationship?: any, userRelationToParent?: any, netInfo?: any, isDefaultChild?: boolean, isSibling?: boolean, parentName?: any): Promise<any> => {
  let oldBirthDate;
  console.log(editScreen, "..editScreen..", data[0].isExpected);
  if (editScreen) {
    let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${data[0].uuid}'`);
    console.log(oldChild, "..oldChild..");
    if (oldChild?.length > 0) {
      oldChild = oldChild.map((item: any) => item)[0];
      oldBirthDate = oldChild.birthDate;
    }
    await userRealmCommon.updateChild<ChildEntity>(ChildEntitySchema, data);
  }
  else {
    if (data[0].isExpected == true || data[0].isExpected == 'true') {
      const eventData = { 'name': EXPECTED_CHILD_ENTERED }
      logEvent(eventData, netInfo.isConnected)
    }
    try {
      await userRealmCommon.create<ChildEntity>(ChildEntitySchema, data);
    } catch (error) {
      Alert.alert('Error', 'Error in creating child' + JSON.stringify(error));
    }

  }
  //new child add from 
  if (param == 0) {
    console.log('sssssss')
    if (isDefaultChild) {
      const eventData = { 'name': ONBOARDING_SKIPPED }
      logEvent(eventData, netInfo.isConnected);
      navigation.navigate('ServiceProviderInfoSetup')
    } else {
      navigation.navigate('ChildSetupList');
    }
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", data[0].uuid);
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", "true");
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userName", parentName);
    await setActiveChild(languageCode, data[0].uuid, dispatch, childAge, false);
    const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: 'all' };
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
  }
  //child add from add sibling
  else if (param == 1) {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    if (currentActiveChildId?.length > 0) {
      currentActiveChildId = currentActiveChildId[0].value;
      if (currentActiveChildId == data[0].uuid) {
        setActiveChild(languageCode, data[0].uuid, dispatch, childAge, false);
      }
    }
    navigation.navigate('ChildSetupList');
  }
  //child add from edit/add expecting
  else {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    const ageLimit = [];
    const startDate = new Date(oldBirthDate)
    const someDate = new Date(data[0].birthDate)
    console.log(data, '=======', dateTimesAreSameDay(startDate, someDate))
    if (data[0].birthDate != null && data[0].birthDate != undefined && data[0].birthDate != "" && dateTimesAreSameDay(startDate, someDate) == false) {
      // regenerate notifications for new dob child
      const storedata = store.getState();
      let allchildNotis = storedata.notificationData.notifications;
      const findIfNotisExistForChild = (childuuid: any): any => {
        if (allchildNotis.length > 0) {
          return allchildNotis.find((item: any) => String(item.childuuid) == String(childuuid))
        }
      }
      if (findIfNotisExistForChild(data[0].uuid)) {
        //remove object of current child's notifications from array
        if (allchildNotis.length > 0) {
          allchildNotis = [...allchildNotis].filter(item => String(item.childuuid) != String(data[0].uuid));
          dispatch(setAllNotificationData(allchildNotis));
        }
      }

      await userRealmCommon.deleteNestedMeasures<ChildEntity>(
        ChildEntitySchema,
        DateTime.fromJSDate(new Date(data[0].birthDate)).toMillis(),
        'uuid ="' + data[0].uuid + '"',
      );
      let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${data[0].uuid}'`);
      if (oldChild?.length > 0) {
        oldChild = oldChild.map((item: any) => item)[0];
      }
      oldChild.reminders.map((x: any) => {
        let previousDTDefined;
        const onlyDateDefined = new Date(x.reminderDateDefined);
        previousDTDefined = onlyDateDefined.setHours(new Date(x.reminderTimeDefined).getHours());
        previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(x.reminderTimeDefined).getMinutes()));
        LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
      })

      await userRealmCommon.deleteNestedReminders<ChildEntity>(
        ChildEntitySchema,
        DateTime.fromJSDate(new Date()).toMillis(),
        'uuid ="' + data[0].uuid + '"',
      );
      ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(data[0].birthDate)).toMillis()));
      const taxonomyData = await checkBetween(0, ageLimit, childAge);
      let apiJsonData;
      console.log('---------', taxonomyData)
      //  apiJsonData = apiJsonDataGet(String(taxonomyData), "all");
      if (taxonomyData?.length > 0) {
        apiJsonData = apiJsonDataGet("all");
        if (currentActiveChildId?.length > 0) {
          currentActiveChildId = currentActiveChildId[0].value;
          if (currentActiveChildId == data[0].uuid) {
            setActiveChild(languageCode, data[0].uuid, dispatch, childAge, false);
          }
        }
        if (!isSibling) {
          navigation.navigate('LoadingScreen', {
            apiJsonData: apiJsonData,
            prevPage: 'AddEditChild'
          });
        } else {
          console.log('===>1')
          navigation.navigate('ChildProfileScreen');
        }
      }

    }
    else {
      if (currentActiveChildId?.length > 0) {
        currentActiveChildId = currentActiveChildId[0].value;
        if (currentActiveChildId == data[0].uuid) {
          setActiveChild(languageCode, data[0].uuid, dispatch, childAge, false);
        }
      }
      console.log('===>2')
      navigation.navigate('ChildProfileScreen');
    }
    const notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: data[0].uuid };
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
  }
}

export const updateActiveChild = (child: any, key: any, value: any, dispatch: any, userRelationToParent: any, boyChildGender: any): any => {
  child[key] = value;
  dispatch(setActiveChildData(child));
  analytics().setUserProperties({
    ageid: String(child.taxonomyData.id),
    is_premature: child.isPremature,
    child_gender: child.gender == boyChildGender ? "Boy" : "Girl",
    relationship_with_child: userRelationToParent,
    parent_gender: child.parent_gender,
    auto_child: child.autoChild
  }) // relationship_with_child:monther/father
}
export const getAllConfigData = async (dispatch: any): Promise<any> => {
  const allJsonDatanew = await dataRealmCommon.getData<ConfigSettingsEntity>(ConfigSettingsSchema);
  allJsonDatanew?.removeAllListeners?.();
  const configAllData: any = [];
  allJsonDatanew.map((value: ConfigSettingsEntity) => {
    configAllData.push(value);
  })
  dispatch(getVariableData(configAllData));
}
export const calc = async (value: any, childAge: any): Promise<any> => {
  value.taxonomyData = await getTaxonomyData(1, value.birthDate, childAge, value.plannedTermDate, value.isPremature);
  return value;
};

export const getAllChildrenDetails = async (dispatch: any, childAge: any, param: any): Promise<any> => {
  const allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
  allJsonDatanew?.removeAllListeners?.();
  let childAllData: any = [];
  if (allJsonDatanew?.length > 0) {
    childAllData = [];
    const p = allJsonDatanew.map(async (n: any) => {
      const value = await calc(n, childAge);
      const userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");
      if (childId?.length > 0) {
        childId = childId[0].value;
        if (childId === n.uuid) {
          const activeChild: any = value;
          if (userParentalRole?.length > 0) {
            activeChild.parent_gender = userParentalRole[0].value
          }
        }
      }
      childAllData.push(value);
      return value;
    });
    await Promise.all(p);
    childAllData = childAllData.sort((a: any, b: any) => {
      DateTime.fromISO(a.createdAt).diff(DateTime.fromISO(b.createdAt));
      const keyA = new Date(a.createdAt),
        keyB = new Date(b.createdAt);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    if (param == 1) {
      return childAllData;
    }
  }

}
export const getAllChildren = async (dispatch: any, childAge: any, param: any): Promise<any> => {
  try {
    const allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    allJsonDatanew?.removeAllListeners?.();
    let childAllData: any = [];
    if (allJsonDatanew?.length > 0) {
      childAllData = [];
      const p = allJsonDatanew.map(async (n: any) => {
        const value = await calc(n, childAge);
        const userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");
        if (childId?.length > 0) {
          childId = childId[0].value;
          if (childId === n.uuid) {
            const activeChild: any = value;
            if (userParentalRole?.length > 0) {
              activeChild.parent_gender = userParentalRole[0].value
            }
            const storedata = store.getState();
            const allDatatoStore = await getAllDataToStore(storedata.selectedCountry.languageCode, dispatch, "AddEditChild", activeChild);
            dispatch(setActiveChildData(activeChild));
          }
        }
        childAllData.push(value);
        return value;
      });
      await Promise.all(p);
      childAllData = childAllData.sort((a: any, b: any) => {
        DateTime.fromISO(a.createdAt).diff(DateTime.fromISO(b.createdAt));
        const keyA = new Date(a.createdAt),
          keyB = new Date(b.createdAt);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      dispatch(setAllChildData(childAllData));
      if (param == 1) {
        return childAllData;
      }
    }
  } catch (error) {
    console.log('getAllChildren catch', error)
  }
}


export const deleteChild = async (navigation: any, languageCode: any, _index: number, dispatch: any, schemaName: string, recordId: any, filterCondition: any, resolve: any, reject: any, childAge: any, t: any, childList: any): Promise<any> => {
  const currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
  let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterCondition);
  if (oldChild?.length > 0) {
    oldChild = oldChild.map((item: any) => item)[0];
  }
  oldChild.reminders.map((x: any) => {
    let previousDTDefined;
    const onlyDateDefined = new Date(x.reminderDateDefined);
    previousDTDefined = onlyDateDefined.setHours(new Date(x.reminderTimeDefined).getHours());
    previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(x.reminderTimeDefined).getMinutes()));
    LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
  })
  const createresult = await userRealmCommon.delete(schemaName, recordId, filterCondition);
  if (createresult == 'success') {
    if (Platform.OS === 'android') {
      ToastAndroidLocal.showWithGravityAndOffset(
        t('deleteSuccess'),
        ToastAndroidLocal.LONG,
        ToastAndroidLocal.BOTTOM,
        25,
        50
      );
    }
    else {
      Alert.alert(t('deleteSuccess'))
    }
    resolve("success");
  }
  else {
    if (Platform.OS === 'android') {
      ToastAndroidLocal.showWithGravityAndOffset(
        t('deleteError'),
        ToastAndroidLocal.LONG,
        ToastAndroidLocal.BOTTOM,
        25,
        50
      );
    }
    else {
      Alert.alert(t('deleteError'));
    }
    reject("error");
  }
}