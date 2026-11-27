import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useHomeUpdateCheck} from '../../customHooks/useHomeUpdateCheck';

jest.mock('../scheduleIdleTask', () => ({scheduleIdleTask: (callback: () => void) => {
  const id = setTimeout(callback, 0);
  return {cancel: () => clearTimeout(id)};
}}));
function Harness({check, focused = false, connected = true, enabled = true}: any) {
  useHomeUpdateCheck(check, focused, connected, enabled);
  return null;
}
let root: TestRenderer.ReactTestRenderer;
beforeEach(() => jest.useFakeTimers());
afterEach(() => {act(() => root?.unmount()); jest.useRealTimers();});
async function flush() {await act(async () => {jest.runOnlyPendingTimers();});}

test('a check skipped before Home gains focus runs once when Home becomes focused', async () => {
  const check = jest.fn().mockResolvedValue(undefined);
  act(() => {root = TestRenderer.create(<Harness check={check} />);});
  await flush();
  expect(check).not.toHaveBeenCalled();
  act(() => root.update(<Harness check={check} focused />));
  await flush();
  expect(check).toHaveBeenCalledTimes(1);
  act(() => root.update(<Harness check={check} focused />));
  await flush();
  expect(check).toHaveBeenCalledTimes(1);
});

test('a reconnect during an existing check is processed without overlapping checks', async () => {
  let finish!: () => void;
  const first = jest.fn(() => new Promise<void>(resolve => {finish = resolve;}));
  const reconnected = jest.fn().mockResolvedValue(undefined);
  act(() => {root = TestRenderer.create(<Harness check={first} focused connected={false} />);});
  await flush();
  act(() => root.update(<Harness check={reconnected} focused connected />));
  await flush();
  expect(reconnected).not.toHaveBeenCalled();
  await act(async () => {finish();});
  expect(reconnected).toHaveBeenCalledTimes(1);
});

test('blur cancels a scheduled check', async () => {
  const check = jest.fn().mockResolvedValue(undefined);
  act(() => {root = TestRenderer.create(<Harness check={check} focused />);});
  act(() => root.update(<Harness check={check} focused={false} />));
  await flush();
  expect(check).not.toHaveBeenCalled();
});
