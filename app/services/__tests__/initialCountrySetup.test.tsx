import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useInitialCountrySetup} from '../../customHooks/useInitialCountrySetup';
jest.mock('../../redux/reducers/childSlice', () => ({
  setchatBotData: (payload: unknown) => ({type: 'chat', payload}),
}));
jest.mock('../../redux/reducers/localizationSlice', () => ({
  oncountrtIdChange: (payload: unknown) => ({type: 'country', payload}),
}));
jest.mock('../../redux/reducers/utilsSlice', () => ({
  setInfoModalOpened: (payload: unknown) => ({type: 'flag', payload}),
}));
const dispatch = jest.fn();
let view: TestRenderer.ReactTestRenderer;
function Screen({
  countries,
  id = 1,
}: {
  countries: {CountryID: unknown}[];
  id?: number;
}) {
  useInitialCountrySetup(countries, id, 99, dispatch);
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  jest.clearAllMocks();
});
afterEach(() => {
  if (view) act(() => view.unmount());
  jest.useRealTimers();
});
test('late metadata initialises once, and later refreshes do not clear an active FAQ', () => {
  act(() => {
    view = TestRenderer.create(<Screen countries={[]} />);
    jest.advanceTimersByTime(2000);
  });
  expect(dispatch).not.toHaveBeenCalled();
  act(() => view.update(<Screen countries={[{CountryID: 2}]} />));
  act(() => jest.advanceTimersByTime(1000));
  expect(dispatch.mock.calls.map(call => call[0].type)).toEqual([
    'chat',
    'country',
    'flag',
  ]);
  act(() => view.update(<Screen countries={[{CountryID: 3}]} id={3} />));
  act(() => jest.advanceTimersByTime(1000));
  expect(dispatch).toHaveBeenCalledTimes(3);
});
test.each([
  {countries: [{CountryID: '1'}], id: 1},
  {countries: [{CountryID: 2}], id: 2},
])('valid selected country is retained: %j', props => {
  act(() => {
    view = TestRenderer.create(<Screen {...props} />);
  });
  act(() => jest.advanceTimersByTime(1000));
  expect(dispatch.mock.calls.some(call => call[0].type === 'country')).toBe(
    false,
  );
});
test('leaving the screen cancels pending initialisation', () => {
  act(() => {
    view = TestRenderer.create(<Screen countries={[{CountryID: 2}]} />);
  });
  act(() => view.unmount());
  act(() => jest.advanceTimersByTime(1000));
  expect(dispatch).not.toHaveBeenCalled();
});
