function parseSnapshot(value: unknown): Record<string, any> {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error('Invalid taxonomy cache');
  return parsed as Record<string, any>;
}
/** Recovery reads a matching content cache/fallback; it never deletes user data. */
export async function recoverTaxonomySnapshot(
  snapshot: unknown, load: () => Promise<unknown>,
): Promise<{data: Record<string, any>; recovered: boolean}> {
  try {return {data: parseSnapshot(snapshot), recovered: false};}
  catch {return {data: parseSnapshot(await load()), recovered: true};}
}
