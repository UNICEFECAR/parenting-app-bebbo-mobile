import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import ChildDate from '../../components/ChildDate';
import {appTheme} from '../../instances/bebbo/styles/theme';
jest.mock('../../../App', () => ({
  useAppSelector: (select: any) =>
    select({selectedCountry: {languageCode: 'en'}}),
}));
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) =>
    require('react').useEffect(callback, [callback]),
}));
jest.mock('../Utils', () => ({
  getDatePickerLocale: () => 'en',
  formatStringDate: (date: Date) => date.toISOString().slice(0, 10),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));
jest.mock('../../components/shared/Icon', () => () => null);
jest.mock('@react-native-community/datetimepicker', () => () => null);
jest.mock('react-native-modal-datetime-picker', () => () => null);
jest.mock('@app-types/types', () => ({
  dobMin: '1900-01-01',
  minDue: '1900-01-01',
  maxDue: '2100-01-01',
}));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
});
const tree = (childData: any) => (
  <ThemeProvider theme={appTheme}>
    <ChildDate childData={childData} dobMax={new Date()} sendData={jest.fn()} />
  </ThemeProvider>
);
const text = () =>
  renderer.root
    .findAllByType(Text)
    .map(n => n.props.children)
    .join(' ');
test('an already-mounted date editor refreshes when another profile arrives', () => {
  act(() => {
    renderer = TestRenderer.create(
      tree({birthDate: '2020-01-01', isPremature: 'false'}),
    );
  });
  expect(text()).toContain('2020-01-01');
  act(() =>
    renderer.update(tree({birthDate: '2021-02-03', isPremature: 'false'})),
  );
  expect(text()).toContain('2021-02-03');
  expect(text()).not.toContain('2020-01-01');
});
test.each(['invalid JSON', true, false, 'true', 'false'])(
  'prematurity input cannot crash the date editor: %s',
  isPremature => {
    expect(() =>
      act(() => {
        renderer = TestRenderer.create(
          tree({birthDate: '2020-01-01', isPremature}),
        );
      }),
    ).not.toThrow();
  },
);
