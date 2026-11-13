/** Move the selected profile first without mutating Redux data or reordering siblings. */
export function activeChildFirst<T extends {uuid: unknown}>(children: readonly T[], activeUuid: unknown): T[] {
  const result = [...children];
  if (activeUuid == null || activeUuid === '') return result;
  const index = result.findIndex(child => String(child.uuid) === String(activeUuid));
  if (index > 0) result.unshift(...result.splice(index, 1));
  return result;
}
