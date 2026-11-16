import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useBandwidthPrompt} from '../../customHooks/useBandwidthPrompt';
import {retryAlert1} from '../commonApiService';
jest.mock('../commonApiService', () => ({retryAlert1: jest.fn()}));
jest.mock('../../redux/reducers/bandwidthSlice', () => ({
  onNetworkStateChange: (value: boolean) => ({
    type: 'bandwidth',
    payload: value,
  }),
}));
let renderer: TestRenderer.ReactTestRenderer;
const dispatch = jest.fn();
function Harness({ready = false, enabled = false, network = 'Lowbandwidth'}) {
  useBandwidthPrompt(ready, network, enabled, dispatch);
  return null;
}
beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
  jest.useRealTimers();
});
test('first-download recovery cannot be covered by an optional bandwidth prompt', async () => {
  act(() => {
    renderer = TestRenderer.create(<Harness />);
  });
  await act(async () => jest.advanceTimersByTime(10000));
  expect(retryAlert1).not.toHaveBeenCalled();
});
test('after onboarding, an accepted low-bandwidth prompt still enables data saving', async () => {
  jest.mocked(retryAlert1).mockResolvedValue('yes');
  act(() => {
    renderer = TestRenderer.create(<Harness ready />);
  });
  await act(async () => jest.advanceTimersByTime(1000));
  expect(dispatch).toHaveBeenCalledWith({type: 'bandwidth', payload: true});
});
test('cancel preserves the current preference', async () => {
  jest.mocked(retryAlert1).mockResolvedValue('cancel');
  act(() => {
    renderer = TestRenderer.create(<Harness ready />);
  });
  await act(async () => jest.advanceTimersByTime(1000));
  expect(dispatch).not.toHaveBeenCalled();
});
test('a delayed answer cannot overwrite a preference changed while the prompt was open', async () => {
  let finish!: (value: string) => void;
  jest.mocked(retryAlert1).mockReturnValue(
    new Promise(resolve => {
      finish = resolve;
    }),
  );
  act(() => {
    renderer = TestRenderer.create(<Harness ready />);
  });
  await act(async () => jest.advanceTimersByTime(1000));
  act(() => renderer.update(<Harness ready enabled />));
  await act(async () => finish('yes'));
  expect(dispatch).not.toHaveBeenCalled();
});
