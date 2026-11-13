import { onAddEditChildSuccess, onHomeapiSuccess, onHomeSurveyapiSuccess, onHomeVideoartapiSuccess, onSponsorApiSuccess, updateIncrementalSyncDT } from './../../services/commonApiService';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import commonApiService, { cancelRetryAlert, onChildSetupApiSuccess, onOnLoadApiSuccess, onCountryApiSuccess, retryAlert } from '../../services/commonApiService';
import { ApiJsonArray, fetchAPI, FETCH_API, insertInDB } from './sagaActions';
import { InsertInDBSaga } from './sagaInsertInDB';
import {addApiDataInRealm} from '../../services/Utils';
import { fetchAPIStart, receiveAPIFailure, receiveAPISuccess } from './sagaSlice';
function* apiCall(data: ApiJsonArray, dispatch: any, errors: ApiJsonArray[]): any {
  try {
    const response = yield call(commonApiService, data.apiEndpoint, data.method, data.postdata);
    if (response?.status != 200 || (data.saveinDB && response?.data?.status != 200)) {
      errors.push(data);
      return null;
    }
    if (data.saveinDB) {
      // A dispatched/forked write does not finish before the success handler.
      // Await persistence before exposing the response or advancing its cursor.
      const saved = yield call(addApiDataInRealm, insertInDB(response, dispatch));
      if (saved !== 'successinsert') {
        errors.push(data);
        return null;
      }
    }
    return response;
  } catch {
    errors.push(data);
    return null;
  }
}
function* onApiSuccess(response: any[], prevPage: string, dispatch: any, navigation: any, languageCode: string, activeChild: any, oldErrorObj: any, netInfoIsConnected: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any, errorArr: ApiJsonArray[]): any {

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
      console.log('prevPage ********',prevPage)
      yield call(onCountryApiSuccess, response, dispatch, navigation, 'en', prevPage)
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

function* onApiError(payload: any, response: any[], prevPage: string, dispatch: any, navigation: any, languageCode: string, activeChild: any, oldErrorObj: any, netInfoIsConnected: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any, errorArr: ApiJsonArray[]): any {
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
    yield put(fetchAPI(onLoadApiArray, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload));
  } catch {
    // Completing the fallback must also release startup's navigator gate.
    // Keep requests in errorArr; only accepted responses may update cursors.
    try {
      yield call(cancelRetryAlert);
    } catch {
      // A dismissed confirmation must not strand the app on its loading screen.
    }
    yield call(onApiSuccess, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload, errorArr);
    yield put(receiveAPISuccess(response));
  }
}
export function* onFetchAPI(value: any): any {
  const errorArr: ApiJsonArray[] = [];
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
  let response: any[] = [];
  try {
    // API Request
    yield put(fetchAPIStart());

    response = yield all(
      payload.map((data: ApiJsonArray) =>
        call(apiCall, data, dispatch, errorArr)
      )
    )
    response = response?.filter((el: any) => {
      return el != null;
    });
    if (netInfoIsConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
      yield call(onApiError, payload, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload, errorArr);
    }
    else {
      yield call(onApiSuccess, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload, errorArr);
      yield put(receiveAPISuccess(response));
    }
  } catch (e) {
    console.log(value)
    if (netInfoIsConnected == true && prevPage != 'Survey' && errorArr.length > 0) {
      yield call(onApiError, payload, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload, errorArr);
    }
    else {
      yield call(onApiSuccess, response, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj, netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload, errorArr);

    }
  }
}

export function* fetchAPISaga(): any {
  yield takeEvery(FETCH_API, onFetchAPI);
}
export default function* rootSaga(): any {
  yield all([fetchAPISaga(), InsertInDBSaga()]);
}




