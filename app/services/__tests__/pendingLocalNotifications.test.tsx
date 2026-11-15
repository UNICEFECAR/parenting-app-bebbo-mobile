import React, {useState} from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {usePendingLocalNotifications} from '../../customHooks/usePendingLocalNotifications';
const mockTasks: {run: () => void; cancelled: boolean}[] = [];
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
jest.mock('../../redux/reducers/notificationSlice', () => ({
  setAllScheduledLocalNotificationData: (payload: unknown) => ({
    type: 'scheduled',
    payload,
  }),
  setAllLocalNotificationData: (payload: unknown) => ({type: 'local', payload}),
  setAllLocalNotificationGenerateType: (payload: unknown) => ({
    type: 'command',
    payload,
  }),
}));
const dispatch = jest.fn();
let enqueue: (data: any[]) => void, view: TestRenderer.ReactTestRenderer;
function Screen() {
  const [pending, setPending] = useState(false),
    [data, setData] = useState<any[]>([]);
  enqueue = next => {
    setData(next);
    setPending(true);
  };
  usePendingLocalNotifications(pending, data, setPending, dispatch);
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockTasks.length = 0;
  jest.clearAllMocks();
});
afterEach(() => {
  if (view) act(() => view.unmount());
});
test('two consecutive updates both commit and complete without waiting for cleanup', () => {
  act(() => {
    view = TestRenderer.create(<Screen />);
  });
  act(() => enqueue([{key: 'first'}]));
  act(() => mockTasks[0].run());
  act(() => enqueue([{key: 'second'}]));
  act(() => mockTasks[1].run());
  expect(
    dispatch.mock.calls
      .filter(call => call[0].type === 'local')
      .map(call => call[0].payload),
  ).toEqual([[{key: 'first'}], [{key: 'second'}]]);
  expect(dispatch).toHaveBeenCalledTimes(6);
});
test('an unmounted screen does not commit a queued update', () => {
  act(() => {
    view = TestRenderer.create(<Screen />);
  });
  act(() => enqueue([{key: 'first'}]));
  act(() => view.unmount());
  act(() => mockTasks[0].run());
  expect(dispatch).not.toHaveBeenCalled();
});
