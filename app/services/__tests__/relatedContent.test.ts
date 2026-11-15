import {relatedActivities} from '../relatedContent';
const items = Object.freeze([
  Object.freeze({id: 1, child_age: [3]}),
  Object.freeze({id: 2, child_age: [3]}),
  Object.freeze({id: 3, child_age: [4]}),
]);
test('fresh age-specific content excludes the current item and preserves source data', () => {
  expect(relatedActivities(3, items, '1', 5)).toEqual([items[1]]);
  expect(items.map(item => item.id)).toEqual([1, 2, 3]);
});
test('changing the current activity does not exclude IDs from the previous suggestion list', () => {
  expect(relatedActivities(items, items, 1, 2)).toEqual([items[1], items[2]]);
  expect(relatedActivities(items, items, 2, 2)).toEqual([items[0], items[2]]);
});
test('late data and invalid optional selections are safe', () => {
  expect(relatedActivities(3, [], 1, 5)).toEqual([]);
  expect(relatedActivities(3, items, 1, 5)).toEqual([items[1]]);
  for (const selected of [null, undefined, {}, '3'])
    expect(relatedActivities(selected, items, 1, 5)).toEqual([]);
  expect(relatedActivities([{id: 2}, {id: '2'}, null], items, 1, 5)).toEqual([
    {id: 2},
  ]);
  expect(relatedActivities(items, items, 1, 0)).toEqual([]);
});
