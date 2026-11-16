import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {BackHandler} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {useLandscapeChart} from '../../customHooks/useLandscapeChart';
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) =>
    require('react').useEffect(callback, [callback]),
}));
jest.mock('react-native-orientation-locker', () => ({
  unlockAllOrientations: jest.fn(),
  lockToLandscape: jest.fn(),
  lockToPortrait: jest.fn(),
}));
let view: TestRenderer.ReactTestRenderer,
  state: ReturnType<typeof useLandscapeChart>;
const unsubscribe = jest.fn(),
  remove = jest.fn(),
  goBack = jest.fn();
const navigation = {
  goBack,
  addListener: jest.fn((_event: any, _callback: any) => unsubscribe),
};
function Screen() {
  state = useLandscapeChart(navigation);
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({remove});
});
afterEach(() => {
  if (view) act(() => view.unmount());
  jest.restoreAllMocks();
  jest.useRealTimers();
});
test('focused chart shows after its existing delay and releases native listeners on leaving', () => {
  act(() => {
    view = TestRenderer.create(<Screen />);
  });
  expect(Orientation.lockToLandscape).toHaveBeenCalledTimes(1);
  expect(state.isChartVisible).toBe(false);
  act(() => jest.advanceTimersByTime(2000));
  expect(state.isChartVisible).toBe(true);
  act(() => view.unmount());
  expect(remove).toHaveBeenCalledTimes(1);
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(Orientation.lockToPortrait).toHaveBeenCalled();
});
test('repeated close taps schedule one back navigation, and leaving cancels delayed work', () => {
  act(() => {
    view = TestRenderer.create(<Screen />);
  });
  act(() => {
    state.closeFullScreen();
    state.closeFullScreen();
    jest.advanceTimersByTime(200);
  });
  expect(goBack).toHaveBeenCalledTimes(1);
  act(() => state.closeFullScreen());
  act(() => {
    navigation.addListener.mock.calls[0][1]();
    view.unmount();
  });
  act(() => jest.runAllTimers());
  expect(goBack).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});
