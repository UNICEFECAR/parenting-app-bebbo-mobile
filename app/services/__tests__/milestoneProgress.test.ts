import {milestoneProgress} from '../milestoneProgress';
test.each([undefined, null, [], [null], {}])(
  'loading/malformed lists cannot yield NaN: %j',
  value => {
    expect(milestoneProgress(value)).toBe(0);
  },
);
test('valid boolean and historical numeric flags preserve rounded percentages without mutation', () => {
  const items = Object.freeze([
    Object.freeze({toggleCheck: true}),
    Object.freeze({toggleCheck: 1}),
    Object.freeze({toggleCheck: false}),
  ]);
  expect(milestoneProgress(items)).toBe(67);
  expect(milestoneProgress([{toggleCheck: '1'}])).toBe(100);
  expect(milestoneProgress([{toggleCheck: false}])).toBe(0);
  expect(items[2].toggleCheck).toBe(false);
});
