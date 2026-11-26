import {runSaga} from 'redux-saga';
import {onFetchAPI} from '../../redux/sagaMiddleware/saga';
import commonApiService, {onHomeapiSuccess, onHomeSurveyapiSuccess, retryAlert, updateIncrementalSyncDT} from '../commonApiService';
import {addApiDataInRealm} from '../Utils';

jest.mock('../commonApiService', () => ({
  __esModule: true, default: jest.fn(),
  updateIncrementalSyncDT: jest.fn(), onHomeapiSuccess: jest.fn(), onHomeSurveyapiSuccess: jest.fn(),
  retryAlert: jest.fn(), cancelRetryAlert: jest.fn(),
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
  return runSaga({dispatch: action => {actions.push(action);}}, onFetchAPI, {
    payload: [request], prevPage: 'Home', dispatch: jest.fn(), netInfoIsConnected: true, ...options,
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
  expect(updateIncrementalSyncDT).toHaveBeenCalledWith([response], expect.anything(), undefined, undefined, 'Home');
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
    await start({payload: [{...request, apiEndpoint}], prevPage: 'DownloadUpdate'}).toPromise();
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
  expect(updateIncrementalSyncDT).toHaveBeenCalledWith([response], expect.anything(), undefined, undefined, 'Home');
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
