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
  jest.mocked(commonApiService).mockResolvedValue(response as any);
  jest.mocked(addApiDataInRealm).mockResolvedValue('successinsert');
  jest.mocked(retryAlert).mockRejectedValue(new Error('Cancel retry'));
});

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
