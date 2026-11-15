import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {
  bandwidthClass,
  useNetworkClassification,
} from '../../customHooks/useNetworkClassification';
const mockTasks: {cancelled: boolean; run: () => void}[] = [];
jest.mock('../scheduleIdleTask', () => ({
  scheduleIdleTask: (callback: () => void) => {
    const task = {
      cancelled: false,
      run: () => {
        if (!task.cancelled) callback();
      },
    };
    mockTasks.push(task);
    return {
      cancel: () => {
        task.cancelled = true;
      },
    };
  },
}));
const update = jest.fn(),
  sync = jest.fn();
let renderer: TestRenderer.ReactTestRenderer;
function Harness({info}: {info: any}) {
  useNetworkClassification(info, update, sync);
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockTasks.length = 0;
  jest.clearAllMocks();
});
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
});
test.each(['android', 'ios'])(
  'existing bandwidth policy is preserved for %s',
  platform => {
    expect(bandwidthClass(platform, null, 'unknown')).toBeNull();
    expect(bandwidthClass(platform, false, 'wifi')).toBe('NoConnection');
    expect(bandwidthClass(platform, true, 'cellular', '2g')).toBe(
      'Lowbandwidth',
    );
    expect(bandwidthClass(platform, true, 'cellular', '3g')).toBe(
      'Lowbandwidth',
    );
    expect(bandwidthClass(platform, true, 'cellular', '4g')).toBe(
      'Highbandwidth',
    );
    expect(bandwidthClass(platform, true, 'cellular', '5g')).toBe(
      'Highbandwidth',
    );
    expect(bandwidthClass(platform, true, 'wifi')).toBe('Highbandwidth');
  },
);
test('platform-specific VPN policy and missing cellular details are preserved', () => {
  expect(bandwidthClass('android', true, 'vpn')).toBe('Lowbandwidth');
  expect(bandwidthClass('ios', true, 'vpn')).toBe('Highbandwidth');
  expect(bandwidthClass('android', true, 'cellular')).toBe('Highbandwidth');
});
test('changed connections cancel obsolete work; equal fresh snapshots do not reschedule', () => {
  act(() => {
    renderer = TestRenderer.create(
      <Harness info={{isConnected: true, netType: 'wifi'}} />,
    );
  });
  act(() =>
    renderer.update(<Harness info={{isConnected: true, netType: 'wifi'}} />),
  );
  expect(mockTasks).toHaveLength(1);
  act(() =>
    renderer.update(<Harness info={{isConnected: false, netType: 'wifi'}} />),
  );
  expect(mockTasks[0].cancelled).toBe(true);
  act(() => {
    mockTasks[0].run();
    mockTasks[1].run();
  });
  expect(sync).not.toHaveBeenCalled();
  expect(update).toHaveBeenCalledWith('NoConnection');
});
test('unmount cancels pending network synchronisation', () => {
  act(() => {
    renderer = TestRenderer.create(
      <Harness info={{isConnected: true, netType: 'wifi'}} />,
    );
  });
  act(() => renderer.unmount());
  act(() => mockTasks[0].run());
  expect(sync).not.toHaveBeenCalled();
});
