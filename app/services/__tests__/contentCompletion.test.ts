import {store} from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onHomeapiSuccess, updateIncrementalSyncDT} from '../commonApiService';

jest.mock('@assets/translations/appOfflineData/getDataToStore', () => ({__esModule: true, default: jest.fn(), getAllDataOnRetryToStore: jest.fn()}));
jest.mock('@react-native-async-storage/async-storage', () => ({setItem: jest.fn()}));
jest.mock('@d11/react-native-fast-image', () => ({}));
jest.mock('../../../App', () => ({store: {getState: jest.fn()}}));
jest.mock('../../instances', () => ({appConfig: {apiConfig: {
  checkUpdate: 'check-update', articles: 'articles', activities: 'activities',
  videoArticles: 'video-articles', faqs: 'faqs', archive: 'archive',
}}}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {}}));
jest.mock('../../database/dbquery/userRealmCommon', () => ({userRealmCommon: {}}));
jest.mock('../axiosService', () => ({}));
jest.mock('../LocalNotifications', () => ({cancelAllReminderLocalNotification: jest.fn()}));
jest.mock('../childCRUD', () => ({}));
jest.mock('../../redux/reducers/articlesSlice', () => ({}));
jest.mock('../../redux/reducers/childSlice', () => ({
  setDownloadedBufferAgeBracket: (payload: any) => ({type: 'bufferCoverage', payload}),
}));
jest.mock('../../redux/reducers/notificationSlice', () => ({
  setAllNotificationData: (payload: any) => ({type: 'notifications', payload}),
  setAllLocalNotificationGenerateType: (payload: any) => ({type: 'notificationGeneration', payload}),
}));
jest.mock('../../redux/reducers/utilsSlice', () => ({
  setIncrementalSyncDT: (payload: any) => ({type: 'cursor', payload}),
  setSyncDate: (payload: any) => ({type: 'syncDate', payload}),
  setInfoModalOpened: (payload: any) => ({type: 'modal', payload}),
}));
jest.mock('../../redux/reducers/localizationSlice', () => ({}));

let dispatch: jest.Mock;
const failed = {apiEndpoint: 'archive'};
beforeEach(() => {
  jest.clearAllMocks();
  dispatch = jest.fn();
  (store.getState as jest.Mock).mockReturnValue({
    failedOnloadApiObjReducer: {errorObj: [failed]},
    utilsData: {taxonomy: {allTaxonomyData: ''}},
  });
});
function finish(prevPage: string) {
  return onHomeapiSuccess([], dispatch, {reset: jest.fn()}, 'en', prevPage, {}, [], 'new-version', true, true, false);
}

test.each([undefined, null, ''])('no-change responses without a cursor (%s) preserve saved cursors', async datetime => {
  const responses = ['articles', 'activities', 'video-articles', 'faqs', 'archive'].map(apiEndpoint => ({
    apiEndpoint, status: 200, data: {status: 204, datetime},
  }));
  await updateIncrementalSyncDT(responses, dispatch, null, 'en', 'DownloadUpdate');
  expect(dispatch).not.toHaveBeenCalled();
});

test('no-change responses can advance a valid server cursor', async () => {
  await updateIncrementalSyncDT([{apiEndpoint: 'activities', status: 200,
    data: {status: 204, datetime: '2026-11-24 12:00:00'}}], dispatch, null, 'en', 'DownloadUpdate');
  expect(dispatch).toHaveBeenCalledWith({type: 'cursor', payload: {
    key: 'activitiesDatetime', value: '2026-11-24 12:00:00',
  }});
});

test.each(['DownloadUpdate', 'ForceUpdate', 'PeriodicSync'])(
  'cancelled %s retains the previous completion dates and force-update version', async prevPage => {
    await finish(prevPage);
    expect(dispatch.mock.calls.filter(([action]) => action.type === 'syncDate')).toEqual([]);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  },
);

test.each(['ForceUpdate', 'PeriodicSync'])(
  'completed %s advances both download dates', async prevPage => {
    (store.getState as jest.Mock).mockReturnValue({
      failedOnloadApiObjReducer: {errorObj: []}, utilsData: {taxonomy: {allTaxonomyData: ''}},
    });
    await finish(prevPage);
    expect(dispatch.mock.calls.filter(([action]) => action.type === 'syncDate').map(([action]) => action.payload.key))
      .toEqual(['weeklyDownloadDate', 'monthlyDownloadDate']);
    if (prevPage === 'ForceUpdate') expect(AsyncStorage.setItem).toHaveBeenCalledWith('forceUpdateTime', 'new-version');
  },
);

test.each([true, false])('offline onboarding recovery initializes dates only when complete (%s)', async complete => {
  (store.getState as jest.Mock).mockReturnValue({
    failedOnloadApiObjReducer: {errorObj: complete ? [] : [failed]},
    utilsData: {weeklyDownloadDate: 0, monthlyDownloadDate: 0, taxonomy: {allTaxonomyData: ''}},
  });
  await finish('Home');
  expect(dispatch.mock.calls.filter(([action]) => action.type === 'syncDate').length).toBe(complete ? 2 : 0);
});

test('ordinary pending recovery preserves existing weekly/monthly dates', async () => {
  (store.getState as jest.Mock).mockReturnValue({
    failedOnloadApiObjReducer: {errorObj: []},
    utilsData: {weeklyDownloadDate: 123, monthlyDownloadDate: 123, taxonomy: {allTaxonomyData: ''}},
  });
  await finish('Home');
  expect(dispatch.mock.calls.filter(([action]) => action.type === 'syncDate')).toEqual([]);
});


test.each(['Home', 'DownloadAllData', 'ForceUpdate', 'PeriodicSync'])(
  '%s records downloaded article ages so buffer sync does not prompt again', async prevPage => {
    (store.getState as jest.Mock).mockReturnValue({
      failedOnloadApiObjReducer: {errorObj: []},
      utilsData: {weeklyDownloadDate: 123, monthlyDownloadDate: 123,
        taxonomy: {allTaxonomyData: JSON.stringify({child_age: [{id: 50}, {id: 51}, {id: 52}]})}},
      childData: {childDataSet: {bufferAgeBracket: [49]}},
    });
    await onHomeapiSuccess([{apiEndpoint: 'articles', status: 200, data: {status: 200}}],
      dispatch, {reset: jest.fn()}, 'en', prevPage, {},
      [{apiEndpoint: 'articles', postdata: {childAge: 'all'}}], undefined, false, false, false);
    expect(dispatch).toHaveBeenCalledWith({type: 'bufferCoverage', payload: [49, 50, 51, 52]});
  },
);

test('failed articles never mark buffer ages as downloaded', async () => {
  (store.getState as jest.Mock).mockReturnValue({
    failedOnloadApiObjReducer: {errorObj: [{apiEndpoint: 'articles'}]},
    utilsData: {taxonomy: {allTaxonomyData: JSON.stringify({child_age: [{id: 51}]})}},
  });
  await onHomeapiSuccess([], dispatch, {reset: jest.fn()}, 'en', 'Home', {},
    [{apiEndpoint: 'articles', postdata: {childAge: 'all'}}], '123', false, false, false);
  expect(dispatch.mock.calls.some(([action]) => action.type === 'bufferCoverage')).toBe(false);
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

test.each(['Home', 'DownloadAllData', 'DownloadUpdate'])(
  'completed %s acknowledges the force-update version covered by the download', async prevPage => {
    (store.getState as jest.Mock).mockReturnValue({
      failedOnloadApiObjReducer: {errorObj: []},
      utilsData: {taxonomy: {allTaxonomyData: ''}},
    });
    await onHomeapiSuccess([], dispatch, {reset: jest.fn()}, 'en', prevPage, {}, [], '123', false, false, false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('forceUpdateTime', '123');
  },
);
