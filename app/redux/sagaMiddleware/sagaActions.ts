
export const FETCH_ONLOAD_API = 'api/FETCH_ONLOAD_API';
// export const RECEIVE_ONLOAD_API_SUCCESS = 'api/RECEIVE_ONLOAD_API_SUCCESS';
// export const RECEIVE_ONLOAD_API_FAILURE = 'api/RECEIVE_ONLOAD_API_FAILURE';

export const INSERT_IN_DB = 'api/INSERT_IN_DB';

export interface apijsonArray{
  apiEndpoint:string,method:string,postdata:any
}
export const fetchOnloadAPI = (apiJsonData:Array<apijsonArray>) => ({
  type: FETCH_ONLOAD_API,
  payload:apiJsonData
});

export const insertInDB = (apiJsonData:Array<apijsonArray>) => ({
  type: INSERT_IN_DB,
  payload:apiJsonData
});


// export const receiveOnloadAPISuccess = (data: any) => ({
//   type: RECEIVE_ONLOAD_API_SUCCESS,
//   data,
// });

// export const receiveOnloadAPIFailure = (error: any) => ({
//   type: RECEIVE_ONLOAD_API_FAILURE,
//   error,
// });