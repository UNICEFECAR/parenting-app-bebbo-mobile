import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Linking} from 'react-native';
import {useDeepLinkURL} from '../DeepLinking';

let state: ReturnType<typeof useDeepLinkURL>;
let renderer: TestRenderer.ReactTestRenderer;
let receive: (event: {url: string}) => void;
const remove = jest.fn();
function Harness() {state = useDeepLinkURL(); return null;}
async function mount() {await act(async () => {renderer = TestRenderer.create(<Harness />);});}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);
  jest.spyOn(Linking, 'addEventListener').mockImplementation((_type, callback) => {
    receive = callback; return {remove};
  });
});
afterEach(async () => {
  if (renderer) await act(async () => renderer.unmount());
  jest.restoreAllMocks(); remove.mockClear();
});

test('cold and warm links decode correctly', async () => {
  jest.mocked(Linking.getInitialURL).mockResolvedValue('bebbo://article/a%20b');
  await mount();
  expect(state.linkedURL).toBe('bebbo://article/a b');
  act(() => receive({url: 'bebbo://activity/c%20d'}));
  expect(state.linkedURL).toBe('bebbo://activity/c d');
});
test('an unavailable initial URL does not reject startup', async () => {
  jest.mocked(Linking.getInitialURL).mockRejectedValue(new Error('Native unavailable'));
  await mount(); expect(state.linkedURL).toBeNull();
});
test('malformed cold and warm links cannot throw URI errors', async () => {
  jest.mocked(Linking.getInitialURL).mockResolvedValue('bebbo://article/%E0');
  await mount(); expect(state.linkedURL).toBeNull();
  expect(() => act(() => receive({url: 'bebbo://article/%E0'}))).not.toThrow();
  expect(state.linkedURL).toBeNull();
});
test('a late initial link cannot overwrite a newer foreground link', async () => {
  let finish!: (url: string) => void;
  jest.mocked(Linking.getInitialURL).mockReturnValue(new Promise(resolve => {finish = resolve;}));
  await mount();
  act(() => receive({url: 'bebbo://new'}));
  await act(async () => finish('bebbo://old'));
  expect(state.linkedURL).toBe('bebbo://new');
});
test('reset invalidates a pending initial link', async () => {
  let finish!: (url: string) => void;
  jest.mocked(Linking.getInitialURL).mockReturnValue(new Promise(resolve => {finish = resolve;}));
  await mount(); act(() => state.resetURL());
  await act(async () => finish('bebbo://old'));
  expect(state.linkedURL).toBeNull();
});
test('unmount removes the native subscription', async () => {
  await mount(); act(() => renderer.unmount());
  expect(remove).toHaveBeenCalledTimes(1);
});
