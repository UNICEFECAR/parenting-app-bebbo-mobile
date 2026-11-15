/** Derive a fresh related-activity list without retaining the previous screen's IDs. */
export function relatedActivities(
  selected: unknown,
  available: readonly any[],
  currentId: unknown,
  limit: number,
): any[] {
  if (currentId == null || currentId === '' || currentId === 0 || limit <= 0)
    return [];
  const source =
    typeof selected === 'number'
      ? available.filter(
          item =>
            Array.isArray(item?.child_age) && item.child_age.includes(selected),
        )
      : Array.isArray(selected)
      ? selected
      : [];
  const seen = new Set<string>();
  return source
    .filter(item => {
      if (
        item?.id == null ||
        String(item.id) === String(currentId) ||
        seen.has(String(item.id))
      )
        return false;
      seen.add(String(item.id));
      return true;
    })
    .slice(0, limit);
}
