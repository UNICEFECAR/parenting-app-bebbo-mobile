import { onAddEditChildSuccess, onHomeapiSuccess, onHomeSurveyapiSuccess, onHomeVideoartapiSuccess, onSponsorApiSuccess, updateIncrementalSyncDT } from './../../services/commonApiService';
import { AxiosResponse } from 'axios';
import { all, call, put, SagaReturnType, takeEvery } from 'redux-saga/effects';
import commonApiService, { cancelRetryAlert, onChildSetupApiSuccess, onOnLoadApiSuccess, onCountryApiSuccess, retryAlert } from '../../services/commonApiService';
import { ApiJsonArray, fetchAPI, FETCH_API, insertInDB } from './sagaActions';
import { InsertInDBSaga } from './sagaInsertInDB';
import { fetchAPIStart, receiveAPIFailure, receiveAPISuccess } from './sagaSlice';
let errorArr: any[] = [];
type commonApiServiceResponse = SagaReturnType<typeof commonApiService>
function* apiCall(data: ApiJsonArray, dispatch: any): any {
  console.log("in api call", data);
  try {

    const response = yield call(commonApiService, data.apiEndpoint, data.method, data.postdata);
    if (response.status != 200) {
      errorArr.push(data);
    } else {
      if (response.data.status == 200) {
        try {
          if (data.saveinDB == true) {
            yield put(insertInDB(response, dispatch));
          }
        }
        catch (e) {
          // console.log("errorArr after insert---",errorArr)
        }
      }
    }
    return response;
  } catch (e) {
    errorArr.push(data);
    return null;
  }
}
function* onApiSuccess(response: AxiosResponse<any>, prevPage: string, dispatch: any, navigation: any, languageCode: string, activeChild: any, oldErrorObj: any, netInfoIsConnected: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any): any {

  // }
  try {
    const payload = { errorArr: errorArr, fromPage: prevPage }
    yield put(receiveAPIFailure(payload))
    yield call(updateIncrementalSyncDT, response, dispatch, navigation, languageCode, prevPage);
  } catch (error) {
    console.log('error1', error)
  }
  if (prevPage == 'Terms') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onOnLoadApiSuccess, response, dispatch, navigation, languageCode, prevPage);
    } catch (error) {
      console.log('error2', error)
    }
    //dispatch action for terms page

  } else if (prevPage == 'AddEditChild') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onAddEditChildSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error3', error)
    }
    //dispatch action for sponsor page

  }
  else if (prevPage == 'CountryLanguageSelection') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onSponsorApiSuccess, response, dispatch, navigation, languageCode, prevPage)
    } catch (error) {
      console.log('error4', error)
    }

  }
  else if (prevPage == '') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onCountryApiSuccess, response, dispatch, navigation, languageCode, prevPage)
    } catch (error) {
      console.log('error5', error)
    }

  }
  else if (prevPage == 'ChildSetup') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onChildSetupApiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error6', error)
    }

  }
  else if (prevPage == 'Home' || prevPage == 'CountryLangChange' || prevPage == 'PeriodicSync' || prevPage == 'ImportScreen' || prevPage == 'DownloadUpdate' || prevPage == 'ForceUpdate' || prevPage == 'DownloadAllData') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onHomeapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload)
    } catch (error) {
      console.log('error7', error)
    }

  }
  else if (prevPage == 'Survey') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onHomeSurveyapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error8', error)
    }

  }
  else if (prevPage == 'VideoArticle' || prevPage == 'RelatedVideoArticle') {
    try {
      const payload = { errorArr: errorArr, fromPage: prevPage }
      yield call(onHomeVideoartapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error9', error)
    }

  }
}

function* onApiError(payload: any, prevPage: string, dispatch: any, navigation: any, languageCode: string, activeChild: any, oldErrorObj: any, netInfoIsConnected: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any): any {
  try {
    yield call(retryAlert);
    const failedApiObj = errorArr;
    let onLoadApiArray;
    const apiJsonData = payload;

    if (failedApiObj && failedApiObj.length > 0) {
      onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any }) =>
        failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
      );
    } else {
      onLoadApiArray = apiJsonData;
    }
    errorArr = [];
    yield put(fetchAPI(onLoadApiArray, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload));
  } catch (e) {
    //code of what to fo if user selected cancel.
    try {
      yield call(cancelRetryAlert);
      yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);
    } catch (e) {
      yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);
    }
  }
}
function* onFetchAPI(value: any): any {
  const payload = value.payload;
  const prevPage = value.prevPage;
  const dispatch = value.dispatch;
  const navigation = value.navigation;
  const languageCode = value.languageCode;
  const activeChild = value.activeChild;
  const oldErrorObj = value.oldErrorObj;
  const netInfoIsConnected = value.netInfoIsConnected;
  const forceupdatetime = value.forceupdatetime;
  const downloadWeeklyData = value.downloadWeeklyData;
  const downloadMonthlyData = value.downloadMonthlyData;
  const enableImageDownload = value.enableImageDownload;
  errorArr = [];
  try {
    // API Request
    yield put(fetchAPIStart());

    let response: commonApiServiceResponse = yield all(
      payload.map((data: ApiJsonArray) =>
        call(apiCall, data, dispatch)
      )
    )
    response = response?.filter((el: any) => {
      return el != null;
    });
    if (netInfoIsConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
      yield call(onApiError, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);
    }
    else {
      yield call(onApiSuccess, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);
      yield put(receiveAPISuccess(response));
    }
  } catch (e) {
    console.log(value)
    if (netInfoIsConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
      yield call(onApiError, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);
    }
    else {
      yield call(onApiSuccess, payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload);

    }
  }
}

export function* fetchAPISaga(): any {
  yield takeEvery(FETCH_API, onFetchAPI);
}
export default function* rootSaga(): any {
  yield all([fetchAPISaga(), InsertInDBSaga()]);
}




