/** Stored/CMS JSON is an input boundary, including while initial data is loading. */
export function readJsonArray(value: unknown): any[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Ignore unusable entries without changing the saved record or its valid entries. */
export function readVaccineIds(value: unknown): any[] {
  return readJsonArray(value).filter(item => {
    const uuid = item?.uuid;
    return item !== null && typeof item === 'object' && !Array.isArray(item) &&
      ((typeof uuid === 'string' && uuid.trim().length > 0) ||
        (typeof uuid === 'number' && Number.isFinite(uuid)));
  });
}
