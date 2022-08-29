import { AnyAction, Dispatch } from "@reduxjs/toolkit";

export const FETCH_API = 'api/FETCH_API';
export const INSERT_IN_DB = 'api/INSERT_IN_DB';
export const INSERT_IN_STORE = 'api/INSERT_IN_STORE';

export interface ApiJsonArray {
  apiEndpoint: string; method: string; postdata: any; saveinDB?: boolean;
}
export const fetchAPI = (apiJsonData: Array<ApiJsonArray>, prevPage?: string, dispatch?: Dispatch<AnyAction> | undefined, navigation?: any, languageCode?: string, activeChild?: any, oldErrorObj?: Array<ApiJsonArray>, netInfovalisConnected?: boolean | null, forceupdatetime?: any, downloadWeeklyData?: any, downloadMonthlyData?: any, enableImageDownload?: any):any => ({
  type: FETCH_API,
  payload: apiJsonData,
  prevPage: prevPage,
  dispatch: dispatch,
  navigation: navigation,
  languageCode: languageCode,
  activeChild: activeChild,
  oldErrorObj: oldErrorObj,
  netInfovalisConnected: netInfovalisConnected,
  forceupdatetime: forceupdatetime,
  downloadWeeklyData: downloadWeeklyData,
  downloadMonthlyData: downloadMonthlyData,
  enableImageDownload: enableImageDownload,
});

export const insertInDB = (apiJsonData: Array<ApiJsonArray>, dispatch?: Dispatch<AnyAction> | undefined):any => ({
  type: INSERT_IN_DB,
  payload: apiJsonData,
  dispatch: dispatch
});
export const insertInStore = (apiJsonData: Array<ApiJsonArray>, dispatch?: Dispatch<AnyAction> | undefined, languageCode?: string):any => ({
  type: INSERT_IN_STORE,
  payload: apiJsonData,
  dispatch: dispatch,
  languageCode: languageCode
});