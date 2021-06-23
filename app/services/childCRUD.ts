import { Dispatch } from '@reduxjs/toolkit';
import { Alert, ToastAndroid } from 'react-native';
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
    console.log("..add child..",createresult);
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
    
    
    // //console.log(new Date()," result is ",createresult);
  
}
export const getAllChildren=async (dispatch:any)=>{
    let databaselistener:any;
    let allJsonData = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    allJsonData.removeAllListeners();
    let childAllData:any=[];
    let isChanged:boolean=false;
    // dispatch(setAllChildData(childAllData));
    console.log("db length--",allJsonData?.length);
    if(allJsonData?.length > 0){
   
    databaselistener = allJsonData.addListener((changes:any,name: any)=> {
        console.log("changes--",changes);
        console.log("name--",name);
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
       // if (changes.insertions.length || changes.deletions.length || changes.modifications.length) {
         dispatch(setAllChildData(childAllData));
       // }
       
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
        ToastAndroid.showWithGravityAndOffset(
            "User Deleted Succesfully",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        // dispatch(removeChild(index))
       // resolve("success");
        //getAllChildren(dispatch);
    }
    else{
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

