/** A loading/empty milestone list must never send NaN to a native progress view. */
export function milestoneProgress(value: unknown): number {
  if (!Array.isArray(value) || value.length === 0) return 0;
  const items = value.filter(item => item && typeof item === 'object');
  if (!items.length) return 0;
  const checked = items.filter(
    item =>
      item.toggleCheck === true ||
      item.toggleCheck === 1 ||
      item.toggleCheck === '1',
  ).length;
  return Math.round((checked / items.length) * 100);
}
