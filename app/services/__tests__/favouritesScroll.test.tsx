import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {FlatList} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import FavActivities from '../../components/FavActivities';
import FavArticles from '../../components/FavArticles';
import {appTheme} from '../../instances/bebbo/styles/theme';

let mockFocused = true;
const mockRead = jest.fn();
const mockRows = Array.from({length: 20}, (_, i) => ({id: i + 1, title: `Saved ${i}`, category: 1, activity_category: 1, child_age: [1]}));
const mockIds = mockRows.map(row => row.id);
jest.mock('../../../App', () => ({useAppSelector: (select: any) => select({childData: {childDataSet: {favoriteadvices: mockIds, favoritegames: mockIds}}})}));
jest.mock('../selectors', () => ({
  selectActiveChild: () => ({taxonomyData: {id: 1}}),
  selectActivitiesDataAll: () => mockRows, selectArticleDataAll: () => mockRows,
  selectActivityCategoryArray: () => [{id: 1, name: 'Games'}],
  selectArticleCategoryArray: () => [{id: 1, name: 'Health'}],
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
  useFocusEffect: (callback: any) => require('react').useEffect(() => {
    if (mockFocused) return callback();
  }, [callback, mockFocused]),
}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {getFilteredData: (...args: any[]) => mockRead(...args)}}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: false}));
jest.mock('../LoadableImage', () => () => null);
jest.mock('../../components/VideoPlayer', () => () => null);
jest.mock('../../components/shared/ShareFavButtons', () => () => null);
jest.mock('@d11/react-native-fast-image', () => ({resizeMode: {cover: 'cover'}}));

let view: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  mockFocused = true;
  mockRead.mockReset().mockImplementation(async (schema: any) => schema.name === 'VideoArticleEntity' ? [] : mockRows);
});
afterEach(() => {if (view) act(() => view.unmount());});

test.each([['Activities', FavActivities], ['Advice', FavArticles]] as const)(
  '%s retains the same list instance throughout the return refresh', async (_name, Component) => {
    const tree = () => <ThemeProvider theme={appTheme}><Component /></ThemeProvider>;
    await act(async () => {view = TestRenderer.create(tree());});
    const list = view.root.findByType(FlatList).instance;
    mockFocused = false;
    await act(async () => view.update(tree()));
    let finish!: (rows: any[]) => void;
    mockRead.mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
    mockFocused = true;
    await act(async () => view.update(tree()));
    // Unmounting during this pending lookup is what discarded the native scroll offset.
    expect(view.root.findByType(FlatList).instance).toBe(list);
    expect(view.root.findByType(FlatList).props.data).toHaveLength(20);
    await act(async () => finish(mockRows.slice(1)));
    expect(view.root.findByType(FlatList).instance).toBe(list);
    expect(view.root.findByType(FlatList).props.data).toHaveLength(19);
  },
);
