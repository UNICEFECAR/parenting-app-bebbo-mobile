import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Platform, StatusBar} from 'react-native';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

let mockInsets = {top: 24, bottom: 0, left: 0, right: 0};
let mockFocused = true;
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => {require('react').useState(null); return mockInsets;},
}));
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => {require('react').useState(null); return mockFocused;},
}));
let renderer: TestRenderer.ReactTestRenderer | undefined;
const originalOS = Platform.OS;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockInsets = {top: 24, bottom: 0, left: 0, right: 0}; mockFocused = true;
  Object.defineProperty(Platform, 'OS', {configurable: true, value: 'android'});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  if (renderer) act(() => renderer?.unmount()); renderer = undefined;
  Object.defineProperty(Platform, 'OS', {configurable: true, value: originalOS});
  jest.restoreAllMocks();
});
const render = () => <FocusAwareStatusBar backgroundColor="#fff" />;

test.each([[0, 24], [24, 0]])('inset changes %s → %s preserve React hook order', (before, after) => {
  mockInsets.bottom = before;
  act(() => {renderer = TestRenderer.create(render());});
  mockInsets = {...mockInsets, bottom: after};
  expect(() => act(() => renderer?.update(<FocusAwareStatusBar backgroundColor="#fafafa" />))).not.toThrow();
});

test.each(['android', 'ios'] as const)('an unfocused %s screen does not override the visible status bar', os => {
  Object.defineProperty(Platform, 'OS', {configurable: true, value: os});
  mockInsets = {...mockInsets, bottom: 24}; mockFocused = false;
  act(() => {renderer = TestRenderer.create(render());});
  expect(renderer?.root.findAllByType(StatusBar).length).toBe(0);
});
