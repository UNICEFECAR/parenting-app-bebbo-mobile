import {DateTime} from 'luxon';

export type DateInput = string | number | Date | DateTime;

/** Realm dates, JSON exports and UI DateTime values share one conversion. */
export function toDateTime(value: unknown): DateTime {
  if (DateTime.isDateTime(value)) return value;
  if (value instanceof Date) return DateTime.fromJSDate(value);
  if (typeof value === 'number') return DateTime.fromMillis(value);
  if (typeof value === 'string') return DateTime.fromISO(value);
  return DateTime.invalid('Missing or unsupported date');
}
