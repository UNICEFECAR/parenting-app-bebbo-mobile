import {remoteStrings} from '../../localization/stringResources';
import {runSaga} from 'redux-saga';
import {onFetchAPI} from '../../redux/sagaMiddleware/saga';
import commonApiService, {onHomeapiSuccess, onHomeSurveyapiSuccess, onSponsorApiSuccess, onOnLoadApiSuccess, onChildSetupApiSuccess, retryAlert, updateIncrementalSyncDT} from '../commonApiService';
import {addApiDataInRealm} from '../Utils';

jest.mock('../../instances', () => ({appConfig: {apiConfig: {strings: 'strings', checkUpdate: 'check-update'}}}));
jest.mock('../../localization/stringResources', () => ({remoteStrings: {acceptResponse: jest.fn()}}));

jest.mock('../commonApiService', () => ({
  __esModule: true, default: jest.fn(),
  updateIncrementalSyncDT: jest.fn(), onHomeapiSuccess: jest.fn(), onHomeSurveyapiSuccess: jest.fn(),
  retryAlert: jest.fn(), cancelRetryAlert: jest.fn(),
  onSponsorApiSuccess: jest.fn(), onOnLoadApiSuccess: jest.fn(), onChildSetupApiSuccess: jest.fn(),
}));
jest.mock('../Utils', () => ({addApiDataInRealm: jest.fn()}));
jest.mock('../../redux/sagaMiddleware/sagaSlice', () => ({
  fetchAPIStart: () => ({type: 'start'}),
  receiveAPIFailure: (payload: any) => ({type: 'failure', payload}),
  receiveAPISuccess: (payload: any) => ({type: 'success', payload}),
}));
const request = {apiEndpoint: 'articles', method: 'get', postdata: {}, saveinDB: true};
const response = {apiEndpoint: 'articles', status: 200, data: {status: 200, datetime: 'new-cursor', data: [{id: 1}]}};
let actions: any[];
function start(options: any = {}) {
  return runSaga({getState: () => ({selectedCountry: {locale: 'ALsq', languageCode: 'al-sq'}, failedOnloadApiObjReducer: {errorObj: options.queued || []}}), dispatch: action => {actions.push(action);}}, onFetchAPI, {
    payload: [request], prevPage: 'ImportScreen', dispatch: jest.fn(), netInfoIsConnected: true, ...options,
  });
}
async function settle() {for (let i=0;i<20;i++) await Promise.resolve();}
beforeEach(() => {
  jest.clearAllMocks(); actions = [];
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
  jest.mocked(commonApiService).mockResolvedValue(response as any);
  jest.mocked(addApiDataInRealm).mockResolvedValue('successinsert');
  jest.mocked(retryAlert).mockRejectedValue(new Error('Cancel retry'));
});
afterEach(() => jest.restoreAllMocks());

test('success handlers and delta cursors wait for the actual content transaction', async () => {
  let finish!: (value: string) => void;
  jest.mocked(addApiDataInRealm).mockReturnValue(new Promise(resolve => {finish = resolve;}));
  const task = start(); await settle();
  expect(addApiDataInRealm).toHaveBeenCalledTimes(1);
  expect(onHomeapiSuccess).not.toHaveBeenCalled();
  expect(updateIncrementalSyncDT).not.toHaveBeenCalled();
  finish('successinsert'); await task.toPromise();
  expect(updateIncrementalSyncDT).toHaveBeenCalledWith([response], expect.anything(), undefined, undefined, 'ImportScreen');
  expect(onHomeapiSuccess).toHaveBeenCalledTimes(1);
});

test('failed persistence is retriable and cannot advance a cursor past missing offline content', async () => {
  jest.mocked(addApiDataInRealm).mockResolvedValue('');
  await start().toPromise();
  expect(retryAlert).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith('Content update cache write failed', {apiEndpoint: 'articles', stage: 'persistence'});
  expect(actions.find(action => action.type === 'success')?.payload).toEqual([]);
  for (const call of jest.mocked(updateIncrementalSyncDT).mock.calls) {
    expect(call[0]).not.toContain(response);
  }
  expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([request]);
});

test.each([503, 401])('HTTP %s failures do not enter the content cache', async status => {
  jest.mocked(commonApiService).mockResolvedValue({...response, status} as any);
  await start().toPromise();
  expect(addApiDataInRealm).not.toHaveBeenCalled();
  expect(retryAlert).toHaveBeenCalledTimes(1);
});

test('an application-level content error is handled even when HTTP status is 200', async () => {
  jest.mocked(commonApiService).mockResolvedValue({...response, data: {status: 500}} as any);
  await start().toPromise();
  expect(addApiDataInRealm).not.toHaveBeenCalled();
  expect(retryAlert).toHaveBeenCalledTimes(1);
});

test.each(['activities', 'faqs', 'video-articles', 'archive'])(
  '%s with no incremental changes completes without a cache write or retry', async apiEndpoint => {
    const unchanged = {apiEndpoint, status: 200, data: {status: 204}};
    jest.mocked(commonApiService).mockResolvedValue(unchanged as any);
    await start({payload: [{...request, apiEndpoint}], prevPage: 'ImportScreen'}).toPromise();
    expect(addApiDataInRealm).not.toHaveBeenCalled();
    expect(retryAlert).not.toHaveBeenCalled();
    expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([]);
    expect(actions.find(action => action.type === 'success').payload).toEqual([unchanged]);
    expect(onHomeapiSuccess).toHaveBeenCalledTimes(1);
  },
);

test('HTTP 204 completes without trying to persist an absent body', async () => {
  jest.mocked(commonApiService).mockResolvedValue({apiEndpoint: 'articles', status: 204} as any);
  await start().toPromise();
  expect(addApiDataInRealm).not.toHaveBeenCalled();
  expect(retryAlert).not.toHaveBeenCalled();
  expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([]);
});

test('non-persisted survey responses keep their existing success path', async () => {
  await start({payload: [{...request, saveinDB: false}], prevPage: 'Survey'}).toPromise();
  expect(addApiDataInRealm).not.toHaveBeenCalled();
  expect(onHomeSurveyapiSuccess).toHaveBeenCalledTimes(1);
  expect(actions.some(action => action.type === 'success')).toBe(true);
});

test('overlapping downloads retain separate failure lists', async () => {
  let cancel!: (error: Error) => void;
  jest.mocked(commonApiService).mockResolvedValueOnce({...response, status: 503} as any);
  jest.mocked(retryAlert).mockImplementationOnce(() => new Promise((_resolve, reject) => {cancel = reject;}));
  const failed = start(); await settle();
  await start().toPromise();
  cancel(new Error('Cancel first request')); await failed.toPromise();
  const failures = actions.filter(action => action.type === 'failure');
  expect(failures[failures.length-1].payload.errorArr).toEqual([request]);
});


test('cancelling a failed startup batch completes the navigator readiness signal', async () => {
  jest.mocked(commonApiService).mockResolvedValue({...response, status: 503} as any);
  await start({prevPage: ''}).toPromise();
  expect(actions.find(action => action.type === 'success')?.payload).toEqual([]);
  expect(updateIncrementalSyncDT).toHaveBeenCalledWith([], expect.anything(), undefined, undefined, '');
});

test('cancellation passes only accepted responses to cache consumers and cursors', async () => {
  jest.mocked(commonApiService)
    .mockResolvedValueOnce(response as any)
    .mockResolvedValueOnce({...response, apiEndpoint: 'taxonomies', status: 503} as any);
  await start({payload: [request, {...request, apiEndpoint: 'taxonomies'}]}).toPromise();
  expect(actions.find(action => action.type === 'success')?.payload).toEqual([response]);
  expect(updateIncrementalSyncDT).toHaveBeenCalledWith([response], expect.anything(), undefined, undefined, 'ImportScreen');
});

test('retry keeps accepted responses and reissues only the failed request, including its parameters', async () => {
  const second = {...request, postdata:{page:2}};
  const secondResponse = {...response, data:{...response.data, datetime:'second-page'}};
  jest.mocked(commonApiService).mockResolvedValueOnce(response as any)
    .mockResolvedValueOnce({...response,status:503} as any).mockResolvedValueOnce(secondResponse as any);
  jest.mocked(retryAlert).mockResolvedValueOnce('Retry');
  await start({payload:[request,second]}).toPromise();
  expect(jest.mocked(commonApiService).mock.calls.map(call => call[2])).toEqual([{}, {page:2}, {page:2}]);
  expect(actions.filter(action => action.type === 'success')).toEqual([{type:'success',payload:[response,secondResponse]}]);
  expect(onHomeapiSuccess).toHaveBeenCalledTimes(1);
});

test.each([
  ['CountryLanguageSelection', false], ['CountryLangChange', false],
  ['ForceUpdate', false], ['DownloadUpdate', false], ['DownloadAllData', false], ['Home', false], ['PeriodicSync', true],
])('strings use the shared API and persistence path during %s', async (prevPage, downloadWeeklyData) => {
  const stringsResponse = {apiEndpoint: 'strings', status: 200, data: {status: 200, langcode: 'al-sq', data: []}};
  jest.mocked(commonApiService).mockImplementation(async (endpoint: any) => endpoint === 'strings' ? stringsResponse : response as any);
  await start({prevPage, downloadWeeklyData}).toPromise();
  expect(commonApiService).toHaveBeenCalledWith('strings', 'get', {});
  expect(remoteStrings.acceptResponse).toHaveBeenCalledWith('ALsq', 'al-sq', stringsResponse.data);
  expect(addApiDataInRealm).toHaveBeenCalledTimes(1);
  expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([]);
});

test('loader waits for strings to be saved before reporting completion', async () => {
  let save!: () => void;
  jest.mocked(remoteStrings.acceptResponse).mockImplementationOnce(() => new Promise(resolve => {save = resolve;}));
  jest.mocked(commonApiService).mockResolvedValue({apiEndpoint: 'strings', status: 200, data: {status: 200}} as any);
  const task = start({payload: [], prevPage: 'ForceUpdate'});
  await settle();
  expect(actions.some(action => action.type === 'success')).toBe(false);
  save();
  await task.toPromise();
  expect(actions.some(action => action.type === 'success')).toBe(true);
});

test('failed strings persistence participates in the existing retry and fallback flow', async () => {
  jest.mocked(commonApiService).mockResolvedValue({apiEndpoint: 'strings', status: 200, data: {status: 200}} as any);
  jest.mocked(remoteStrings.acceptResponse).mockRejectedValueOnce(new Error('Cannot save strings'));
  await start({payload: [], prevPage: 'ForceUpdate'}).toPromise();
  expect(retryAlert).toHaveBeenCalledTimes(1);
  expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([
    {apiEndpoint: 'strings', method: 'get', postdata: {}, saveinDB: false},
  ]);
  expect(addApiDataInRealm).not.toHaveBeenCalled();
});

test.each(['CountryLanguageSelection', 'Terms', 'ChildSetup'])(
  'offline %s queues its requests and continues without network calls or retry dialogs', async prevPage => {
    await start({prevPage, netInfoIsConnected: false}).toPromise();
    expect(commonApiService).not.toHaveBeenCalled();
    expect(retryAlert).not.toHaveBeenCalled();
    expect(addApiDataInRealm).not.toHaveBeenCalled();
    const queued = actions.find(action => action.type === 'failure').payload;
    expect(queued.errorArr).toContainEqual(request);
    expect(queued.attempted).toEqual(queued.errorArr);
    if (prevPage === 'CountryLanguageSelection') {
      expect(queued.errorArr).toContainEqual({apiEndpoint: 'strings', method: 'get', postdata: {}, saveinDB: false});
    }
    expect(actions.find(action => action.type === 'success').payload).toEqual([]);
    const continuation = {CountryLanguageSelection: onSponsorApiSuccess, Terms: onOnLoadApiSuccess, ChildSetup: onChildSetupApiSuccess}[prevPage];
    expect(continuation).toHaveBeenCalledTimes(1);
  },
);

test.each(['Survey', 'VideoArticle', 'RelatedVideoArticle'])(
  '%s failures cannot open retry dialogs alongside a Home update prompt', async prevPage => {
    jest.mocked(commonApiService).mockResolvedValue({...response, status: 503} as any);
    await start({prevPage}).toPromise();
    expect(retryAlert).not.toHaveBeenCalled();
    expect(actions.find(action => action.type === 'failure').payload.errorArr).toEqual([request]);
  },
);


test('full download captures the CMS version before content requests and passes it to completion', async () => {
  jest.mocked(commonApiService).mockImplementation(async (endpoint: any) => {
    if (endpoint === 'check-update') return {status: 200, data: {status: 200, updated_at: '123'}} as any;
    if (endpoint === 'strings') return {status: 200, data: {status: 200, data: []}} as any;
    return response as any;
  });
  await start({prevPage: 'DownloadAllData'}).toPromise();
  expect(jest.mocked(commonApiService).mock.calls[0]).toEqual(['check-update', 'get', {}]);
  expect(jest.mocked(onHomeapiSuccess).mock.calls[0][7]).toBe('123');
});


test('force update includes pending full onboarding requests alongside incremental updates', async () => {
  const fullGames = {...request, apiEndpoint: 'activities'};
  const deltaGames = {...fullGames, postdata: {datetime: 'previous-download'}};
  await start({prevPage: 'ForceUpdate', payload: [deltaGames], queued: [fullGames, fullGames]}).toPromise();
  const gamesCalls = jest.mocked(commonApiService).mock.calls.filter(([endpoint]) => endpoint === 'activities');
  expect(gamesCalls.map(call => call[2])).toEqual([{datetime: 'previous-download'}, {}]);
  const completion = actions.find(action => action.type === 'failure').payload;
  expect(completion.errorArr).toEqual([]);
  expect(completion.attempted).toContainEqual(fullGames);
});
