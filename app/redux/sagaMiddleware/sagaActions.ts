
export const FETCH_API = 'api/FETCH_API';
// export const RECEIVE_ONLOAD_API_SUCCESS = 'api/RECEIVE_ONLOAD_API_SUCCESS';
// export const RECEIVE_ONLOAD_API_FAILURE = 'api/RECEIVE_ONLOAD_API_FAILURE';

export const INSERT_IN_DB = 'api/INSERT_IN_DB';

export interface apijsonArray{
  apiEndpoint:string,method:string,postdata:any,saveinDB?:boolean
}
export const fetchAPI = (apiJsonData:Array<apijsonArray>) => ({
  type: FETCH_API,
  payload:apiJsonData
});

export const insertInDB = (apiJsonData:Array<apijsonArray>) => ({
  type: INSERT_IN_DB,
  payload:apiJsonData
});


// export const receiveAPISuccess = (data: any) => ({
//   type: RECEIVE_API_SUCCESS,
//   data,
// });

// export const receiveAPIFailure = (error: any) => ({
//   type: RECEIVE_API_FAILURE,
//   error,
// });