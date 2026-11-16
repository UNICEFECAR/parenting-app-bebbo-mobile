type Day = {day: number; month: number; year: number};
type Message = Day & {messageId: unknown; messageText: string};

/** Treat cached preferences as untrusted, and refresh text from the current catalogue. */
export function dailyMessage(
  records: readonly any[],
  stored: unknown,
  today: Day,
): Message | undefined {
  const available = records.filter(
    record => record?.id != null && typeof record.title === 'string',
  );
  if (!available.length) return undefined;
  let cached: any;
  try {
    cached = typeof stored === 'string' ? JSON.parse(stored) : stored;
  } catch {
    cached = undefined;
  }
  const valid =
    cached &&
    !Array.isArray(cached) &&
    typeof cached === 'object' &&
    Number.isInteger(Number(cached.day)) &&
    Number(cached.day) >= 1 &&
    Number(cached.day) <= 31 &&
    Number.isInteger(Number(cached.month)) &&
    Number(cached.month) >= 1 &&
    Number(cached.month) <= 12 &&
    Number.isInteger(Number(cached.year)) &&
    Number(cached.year) > 0;
  const oldIndex = valid
    ? available.findIndex(
        record => String(record.id) === String(cached.messageId),
      )
    : -1;
  const sameDay =
    valid &&
    Number(cached.day) === today.day &&
    Number(cached.month) === today.month &&
    Number(cached.year) === today.year;
  const index =
    oldIndex < 0 ? 0 : sameDay ? oldIndex : (oldIndex + 1) % available.length;
  return {
    messageId: available[index].id,
    messageText: available[index].title,
    ...today,
  };
}
