import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';

import { ChildGender } from '../database/schema/ChildDataSchema';
import { Dispatch } from '@reduxjs/toolkit';
import { Alert, ToastAndroid } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { removeChild, setActiveChildData, setAllChildData } from '../redux/reducers/childSlice';
import { getVariableData } from '../redux/reducers/variableSlice';
import { DateTime } from 'luxon';
import { appConfig, articleCategory } from '@assets/translations/appOfflineData/apiConstants';
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
export const apiJsonDataGet = (childAge: any, parentGender: any) => {

  return [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {
        // childAge: 'all',
        childGender: 'all',
        childAge: childAge != "" && childAge != undefined && childAge != null ? childAge : "all",
        // childGender: '40',
        parentGender: parentGender != "" && parentGender != undefined && parentGender != null ? parentGender : "all",
        category: articleCategory,
      },
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
}
export const getNewChild = async (uuidGet: string, isExpected?: any, plannedTermDate?: any, isPremature?: string, birthDate?: any, name?: string, photoUri?: string, gender?: any): Promise<ChildEntity> => {
  return {
    uuid: uuidGet ? uuidGet : uuidv4(),
    childName: (name != "" && name != null && name != undefined) ? name : '',
    photoUri: photoUri ? photoUri : '',
    plannedTermDate: plannedTermDate ? plannedTermDate : null,
    birthDate: birthDate,
    isPremature: (isPremature != '' && isPremature != null && isPremature != undefined) ? isPremature : "false",
    gender: gender ? gender : 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    measurementPlace: "doctor",
    //relationship: relationship ? relationship : '',
    isExpected: (isExpected != '' && isExpected != null && isExpected != undefined) ? isExpected : "false"
  };

}
export const setActiveChild = async (languageCode: any, uuid: any, dispatch: any, child_age: any) => {

  //console.log(child_age,"..child_age..");
  let userParentalRole = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='userParentalRole'");

  if (uuid != "" && uuid != null && uuid != undefined) {
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", uuid);
    let child = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${uuid}'`);
    if (child?.length > 0) {
      child = child.map(item => item)[0];
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        let ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        // console.log(ageLimit,"..ageLimit..")  
        const taxonomyData = await checkBetween(1, ageLimit, child_age);
        // console.log(taxonomyData,"..taxonomyData..")
        if (taxonomyData?.length > 0) {
          child.taxonomyData = taxonomyData[0];
        }
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      console.log(child);
      // childId.parent_gender=
      // childId.taxonomydata
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      console.log(allDatatoStore, "..allDatatoStore..")
      dispatch(setActiveChildData(child));

    }
    else {
      let child = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
      child = child.find((record: any, index: number) => index === 0);
      if (child.birthDate != null && child.birthDate != undefined && child.birthDate != "") {
        let ageLimit = [];
        ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(child.birthDate)).toMillis()));
        // console.log(ageLimit,"..ageLimit..")  
        const taxonomyData = await checkBetween(1, ageLimit, child_age);
        // console.log(taxonomyData,"..taxonomyData..")
        if (taxonomyData?.length > 0) {
          child.taxonomyData = taxonomyData[0];
        }
      }
      if (userParentalRole?.length > 0) {
        child.parent_gender = userParentalRole[0].value
      }
      if (child) {
        const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
        console.log(allDatatoStore, "..allDatatoStore..")
        dispatch(setActiveChildData(child));

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
      // console.log(ageLimit,"..ageLimit..")  
      const taxonomyData = await checkBetween(1, ageLimit, child_age);
      // console.log(taxonomyData,"..taxonomyData..")
      if (taxonomyData?.length > 0) {
        child.taxonomyData = taxonomyData[0];
      }
    }
    if (userParentalRole?.length > 0) {
      child.parent_gender = userParentalRole[0].value
    }
    if (child) {
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, "AddEditChild", child);
      console.log(allDatatoStore, "..allDatatoStore..")
      dispatch(setActiveChildData(child));
    }
  }

}


export const between = (x: any, min: any, max: any) => {
  return x >= min && x <= max;
}
const notEmpty = (value: any) => {
  return value !== null && value !== undefined;
}
export const checkBetween = async (param: any, users: any, child_age: any) => {
  let ageData: any = [];
  await Promise.all(users.map(async (itemset: any) => {
    let result = await Promise.all(child_age.map((item: any) => {
      if (between(itemset, parseInt(item["days_from"]), parseInt(item["days_to"]))) {
        if (item.id != "446") {
          if (param == 0) {
            ageData.push(parseInt(item.id));
          }
          else {
            ageData.push(item);
          }

        }
      }
      return ageData;
    }));
    return result;
  }));
  //  console.log(ageData,"..ageData..")
  return ageData;
}
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
  console.log(days, "..days..");
  return days;
};
export const isFutureDate = (date: Date) => {
  return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
};

export const getCurrentChildAgeInMonths = (t: any, birthDate: string) => {
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
  const date1 = DateTime.fromISO(DateTime.local().toISODate());
  const date2 = DateTime.fromISO(birthDate);

  const diff: any = date1.diff(date2, ["years", "months", "days"]);
  // console.log(diff.toObject());
  var ageStr = "";
  // console.log(diff.years,diff.months,diff.days);
  if (diff.years <= 0 && diff.months <= 0 && diff.days <= 0) {
    ageStr = t('noBorn');
  } else {
    if (diff.years > 0) {
      ageStr = diff.years + (diff.years > 1 ? t('yearstag') : t('yeartag'));
    }
    if (diff.months > 0) {
      ageStr += diff.months + (diff.months > 1 ? t('monthstag') : t('monthtag'));
    }
    // console.log(diff,"..diffff...")
    // if(diff.days>0){ 
    if (diff.days != "" && diff.months == "" && diff.years == "") {
      ageStr += Math.round(diff.days) + (Math.round(diff.days) > 1 ? t('daystag') : t('daytag'));
    }
    if (ageStr == "") {
      ageStr = t('noday');
    }

  }

  return ageStr;

};
export const addChild = async (languageCode: any, editScreen: boolean, param: number, data: any, dispatch: any, navigation: any, child_age: any,relationship?:any) => {
  let oldBirthDate;
  if (editScreen) {
    //console.log("..update child..", data);
    let oldChild = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, `uuid == '${data[0].uuid}'`);
    if (oldChild?.length > 0) {
      oldChild = oldChild.map(item => item)[0];
      oldBirthDate = oldChild.birthDate;
    }
    let createresult = await userRealmCommon.updateChild<ChildEntity>(ChildEntitySchema, data);
    console.log("..update child..", createresult);
    let createresult1 = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    console.log(createresult1, "...createresult1getData..")
  }
  else {
    //  console.log("..add child..", data);
    let createresult = await userRealmCommon.create<ChildEntity>(ChildEntitySchema, data);
  }

  if (param == 0) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ChildSetupList' }],
    });
    // console.log(data[0].relationship,"..data[0].relationship..");
    let relationshipnew = relationship;
    if (typeof relationship === 'string' || relationship instanceof String) {
     relationshipnew = relationship
    }
    else {
      relationshipnew = String(relationship);
    }
    let userParentalRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", data[0].uuid);
    let userEnteredChildData = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", "true");
    setActiveChild(languageCode, data[0].uuid, dispatch, child_age);
  }
  else if (param == 1) {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    if (currentActiveChildId?.length > 0) {
      currentActiveChildId = currentActiveChildId[0].value;
      if (currentActiveChildId == data[0].uuid) {
        setActiveChild(languageCode, data[0].uuid, dispatch, child_age);
      }
    }
    navigation.navigate('ChildSetupList');
    // setActiveChild(data[0].uuid,dispatch,child_age);
  }
  else {
    let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    let ageLimit = [];
    let startDate =new Date(oldBirthDate)
    let someDate = new Date(data[0].birthDate)
    console.log(dateTimesAreSameDay(startDate, someDate), ".11.data.birthDate..")
    if (data[0].birthDate != null && data[0].birthDate != undefined && data[0].birthDate != "" && dateTimesAreSameDay(startDate, someDate)==false) {
      ageLimit.push(getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(data[0].birthDate)).toMillis()));
      console.log(ageLimit, "..ageLimit..")
      const taxonomyData = await checkBetween(0, ageLimit, child_age);
      console.log(taxonomyData, "..taxonomydata..");
      let apiJsonData;
      if (taxonomyData?.length > 0) {
        apiJsonData = apiJsonDataGet(String(taxonomyData), "all");
        console.log(apiJsonData, "..apiJsonData..");
        if (currentActiveChildId?.length > 0) {
          currentActiveChildId = currentActiveChildId[0].value;
          if (currentActiveChildId == data[0].uuid) {
            setActiveChild(languageCode, data[0].uuid, dispatch, child_age);
          }
        }
        navigation.navigate('LoadingScreen', {
          apiJsonData: apiJsonData,
          prevPage: 'AddEditChild'
        });
      }

    }
    else {
      if (currentActiveChildId?.length > 0) {
        currentActiveChildId = currentActiveChildId[0].value;
        if (currentActiveChildId == data[0].uuid) {
          setActiveChild(languageCode, data[0].uuid, dispatch, child_age);
        }
      }
      navigation.navigate('ChildProfileScreen');
    }


    //navigation.navigate('ChildProfileScreen');
  }

  // //console.log(new Date()," result is ",createresult);

}
export const dateTimesAreSameDay = (dateTime1: any, dateTime2: any) => {
  console.log(dateTime1, "/", dateTime2)
  let month1 = dateTime1.getUTCMonth() + 1; //months from 1-12
  let day1 = dateTime1.getUTCDate();
  let year1 = dateTime1.getUTCFullYear();
  let month2 = dateTime2.getUTCMonth() + 1; //months from 1-12
  let day2 = dateTime2.getUTCDate();
  let year2 = dateTime2.getUTCFullYear();
  console.log(year1, "/", year2,month1, "/", month2,day1, "/", day2)
  return month1 === month2 && year1 === year2 && day1 === day2;
}
export const updateActiveChild = (child: any, key: any, value: any, dispatch: any) => {
  child[key] = value;
  console.log(child, "..child..");
  dispatch(setActiveChildData(child));
}
export const getAllConfigData = async (dispatch: any) => {
  let databaselistener: any;
  let allJsonDatanew = await dataRealmCommon.getData<ConfigSettingsEntity>(ConfigSettingsSchema);
  allJsonDatanew.removeAllListeners();
  let configAllData: any = [];
  //console.log("db length--", allJsonDatanew?.length);
  if (allJsonDatanew?.length > 0) {
    databaselistener = allJsonDatanew.addListener((changes: any, name: any) => {
      configAllData = [];
      allJsonDatanew.map((value: ConfigSettingsEntity) => {
        configAllData.push(value);
      })
      dispatch(getVariableData(configAllData));
    });
  }
  else {
    //console.log("..else loop");
    dispatch(getVariableData(configAllData));
  }
}
export const getAllChildren = async (dispatch: any) => {
  let databaselistener: any;
  let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  allJsonDatanew.removeAllListeners();
  let childAllData: any = [];
  let isChanged: boolean = false;
  // dispatch(setAllChildData(childAllData));
  //console.log("db length--", allJsonDatanew?.length);
  if (allJsonDatanew?.length > 0) {
    databaselistener = allJsonDatanew.addListener(async (changes: any, name: any) => {
      // console.log("changes--",changes);
      // console.log("name--",name);
      childAllData = [];
      allJsonDatanew.map((value: ChildEntity) => {
        console.log(value, "..config value..");
        childAllData.push(value);
      })
      console.log(childAllData, "before")
      childAllData = childAllData.sort((a: any, b: any) => {
        DateTime.fromISO(a.updatedAt).diff(DateTime.fromISO(b.updatedAt));
        const keyA = new Date(a.updatedAt),
          keyB = new Date(b.updatedAt);

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      console.log(childAllData, "after")
      //if(changes.insertion.length || changes.deletion.length || changes.modifications.length){
      dispatch(setAllChildData(childAllData));
      //}
    });
  }
  else {
    //console.log("..else loop");
    // let enteredChildData:any=[{
    //     key:"userEnteredChildData",
    //     value:"false",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }]
    //  let updateresult = await dataRealmCommon.update<ConfigSettingsEntity>(ConfigSettingsSchema, enteredChildData);
    //   let createRelation = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, [{
    //     key:'userParentalRole',
    //     value:'',
    //     createdAt:new Date(),
    //     updatedAt:new Date()
    //  }]);
    dispatch(setAllChildData(childAllData));
  }
}

export const deleteChild = async (languageCode: any, index: number, dispatch: any, schemaName: string, recordId: any, filterCondition: any, resolve: any, reject: any, child_age: any) => {
  //setActiveChild(data.uuid,dispatch,child_age);
  let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
  let createresult = await userRealmCommon.delete(schemaName, recordId, filterCondition);
  //console.log(createresult,"..createresult..");
  if (createresult == 'success') {
    //console.log(index, "..index..");
    if (currentActiveChildId?.length > 0) {
      currentActiveChildId = currentActiveChildId[0].value;
      if (currentActiveChildId == recordId) {
        setActiveChild(languageCode, '', dispatch, child_age);
      }
    }
    ToastAndroid.showWithGravityAndOffset(
      "User Deleted Succesfully",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    resolve("success");
  }
  else {
    reject("error");
    ToastAndroid.showWithGravityAndOffset(
      "User Delete Error.Please try again..",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
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

