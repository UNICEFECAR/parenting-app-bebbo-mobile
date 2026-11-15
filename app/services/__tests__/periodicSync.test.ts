import {useAllPeriodicSyncData as getPeriodicSyncData} from '../periodicSync';
let mockSync: any;
jest.mock('../../../App', () => ({useAppSelector: (select: any) => select({
  utilsData: {incrementalSyncDT: mockSync, userIsOnboarded: false}, childData: {childDataSet: {}},
})}));
jest.mock('../selectors', () => ({selectChildList: () => [], selectChildAge: () => []}));
jest.mock('../../instances', () => ({appConfig: {apiConfig: {}}}));
test.each([null, undefined, {}])('sync planning tolerates absent timestamps during hydration: %s', value => {
  mockSync = value;
  expect(getPeriodicSyncData().apiJsonData).toEqual([]);
});
