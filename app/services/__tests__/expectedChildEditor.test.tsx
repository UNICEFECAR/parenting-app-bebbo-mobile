import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';
import EditChildProfile from '../../screens/home/EditChildProfile';
import ChildDate from '../../components/ChildDate';
import ToggleRadios from '../../components/ToggleRadios';
import {appTheme} from '../../instances/bebbo/styles/theme';

jest.mock('../../../App', () => ({useAppSelector: (select: any) => select({selectedCountry: {languageCode: 'en'}, utilsData: {taxonomyIds: {girlChildGender: 'girl'}}}), useAppDispatch: () => jest.fn()}));
jest.mock('../selectors', () => ({selectChildAge: () => [], selectChildList: () => [], selectChildGenders: () => [{id: 1, unique_name: 'girl'}, {id: 2, unique_name: 'boy'}]}));
jest.mock('../../instances', () => ({appConfig: {}, cameraProfileImage: 1}));
jest.mock('@react-navigation/native', () => ({useFocusEffect: (cb: any) => require('react').useEffect(cb, [cb])}));
jest.mock('../../navigation/returnToScreen', () => ({returnToScreen: jest.fn()}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: false}));
jest.mock('../Utils', () => ({validateForm: () => true}));
jest.mock('../childCRUD', () => ({addChild: jest.fn(), deleteChild: jest.fn(), getNewChild: jest.fn()}));
jest.mock('../MediaPicker', () => ({}));
jest.mock('../../downloadImages/ImageStorage', () => ({deleteImageFile: jest.fn()}));
jest.mock('../../redux/reducers/childSlice', () => ({setActiveChildData: jest.fn()}));
jest.mock('@dr.pogodin/react-native-fs', () => ({}));
jest.mock('@app-types/types', () => ({CHILDREN_PATH: '', dobMax: new Date(2100, 0, 1)}));
jest.mock('react-native-vector-image', () => () => null);
jest.mock('../../components/ChildDate', () => () => null);
jest.mock('../../components/ToggleRadios', () => () => null);
jest.mock('../../components/FocusAwareStatusBar', () => () => null);
jest.mock('../../components/OverlayLoadingComponent', () => () => null);
jest.mock('../../components/shared/AppActionSheet', () => () => null);
jest.mock('../../components/shared/TextInputML', () => require('react-native').TextInput);
jest.mock('../../components/shared/Icon', () => ({__esModule: true, default: () => null, IconML: () => null}));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => { if (renderer) act(() => renderer.unmount()); jest.useRealTimers(); });

test.each([24, 25, 26])('gender visibility on November %s follows the due date despite a saved expected flag', day => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, day));
  const child = {uuid: 'six', childName: 'six', gender: 0, birthDate: new Date(2026, 10, 25, 18).toISOString(), isExpected: 'true', isPremature: 'false'};
  act(() => { renderer = TestRenderer.create(<ThemeProvider theme={appTheme}><EditChildProfile route={{params: {childData: child}}} navigation={{goBack: jest.fn()} as any} /></ThemeProvider>); });
  expect(renderer.root.findAllByType(ToggleRadios)).toHaveLength(day < 25 ? 0 : 1);
  // Changing the due date in the editor also updates gender visibility immediately.
  act(() => { renderer.root.findByType(ChildDate).props.sendData({...child, birthDate: new Date(2026, 11, 1)}); });
  expect(renderer.root.findAllByType(ToggleRadios)).toHaveLength(0);
});
