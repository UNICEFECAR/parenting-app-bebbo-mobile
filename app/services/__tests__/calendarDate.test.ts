import {DateTime, Settings} from 'luxon';
import {calendarDateOffset} from '../calendarDate';

afterEach(() => { Settings.defaultZone = 'system'; });

test.each(['America/New_York', 'Europe/Athens', 'Africa/Nairobi', 'Asia/Karachi'])
  ('due-date bounds retain the local calendar day in %s', zone => {
    Settings.defaultZone = zone;
    const birth = DateTime.fromISO('2026-03-01T17:30:00');
    const minimum = DateTime.fromJSDate(calendarDateOffset(birth.toJSDate(), {weeks: 2}));
    const maximum = DateTime.fromJSDate(calendarDateOffset(birth.toJSDate(), {months: 2}));
    expect(minimum.toISODate()).toBe('2026-03-15');
    expect(maximum.toISODate()).toBe('2026-05-01');
    expect(minimum.hour).toBe(0);
    expect(maximum.hour).toBe(0);
  });

test('calendar month bounds handle a leap-day birth without overflowing into March', () => {
  Settings.defaultZone = 'Asia/Karachi';
  const birth = DateTime.fromISO('2024-02-29T09:00:00');
  expect(DateTime.fromJSDate(calendarDateOffset(birth.toJSDate(), {months: 12})).toISODate()).toBe('2025-02-28');
});
