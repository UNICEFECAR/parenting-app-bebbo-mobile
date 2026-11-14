import {DateTime, DurationLikeObject} from 'luxon';

/** Date pickers require a Date for local midnight, without an ISO date's UTC conversion. */
export function calendarDateOffset(date: Date, offset: DurationLikeObject): Date {
  return DateTime.fromJSDate(date).plus(offset).startOf('day').toJSDate();
}
