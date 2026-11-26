import React from 'react';
import {act, create} from 'react-test-renderer';
import {
  BaseNavigationContainer, createNavigationContainerRef, createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/core';
import {DefaultTheme} from '@react-navigation/native';
import {StackActions, StackRouter} from '@react-navigation/routers';
import {useLoadingNavigation} from '../../customHooks/useLoadingNavigation';
import {BackHandler} from 'react-native';
import {onOnLoadApiSuccess, onSponsorApiSuccess} from '../commonApiService';
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';

jest.mock('@assets/translations/appOfflineData/getDataToStore', () => ({__esModule: true, default: jest.fn(), getAllDataOnRetryToStore: jest.fn()}));
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@d11/react-native-fast-image', () => ({}));
jest.mock('../../../App', () => ({store: {getState: jest.fn()}}));
jest.mock('../../instances', () => ({appConfig: {apiConfig: {}}}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {}}));
jest.mock('../../database/dbquery/userRealmCommon', () => ({userRealmCommon: {getData: jest.fn()}}));
jest.mock('../axiosService', () => ({}));
jest.mock('../LocalNotifications', () => ({}));
jest.mock('../childCRUD', () => ({}));
jest.mock('../../redux/reducers/articlesSlice', () => ({}));
jest.mock('../../redux/reducers/childSlice', () => ({}));
jest.mock('../../redux/reducers/notificationSlice', () => ({}));
jest.mock('../../redux/reducers/utilsSlice', () => ({}));
jest.mock('../../redux/reducers/localizationSlice', () => ({}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function Navigator(props: any) {
  const {state, descriptors, NavigationContent} = useNavigationBuilder(StackRouter, props);
  return <NavigationContent>{state.routes.map(route =>
    <React.Fragment key={route.key}>{descriptors[route.key].render()}</React.Fragment>,
  )}</NavigationContent>;
}
const Stack = createNavigatorFactory(Navigator)();
const Screen = () => null;
let completionNavigation: any;
function Loading({navigation: screenNavigation}: any) {
  completionNavigation = useLoadingNavigation(screenNavigation);
  return null;
}
let hardwareHandlers: (() => boolean | null | undefined)[];
function pressHardwareBack() {
  for (const handler of [...hardwareHandlers].reverse()) {
    if (handler()) return;
  }
}
let view: ReturnType<typeof create>;
const navigation = createNavigationContainerRef<any>();
beforeEach(() => {
  jest.clearAllMocks();
  hardwareHandlers = [];
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_event, handler) => {
    const onBack = handler as () => boolean;
    hardwareHandlers.push(onBack);
    return {remove: () => {hardwareHandlers = hardwareHandlers.filter(item => item !== onBack);}};
  });
  act(() => {
    view = create(<BaseNavigationContainer ref={navigation} theme={DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Terms" component={Screen} />
        <Stack.Screen name="LoadingScreen" component={Loading} />
        <Stack.Screen name="ChildSetup" component={Screen} />
        <Stack.Screen name="ChildSetupList" component={Screen} />
      </Stack.Navigator>
    </BaseNavigationContainer>);
  });
  act(() => navigation.navigate('LoadingScreen'));
});
afterEach(() => {act(() => view.unmount()); jest.restoreAllMocks();});

test.each([
  {children: [], destination: 'ChildSetup'},
  {children: [{uuid: 'existing-child'}], destination: 'ChildSetupList'},
])('Back during processing and immediately after completion cannot reopen a finished loader: $destination', async ({children, destination}) => {
  let finish!: (value: string) => void;
  jest.mocked(getAllDataToStore).mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
  jest.mocked(userRealmCommon.getData).mockResolvedValueOnce(children as any);
  const operation = onOnLoadApiSuccess([], jest.fn(), completionNavigation, 'en', 'Terms');
  act(() => {pressHardwareBack(); pressHardwareBack(); navigation.goBack();});
  expect(navigation.getCurrentRoute()?.name).toBe('LoadingScreen');
  await act(async () => {finish('success'); await operation;});
  expect(navigation.getCurrentRoute()?.name).toBe(destination);
  expect(navigation.getRootState()!.routes.some(route => route.name === 'LoadingScreen')).toBe(false);
  act(() => navigation.goBack());
  expect(navigation.getCurrentRoute()?.name).toBe('Terms');
});

test('the initial language download also removes its completed loader before showing Terms', async () => {
  act(() => completionNavigation.reset({index: 0, routes: [{name: 'LoadingScreen'}]}));
  jest.mocked(getAllDataToStore).mockResolvedValueOnce('success');
  await act(async () => {
    await onSponsorApiSuccess([], jest.fn(), completionNavigation, 'en', 'CountryLanguageSelection');
  });
  expect(navigation.getRootState()!.routes.map(route => route.name)).toEqual(['Terms']);
});

test.each([{type: 'GO_BACK'}, StackActions.pop(), StackActions.popToTop()])(
  'loading ignores repeated back actions: %j', action => {
    const key = navigation.getCurrentRoute()?.key;
    act(() => {navigation.dispatch(action); navigation.dispatch(action);});
    expect(navigation.getCurrentRoute()?.key).toBe(key);
    act(() => completionNavigation.replace('ChildSetup'));
    expect(navigation.getCurrentRoute()?.name).toBe('ChildSetup');
  },
);

test('completion can reset the stack after back was blocked', () => {
  act(() => navigation.goBack());
  act(() => completionNavigation.reset({index: 0, routes: [{name: 'ChildSetup'}]}));
  expect(navigation.getRootState()!.routes.map(route => route.name)).toEqual(['ChildSetup']);
});

test('completion can return to an existing destination without leaving a back guard behind', () => {
  act(() => navigation.goBack());
  act(() => completionNavigation.dispatch(StackActions.popTo('Terms')));
  expect(navigation.getCurrentRoute()?.name).toBe('Terms');
  act(() => navigation.navigate('ChildSetup'));
  act(() => navigation.goBack());
  expect(navigation.getCurrentRoute()?.name).toBe('Terms');
});


test('hardware Back keeps processing active; only its completion navigation unlocks the loader', async () => {
  let finish!: (value: string) => void;
  jest.mocked(getAllDataToStore).mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
  jest.mocked(userRealmCommon.getData).mockResolvedValueOnce([] as any);
  const operation = onOnLoadApiSuccess([], jest.fn(), completionNavigation, 'en', 'Terms');
  act(() => {
    pressHardwareBack();
    navigation.dispatch(StackActions.popTo('Terms'));
    navigation.reset({index: 0, routes: [{name: 'Terms'}]});
  });
  expect(navigation.getCurrentRoute()?.name).toBe('LoadingScreen');
  expect(getAllDataToStore).toHaveBeenCalledTimes(1);
  await act(async () => {finish('success'); await operation;});
  expect(navigation.getCurrentRoute()?.name).toBe('ChildSetup');
  expect(getAllDataToStore).toHaveBeenCalledTimes(1);
  expect(hardwareHandlers).toHaveLength(0);
});
