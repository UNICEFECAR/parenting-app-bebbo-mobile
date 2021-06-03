import { takeLatest, put, call, SagaReturnType, takeEvery, all, takeLeading, fork } from 'redux-saga/effects';
import { onLoadApiSuccess, retryOnloadAlert } from '../../screens/Terms';
import  commonApiService  from '../../services/commonApiService';
import { appConfig } from '../../types/apiConstants';
import { apijsonArray, fetchOnloadAPI, FETCH_ONLOAD_API } from './sagaActions';
import { receiveOnloadAPIFailure } from './sagaSlice';
// declare global errorArr;
let errorArr: any[] = [];
type commonApiServiceResponse = SagaReturnType<typeof commonApiService>
export default function* rootSaga() {
    console.log("called rootSaga");
    yield all([fetchOnloadPISaga()]);
}

function* onFetchOnloadAPI(value:any) {
    console.log(" called ..onFetchAPI..",value);
    try {
        // API Request
        const payload=value.payload;
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
            const confirm = yield call(retryOnloadAlert);
            console.log("confirm--",confirm);
            let failedApiObj = errorArr;
            let onLoadApiArray;
            const apiJsonData = [
              {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
              {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
              {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
            ]
            
            if(failedApiObj) {
              onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
                failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
              );
            }else {
              onLoadApiArray = apiJsonData;
            }
            console.log("onLoadApiArray--",onLoadApiArray);
            errorArr = [];
            yield put(fetchOnloadAPI(onLoadApiArray));
          }catch(e) {
            console.log("user selected cancelled");
            //code of what to fo if user selected cancel.
          }
         }
         else {
           onLoadApiSuccess();
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
    yield put(receiveOnloadAPIFailure(errorArr))
  }else {
    // call realm db insertion code by creating another saga.
  }
  // return response;
  // yield put(receiveData(response))
}
export function* fetchOnloadPISaga() {
    console.log("called fetchAPISaga");
    yield takeEvery(FETCH_ONLOAD_API, onFetchOnloadAPI);
  }
