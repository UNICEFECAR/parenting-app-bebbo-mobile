/** Drupal responses and older caches can contain absent or keyed collections. */
export function taxonomyRows(value: unknown): Record<string, any>[] {
  const rows = Array.isArray(value) ? value : value && typeof value === 'object' ? Object.values(value) : [];
  return rows.filter((row): row is Record<string, any> => Boolean(row && typeof row === 'object' && !Array.isArray(row)));
}

export function categoryIds(value: unknown, configuredNames: readonly string[]): number[] {
  const lookup = new Map<string, number>();
  for (const row of taxonomyRows(value)) {
    const id = typeof row.id === 'number' ? row.id : typeof row.id === 'string' && /^\d+$/.test(row.id) ? Number(row.id) : NaN;
    if (typeof row.unique_name === 'string' && Number.isSafeInteger(id) && id > 0) lookup.set(row.unique_name, id);
  }
  return configuredNames.flatMap(name => lookup.has(name) ? [lookup.get(name)!] : []);
}
