import {DateTime, DurationLikeObject} from 'luxon';

/** Date pickers require a Date for local midnight, without an ISO date's UTC conversion. */
export function calendarDateOffset(date: Date, offset: DurationLikeObject): Date {
  return DateTime.fromJSDate(date).plus(offset).startOf('day').toJSDate();
}

export function isFutureCalendarDate(date: Date | string | number | undefined, now = Date.now()): boolean {
  return date != null && new Date(date).setHours(0, 0, 0, 0) > new Date(now).setHours(0, 0, 0, 0);
}

/** Resolve age from dates, rather than the taxonomy saved on a previous day. */
export function currentChildAgeBracket(child: any, brackets: any[], pregnancyId: number | string, now = Date.now()): any {
  if (!child?.birthDate || !brackets.length) return undefined;
  const ages = brackets.filter(item => String(item.id) !== String(pregnancyId) && String(item.id) !== '446' && Number(item.days_from) >= 0)
    .sort((a, b) => Number(a.days_from) - Number(b.days_from));
  if (isFutureCalendarDate(child.birthDate, now)) {
    return brackets.find(item => String(item.id) === String(pregnancyId)) ?? ages[0];
  }
  const premature = child.isPremature === true || child.isPremature === 'true';
  const birth = DateTime.fromJSDate(new Date(premature && child.plannedTermDate ? child.plannedTermDate : child.birthDate)).startOf('day');
  const days = Math.max(0, Math.floor(DateTime.fromMillis(now).startOf('day').diff(birth, 'days').days));
  if (!Number.isFinite(days)) return undefined;
  return ages.find(item => days >= Number(item.days_from) && days <= Number(item.days_to))
    ?? (days < Number(ages[0]?.days_from) ? ages[0] : ages[ages.length - 1]);
}
