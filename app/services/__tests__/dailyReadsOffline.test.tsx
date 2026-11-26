import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';
import {DateTime} from 'luxon';
import DailyReads from '../../components/homeScreen/DailyReads';
import HorizontalContentList from '../../components/shared/HorizontalContentList';
import {articledata} from '../../instances/bebbo/assets/offlinecontent/article';
import {appTheme} from '../../instances/bebbo/styles/theme';

const mockDispatch = jest.fn();
const mockEmpty: any[] = [];
let mockArticles: any[] = [];
let mockActivities: any[] = [];
let mockDaily: any = {};
let mockShown: any = {};
const mockActivityCategories = [{id: 1}];
const mockChild = {uuid: 'offline-child', taxonomyData: {id: 43}};
jest.mock('../../redux/reducers/articlesSlice', () => ({
  setDailyArticleGamesCategory: (payload: any) => ({type: 'daily', payload}),
  setShowedDailyDataCategory: (payload: any) => ({type: 'shown', payload}),
}));
jest.mock('../../../App', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector({}),
}));
jest.mock('../selectors', () => ({
  selectArticleDataAll: () => mockArticles,
  selectLowBandwidth: () => false,
  selectActiveChild: () => mockChild,
  selectActivitiesDataAll: () => mockActivities,
  selectActivityCategoryArray: () => mockActivityCategories,
  selectDailyDataCategoryAll: () => mockDaily,
  selectShowedDailyDataCategoryAll: () => mockShown,
  selectFavoriteAdvices: () => mockEmpty,
  selectFavoriteGames: () => mockEmpty,
}));
jest.mock('../../instances', () => ({appConfig: {articleCategoryIdArray: [56]}}));
jest.mock('@react-navigation/native', () => ({useNavigation: () => ({navigate: jest.fn()})}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: false}));
jest.mock('../../components/shared/HorizontalContentList', () => 'DailyList');
jest.mock('../../components/shared/ShareFavButtons', () => () => null);
jest.mock('../LoadableImage', () => () => null);
jest.mock('react-native-linear-gradient', () => 'Gradient');
jest.mock('@d11/react-native-fast-image', () => ({resizeMode: {cover: 'cover'}}));

let view: TestRenderer.ReactTestRenderer;
const tree = () => <ThemeProvider theme={appTheme}><DailyReads /></ThemeProvider>;
const articles = () => view.root.findAllByType(HorizontalContentList)[0].props.data;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockDispatch.mockClear();
  mockDispatch.mockImplementation((action: any) => {
    if (action.type === 'daily') mockDaily = action.payload;
    if (action.type === 'shown') mockShown = action.payload;
  });
  mockArticles = [];
  mockActivities = [];
  mockDaily = {};
  mockShown = {};
});
afterEach(() => {act(() => view.unmount());});

test('the single bundled English article appears when offline hydration finishes late', () => {
  act(() => {view = TestRenderer.create(tree());});
  expect(articles()).toEqual([]);
  // The loader can publish the raw bundled fallback, without Realm defaults.
  mockArticles = articledata.en;
  act(() => view.update(tree()));
  expect(articles().map((item: any) => item.id)).toEqual([331]);
  const writes = mockDispatch.mock.calls.length;
  act(() => view.update(tree()));
  expect(mockDispatch).toHaveBeenCalledTimes(writes);
});

test('today\'s missing cached IDs are replaced with available offline content', () => {
  mockDaily = {'offline-child': {
    advice: [56], games: [], currentadviceid: [999], currentgamesid: [],
    currentDate: DateTime.now().toISODate(), taxonomyid: 43, prematureTaxonomyId: 43,
  }};
  mockArticles = [{...articledata.en[0], do_not_feature: 0}];
  act(() => {view = TestRenderer.create(tree());});
  expect(articles().map((item: any) => item.id)).toEqual([331]);
});

test('late article hydration keeps the activities already chosen today and never duplicates a sole activity', () => {
  mockActivities = [{id: 10, activity_category: 1, child_age: [43]}];
  act(() => {view = TestRenderer.create(tree());});
  const games = () => view.root.findAllByType(HorizontalContentList)[1].props.data;
  expect(games().map((item: any) => item.id)).toEqual([10]);
  mockArticles = [{...articledata.en[0], do_not_feature: 0}];
  act(() => view.update(tree()));
  expect(articles().map((item: any) => item.id)).toEqual([331]);
  expect(games().map((item: any) => item.id)).toEqual([10]);
  expect(mockDaily['offline-child'].currentgamesid).toEqual([10]);
});

test('removing one daily article replaces only that slot and refreshes surviving content', () => {
  mockArticles = [1, 2, 3].map(id => ({id, category: 56, child_age: [43], do_not_feature: 0}));
  mockDaily = {'offline-child': {
    advice: [56, 56], games: [], currentadviceid: [1, 2], currentgamesid: [],
    currentDate: DateTime.now().toISODate(), taxonomyid: 43, prematureTaxonomyId: 43,
  }};
  act(() => {view = TestRenderer.create(tree());});
  expect(articles().map((item: any) => item.id)).toEqual([1, 2]);
  mockArticles = [
    {...mockArticles[0], do_not_feature: 1},
    {...mockArticles[1], title: 'Updated'},
    mockArticles[2],
  ];
  act(() => view.update(tree()));
  expect(articles().map((item: any) => item.id)).toEqual([2, 3]);
  expect(articles()[0].title).toBe('Updated');
});
