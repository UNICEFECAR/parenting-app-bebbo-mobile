import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {BackHandler} from 'react-native';
import {useNavigationBackHandler} from '../../customHooks/useNavigationBackHandler';
let mockFocused = true;
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (effect: () => void) => require('react').useEffect(
    () => mockFocused ? effect() : undefined, [mockFocused, effect]),
}));
let view: TestRenderer.ReactTestRenderer;
const remove = jest.fn(),
  unsubscribe = jest.fn(),
  addListener = jest.fn(() => unsubscribe);
const navigation = {addListener};
let hardware: () => boolean;
function Screen({
  handler,
  nav = navigation,
}: {
  handler: () => boolean;
  nav?: typeof navigation;
}) {
  useNavigationBackHandler(nav, handler);
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockFocused = true;
  jest.clearAllMocks();
  jest
    .spyOn(BackHandler, 'addEventListener')
    .mockImplementation((_event, listener) => {
      hardware = listener as () => boolean;
      return {remove};
    });
});
afterEach(() => {
  if (view) act(() => view.unmount());
  jest.restoreAllMocks();
});
test('hardware and gesture callbacks use the current route without duplicate subscriptions', () => {
  const first = jest.fn(() => true),
    next = jest.fn(() => false);
  act(() => {
    view = TestRenderer.create(<Screen handler={first} />);
  });
  expect(hardware()).toBe(true);
  act(() => view.update(<Screen handler={next} />));
  expect(hardware()).toBe(false);
  const gesture = addListener.mock.calls[0] as any;
  expect(gesture[0]).toBe('gestureEnd');
  expect(gesture[1]()).toBe(false);
  expect(first).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(2);
  expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
});
test('navigation replacement and unmount remove exactly the registered listeners', () => {
  const otherCleanup = jest.fn(),
    other = {addListener: jest.fn(() => otherCleanup)};
  act(() => {
    view = TestRenderer.create(<Screen handler={() => true} />);
  });
  act(() => view.update(<Screen nav={other} handler={() => true} />));
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledTimes(1);
  act(() => view.unmount());
  expect(otherCleanup).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledTimes(2);
});

test('a blurred screen releases back handling and subscribes once when revisited', () => {
  const handler = jest.fn(() => true);
  act(() => {view = TestRenderer.create(<Screen handler={handler} />);});
  mockFocused = false;
  act(() => view.update(<Screen handler={handler} />));
  expect(remove).toHaveBeenCalledTimes(1);
  expect(unsubscribe).toHaveBeenCalledTimes(1);
  mockFocused = true;
  act(() => view.update(<Screen handler={handler} />));
  expect(BackHandler.addEventListener).toHaveBeenCalledTimes(2);
  expect(hardware()).toBe(true);
});
