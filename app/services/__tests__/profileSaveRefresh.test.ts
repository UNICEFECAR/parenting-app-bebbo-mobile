import {addChild, getAllChildren} from '../childCRUD';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';
import {dataRealmCommon} from '../../database/dbquery/dataRealmCommon';
import getAllDataToStore from '../../assets/translations/appOfflineData/getDataToStore';
import {returnToScreen} from '../../navigation/returnToScreen';

jest.mock('uuid', () => ({v4: () => 'new-id'}));
jest.mock('../../instances', () => ({appConfig: {}}));
jest.mock('../../../App', () => ({store: {getState: () => ({selectedCountry: {languageCode: 'en'}})}}));
jest.mock('../../assets/translations/appOfflineData/getDataToStore', () => ({__esModule: true, default: jest.fn()}));
jest.mock('../../database/dbquery/userRealmCommon', () => ({userRealmCommon: {getData: jest.fn(), getFilteredData: jest.fn(), updateChild: jest.fn()}}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {getFilteredData: jest.fn(), updateSettings: jest.fn()}}));
jest.mock('../../redux/reducers/childSlice', () => ({setActiveChildData: (payload: any) => ({type: 'active', payload}), setAllChildData: (payload: any) => ({type: 'list', payload})}));
jest.mock('../../redux/reducers/notificationSlice', () => ({setAllLocalNotificationGenerateType: (payload: any) => ({type: 'notifications', payload})}));
jest.mock('../../redux/reducers/utilsSlice', () => ({setInfoModalOpened: (payload: any) => ({type: 'modal', payload})}));
jest.mock('../../redux/reducers/variableSlice', () => ({}));
jest.mock('../../navigation/returnToScreen', () => ({returnToScreen: jest.fn()}));
jest.mock('../LocalNotifications', () => ({}));
jest.mock('../EventSyncService', () => ({logEvent: jest.fn().mockResolvedValue(undefined)}));
jest.mock('../firebaseAnalytics', () => ({setUserProperties: jest.fn()}));
jest.mock('../Utils', () => ({isPregnancy: () => false}));
jest.mock('../profileDeletion', () => ({}));

const child = {uuid: 'active', childName: 'Updated name', gender: 41, birthDate: '2024-11-12', createdAt: '2024-11-12', isPremature: 'false'};
const ages = [{id: 1, name: 'Child', days_from: 0, days_to: 10000}];
let actions: any[];
const dispatch = (action: any) => actions.push(action);
beforeEach(() => {
  jest.clearAllMocks(); actions = [];
  jest.mocked(userRealmCommon.getData).mockResolvedValue([{...child}] as any);
  jest.mocked(userRealmCommon.getFilteredData).mockResolvedValue([{...child}] as any);
  jest.mocked(userRealmCommon.updateChild).mockResolvedValue([{...child}] as any);
  jest.mocked(dataRealmCommon.getFilteredData).mockImplementation(async (_schema: any, query: any) =>
    [{value: query.includes('currentActiveChildId') ? 'active' : 'mother'}] as any);
  jest.mocked(getAllDataToStore).mockImplementation(() => new Promise(() => {}));
});

test('saved name and gender reach the list and active profile before navigation even when article loading is pending', async () => {
  jest.mocked(returnToScreen).mockImplementation(() => {
    expect(actions.find(action => action.type === 'active').payload).toMatchObject(child);
    expect(actions.find(action => action.type === 'list').payload[0]).toMatchObject(child);
  });
  await addChild('en', true, 2, [{...child}], dispatch, {}, ages);
  expect(returnToScreen).toHaveBeenCalledTimes(1);
});

test('a normal profile refresh publishes every child before waiting for article content', async () => {
  jest.mocked(userRealmCommon.getData).mockResolvedValue([{...child, uuid: 'sibling'}, {...child}] as any);
  let finish!: () => void;
  jest.mocked(getAllDataToStore).mockImplementation(() => new Promise(resolve => {finish = () => resolve('success');}));
  const refresh = getAllChildren(dispatch, ages, 0);
  for (let i = 0; i < 30; i++) await Promise.resolve();
  expect(actions.find(action => action.type === 'active').payload.uuid).toBe('active');
  expect(actions.find(action => action.type === 'list').payload).toHaveLength(2);
  finish();
  await refresh;
});

test('failed writes do not publish an edited profile or navigate away', async () => {
  const alert = jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});
  jest.mocked(userRealmCommon.updateChild).mockResolvedValue([] as any);
  await addChild('en', true, 2, [{...child}], dispatch, {}, ages);
  expect(actions).toEqual([]);
  expect(returnToScreen).not.toHaveBeenCalled();
  alert.mockRestore();
});
