import { onAddEditChildSuccess, onHomeapiSuccess, onHomeSurveyapiSuccess, onHomeVideoartapiSuccess, updateIncrementalSyncDT } from './../../services/commonApiService';
import { AxiosResponse } from 'axios';
import { all, call, put, SagaReturnType, takeEvery } from 'redux-saga/effects';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import commonApiService, { cancelRetryAlert, onChildSetuppiSuccess, onOnLoadApiSuccess, onSponsorApiSuccess, retryAlert } from '../../services/commonApiService';
import { addApiDataInRealm } from '../../services/Utils';
import { apijsonArray, fetchAPI, FETCH_API, insertInDB, insertInStore } from './sagaActions';
import { InsertInDBSaga } from './sagaInsertInDB';
import { InsertInStoreSaga } from './sagaInsertInStore';
import { receiveAPIFailure } from './sagaSlice';
import { Alert } from 'react-native';
// declare global errorArr;
let errorArr: any[] = [];
type commonApiServiceResponse = SagaReturnType<typeof commonApiService>
export default function* rootSaga() {
  // console.log("called rootSaga");
  yield all([fetchAPISaga(), InsertInDBSaga()]);
}

function* onFetchAPI(value: any) {
  // console.log(new Date()," called ..onFetchAPI..",value);
  const payload = value.payload;
  const prevPage = value.prevPage;
  const dispatch = value.dispatch;
  const navigation = value.navigation;
  const languageCode = value.languageCode;
  const activeChild = value.activeChild;
  const oldErrorObj = value.oldErrorObj;
  const netInfovalisConnected = value.netInfovalisConnected;
  const forceupdatetime = value.forceupdatetime;
  const downloadWeeklyData = value.downloadWeeklyData;
  const downloadMonthlyData = value.downloadMonthlyData;
  const enableImageDownload = value.enableImageDownload;
  // console.log("prevPage--",prevPage);
  errorArr = [];
  try {
    // API Request

    // console.log(payload,"..payload..");
    // console.log(prevPage,"..prevPage..");
    //we can use fork instead of all.Need to check.
    // yield payload.map((data: apijsonArray) =>call(apiCall, data))
    // const response:commonApiServiceResponse = yield all(payload.forEach((data: apijsonArray) =>  fork(apiCall, data)));
    // if(netInfovalisConnected == true)
    // {
      let response: commonApiServiceResponse = yield all(
        payload.map((data: apijsonArray) =>
          call(apiCall, data,dispatch,languageCode)
        )
      )
      response = response.filter((el: any) =>{
        return el != null;
      });
      // console.log(response,"..response..");
      // console.log(errorArr,"..errorArr..",netInfovalisConnected);
      // Alert.alert(errorArr.length+"-start--"+netInfovalisConnected+" hh "+prevPage);
      if (netInfovalisConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
        // console.log("first error called");
          yield call(onApiError,payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
      }
      else {
          yield call(onApiSuccess, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
      }
    // }else {
    //   yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj);

    // }
    //yield put(receiveAPISuccess(response));
  } catch (e) {
    // Alert.alert(errorArr.length+"-start--"+netInfovalisConnected+" hhnew "+prevPage);
    if (netInfovalisConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
      // console.log("second error called");
        yield call(onApiError,payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
    }
    else {
        yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
    }
    // yield call(onApiError,payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj);
  }
}
// async function* navigateToPage() {
//    let allJsonData = yield await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
//    console.log(allJsonData.length,"..allJsonData..")
//   //let userEnteredChildData = yield await dataRealmCommon.getData<ConfigSettingsEntity>(ConfigSettingsSchema);
//   //console.log("  db length--",allJsonData?.length);

// }
// async function* fetchUsers() {
// }
function* apiCall(data: apijsonArray,dispatch: any,languageCode: string) {
  console.log("in api call",data);
  try{
    const response = yield call(commonApiService, data.apiEndpoint, data.method, data.postdata);
    // console.log(response,"  in apicall",new Date())

    if (response.status != 200) {
      // console.log("in if")
      //code to insert in realm
      errorArr.push(data);
      // console.log("errorArr---",errorArr)
      // yield put(receiveAPIFailure(errorArr))
    } else {
      // if(data.apiEndpoint == "standard_deviation")
      // {
      //   yield put(insertInDB(response,dispatch));
      //   // const response2 = {payload:response,
      //   // dispatch:dispatch}
      //   // yield call(addApiDataInRealm, response2);
      // }
        if(response.data.status == 200)
        {
          // call realm db insertion code by creating another saga.
          try {
            // yield call(addApiDataInRealm, response);
            if (data.saveinDB == true) {
              // console.log("insert started");
              yield put(insertInDB(response,dispatch));
              // const response2 = {payload:response,
              //   dispatch:dispatch}
              //   yield call(addApiDataInRealm, response2);
              // yield put(insertInStore(response,dispatch,languageCode));
                // const response3 = {payload:response,
                // dispatch:dispatch,languageCode:languageCode}
                // yield call(getAllDataToStore, response3.languageCode,response3.dispatch,response3.payload.apiEndpoint)
            }
          }
          catch (e) {
            // errorArr.push(response);
            // console.log("errorArr after insert---",errorArr)
          }
        }
        // else if(response.data.status == 400){
        //   console.log("11in apiCall catch");
        //   errorArr.push(data);
        // }
        else {
          // yield put(insertInStore(response,dispatch,languageCode));
        }
    }
    return response;
  }catch (e) {
   // console.log("in apiCall catch");
    errorArr.push(data);
    return null;
  }
  // yield put(receiveData(response))
}
export function* fetchAPISaga() {
  //console.log("called fetchAPISaga");
  yield takeEvery(FETCH_API, onFetchAPI);
}

function* onApiSuccess(response: AxiosResponse<any>, prevPage: string, dispatch: any, navigation: any,languageCode: string, activeChild: any,oldErrorObj:any,netInfovalisConnected:any,forceupdatetime:any,downloadWeeklyData:any,downloadMonthlyData:any,enableImageDownload:any) {
 // console.log("errorArr on redirect--",errorArr);
  // if(errorArr && errorArr.length > 0)
  // {
    let payload = {errorArr:errorArr,fromPage:prevPage}
      yield put(receiveAPIFailure(payload))
  // }
  yield call(updateIncrementalSyncDT, response, dispatch, navigation, languageCode, prevPage);
  if (prevPage == 'Terms') {
    //dispatch action for terms page
    yield call(onOnLoadApiSuccess, response, dispatch, navigation, languageCode, prevPage);
  } else if (prevPage == 'AddEditChild') {
    //dispatch action for sponsor page
    yield call(onAddEditChildSuccess, response, dispatch, navigation, languageCode, prevPage,activeChild,oldErrorObj)
  }
  else if (prevPage == 'CountryLanguageSelection') {
    //dispatch action for sponsor page
    yield call(onSponsorApiSuccess, response, dispatch, navigation, languageCode, prevPage)
  }
   else if (prevPage == 'ChilSetup') {
    //dispatch action for before home page
    yield call(onChildSetuppiSuccess, response, dispatch, navigation, languageCode, prevPage,activeChild,oldErrorObj)
  }
   else if (prevPage == 'Home' || prevPage == 'CountryLangChange' || prevPage == 'PeriodicSync' || prevPage == 'ImportScreen' || prevPage == 'DownloadUpdate' || prevPage == 'ForceUpdate' || prevPage == 'DownloadAllData') {
    //dispatch action for before home page
    yield call(onHomeapiSuccess, response, dispatch, navigation, languageCode, prevPage,activeChild,oldErrorObj,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload)
  }
   else if (prevPage == 'Survey') {
    //dispatch action for before home page
    yield call(onHomeSurveyapiSuccess, response, dispatch, navigation, languageCode, prevPage,activeChild,oldErrorObj)
  }
   else if (prevPage == 'VideoArticle' || prevPage == 'RelatedVideoArticle') {
    //dispatch action for before home page
    yield call(onHomeVideoartapiSuccess, response, dispatch, navigation, languageCode, prevPage,activeChild,oldErrorObj)
  }
}

function* onApiError(payload:any,prevPage: string, dispatch: any, navigation: any, languageCode: string,activeChild: any, oldErrorObj: any,netInfovalisConnected:any,forceupdatetime:any,downloadWeeklyData:any,downloadMonthlyData:any,enableImageDownload:any) {
  // if (prevPage !== 'CountryLanguageSelection') {
    try {
      const confirm = yield call(retryAlert);
      // console.log("confirm--",confirm);
      let failedApiObj = errorArr;
      let onLoadApiArray;
      const apiJsonData = payload;

      if (failedApiObj && failedApiObj.length > 0) {
        onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
          failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
        );
      } else {
        onLoadApiArray = apiJsonData;
      }
     // console.log("onLoadApiArray--",onLoadApiArray);
      errorArr = [];
      yield put(fetchAPI(onLoadApiArray, prevPage, dispatch, navigation, languageCode,activeChild,oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload));
    } catch (e) {
      //code of what to fo if user selected cancel.
      try {
        const cancelclicked = yield call(cancelRetryAlert);
        // console.log("in cancel retry ---",errorArr);
        yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode,activeChild, oldErrorObj,netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
        // if (prevPage == 'Terms') {
        //   // navigation.navigate('ChildSetup');
        //   const allJsonData = navigateToPage();
        //   allJsonData.next().then(({ value, done }) => {
        //   //  console.log(value.length,"..value..");
        //     if (value?.length>0) {
        //       navigation.navigate('ChildSetupList');
        //     }
        //     else {
        //       navigation.navigate('ChildSetup');
        //     }
        //   }).catch(({ error }) => {
        //     console.log(error,"..error..");
        //   });
        // } else if (prevPage == 'ChilSetup') {
        //   //dispatch action for before home page
        //   // navigation.reset('HomeDrawerNavigator');
        //   navigation.reset({
        //     index: 0,
        //     routes: [
        //       {
        //         name: 'HomeDrawerNavigator',
        //       },
        //     ],
        //   });
        // }
      }catch (e) {
        yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfovalisConnected,forceupdatetime,downloadWeeklyData,downloadMonthlyData,enableImageDownload);
      }
    }
  // }else {
  //   yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode);
  // }
}
