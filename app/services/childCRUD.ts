import { EXPECTED_CHILD_ENTERED } from '@assets/data/firebaseEvents';
import { appConfig, boy_child_gender } from '@assets/translations/appOfflineData/apiConstants';
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
import analytics from '@react-native-firebase/analytics';
import { DateTime } from 'luxon';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { setActiveChildData, setAllChildData } from '../redux/reducers/childSlice';
import { setAllLocalNotificationGenerateType, setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getVariableData } from '../redux/reducers/variableSlice';
import LocalNotifications from './LocalNotifications';
export const apiJsonDataGet = (childAge: any, parentGender: any,isDatetimeReq?:any, dateTimeObj?:any) => {
  const postData = {
    childGender: 'all',
    childAge: childAge != "" && childAge != undefined && childAge != null ? childAge : "all",
    // childGender: '40',
    parentGender: parentGender != "" && parentGender != undefined && parentGender != null ? parentGender : "all",
    category: 'all',
  }
  return [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: isDatetimeReq == true && dateTimeObj.articlesDatetime != '' ? {...postData,datetime : dateTimeObj.articlesDatetime} : {...postData},
      // postdata: {
      //   childGender: 'all',
      //   childAge: childAge != "" && childAge != undefined && childAge != null ? childAge : "all",
      //   parentGender: parentGender != "" && parentGender != undefined && parentGender != null ? parentGender : "all",
      //   category: 'all',
      // },
      saveinDB: true,
    },
    // {
    //   apiEndpoint: appConfig.taxonomies,
    //   method: 'get',
    //   postdata: {},
    //   saveinDB: true,
    // },
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}

  ];
  // console.log(apiJsonDataGet, "..apiJsonDataGet..")
}
export const getNewChild = async (uuidGet: string, isExpected?: any, plannedTermDate?: any, isPremature?: string, birthDate?: any, name?: string, photoUri?: string, gender?: any, createdAt?: any): Promise<ChildEntity> => {
  console.log({
    uuid: uuidGet ? uuidGet : uuidv4(),
    childName: (name != "" && name != null && name != undefined) ? name.trim() : '',
    photoUri: photoUri ? photoUri : '',
    plannedTermDate: plannedTermDate ? plannedTermDate : null,
    birthDate: birthDate,
    isPremature: (isPremature != '' && isPremature != null && isPremature != undefined) ? isPremature : "false",
    gender: gender ? gender : 0,
    createdAt: createdAt != null ? createdAt : new Date(),
    updatedAt: new Date(),
    measurementPlace: "doctor",
    isMigrated: false,
    //relationship: relationship ? relationship : '',
    isExpected: (isExpected != '' && isExpected != null && isExpected != undefined) ? isExpected : "false"
  }, "chilObjGetNewChild")
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
    //relationship: relationship ? relationship : '',
    isExpected: (isExpected != '' && isExpected != null && isExpected != undefined) ? isExpected : "false"
  };

}
export const getTaxonomyData = async (param: any, birthDate: any, child_age: any,plannedTermDate:any,isPremature:any) => {
  // console.log(typeof isPremature,"..isPremature")
  if (birthDate != null && birthDate != undefined && birthDate != "") {
    let ageLimit = [];
    ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(birthDate)).toMillis()));
    // console.log(ageLimit, "..ageLimit..")
    let prematureageLimit = [];
    if(isPremature=="true" && plannedTermDate!=null && plannedTermDate!=undefined && plannedTermDate!=""){
    prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(plannedTermDate)).toMillis()));
    }
    // console.log(prematureageLimit, "..prematureageLimit..")
    const taxonomyData = await checkBetween(param, ageLimit, child_age);
    let prematureTaxonomyData:any=[];
    if(prematureageLimit && prematureageLimit.length>0){
       prematureTaxonomyData = await checkBetween(param, prematureageLimit, child_age);
    }
    // console.log(taxonomyData, "..taxonomyData..");
    // console.log(prematureTaxonomyData, "..newprematureTaxonomyData..");
    if (taxonomyData?.length > 0) {
      // child.taxonomyData = taxonomyData[0];
      if(prematureTaxonomyData && prematureTaxonomyData.length>0){
        taxonomyData[0].prematureTaxonomyId=prematureTaxonomyData[0].id;
      }
      else{
        taxonomyData[0].prematureTaxonomyId=null;
      }
      // console.log(taxonomyData[0],"..11taxonomyData[0]")
      return taxonomyData[0];
    }
    else {
      return [];
    }
  }
}
export const addPrefixForAndroidPaths = (path: string): string => {
  let finalPath = path;

  if (finalPath && Platform.OS === 'android') {
    let re = new RegExp('^file:');
    let match = finalPath.match(re);
    if (!match) {
      finalPath = 'file://' + finalPath;
    };
  };

  return finalPath;
}
// export const getCurrentChild = async () => {
//   let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
//   console.log(childId,"..childId..");
//   if (childId) {
//     let child = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${childId}'`);
//     console.log(child,"..child..");
//     return child.map((item: any) => item)[0];
//  } else {
//       let child =  await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
//       child=child.find((record: any, index: number) => index === 0);
//       console.log(child,"..child..");
//       if (child) {
//           let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", child.uuid);
//           return child;
//       }
//   };
// };
export const setActiveChild = async (languageCode: any, uuid: any, dispatch: any, child_age: any,activeset?:any) => {

  //console.log(child_age,"..child_age..");
  let userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");
  let userRelationToParent = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userRelationToParent'");
  userRelationToParent=userRelationToParent.length>0?userRelationToParent[0].value:''
  if (uuid != "" && uuid != null && uuid != undefined) {
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", uuid);
    let child = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${uuid}'`);
    if (child?.length > 0) {
      child = child.map(item => item)[0];
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        let ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        let prematureageLimit = [];
        if(child.isPremature=="true" && child.plannedTermDate!=null && child.plannedTermDate!=undefined && child.plannedTermDate!=""){
        prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
        }
        // console.log(prematureageLimit, "..prematureageLimit..")
        // console.log(ageLimit,"..ageLimit..")  
        const taxonomyData = await checkBetween(1, ageLimit, child_age);
        let prematureTaxonomyData:any=[];
        if(prematureageLimit && prematureageLimit.length>0){
           prematureTaxonomyData = await checkBetween(1, prematureageLimit, child_age);
        }
        // console.log(taxonomyData, "..taxonomyData..");
        // console.log(prematureTaxonomyData, "..newprematureTaxonomyData..");
        // console.log(taxonomyData,"..taxonomyData..")
        if (taxonomyData?.length > 0) {
          if(prematureTaxonomyData && prematureTaxonomyData.length>0){
            taxonomyData[0].prematureTaxonomyId=prematureTaxonomyData[0].id;
          }
          else{
            taxonomyData[0].prematureTaxonomyId=null;
          }
          // console.log(taxonomyData[0],"..21taxonomyData[0]")
          child.taxonomyData = taxonomyData[0];
        }
        else{}
        //if notif.length>0 child.notifications.append
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      // console.log(child);
      // childId.parent_gender=
      // childId.taxonomydata
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      // console.log(allDatatoStore, "..allDatatoStore..")
      dispatch(setActiveChildData(child));
      analytics().setUserProperties({ ageid: String(child.taxonomyData.id), 
        is_premature: child.isPremature, child_gender: child.gender == boy_child_gender ? "Boy" : "Girl", 
        relationship_with_child:userRelationToParent,
      parent_gender: child.parent_gender
    }) // relationship_with_child:monther/father
      

    }
    else {
      let child = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
      child = child.find((record: any, index: number) => index === 0);
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        let ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        // console.log(ageLimit,"..ageLimit..")  
        let prematureageLimit = [];
        if(child.isPremature=="true" && child.plannedTermDate!=null && child.plannedTermDate!=undefined && child.plannedTermDate!=""){
        prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
        }
        const taxonomyData = await checkBetween(1, ageLimit, child_age);
        // console.log(taxonomyData,"..taxonomyData..")
        let prematureTaxonomyData:any=[];
        if(prematureageLimit && prematureageLimit.length>0){
           prematureTaxonomyData = await checkBetween(1, prematureageLimit, child_age);
        }
        // console.log(taxonomyData, "..taxonomyData..");
        // console.log(prematureTaxonomyData, "..newprematureTaxonomyData..");
        if (taxonomyData?.length > 0) {
          if(prematureTaxonomyData && prematureTaxonomyData.length>0){
            taxonomyData[0].prematureTaxonomyId=prematureTaxonomyData[0].id;
          }
          else{
            taxonomyData[0].prematureTaxonomyId=null;
          }
          // console.log(taxonomyData[0],"..31taxonomyData[0]")
          child.taxonomyData = taxonomyData[0];
        }
        //if notif.length>0 child.notifications.append
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      if (child) {
        const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
        // console.log(allDatatoStore, "..allDatatoStore..")
        dispatch(setActiveChildData(child));
        analytics().setUserProperties({ ageid: String(child.taxonomyData.id), 
          is_premature: child.isPremature, 
          child_gender: child.gender == boy_child_gender ? "Boy" : "Girl", 
          relationship_with_child:userRelationToParent,
          parent_gender: child.parent_gender
        }) // relationship_with_child:monther/father

      }
    }
  }
  else {
    let child = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    child = child.find((record: any, index: number) => index === 0);
    if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
      let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", child.uuid);
      let ageLimit = [];
      ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
      //  console.log(ageLimit,"..ageLimit..")  
       let prematureageLimit = [];
       if(child.isPremature=="true" && child.plannedTermDate!=null && child.plannedTermDate!=undefined && child.plannedTermDate!=""){
       prematureageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.plannedTermDate)).toMillis()));
       }
      const taxonomyData = await checkBetween(1, ageLimit, child_age);
      let prematureTaxonomyData:any=[];
      if(prematureageLimit && prematureageLimit.length>0){
         prematureTaxonomyData = await checkBetween(1, prematureageLimit, child_age);
      }
      //  console.log(taxonomyData,"..taxonomyData..")
      if (taxonomyData?.length > 0) {
        if(prematureTaxonomyData && prematureTaxonomyData.length>0){
          taxonomyData[0].prematureTaxonomyId=prematureTaxonomyData[0].id;
        }
        else{
          taxonomyData[0].prematureTaxonomyId=null;
        }
        // console.log(taxonomyData[0],"..41taxonomyData[0]")
        child.taxonomyData = taxonomyData[0];
      }
      //if notif.length>0 child.notifications.append
    }
    if (userParentalRole?.length > 0) {
      child.parent_gender = userParentalRole[0].value
    }
    if (child) {
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      // console.log(allDatatoStore, "..allDatatoStore..")
      dispatch(setActiveChildData(child));
      analytics().setUserProperties({ ageid: String(child.taxonomyData.id),
         is_premature: child.isPremature, child_gender: child.gender == boy_child_gender ? "Boy" : "Girl", 
         relationship_with_child:userRelationToParent,
         parent_gender: child.parent_gender
        }) // relationship_with_child:monther/father
    }
  }
  let notiFlagObj = { key: 'generateNotifications', value: true };
  dispatch(setInfoModalOpened(notiFlagObj));
  console.log("check local notification log1---");
  if(activeset==true){
  return "activeset";
  }
}


export const between = (x: any, min: any, max: any) => {
  return x >= min && x <= max;
}
const notEmpty = (value: any) => {
  return value !== null && value !== undefined;
}
export const getAge = (childList: any, child_age: any) => {
  let ageData: any = [];
  if (childList.length > 0) {
    var promises = childList.map((item: any) => {
      if (item.birthDate != null && item.birthDate != undefined && item.birthDate != "") {
        return getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(item.birthDate)).toMillis());
      }
    })
    return Promise.all(promises).then(async (results: any) => {
      const data = await checkBetween(0, results, child_age);
      return data;
    })
  }
}
export const checkBetween = async (param: any, users: any, child_age: any) => {
  let ageData: any = [];
  await Promise.all(users.map(async (itemset: any) => {
    if(child_age.length>0){
    if(itemset>child_age[child_age.length-1].days_to){
      // console.log(child_age[child_age.length-1],"..last taxonomy dataset..")
      // ageData.push(child_age[child_age.length-1]);
      if (param == 0) {
        ageData.push(child_age[child_age.length-1].id);
      }
      else {
        ageData.push(child_age[child_age.length-1]);
      }
      // console.log(ageData,"..last taxonomy..")
    }
    else{
    let result = await Promise.all(child_age.map((item: any) => {
      if (between(itemset, parseInt(item["days_from"]), parseInt(item["days_to"]))) {
        if (item.id != "446") {
          // console.log(item.age_bracket, "..item.age_bracket..")
          if (param == 0) {
            if (item.age_bracket.length > 0) {
              item.age_bracket.map((ages: any) => {
                ageData.push(ages);
              })
            }
            //ageData.push(parseInt(item.id));
          }
          else {
            ageData.push(item);
          }
          // console.log(ageData, "..ageData..")
          ageData = [...new Set(ageData)];
          // console.log(ageData, "..unique..")
        }
      }
      else{
        // console.log(ageData,"..noageData..")
        // ageData.push(item);
      }
      // console.log(ageData,"..ageData..")
      return ageData;
    }));
    // console.log(result,"..result..")
    return result;
    }
    }
   
  }));
  // console.log(ageData,"..1123ageData..")
  return ageData;
}
export const getDiffinDays = (day1millis: number, day2millis: number) => {
  let days: number = 0;
  if (day1millis && day2millis) {
    let date1 = DateTime.fromMillis(day1millis);
    let date2 = DateTime.fromMillis(day2millis);
    // console.log(date1, date2, "..12convertInDays");
    let convertInDays = date2.diff(date1, "days").toObject().days;
    // console.log(convertInDays, "..convertInDays");
    if (convertInDays == undefined || convertInDays == null) {
      convertInDays = -1;
    }
    days = Math.round(convertInDays);
    // if (convertInDays !== undefined && convertInDays > 0) {

    // }
    // else {
    //   days = 0;
    // }
  };
  // console.log(days, "..days..");
  return days;
};
export const getCurrentChildAgeInDays = (birthDayMillis: number) => {
  let childBirthDay = birthDayMillis;
  let timeNow: any = DateTime.local().toMillis();
  timeNow = DateTime.fromMillis(timeNow);
  let days: number = 0;
  if (childBirthDay) {
    let date = DateTime.fromMillis(childBirthDay);
    let convertInDays = timeNow.diff(date, "days").toObject().days;
    if (convertInDays !== undefined && convertInDays > 0) {
      days = Math.round(convertInDays);
    }
    else {
      days = 0;
    }
  };
  // console.log(days, "..days..");
  return days;
};
export const getCurrentChildAgeInYears = (birthDayMillis: number) => {
  let childBirthDay = birthDayMillis;
  let timeNow: any = DateTime.local().toMillis();
  timeNow = DateTime.fromMillis(timeNow);
  let years: number = 0;
  if (childBirthDay) {
    let date = DateTime.fromMillis(childBirthDay);
    let convertInDays = timeNow.diff(date, "years").toObject().years;
    // console.log(convertInDays,"..334convertInDays...")
    if (convertInDays !== undefined && convertInDays > 0) {
      years = convertInDays;
    }
    else {
      years = 0;
    }
  };
  // console.log(years, "..years..");
  return years;
};
export const isFutureDate = (date: Date) => {
  return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
};
export const isFutureDateTime = (date: DateTime) => {
  return new Date(date) > new Date()
};

export const getCurrentChildAgeInMonths = (t: any, birthDate: string,pluralShow:boolean) => {
  //Alert.alert('birthDate',String(birthDate));
  //birthDate=Platform.OS=='ios'?new Date(birthDate).toISOString():birthDate;
  // var d = new Date(birthDate).toString();
  // console.log(d,"..d..")
  // birthDate=d;
  // let months: any = 0;
  // console.log(new Date(birthDate),"..new Date(birthDate)..")
  // const inFuture=isFutureDate(new Date(birthDate));
  // console.log(inFuture,"..inFuture..")
  // var d = new Date();
  // var n = d.toString();
  // if (!inFuture) {
  // const yearDiffData=yearDiff(d,new Date(birthDate));
  // console.log(yearDiffData,"..yearDiffData..")
  //   const date1 = DateTime.fromISO(n);
  // const date2 = DateTime.fromISO(birthDate);
  // let date = DateTime.fromMillis(DateTime.(childBirthDay).toMillis());
  // const diff = birthDate.diffNow(["years", "months", "days", "hours"])
  // const date1 = DateTime.fromMillis(DateTime.(childBirthDay).toMillis());
  // const date2 =DateTime.fromMillis(DateTime.(childBirthDay).toMillis());

  // const diff = date1.diff(date2, ["years", "months", "days", "hours"])

  // console.log(diff.toObject())
  //   const date1 = DateTime.fromISO(n)
  //   const date2 = DateTime.fromISO(birthDate)
  //   const diff = date2.diff(date1, ["years", "months", "days", "hours"]);
  //   console.log(diff.toObject())
  // const convertInMonths=diff.toObject().months;
  // console.log(convertInMonths,"..convertInMonths..")
  // if (convertInMonths !== undefined) months = convertInMonths;
  //   return diff.months;
  // }
  // else{
  //   return 0 ;
  // }
  // console.log(birthDate,"..birthDate..")
  //const date1 = DateTime.fromISO(DateTime.local().toISODate());
  const date1 = DateTime.local();
  // console.log(date1,"..date1");
  // const date2 = DateTime.fromISO(birthDate);
  let dateData=new Date(birthDate).toISOString().split('T')[0];
  // console.log(dateData,"..dateData")
  const date2 = DateTime.fromISO(dateData);
  // console.log(date2);
  const diff: any = date1.diff(date2, ["years", "months", "days"]);
  // console.log(diff.toObject(),"..diffobject");
  var ageStr = "";
  // console.log(diff.years,diff.months,diff.days);
  if (diff.years < 0 && diff.months < 0 && (diff.days) < 0) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      //ageStr = diff.years + (diff.years > 1 ? t('yearstag') : t('yeartag'));
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));
     
    }
    if (diff.months > 0) {
      if(ageStr!="" && ageStr!=null && ageStr!=undefined){
      ageStr += ' '+t('childInfoAndText')+' ';
      }
      //ageStr += diff.months + (diff.months > 1 ? t('monthstag') : t('monthtag'));
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    //  console.log(Math.round(diff.days),"..diffff...")
    // if(diff.days>0){ 
    if (diff.days >=1 && diff.months == "" && diff.years == "") {
      if(pluralShow==true){
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25? ' ' + t('days5tag') : Math.round(diff.days) == 21?' ' +  t('daytag'):' ' + t('daystag')) : ' ' + t('daytag'));
      }
      else{
        ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
      }
    }
    // console.log(ageStr,"..ageStr")
    if (ageStr == "") {
      ageStr = t('noday');
    }

  }
  // console.log(ageStr,"..ageStr")
  return ageStr;

};

export const getNotificationDateInString = (t: any, birthDate: string,pluralShow:boolean) => {
  //Alert.alert('birthDate',String(birthDate));
  const date1 = DateTime.local();
  //  console.log(date1,"..date1");
  //birthDate=Platform.OS=='ios'?new Date(birthDate).toString():birthDate;
  // const date2 = DateTime.fromISO(birthDate);
  let dateData=new Date(birthDate).toISOString().split('T')[0];
  // console.log(dateData,"..dateData")
  const date2 = DateTime.fromISO(dateData);
  // console.log(date2);
  const diff: any = date1.diff(date2, ["years", "months", "days"]);
  // console.log(diff.toObject(),"..diffobject");
  var ageStr = "";
  // console.log(diff.years,diff.months,diff.days);
  if (diff.years < 0 && diff.months < 0 && (diff.days) < 0) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      //ageStr = diff.years + (diff.years > 1 ? t('yearstag') : t('yeartag'));
      ageStr += diff.years + (diff.years > 1 ? (diff.years >= 5 ? ' ' + t('years5tag') : ' ' + t('yearstag')) : ' ' + t('yeartag'));
     
    }
    if (diff.months > 0) {
      if(ageStr!="" && ageStr!=null && ageStr!=undefined){
      ageStr += ' '+t('childInfoAndText')+' ';
      }
      //ageStr += diff.months + (diff.months > 1 ? t('monthstag') : t('monthtag'));
      ageStr += diff.months + (diff.months > 1 ? (diff.months >= 5 ? ' ' + t('months5tag') : ' ' + t('monthstag')) : ' ' + t('monthtag'));

    }
    //  console.log(Math.round(diff.days),"..diffff...")
    // if(diff.days>0){ 
    if (diff.days >=1 && diff.months == "" && diff.years == "") {
    if(pluralShow==true){
      ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? ((Math.round(diff.days) >= 5 && Math.round(diff.days) <= 20) || Math.round(diff.days) >= 25? ' ' + t('days5tag') : Math.round(diff.days) == 21?' ' +  t('daytag'):' ' + t('daystag')) : ' ' + t('daytag'));
    }
    else{
      ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? (Math.round(diff.days) >= 5 ? ' ' + t('days5tag') : ' ' + t('daystag')) : ' ' + t('daytag'));
    }
  
      // ageStr += Math.round(diff.days) + (Math.round(diff.days)>1 ? (Math.round(diff.days)>=5 ? " days5 ": " day24 "): " day");
    }
    // console.log(ageStr,"..ageStr")
    if (ageStr == "") {
      ageStr = t('todayTxt');
    }else{
      // ageStr = ageStr+ " "+t('notiTimeAgoTxt')
      ageStr = t('notiTimeAgoTxt',{ageStr:ageStr})
    }

  }
  // console.log(ageStr,"..ageStr")
  return ageStr

};
export const addChild = async (languageCode: any, editScreen: boolean, param: number, data: any, dispatch: any, navigation: any, child_age: any, relationship?: any,userRelationToParent?:any) => {
  let oldBirthDate;
  console.log(editScreen, "..editScreen..",param);
  // console.log(param, "..param..")
  if (editScreen) {
    // console.log("..update child..", data);
    let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${data[0].uuid}'`);
    if (oldChild?.length > 0) {
      oldChild = oldChild.map(item => item)[0];
      oldBirthDate = oldChild.birthDate;
    }
    let createresult = await userRealmCommon.updateChild<ChildEntity>(ChildEntitySchema, data);
    // console.log("..update child..", createresult);
    // let createresult1 = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    // console.log(createresult1, "...createresult1getData..")
    // dispatch(setActiveChildData(data[0]));
  }
  else {
    // console.log("..add child..", data);
    if (data[0].isExpected == true || data[0].isExpected == 'true') {
      analytics().logEvent(EXPECTED_CHILD_ENTERED)
    }
    let createresult = await userRealmCommon.create<ChildEntity>(ChildEntitySchema, data);
    // dispatch(setActiveChildData(data[0]));
  }
  //new child add from 
  if (param == 0) {
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'ChildSetupList' }],
    // });
    navigation.navigate('ChildSetupList');
    // console.log(data[0].relationship,"..data[0].relationship..");
    let relationshipnew = relationship;
    if (typeof relationship === 'string' || relationship instanceof String) {
      relationshipnew = relationship
    }
    else {
      relationshipnew = String(relationship);
    }
    // console.log(data[0].uuid, "..data[0].uuid..");
    // console.log(userRelationToParent,"..userRelationToParent")
    let userParentalRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    let userRelationToParentRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", data[0].uuid);
    let userEnteredChildData = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", "true");
    setActiveChild(languageCode, data[0].uuid, dispatch, child_age,false);
    let localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: 'all'};
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
  }
  //child add from add sibling
  else if (param == 1) {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    if (currentActiveChildId?.length > 0) {
      currentActiveChildId = currentActiveChildId[0].value;
      if (currentActiveChildId == data[0].uuid) {
        setActiveChild(languageCode, data[0].uuid, dispatch, child_age,false);
      }
    }
    navigation.navigate('ChildSetupList');
    // setActiveChild(data[0].uuid,dispatch,child_age);
  }
  //child add from edit/add expecting
  else {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    let ageLimit = [];
    let startDate = new Date(oldBirthDate)
    let someDate = new Date(data[0].birthDate)
    // console.log(dateTimesAreSameDay(startDate, someDate), ".11.data.birthDate..")
    
    
    // console.log(dateTimesAreSameDay(startDate, someDate), ".11.data.birthDate..");

    if (data[0].birthDate != null && data[0].birthDate != undefined && data[0].birthDate != "" && dateTimesAreSameDay(startDate, someDate) == false) {
      // regenerate notifications for new dob child
      // let allchildNotis = useAppSelector((state: any) => state.notificationData.notifications);
      const storedata = store.getState();
      let allchildNotis = storedata.notificationData.notifications;
      // console.log(allchildNotis, ".allchildNotis");

      const findIfNotisExistForChild = (childuuid: any) => {
        if (allchildNotis.length > 0) {
          return allchildNotis.find((item) => String(item.childuuid) == String(childuuid))
        }
      }
      if (findIfNotisExistForChild(data[0].uuid)) {
        //remove object of current child's notifications from array
        if (allchildNotis.length > 0) {
          // const deleteindex = allchildNotis.findIndex(item => String(item.childuuid) == String(data[0].uuid))
          // console.log(deleteindex, "deleteindex")
          allchildNotis = [...allchildNotis].filter(item => String(item.childuuid) != String(data[0].uuid));
          // console.log(allchildNotis, "new allchildNotis");
          dispatch(setAllNotificationData(allchildNotis));
        }
      }

      // console.log('inifaddchild')
      let deleteresult = await userRealmCommon.deleteNestedMeasures<ChildEntity>(
        ChildEntitySchema,
        DateTime.fromJSDate(new Date(data[0].birthDate)).toMillis(),
        'uuid ="' + data[0].uuid + '"',
      );
      // console.log(deleteresult, "..deleteresult..")
      let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${data[0].uuid}'`);
      if (oldChild?.length > 0) {
        oldChild = oldChild.map(item => item)[0];
      }
      // console.log(JSON.stringify(oldChild),"oldChild---",oldChild);
      oldChild.reminders.map((x:any) => {
        let previousDTDefined;
        const onlyDateDefined = new Date(x.reminderDateDefined);
        previousDTDefined = onlyDateDefined.setHours(new Date(x.reminderTimeDefined).getHours());
        previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(x.reminderTimeDefined).getMinutes()));
        // console.log("editing dtdefined---",previousDTDefined);
        LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
      })

      let deleteresult1 = await userRealmCommon.deleteNestedReminders<ChildEntity>(
        ChildEntitySchema,
        DateTime.fromJSDate(new Date()).toMillis(),
        'uuid ="' + data[0].uuid + '"',
      );
      // LocalNotifications.cancelAllReminderLocalNotification();
      // console.log(deleteresult, "..deleteresult..")
      ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(data[0].birthDate)).toMillis()));
      // console.log(ageLimit, "..ageLimit..")
       const taxonomyData = await checkBetween(0, ageLimit, child_age);
      //console.log(taxonomyData, "..taxonomydata..");
      let apiJsonData;
      if (taxonomyData?.length > 0) {
        apiJsonData = apiJsonDataGet(String(taxonomyData), "all");
        // console.log(apiJsonData, "..apiJsonData..");
        if (currentActiveChildId?.length > 0) {
          currentActiveChildId = currentActiveChildId[0].value;
          if (currentActiveChildId == data[0].uuid) {
            setActiveChild(languageCode, data[0].uuid, dispatch, child_age,false);
          }
        }
        navigation.navigate('LoadingScreen', {
          apiJsonData: apiJsonData,
          prevPage: 'AddEditChild'
        });
      }

    }
    else {
      // console.log('inelseaddchild')
      if (currentActiveChildId?.length > 0) {
        currentActiveChildId = currentActiveChildId[0].value;
        if (currentActiveChildId == data[0].uuid) {
          setActiveChild(languageCode, data[0].uuid, dispatch, child_age,false);
        }
      }
      navigation.navigate('ChildProfileScreen');
    }
    let notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    // console.log("check local notification log2---",JSON.stringify(data));
    let localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: data[0].uuid};
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));

    //navigation.navigate('ChildProfileScreen');
  }

  // //console.log(new Date()," result is ",createresult);
  // if (editScreen) {
  //   return 'updated'
  // }
}
export const dateTimesAreSameDay = (dateTime1: any, dateTime2: any) => {
  // console.log(dateTime1, "/", dateTime2)
  let month1 = dateTime1.getUTCMonth() + 1; //months from 1-12
  let day1 = dateTime1.getUTCDate();
  let year1 = dateTime1.getUTCFullYear();
  let month2 = dateTime2.getUTCMonth() + 1; //months from 1-12
  let day2 = dateTime2.getUTCDate();
  let year2 = dateTime2.getUTCFullYear();
  // console.log(year1, "/", year2, month1, "/", month2, day1, "/", day2)
  return month1 === month2 && year1 === year2 && day1 === day2;
}
export const updateActiveChild = (child: any, key: any, value: any, dispatch: any,userRelationToParent:any) => {
  child[key] = value;
  // console.log(child, "..child..");
  dispatch(setActiveChildData(child));
  analytics().setUserProperties({ ageid: String(child.taxonomyData.id), 
    is_premature: child.isPremature, child_gender: child.gender == boy_child_gender ? "Boy" : "Girl",
    relationship_with_child:userRelationToParent,
    parent_gender: child.parent_gender
     }) // relationship_with_child:monther/father
}
export const getAllConfigData = async (dispatch: any) => {
  let databaselistener: any;
  let allJsonDatanew = await dataRealmCommon.getData<ConfigSettingsEntity>(ConfigSettingsSchema);
  allJsonDatanew.removeAllListeners();
  let configAllData: any = [];
  //console.log("db length--", allJsonDatanew?.length);
  // if (allJsonDatanew?.length > 0) {
  //   databaselistener = allJsonDatanew.addListener((changes: any, name: any) => {
  //     configAllData = [];
  allJsonDatanew.map((value: ConfigSettingsEntity) => {
    configAllData.push(value);
  })
  dispatch(getVariableData(configAllData));
  //   });
  // }
  // else {
  //console.log("..else loop");
  //   dispatch(getVariableData(configAllData));
  // }
}
// export const getAllChildren = async (dispatch: any) => {
//   let databaselistener: any;
//   let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
//   allJsonDatanew.removeAllListeners();
//   let childAllData: any = [];
//   let isChanged: boolean = false;
//   // dispatch(setAllChildData(childAllData));
//   //console.log("db length--", allJsonDatanew?.length);
//   if (allJsonDatanew?.length > 0) {
//       childAllData = [];
//       allJsonDatanew.map((value: ChildEntity) => {
//         console.log(value, "..config value..");
//         childAllData.push(value);
//       })
//       console.log("childAllData--",childAllData);
//       console.log(childAllData, "before")
//       childAllData = childAllData.sort((a: any, b: any) => {
//         DateTime.fromISO(a.createdAt).diff(DateTime.fromISO(b.createdAt));
//         const keyA = new Date(a.createdAt),
//           keyB = new Date(b.createdAt);

//         if (keyA < keyB) return -1;
//         if (keyA > keyB) return 1;
//         return 0;
//       });
//       console.log(childAllData, "after")
//       dispatch(setAllChildData(childAllData));
//     // databaselistener = allJsonDatanew.addListener(async (changes: any, name: any) => {
//     //   // console.log("changes--",changes);
//     //   // console.log("name--",name);


//     //   //if(changes.insertion.length || changes.deletion.length || changes.modifications.length){
//     //   dispatch(setAllChildData(childAllData));
//     //   //}
//     // });
//   }
//   // else {
//   //   //console.log("..else loop");
//   //   // let enteredChildData:any=[{
//   //   //     key:"userEnteredChildData",
//   //   //     value:"false",
//   //   //     createdAt: new Date(),
//   //   //     updatedAt: new Date(),
//   //   //   }]
//   //   //  let updateresult = await dataRealmCommon.update<ConfigSettingsEntity>(ConfigSettingsSchema, enteredChildData);
//   //   //   let createRelation = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, [{
//   //   //     key:'userParentalRole',
//   //   //     value:'',
//   //   //     createdAt:new Date(),
//   //   //     updatedAt:new Date()
//   //   //  }]);
//   //   dispatch(setAllChildData(childAllData));
//   // }

// }
export const calc = async (value: any, child_age: any) => {
  // console.log(value, "..  before taxonomy..");
  value.taxonomyData = await getTaxonomyData(1, value.birthDate, child_age,value.plannedTermDate,value.isPremature);
  // console.log(value, "after taxonomy");
  return value;
};
// async function requestWriteStoragePermission() {
//   try {
//       const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//               'title': 'Write your android storage Permission',
//               'message': 'Write your android storage to save your data'
//           }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("You can write storage")
//       } else {
//           console.log("Write Storage permission denied")
//       }
//   } catch (err) {
//       console.warn(err)
//   }
// }


/**
* * require read storage permission
*/
// export const requestWriteStoragePermission=async ()=>{
//   try {
//     const granted:any = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//             'title': 'Write your android storage Permission',
//             'message': 'Write your android storage to save your data'
//         }
//     )
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can write storage")
//     } else {
//         console.log("Write Storage permission denied")
//     }
// } catch (err) {
//     console.warn(err)
// }
// }

// export const requestReadStoragePermission=async ()=>{
//   try {
//       const granted:any = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//               'title': 'Read your android storage Permission',
//               'message': 'Read your android storage to save your data'
//           }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("You can Read storage")
//       } else {
//           console.log("Read Storage permission denied")
//       }
//   } catch (err) {
//       console.warn(err)
//   }
// }

export const getAllChildren = async (dispatch: any, child_age: any, param: any) => {
  // console.log("sdfdfd");
  let databaselistener: any;
  let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  // console.log("sdfdfd");
  // console.log(allJsonDatanew?.length, "..allJsonDatanew")
  let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
  allJsonDatanew.removeAllListeners();
  let childAllData: any = [];
  let isChanged: boolean = false;
  if (allJsonDatanew?.length > 0) {
    childAllData = [];
    const p = allJsonDatanew.map(async (n: any) => {
      const value = await calc(n, child_age);
      let userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");
      if (childId?.length > 0) {
        childId = childId[0].value;
        if (childId === n.uuid) {
          let activeChild: any = value;
          // setActiveChild(langCode, n.uuid, dispatch, child_age);
          if (userParentalRole?.length > 0) {
            activeChild.parent_gender = userParentalRole[0].value
          }
          // console.log(activeChild, "..3435activeChild")

    const storedata = store.getState();
    //console.log("store val--", storedata)
    
          const allDatatoStore = await getAllDataToStore(storedata.selectedCountry.languageCode, dispatch, "AddEditChild", activeChild);
          // console.log(allDatatoStore, "..allDatatoStore..")
          dispatch(setActiveChildData(activeChild));
        }
      }
      // console.log(value, " returned value")
      childAllData.push(value);
      return value;
    });
    // console.log(p, "..p")
    const results = await Promise.all(p);
    // console.log(results, "..results..", childAllData);
    // console.log("childAllData--", childAllData);
    // console.log(childAllData, "before")
    childAllData = childAllData.sort((a: any, b: any) => {
      DateTime.fromISO(a.createdAt).diff(DateTime.fromISO(b.createdAt));
      const keyA = new Date(a.createdAt),
        keyB = new Date(b.createdAt);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    // console.log(childAllData, "after");
    dispatch(setAllChildData(childAllData));
    // console.log(param, "param");
    if (param == 1) {
      return childAllData;
    }
  }

}


export const deleteChild = async (languageCode: any, index: number, dispatch: any, schemaName: string, recordId: any, filterCondition: any, resolve: any, reject: any, child_age: any, t: any) => {
  //setActiveChild(data.uuid,dispatch,child_age);
  // console.log(recordId,"delete child filterCondition---",filterCondition);
  let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
  let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterCondition);
      if (oldChild?.length > 0) {
        oldChild = oldChild.map(item => item)[0];
      }
      // console.log(JSON.stringify(oldChild),"oldChild---",oldChild);
      oldChild.reminders.map((x:any) => {
        let previousDTDefined;
        const onlyDateDefined = new Date(x.reminderDateDefined);
        previousDTDefined = onlyDateDefined.setHours(new Date(x.reminderTimeDefined).getHours());
        previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(x.reminderTimeDefined).getMinutes()));
        // console.log("editing dtdefined---",previousDTDefined);
        LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
      })
  let createresult = await userRealmCommon.delete(schemaName, recordId, filterCondition);
  //console.log(createresult,"..createresult..");
  if (createresult == 'success') {
    let notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    
    let localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: recordId};
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    console.log("check local notification log3---");
    //console.log(index, "..index..");
    if (currentActiveChildId?.length > 0) {
      currentActiveChildId = currentActiveChildId[0].value;
      if (currentActiveChildId == recordId) {
        setActiveChild(languageCode, '', dispatch, child_age,false);
      }
    }
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        t('deleteSuccess'),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
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
      ToastAndroid.showWithGravityAndOffset(
        t('deleteError'),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    else {
      Alert.alert(t('deleteError'));
    }
    reject("error");
  }

  // reject("error");

  // }
}

export const onRealmDataDbChange = (collection: any, changes: any) => {
  //console.log("Realm listener called--",collection.name);
  //console.log("Realm listener called--",collection.schema);
  //console.log("Realm listener called string--",changes);
  // //console.log("Realm listener called Schema--",Schema);
}

