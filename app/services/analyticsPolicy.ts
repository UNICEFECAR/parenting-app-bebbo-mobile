/** Only public content identifiers, counts and fixed UI labels may leave the app. */
const numberKeys = new Set(['child_count', 'restored_count', 'query_length', 'result_count',
  'advise_id', 'game_id', 'category_id', 'faq_Id', 'faq_Subcategory_Id', 'faq_Category_Id',
  'captured_at_ms', 'is_offline_event']);
const labelKeys = new Set(['category_ids', 'screen_name', 'screen_class', 'source', 'operation', 'profile_type']);
export const legacyProfileProperties = ['ageid', 'is_premature', 'child_gender',
  'relationship_with_child', 'parent_gender', 'auto_child'];

export function prepareAnalyticsEvent(name: unknown, input?: Record<string, any>):
  {name: string; params?: Record<string, string | number>} | null {
  if (typeof name !== 'string') return null;
  let eventName = name;
  const params: Record<string, string | number> = {};
  // Older detail screens encoded taxonomy IDs in the event name. These are
  // content impressions, not category-selection actions, and exhaust GA4's limit.
  const impression = /^(advice|game)_category_selected_(.+)$/.exec(name);
  if (impression) {
    eventName = `${impression[1]}_category_viewed`;
    if (/^\d+$/.test(impression[2]) && Number.isSafeInteger(Number(impression[2]))) params.category_id = Number(impression[2]);
    else if (/^\d+(?:,\s*\d+)+$/.test(impression[2]) && impression[2].length <= 100)
      params.category_ids = impression[2].replace(/\s/g, '');
  }
  if (!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(eventName) || /^(firebase_|google_|ga_)/i.test(eventName)) return null;
  for (const [key, value] of Object.entries(input ?? {})) {
    if (key === 'category_ids') {
      if (typeof value === 'string' && /^\d+(?:,\d+)+$/.test(value) && value.length <= 100) params[key] = value;
    } else if (numberKeys.has(key)) {
      const number = typeof value === 'boolean' ? Number(value) :
        typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
      if (Number.isFinite(number)) params[key] = number;
    } else if (labelKeys.has(key) && typeof value === 'string' && /^[A-Za-z0-9_ -]{1,100}$/.test(value)) {
      params[key] = value;
    }
    // Names, UUIDs, dates of birth, health values, URLs and arbitrary text are excluded.
  }
  if (typeof input?.article_searched === 'string' || typeof input?.activity_searched === 'string')
    params.query_length = [...String(input.article_searched ?? input.activity_searched)].length;
  return {name: eventName, params: Object.keys(params).length ? params : undefined};
}
