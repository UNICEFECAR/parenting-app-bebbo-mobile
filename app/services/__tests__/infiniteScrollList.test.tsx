import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {FlatList} from 'react-native';
import InfiniteScrollList from '../../components/shared/InfiniteScrollList';
jest.mock('react-native/Libraries/Lists/FlatList', () => ({
  __esModule: true,
  default: 'TestList',
}));
let view: TestRenderer.ReactTestRenderer;
const items = Array.from({length: 25}, (_, id) => ({id}));
const done = jest.fn();
const tree = (data: any[]) => (
  <InfiniteScrollList
    filteredData={data}
    renderArticleItem={() => null}
    receivedLoadingArticle={done}
  />
);
const list = () => view.root.findByType(FlatList).props;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.clearAllMocks();
});
afterEach(() => {
  if (view) act(() => view.unmount());
});
test('pagination appends one batch per momentum gesture, with no duplicate items', () => {
  act(() => {
    view = TestRenderer.create(tree(items));
  });
  expect(list().data).toHaveLength(10);
  act(() => {
    list().onMomentumScrollBegin();
    list().onEndReached();
    list().onEndReached();
  });
  expect(list().data).toHaveLength(20);
  act(() => {
    list().onMomentumScrollBegin();
    list().onEndReached();
  });
  expect(list().data).toEqual(items);
  expect(done).toHaveBeenCalledWith(false);
});
test('changing filters resets to the first page and an empty filter clears old results', () => {
  act(() => {
    view = TestRenderer.create(tree(items));
  });
  act(() => {
    list().onMomentumScrollBegin();
    list().onEndReached();
  });
  const next = items.map(item => ({id: item.id + 100}));
  act(() => view.update(tree(next)));
  expect(list().data).toEqual(next.slice(0, 10));
  act(() => view.update(tree([])));
  expect(list().data).toEqual([]);
});
test('unrelated rendering preserves the current gesture; refresh returns to page one', () => {
  act(() => {
    view = TestRenderer.create(tree(items));
  });
  act(() => list().onMomentumScrollBegin());
  act(() => view.update(tree(items)));
  act(() => list().onEndReached());
  expect(list().data).toHaveLength(20);
  act(() => list().onRefresh());
  expect(list().data).toEqual(items.slice(0, 10));
  expect(list().refreshing).toBe(false);
});
