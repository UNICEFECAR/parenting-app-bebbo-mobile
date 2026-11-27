import {withPendingForceUpdateRequests} from '../../services/forceUpdateRequests';
import { onAddEditChildSuccess, onHomeapiSuccess, onHomeSurveyapiSuccess, onHomeVideoartapiSuccess, onSponsorApiSuccess, updateIncrementalSyncDT } from './../../services/commonApiService';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {appConfig} from '../../instances';
import {remoteStrings} from '../../localization/stringResources';
import {withStringSync} from '../../localization/stringSyncPlan';
import commonApiService, { cancelRetryAlert, onChildSetupApiSuccess, onOnLoadApiSuccess, onCountryApiSuccess, retryAlert } from '../../services/commonApiService';
import { ApiJsonArray, FETCH_API, insertInDB } from './sagaActions';
import { InsertInDBSaga } from './sagaInsertInDB';
import {addApiDataInRealm} from '../../services/Utils';
import { fetchAPIStart, receiveAPIFailure, receiveAPISuccess } from './sagaSlice';
function* apiCall(data: ApiJsonArray, dispatch: any, errors: ApiJsonArray[]): any {
  let stage = 'download';
  try {
    const isStrings = data.apiEndpoint === appConfig.apiConfig.strings;
    // Capture the requested language before downloading; late responses must
    // never overwrite another locale if the user changes language meanwhile.
    const language = isStrings ? yield select(state => state.selectedCountry) : undefined;
    const response = yield call(commonApiService, data.apiEndpoint, data.method, data.postdata);
    // Incremental endpoints report 204 when there is nothing new to download.
    // Keep the existing cache and accept the response without attempting a write.
    if (response?.status == 204 || (response?.status == 200 && response?.data?.status == 204)) {
      return response;
    }
    if (response?.status != 200 || ((data.saveinDB || isStrings) && response?.data?.status != 200)) {
      console.error('Content update request failed', {apiEndpoint: data.apiEndpoint, stage,
        httpStatus: response?.status, contentStatus: response?.data?.status});
      errors.push(data);
      return null;
    }
    if (isStrings) {
      stage = 'persistence';
      yield call(remoteStrings.acceptResponse, language.locale, language.languageCode, response.data);
    } else if (data.saveinDB) {
      stage = 'persistence';
      // A dispatched/forked write does not finish before the success handler.
      // Await persistence before exposing the response or advancing its cursor.
      const saved = yield call(addApiDataInRealm, insertInDB(response, dispatch));
      if (saved !== 'successinsert') {
        console.error('Content update cache write failed', {apiEndpoint: data.apiEndpoint, stage});
        errors.push(data);
        return null;
      }
    }
    return response;
  } catch {
    console.error('Content update failed', {apiEndpoint: data.apiEndpoint, stage});
    errors.push(data);
    return null;
  }
}
function* onApiSuccess(response: any[], prevPage: string, dispatch: any, navigation: any, languageCode: string, activeChild: any, oldErrorObj: any, netInfoIsConnected: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any, errorArr: ApiJsonArray[], attempted: ApiJsonArray[]): any {

  try {
    const payload = { errorArr: errorArr, fromPage: prevPage, attempted }
    yield put(receiveAPIFailure(payload))
    yield call(updateIncrementalSyncDT, response, dispatch, navigation, languageCode, prevPage);
  } catch (error) {
    console.log('error1', error)
  }
  if (prevPage == 'Terms') {
    try {

      yield call(onOnLoadApiSuccess, response, dispatch, navigation, languageCode, prevPage);
    } catch (error) {
      console.log('error2', error)
    }
    //dispatch action for terms page

  } else if (prevPage == 'AddEditChild') {
    try {

      yield call(onAddEditChildSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error3', error)
    }
    //dispatch action for sponsor page

  }
  else if (prevPage == 'CountryLanguageSelection') {
    try {

      yield call(onSponsorApiSuccess, response, dispatch, navigation, languageCode, prevPage)
    } catch (error) {
      console.log('error4', error)
    }

  }
  else if (prevPage == '') {
    try {

      console.log('prevPage ********',prevPage)
      yield call(onCountryApiSuccess, response, dispatch, navigation, 'en', prevPage)
    } catch (error) {
      console.log('error5', error)
    }

  }
  else if (prevPage == 'ChildSetup') {
    try {

      yield call(onChildSetupApiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error6', error)
    }

  }
  else if (prevPage == 'Home' || prevPage == 'CountryLangChange' || prevPage == 'PeriodicSync' || prevPage == 'ImportScreen' || prevPage == 'DownloadUpdate' || prevPage == 'ForceUpdate' || prevPage == 'DownloadAllData') {
    try {

      yield call(onHomeapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload)
    } catch (error) {
      console.log('error7', error)
    }

  }
  else if (prevPage == 'Survey') {
    try {

      yield call(onHomeSurveyapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error8', error)
    }

  }
  else if (prevPage == 'VideoArticle' || prevPage == 'RelatedVideoArticle') {
    try {

      yield call(onHomeVideoartapiSuccess, response, dispatch, navigation, languageCode, prevPage, activeChild, oldErrorObj)
    } catch (error) {
      console.log('error9', error)
    }

  }
}

export function* onFetchAPI(value: any): any {
  const {payload, prevPage, dispatch, navigation, languageCode, activeChild, oldErrorObj,
    netInfoIsConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload} = value;
  const accepted: any[] = [];
  let pending: ApiJsonArray[] = withStringSync(payload, appConfig.apiConfig.strings, prevPage, downloadWeeklyData);
  if (prevPage === 'ForceUpdate') {
    const queued: ApiJsonArray[] = yield select(state => state.failedOnloadApiObjReducer?.errorObj || []);
    pending = withPendingForceUpdateRequests(pending, queued);
  }
  let coveredForceUpdateTime = forceupdatetime;
  const initialRecovery = prevPage === 'Home' && (yield select(state =>
    state.utilsData?.weeklyDownloadDate === 0 && state.utilsData?.monthlyDownloadDate === 0));
  const fullRefresh = ['DownloadAllData', 'DownloadUpdate', 'CountryLangChange'].includes(prevPage) || initialRecovery;
  if (netInfoIsConnected && fullRefresh && coveredForceUpdateTime == null) {
    try {
      const version = yield call(commonApiService, appConfig.apiConfig.checkUpdate, 'get', {});
      if (version?.status === 200 && version.data?.status === 200 && version.data.updated_at != null) {
        coveredForceUpdateTime = String(version.data.updated_at);
      }
    } catch { /* Content can still download if the version check is unavailable. */ }
  }
  const attempted = pending;
  let failed: ApiJsonArray[] = [];
  yield put(fetchAPIStart());
  do {
    // Offline onboarding continues using bundled data, without network timeouts or dialogs.
    if (netInfoIsConnected === false) { failed = pending; break; }
    failed = [];
    const batch: any[] = yield all(pending.map(request => call(apiCall, request, dispatch, failed)));
    accepted.push(...batch.filter(Boolean));
    if (!failed.length || !netInfoIsConnected || ['Survey', 'VideoArticle', 'RelatedVideoArticle'].includes(prevPage)) break;
    try {
      yield call(retryAlert);
    } catch {
      try { yield call(cancelRetryAlert); } catch { /* The system dismissed the fallback notice. */ }
      break;
    }
    pending = failed;
  } while (pending.length);

  yield call(onApiSuccess, accepted, prevPage, dispatch, navigation, languageCode, activeChild,
    oldErrorObj, netInfoIsConnected, coveredForceUpdateTime, downloadWeeklyData, downloadMonthlyData,
    enableImageDownload, failed, attempted);
  yield put(receiveAPISuccess(accepted));
}
export function* fetchAPISaga(): any {
  yield takeEvery(FETCH_API, onFetchAPI);
}
export default function* rootSaga(): any {
  yield all([fetchAPISaga(), InsertInDBSaga()]);
}


