import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';
import Favourites from '../../screens/home/Favourites';
import {appTheme} from '../../instances/bebbo/styles/theme';
jest.mock(
  '../../components/FavActivities',
  () => () => require('react').createElement('view', {testID: 'activities'}),
);
jest.mock(
  '../../components/FavArticles',
  () => () => require('react').createElement('view', {testID: 'articles'}),
);
jest.mock('../../components/FocusAwareStatusBar', () => () => null);
jest.mock('../../components/TabScreenHeader', () => () => null);
jest.mock('../../components/OverlayLoadingComponent', () => () => null);
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) =>
    require('react').useEffect(callback, [callback]),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));
let view: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});
afterEach(() => {
  if (view) act(() => view.unmount());
});
test('acknowledging a return from activity details retains the selected favourite tab', () => {
  const navigation = {closeDrawer: jest.fn(), setParams: jest.fn()};
  const tree = (backClicked: string) => (
    <ThemeProvider theme={appTheme}>
      <Favourites
        navigation={navigation as any}
        route={{params: {tabIndex: 1, backClicked}}}
      />
    </ThemeProvider>
  );
  act(() => {
    view = TestRenderer.create(tree('yes'));
  });
  expect(navigation.setParams).toHaveBeenCalledWith({backClicked: 'no'});
  expect(view.root.findByProps({testID: 'activities'})).toBeDefined();
  act(() => view.update(tree('no')));
  expect(view.root.findByProps({testID: 'activities'})).toBeDefined();
  expect(view.root.findAllByProps({testID: 'articles'})).toHaveLength(0);
});
