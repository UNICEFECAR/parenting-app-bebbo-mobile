import { ActionCreator, AnyAction, Dispatch } from "@reduxjs/toolkit";
// import { Dispatch } from "react";

export const FETCH_API = 'api/FETCH_API';
// export const RECEIVE_ONLOAD_API_SUCCESS = 'api/RECEIVE_ONLOAD_API_SUCCESS';
// export const RECEIVE_ONLOAD_API_FAILURE = 'api/RECEIVE_ONLOAD_API_FAILURE';

export const INSERT_IN_DB = 'api/INSERT_IN_DB';

export const INSERT_IN_STORE = 'api/INSERT_IN_STORE';

export interface apijsonArray{
  apiEndpoint:string,method:string,postdata:any,saveinDB?:boolean
}

const setLoginState: ActionCreator<any> = (typeset: string,data:any) => {
  return {
  type:typeset,
  payload:data
  }
  };
  // const dispatchnew: Dispatch<any>;
export const fetchAPI = (apiJsonData:Array<apijsonArray>,prevPage?:string,dispatch?: Dispatch<AnyAction> | undefined,navigation?:any,languageCode?:string,activeChild?:any,oldErrorObj?:Array<apijsonArray>,netInfovalisConnected?:boolean|null) => ({
  type: FETCH_API,
  payload:apiJsonData,
  prevPage:prevPage,
  dispatch:dispatch,
  navigation:navigation,
  languageCode:languageCode,
  activeChild:activeChild,
  oldErrorObj: oldErrorObj,
  netInfovalisConnected: netInfovalisConnected
});

export const insertInDB = (apiJsonData:Array<apijsonArray>,dispatch?: Dispatch<AnyAction> | undefined) => ({
  type: INSERT_IN_DB,
  payload:apiJsonData,
  dispatch:dispatch
});
export const insertInStore = (apiJsonData:Array<apijsonArray>,dispatch?: Dispatch<AnyAction> | undefined, languageCode?:string) => ({
  type: INSERT_IN_STORE,
  payload:apiJsonData,
  dispatch:dispatch,
  languageCode:languageCode
});


// export const receiveAPISuccess = (data: any) => ({
//   type: RECEIVE_API_SUCCESS,
//   data,
// });

// export const receiveAPIFailure = (error: any) => ({
//   type: RECEIVE_API_FAILURE,
//   error,
// });