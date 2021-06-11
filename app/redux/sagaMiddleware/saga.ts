import { AxiosResponse } from 'axios';
import { takeLatest, put, call, SagaReturnType, takeEvery, all, takeLeading, fork } from 'redux-saga/effects';
import  commonApiService, { onChildSetuppiSuccess, onOnLoadApiSuccess, onSponsorApiSuccess, retryAlert }  from '../../services/commonApiService';
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
    const dispatch=value.dispatch;
    const navigation=value.navigation;
    console.log("prevPage--",prevPage);
    errorArr = [];
    try {
        // API Request
        
        console.log(payload,"..payload..");
        console.log(prevPage,"..prevPage..");
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
          if(prevPage == 'Terms')
          {
            navigation.navigate('ChildSetup');
          }else if(prevPage == 'ChilSetup')
          {
            //dispatch action for before home page
            navigation.navigate('HomeDrawerNavigator');
          }
          // try {
          //   const confirm = yield call(retryAlert);
          //   console.log("confirm--",confirm);
          //   let failedApiObj = errorArr;
          //   let onLoadApiArray;
          //   const apiJsonData =payload;
            
          //   if(failedApiObj) {
          //     onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
          //       failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
          //     );
          //   }else {
          //     onLoadApiArray = apiJsonData;
          //   }
          //   console.log("onLoadApiArray--",onLoadApiArray);
          //   errorArr = [];
          //   yield put(fetchAPI(onLoadApiArray,prevPage,dispatch,navigation));
          // }catch(e) {
          //   console.log("user selected cancelled",prevPage);
          //   //code of what to fo if user selected cancel.
          //   if(prevPage == 'Terms')
          //   {
          //     navigation.navigate('ChildSetup');
          //   }else if(prevPage == 'ChilSetup')
          //   {
          //     //dispatch action for before home page
          //     navigation.navigate('HomeDrawerNavigator');
          //   }
          // }
         }
         else {
          yield call(onApiSuccess,response,prevPage,dispatch,navigation);

         }
        //yield put(receiveAPISuccess(response));
      }catch(e) {
        console.log("in catch---",prevPage);
        if(prevPage !== 'CountryLanguageSelection')
        {
          if(prevPage == 'Terms')
            {
              navigation.navigate('ChildSetup');
            }else if(prevPage == 'ChilSetup')
            {
              //dispatch action for before home page
              navigation.navigate('HomeDrawerNavigator');
            }
          // try {
          //   const confirm = yield call(retryAlert);
          //   console.log("confirm--",confirm);
          //   // let failedApiObj = errorArr;
          //   let onLoadApiArray;
          //   const apiJsonData =payload;
            
          //   // if(failedApiObj) {
          //   //   onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
          //   //     failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
          //   //   );
          //   // }else {
          //   //   onLoadApiArray = apiJsonData;
          //   // }
          //   onLoadApiArray = apiJsonData;
          //   console.log("onLoadApiArray--",onLoadApiArray);
          //   errorArr = [];
          //   yield put(fetchAPI(onLoadApiArray,prevPage,dispatch,navigation));
          // }catch(e) {
          //   console.log("user selected cancelled",prevPage);
          //   //code of what to fo if user selected cancel.
          //   if(prevPage == 'Terms')
          //   {
          //     navigation.navigate('ChildSetup');
          //   }else if(prevPage == 'ChilSetup')
          //   {
          //     //dispatch action for before home page
          //     navigation.navigate('HomeDrawerNavigator');
          //   }
          // }
        }
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

function* onApiSuccess(response: AxiosResponse<any>,prevPage: string,dispatch: any,navigation: any){
  if(prevPage == 'Terms')
 {
  //dispatch action for terms page
  yield call(onOnLoadApiSuccess,response,dispatch,navigation);
 } else if(prevPage == 'CountryLanguageSelection')
 {
 //dispatch action for sponsor page
  yield call(onSponsorApiSuccess,response,dispatch,navigation)
 } else if(prevPage == 'ChilSetup')
 {
 //dispatch action for before home page
  yield call(onChildSetuppiSuccess,response,dispatch,navigation)
 }
}
