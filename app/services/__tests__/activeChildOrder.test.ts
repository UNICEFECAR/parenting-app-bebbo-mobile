import {activeChildFirst} from '../activeChildOrder';
const children = Object.freeze([{uuid:'one'}, {uuid:'two'}, {uuid:'three'}, {uuid:'four'}]);
test.each(['one', 'two', 'three', 'four'])('places active child %s first and preserves sibling order', uuid => {
  const result = activeChildFirst(children, uuid);
  expect(result[0].uuid).toBe(uuid);
  expect(result.slice(1)).toEqual(children.filter(child => child.uuid !== uuid));
  expect(children.map(child => child.uuid)).toEqual(['one','two','three','four']);
  expect(result[0]).toBe(children.find(child => child.uuid === uuid));
});
test.each([undefined, null, '', 'deleted'])('missing active child %s preserves all profiles', uuid => {
  const result = activeChildFirst(children, uuid);
  expect(result).toEqual(children);
  expect(result).not.toBe(children);
});
test('supports historical numeric identifiers and an empty profile list', () => {
  expect(activeChildFirst([{uuid:1},{uuid:2}], '2')).toEqual([{uuid:2},{uuid:1}]);
  expect(activeChildFirst([], 'one')).toEqual([]);
});
