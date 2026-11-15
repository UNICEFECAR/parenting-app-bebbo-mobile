import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';
import HorizontalContentList from '../../components/shared/HorizontalContentList';
import RelatedVideoArticles from '../../components/shared/RelatedVideoArticles';
import RelatedArticles from '../../components/shared/RelatedArticles';
import {appTheme} from '../../instances/bebbo/styles/theme';
const mockRead = jest.fn();
jest.mock('../../instances', () => ({appConfig: {maxRelatedArticleSize: 5}}));
const mockData: any[] = [];
jest.mock('../../../App', () => ({
  useAppSelector: (select: any) =>
    select({
      childData: {childDataSet: {favoriteadvices: []}},
      bandWidthData: {lowbandWidth: false},
    }),
}));
jest.mock('../selectors', () => ({
  selectArticleDataAll: () => mockData,
  selectArticleCategoryArray: () => [],
  selectPinnedChildDevData: () => mockData,
  selectActiveChild: () => ({gender: 0, taxonomyData: {id: 3}}),
}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({
  dataRealmCommon: {getFilteredData: (...args: any[]) => mockRead(...args)},
}));
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) =>
    require('react').useEffect(callback, [callback]),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));
jest.mock('../Utils', () => ({randomArrayShuffle: (data: any[]) => [...data]}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({
  isConnected: true,
}));
jest.mock('../../components/shared/HorizontalContentList', () => 'RelatedList');
jest.mock('../../components/shared/ShareFavButtons', () => () => null);
jest.mock('../LoadableImage', () => () => null);
jest.mock('../../components/VideoPlayer', () => () => null);
jest.mock('@d11/react-native-fast-image', () => ({
  resizeMode: {cover: 'cover'},
}));
let view: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.clearAllMocks();
});
afterEach(() => {
  if (view) act(() => view.unmount());
});
const cases: [string, React.ComponentType<any>][] = [
  ['article', RelatedArticles],
  ['video', RelatedVideoArticles],
];
test.each(cases)(
  'a late %s lookup cannot replace the current results',
  async (_label, Component) => {
    let old!: (data: any[]) => void, current!: (data: any[]) => void;
    mockRead
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            old = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise(resolve => {
            current = resolve;
          }),
      );
    const first = [1],
      next = [2];
    const tree = (ids: number[]) => (
      <ThemeProvider theme={appTheme}>
        <Component
          {...({
            fromScreen: 'ChildgrowthTab',
            currentId: ids[0],
            relatedArticles: ids,
          } as any)}
        />
      </ThemeProvider>
    );
    act(() => {
      view = TestRenderer.create(tree(first));
    });
    act(() => view.update(tree(next)));
    await act(async () => current([{id: 22}]));
    expect(view.root.findByType(HorizontalContentList).props.data).toEqual([
      {id: 22},
    ]);
    await act(async () => old([{id: 11}]));
    expect(view.root.findByType(HorizontalContentList).props.data).toEqual([
      {id: 22},
    ]);
  },
);
