import {onCountryApiSuccess} from '../commonApiService';
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
import {setCountriesStore} from '../../redux/reducers/localizationSlice';

jest.mock('@assets/translations/appOfflineData/getDataToStore', () => ({__esModule: true, default: jest.fn(), getAllDataOnRetryToStore: jest.fn()}));
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@d11/react-native-fast-image', () => ({}));
jest.mock('../../../App', () => ({store: {getState: jest.fn()}}));
jest.mock('../../instances', () => ({appConfig: {apiConfig: {countryGroups: 'country_groups'}}}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {}}));
jest.mock('../../database/dbquery/userRealmCommon', () => ({userRealmCommon: {}}));
jest.mock('../axiosService', () => ({}));
jest.mock('../LocalNotifications', () => ({}));
jest.mock('../childCRUD', () => ({}));
jest.mock('../../redux/reducers/articlesSlice', () => ({}));
jest.mock('../../redux/reducers/childSlice', () => ({}));
jest.mock('../../redux/reducers/notificationSlice', () => ({}));
jest.mock('../../redux/reducers/utilsSlice', () => ({setuserIsFirstTime: (payload: any) => ({type: 'firstTime', payload})}));
jest.mock('../../redux/reducers/localizationSlice', () => ({setCountriesStore: (payload: any) => ({type: 'countries', payload})}));
const countries = [{CountryID: 42, languages: [{languageCode: 'en'}]}];
const successful = {apiEndpoint: 'country_groups', status: 200, data: {status: 200, data: countries}};
let dispatch: jest.Mock;
beforeEach(() => {jest.clearAllMocks(); dispatch = jest.fn();});

test.each([[], [{apiEndpoint: 'taxonomies', status: 200}], [{...successful, data: {status: 503}}]].map(responses => ({responses})))(
  'startup without a country response still loads cached or bundled countries (%j)', async ({responses}) => {
    await onCountryApiSuccess(responses, dispatch, null, 'en', '');
    expect(getAllDataToStore).toHaveBeenCalledWith('en', dispatch, '');
    expect(dispatch).not.toHaveBeenCalledWith(setCountriesStore(countries));
  },
);

test('a country response is found regardless of response ordering', async () => {
  await onCountryApiSuccess([{apiEndpoint: 'taxonomies', status: 200}, successful], dispatch, null, 'en', '');
  expect(dispatch).toHaveBeenCalledWith(setCountriesStore(countries));
  expect(getAllDataToStore).toHaveBeenCalledWith('en', dispatch, '');
});
