import {userRealmCommon} from '../database/dbquery/userRealmCommon';
import {ChildEntitySchema} from '../database/schema/ChildDataSchema';

/** Return confirmed stored state; stale UI props are not a write acknowledgement. */
export async function toggleBookmark(childId: unknown, contentId: unknown, advice: boolean): Promise<{ids: number[]; added: boolean}> {
  if (typeof childId !== 'string' || !/^[A-Za-z0-9_:-]{1,128}$/.test(childId)) throw new Error('No active profile');
  const id = typeof contentId === 'number' ? contentId : typeof contentId === 'string' && /^\d+$/.test(contentId) ? Number(contentId) : NaN;
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid content');
  const query = `uuid == "${childId}"`;
  const existing = await userRealmCommon.getFilteredData<any>(ChildEntitySchema, query);
  if (!existing?.[0]) throw new Error('Profile no longer available');
  const result = await userRealmCommon.updateFavorites(ChildEntitySchema, id, advice ? 'advices' : 'games', query);
  if (result !== 'success') throw new Error('Bookmark could not be saved');
  const current = await userRealmCommon.getFilteredData<any>(ChildEntitySchema, query);
  if (!current?.[0]) throw new Error('Profile no longer available');
  const ids = Array.from(current[0][advice ? 'favoriteadvices' : 'favoritegames'] ?? []) as number[];
  return {ids, added: ids.includes(id)};
}
