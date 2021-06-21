import { Dispatch } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { removeChild, setAllChildData } from '../redux/reducers/childSlice';
export const getNewChild=(birthDate:any,plannedTermDate:any,isPremature:string,relationship?:string):ChildEntity=>{
    return {
        uuid: uuidv4(),
        name: '',
        plannedTermDate:plannedTermDate,
        birthDate:birthDate,
        isPremature:isPremature,
        gender: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        measurementPlace: "doctor",
        relationship:relationship ? relationship : ''
    };
  }
export const addChild = async(param:number,data:any,dispatch:any,navigation:any) => {
    //console.log("..add child..",data);
    let createresult = await userRealmCommon.create<ChildEntity>(ChildEntitySchema, data);
    //createresult.addListener(() => dispatch(setChildStore(JSON.stringify(objdata))));
    if(param==0){
        navigation.reset({
            index: 0,
            routes: [{name: 'ChildSetupList'}],
        });
    }
    else{
        navigation.navigate('ChildSetupList');
    }
  
    getAllChildren(dispatch);
    // //console.log(new Date()," result is ",createresult);
  
}
export const getAllChildren=async (dispatch:any)=>{
    let databaselistener:any;
    let allJsonData = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let childAllData:any=[];
    // dispatch(setAllChildData(childAllData));
    //console.log("db length--",allJsonData?.length);
    if(allJsonData?.length > 0){
    //console.log(allJsonData,"..allJsonData..");
    databaselistener = allJsonData.addListener(() => {
        //console.log("in if listener called--",allJsonData);
        childAllData=[];
         allJsonData.map((value:ChildEntity)=>{
          let valueset= {
            birthDate:value.birthDate,
            name:value.name,
            uuid:value.uuid,
            gender:value.gender,
            relationship:value.relationship,
            createdAt:value.createdAt,
            updatedAt:value.updatedAt,
            measurementPlace:value.measurementPlace,
            isPremature:value.isPremature ? value.isPremature:''
          }
          childAllData.push(valueset);
        })
        dispatch(setAllChildData(childAllData));
    });
    } 
    else{
        dispatch(setAllChildData(childAllData));
    }
}
export const updateChild=()=>{
    
}
export const deleteChild=async (index:number,dispatch:any,schemaName:string,recordId:any,filterCondition:any)=>{
    let createresult = await userRealmCommon.delete(schemaName,recordId,filterCondition);
   //console.log(createresult,"..createresult..");
    if(createresult=='success'){
        console.log(index,"..index..");
        dispatch(removeChild(index))
        // getAllChildren(dispatch);
    }
    else{
        Alert.alert("Please try again...");
    }
}

export const onRealmDataDbChange = (collection: any, changes: any) => {
    //console.log("Realm listener called--",collection.name);
    //console.log("Realm listener called--",collection.schema);
    //console.log("Realm listener called string--",changes);
    // //console.log("Realm listener called Schema--",Schema);
}

