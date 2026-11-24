import {DateTime} from 'luxon';
import {v4 as uuid} from 'uuid';

// The pickers display a date and a time to the minute. Ignore the unused date
// in the time value (and hidden seconds) when identifying the same message.
const dateAndTime = (date: number, time: number): DateTime => {
  const clock = DateTime.fromMillis(Number(time));
  return DateTime.fromMillis(Number(date)).set({
    hour: clock.hour, minute: clock.minute, second: clock.second, millisecond: 0,
  });
};

const messageKey = (item: any): string => JSON.stringify([
  item.uuid, item.type, item.subtype,
  dateAndTime(item.periodName, item.growth_period).startOf('minute').toMillis(),
  // Two alerts for different reminder times may refer to the same appointment.
  item.subtype === 'reminder' ? Math.floor(new Date(item.notificationDate).getTime() / 60000) : null,
]);

function uniqueMessages(items: any[]): any[] {
  const messages = new Map<string, any>();
  [...items].sort((a, b) => Number(new Date(a.notificationDate)) - Number(new Date(b.notificationDate)))
    .forEach(item => {
      const key = messageKey(item);
      const existing = messages.get(key);
      messages.set(key, existing ? {
        ...existing,
        // Repair old duplicates without bringing back a dismissed notification.
        isRead: existing.isRead || item.isRead,
        isDeleted: existing.isDeleted || item.isDeleted,
      } : item);
    });
  return [...messages.values()];
}

export function getChildReminderNotifications(child: any, reminderNotis: any[], enabled: boolean): any[] {
  const history = uniqueMessages(reminderNotis ?? []);
  const now = Date.now();
  // Regeneration keeps past history, including automatically expired reminders.
  // Explicit deletion removes that reminder's history through the Redux action.
  const result = history.filter(item => Number(new Date(item.notificationDate)) <= now);

  for (const reminder of child?.reminders ?? []) {
    const type = reminder.reminderType === 'vaccine' ? 'vcr' : 'hcr';
    const appointment = dateAndTime(reminder.reminderDate, reminder.reminderTime);
    const alert = dateAndTime(reminder.reminderDateDefined, reminder.reminderTimeDefined);
    const birth = DateTime.fromJSDate(new Date(child.birthDate));
    const existing = history.filter(item => item.uuid === reminder.uuid && item.type === type);

    for (const subtype of ['start', 'reminder', 'scheduled']) {
      const isStart = subtype === 'start';
      const day = DateTime.fromMillis(Number(isStart ? reminder.reminderDateDefined : reminder.reminderDate));
      const days = Math.floor(day.diff(birth, 'days').days + (subtype === 'scheduled' ? 1 : 0));
      const candidate = {
        days_from: days, days_to: days, type, subtype, subtypeid: uuid(),
        title: `${type}Noti${isStart ? 1 : subtype === 'reminder' ? 2 : 3}`,
        checkinField: 'days_from',
        notificationDate: isStart ? DateTime.fromMillis(now) : subtype === 'reminder' ? alert : appointment,
        isRead: false, isDeleted: !enabled,
        growth_period: isStart ? reminder.reminderTimeDefined : reminder.reminderTime,
        periodName: isStart ? reminder.reminderDateDefined : reminder.reminderDate,
        uuid: reminder.uuid,
      };
      const previous = existing.find(item => messageKey(item) === messageKey(candidate));
      if (previous) {
        // Keep stable IDs and read/deleted flags across refresh and restart.
        if (!result.includes(previous)) result.push(previous);
      } else {
        result.push(candidate);
      }
    }
  }
  return uniqueMessages(result);
}
