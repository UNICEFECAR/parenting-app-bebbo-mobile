import {dailyMessage} from '../dailyMessage';
const records = Object.freeze([
  Object.freeze({id: 1, title: 'One'}),
  Object.freeze({id: 2, title: 'Two'}),
]);
const today = {day: 1, month: 1, year: 2027};
test.each(['invalid JSON', 'null', '[]', '{}', 42, undefined])(
  'invalid cache cannot crash the home screen: %j',
  cached => {
    expect(dailyMessage(records, cached, today)?.messageId).toBe(1);
  },
);
test('a new calendar day advances once and a repeated read retains the same message', () => {
  const next = dailyMessage(
    records,
    JSON.stringify({messageId: 1, day: 31, month: 12, year: 2026}),
    today,
  );
  expect(next?.messageId).toBe(2);
  expect(dailyMessage(records, JSON.stringify(next), today)).toEqual(next);
  expect(
    dailyMessage(records, {messageId: 2, day: 31, month: 12, year: 2026}, today)
      ?.messageId,
  ).toBe(1);
});
test('current catalogue text replaces stale translations even when item counts match', () => {
  expect(
    dailyMessage(
      records,
      {messageId: '2', messageText: 'Old translation', ...today},
      today,
    )?.messageText,
  ).toBe('Two');
  expect(
    dailyMessage(records, {messageId: 99, ...today}, today)?.messageId,
  ).toBe(1);
  expect(dailyMessage([], '{}', today)).toBeUndefined();
  expect(records[0].title).toBe('One');
});
