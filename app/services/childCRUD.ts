
import { ChildGender } from '../database/schema/ChildDataSchema';
import { Dispatch } from '@reduxjs/toolkit';
import { Alert, ToastAndroid } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { removeChild, setAllChildData } from '../redux/reducers/childSlice';
import { getVariableData } from '../redux/reducers/variableSlice';
export const getNewChild = async (uuidGet: string,isExpected?:any, plannedTermDate?: any, isPremature?: string, birthDate?: any, relationship?: string, name?: string, photoUri?: string, gender?: any): Promise<ChildEntity> => {
  return {
    uuid: uuidGet ? uuidGet : uuidv4(),
    name: (name!="" && name!=null  && name!=undefined) ? name:'',
    photoUri: photoUri ? photoUri : '',
    plannedTermDate: plannedTermDate ? plannedTermDate : null,
    birthDate: birthDate,
    isPremature: (isPremature!='' && isPremature!=null && isPremature!=undefined) ? isPremature : "false",
    gender: gender ? gender : '',
    createdAt: new Date(),
    updatedAt: new Date(),
    measurementPlace: "doctor",
    relationship: relationship ? relationship : '',
    isExpected: (isExpected!='' && isExpected!=null && isExpected!=undefined)?isExpected:"false"
  };

}
export const setActiveChild=async (uuid:any)=>{
 // console.log(uuid,"..uuid..");
  let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId",uuid);
}
export const addChild = async (editScreen: boolean, param: number, data: any, dispatch: any, navigation: any) => {
  if (editScreen) {
    //console.log("..update child..", data);
    let createresult = await userRealmCommon.updateChild<ChildEntity>(ChildEntitySchema, data);
    //console.log("..update child..", createresult);
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
    //console.log(data[0].uuid,"..data[0].uuid..");
    let userParentalRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", data[0].relationship);
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", data[0].uuid);
    let userEnteredChildData = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", "true");
  }
  else if (param == 1) {
    navigation.navigate('ChildSetupList');
  }
  else {
    navigation.navigate('ChildProfileScreen');
  }


  // //console.log(new Date()," result is ",createresult);

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
        //console.log(value,"..config value..");
        childAllData.push(value);
      })
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

export const deleteChild = async (index: number, dispatch: any, schemaName: string, recordId: any, filterCondition: any,resolve:any,reject:any) => {
  let createresult = await userRealmCommon.delete(schemaName, recordId, filterCondition);
  //console.log(createresult,"..createresult..");
  if (createresult == 'success') {
    //console.log(index, "..index..");
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

