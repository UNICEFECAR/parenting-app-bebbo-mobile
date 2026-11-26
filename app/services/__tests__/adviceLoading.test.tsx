import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {FlatList} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import Articles from '../../screens/home/bottomTabs/Articles';
import AgeBrackets from '../../components/AgeBrackets';
import ArticleCategories from '../../components/ArticleCategories';
import {prepareSearchIndex} from '../searchIndex';
import {appTheme} from '../../instances/bebbo/styles/theme';

let mockArticles = [{id: 101, category: 1, child_age: [1], title: 'First month advice', body: '', summary: ''}];
const mockAges = [{id: 1, days_from: 0, days_to: 30}, {id: 9, days_from: -280, days_to: -1}];
let mockState: any;
let mockFocused = true;
jest.mock('../../../App', () => ({useAppSelector: (select: any) => select(mockState), useAppDispatch: () => jest.fn()}));
jest.mock('../selectors', () => ({
  selectActiveChild: (s: any) => s.child,
  selectChildAge: () => mockAges,
  selectArticleDataAll: () => mockArticles,
  selectPinnedChildDevData: (s: any) => s.videos,
  selectArticleCategoryArray: (s: any) => s.categories,
}));
jest.mock('../../instances', () => ({appConfig: {pregnancyId: 9, maxArticleSize: 3, videoArticleMandatory: 1}}));
jest.mock('@react-navigation/native', () => ({useIsFocused: () => mockFocused, useFocusEffect: (cb: any) => require('react').useEffect(() => {
  if (mockFocused) return cb();
}, [cb, mockFocused])}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: false}));
jest.mock('../Utils', () => ({randomArrayShuffle: (items: any) => items, miniSearchConfig: {}}));
jest.mock('../EventSyncService', () => ({logEvent: jest.fn(), synchronizeEvents: jest.fn()}));
jest.mock('../searchIndex', () => ({prepareSearchIndex: jest.fn(() => ({cancel: jest.fn()})), searchReadyIndex: () => []}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {openRealm: async () => null}}));
jest.mock('../../redux/reducers/realmSafe', () => ({getRealmLib: jest.fn()}));
jest.mock('../../redux/reducers/utilsSlice', () => ({setInfoModalOpened: jest.fn()}));
jest.mock('../LoadableImage', () => () => null);
jest.mock('@d11/react-native-fast-image', () => ({__esModule: true, default: Object.assign(() => null, {resizeMode: {cover: 'cover'}})}));
jest.mock('react-native-vector-image', () => () => null);
jest.mock('react-native-outside-press', () => require('react-native').View);
jest.mock('../../components/ArticleCategories', () => () => null);
jest.mock('../../components/AgeBrackets', () => () => null);
jest.mock('../../components/FocusAwareStatusBar', () => () => null);
jest.mock('../../components/OverlayLoadingComponent', () => () => null);
jest.mock('../../components/TabScreenHeader', () => () => null);
jest.mock('../../components/VideoPlayer', () => () => null);
jest.mock('../../components/shared/FirstTimeModal', () => () => null);
jest.mock('../../components/shared/ShareFavButtons', () => () => null);
jest.mock('../../components/shared/Icon', () => ({__esModule: true, default: () => null, IconClearPress: require('react-native').View, OuterIconRow: require('react-native').View}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 25));
  jest.clearAllMocks();
  mockFocused = true;
  mockState = {
    child: {uuid: 'expected-child', birthDate: new Date(2026, 10, 25, 18).toISOString(), isExpected: 'true', taxonomyData: mockAges[1]},
    videos: [], categories: [{id: 1, name: 'Health'}],
    utilsData: {IsArticleModalOpened: false, taxonomyIds: {articleCategoryArray: [1]}},
    childData: {childDataSet: {favoriteadvices: []}}, selectedCountry: {languageCode: 'en'},
  };
});
afterEach(() => { if (renderer) act(() => renderer.unmount()); jest.useRealTimers(); });
const navigation = {setParams: jest.fn(), navigate: jest.fn()};
const tree = () => <ThemeProvider theme={appTheme}><Articles route={{params: {}}} navigation={navigation} /></ThemeProvider>;

test.each([25, 26])('Advice immediately shows first month articles on November %s while search indexing is pending', async day => {
  jest.setSystemTime(new Date(2026, 10, day));
  await act(async () => { renderer = TestRenderer.create(tree()); });
  expect(prepareSearchIndex).toHaveBeenCalledTimes(1);
  expect(renderer.root.findByType(AgeBrackets).props.currentSelectedChildId).toBe(1);
  expect(renderer.root.findByType(FlatList).props.data.map((item: any) => item.id)).toEqual([101]);
  mockState = {...mockState, child: {...mockState.child, gender: 2}};
  await act(async () => { renderer.update(tree()); });
  expect(prepareSearchIndex).toHaveBeenCalledTimes(1);
});

test('Advice advances from Pregnancy at midnight without switching the active child', async () => {
  jest.setSystemTime(new Date(2026, 10, 24, 23, 59, 59));
  await act(async () => { renderer = TestRenderer.create(tree()); });
  expect(renderer.root.findByType(AgeBrackets).props.currentSelectedChildId).toBe(9);
  await act(async () => { jest.advanceTimersByTime(1001); });
  expect(renderer.root.findByType(AgeBrackets).props.currentSelectedChildId).toBe(1);
  expect(renderer.root.findByType(FlatList).props.data.map((item: any) => item.id)).toEqual([101]);
  expect(prepareSearchIndex).toHaveBeenCalledTimes(1);
});

test('returning from Terms preserves the Advice list without clearing filters or rebuilding results', async () => {
  await act(async () => { renderer = TestRenderer.create(tree()); });
  await act(async () => {
    const categories = renderer.root.findByType(ArticleCategories).props;
    categories.onFilterArrayChange([1]);
    await categories.filterOnCategory([1]);
  });
  const data = renderer.root.findByType(FlatList).props.data;
  navigation.setParams.mockClear();
  mockFocused = false;
  await act(async () => { renderer.update(tree()); });
  mockFocused = true;
  await act(async () => { renderer.update(tree()); });
  expect(navigation.setParams).not.toHaveBeenCalled();
  expect(renderer.root.findByType(FlatList).props.data).toBe(data);
  expect(renderer.root.findByType(ArticleCategories).props.filterArray).toEqual([1]);
  expect(prepareSearchIndex).toHaveBeenCalledTimes(1);
});

test('downloaded advice replaces the offline list even when a detail-return flag is still set', async () => {
  jest.setSystemTime(new Date(2026, 10, 25));
  const original = mockArticles;
  const returned = () => <ThemeProvider theme={appTheme}><Articles route={{params: {backClicked: 'yes', currentSelectedChildId: 1}}} navigation={navigation} /></ThemeProvider>;
  try {
    await act(async () => {renderer = TestRenderer.create(tree());});
    await act(async () => renderer.update(returned()));
    mockArticles = [...original, {...original[0], id: 102, title: 'Downloaded advice'}];
    await act(async () => renderer.update(returned()));
    expect(renderer.root.findByType(FlatList).props.data.map((item: any) => item.id)).toEqual([101, 102]);
  } finally {
    mockArticles = original;
  }
});
