import { scheduleIdleTask } from '../scheduleIdleTask';

describe('scheduleIdleTask', () => {
  let runPending: () => void;
  const runtime = globalThis as typeof globalThis & {
    requestIdleCallback: jest.Mock;
    cancelIdleCallback: jest.Mock;
  };
  const originalRequest = runtime.requestIdleCallback;
  const originalCancel = runtime.cancelIdleCallback;

  beforeEach(() => {
    runtime.requestIdleCallback = jest.fn(callback => {
      runPending = callback;
      return 7;
    });
    runtime.cancelIdleCallback = jest.fn();
  });

  afterEach(() => {
    runtime.requestIdleCallback = originalRequest;
    runtime.cancelIdleCallback = originalCancel;
  });

  it('defers work until the runtime is idle', () => {
    const work = jest.fn();
    scheduleIdleTask(work);
    expect(work).not.toHaveBeenCalled();
    runPending();
    expect(work).toHaveBeenCalledTimes(1);
  });

  it('prevents cancelled work from running after component cleanup', () => {
    const work = jest.fn();
    const task = scheduleIdleTask(work);
    task.cancel();
    // Even an already queued callback must not run work after cleanup.
    runPending();
    expect(runtime.cancelIdleCallback).toHaveBeenCalledWith(7);
    expect(work).not.toHaveBeenCalled();
  });
});
