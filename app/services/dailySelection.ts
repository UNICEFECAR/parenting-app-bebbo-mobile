/** Keep today's valid choices and fill only missing slots, without duplicates. */
export function restoreDailySelection(ids: unknown, available: readonly any[], preferred: readonly any[] = []): any[] {
  const byId = new Map(available.map(item => [String(item.id), item]));
  const result: any[] = [];
  const seen = new Set<string>();
  const candidates = [
    ...(Array.isArray(ids) ? ids.map(id => byId.get(String(id))) : []),
    ...preferred.map(item => byId.get(String(item.id))),
    ...available,
  ];
  for (const item of candidates) {
    if (!item || seen.has(String(item.id))) continue;
    result.push(item);
    seen.add(String(item.id));
    if (result.length === 2) break;
  }
  return result;
}
