import { AxiosResponse } from 'axios';
import { takeLatest, put, call, SagaReturnType, takeEvery, all, takeLeading, fork } from 'redux-saga/effects';
import  commonApiService, { onApiSuccess, retryAlert }  from '../../services/commonApiService';
import { addApiDataInRealm } from '../../services/Utils';
import { appConfig } from '../../types/apiConstants';
import { apijsonArray, fetchAPI, FETCH_API, insertInDB } from './sagaActions';
import { InsertInDBSaga } from './sagaInsertInDB';
import { receiveAPIFailure } from './sagaSlice';
// declare global errorArr;
let errorArr: any[] = [];
type commonApiServiceResponse = SagaReturnType<typeof commonApiService>
export default function* rootSaga() {
    console.log("called rootSaga");
    yield all([fetchAPISaga(),InsertInDBSaga()]);
}

function* onFetchAPI(value:any) {
    console.log(" called ..onFetchAPI..",value);
     const payload=value.payload;
     const prevPage=value.prevPage;
        console.log(payload,"..payload..");
    try {
        // API Request
        const payload=value.payload;
        console.log(payload,"..payload..");
        //we can use fork instead of all.Need to check.
        // yield payload.map((data: apijsonArray) =>call(apiCall, data))
        // const response:commonApiServiceResponse = yield all(payload.forEach((data: apijsonArray) =>  fork(apiCall, data)));
        const response:commonApiServiceResponse = yield all(
            payload.map((data: apijsonArray) =>
              call(apiCall, data)
            )
          )
         console.log(response,"..response..");
         console.log(errorArr,"..errorArr..");
         if(errorArr.length > 0)
         {
          try {
            const confirm = yield call(retryAlert);
            console.log("confirm--",confirm);
            let failedApiObj = errorArr;
            let onLoadApiArray;
            const apiJsonData =payload;
            
            if(failedApiObj) {
              onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
                failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
              );
            }else {
              onLoadApiArray = apiJsonData;
            }
            console.log("onLoadApiArray--",onLoadApiArray);
            errorArr = [];
            yield put(fetchAPI(onLoadApiArray));
          }catch(e) {
            console.log("user selected cancelled");
            //code of what to fo if user selected cancel.
          }
         }
         else {
          onApiSuccess(response);

         }
        //yield put(receiveAPISuccess(response));
      }catch(e) {
        console.log("in catch");
        //yield put(receiveAPIFailure(e));
      }
}

function* apiCall(data: apijsonArray) {
  const response = yield call(commonApiService, data.apiEndpoint,data.method,data.postdata);
  console.log(response,"  in apicall")
  
  if(response.status != 200)
  {
    console.log("in if")
    //code to insert in realm
    errorArr.push(response);
    console.log("errorArr---",errorArr)
    yield put(receiveAPIFailure(errorArr))
  }else {
    // call realm db insertion code by creating another saga.
    try{
      // yield call(addApiDataInRealm, response);
      if(data.saveinDB==true){
      console.log("insert started");
      yield put(insertInDB(response));
      }
    }
    catch(e) {
      errorArr.push(response);
      console.log("errorArr after insert---",errorArr)
    }
  }
     return response;
  // yield put(receiveData(response))
}
export function* fetchAPISaga() {
    console.log("called fetchAPISaga");
    yield takeEvery(FETCH_API, onFetchAPI);
  }
