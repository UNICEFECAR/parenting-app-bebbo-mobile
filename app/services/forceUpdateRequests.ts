import type {ApiJsonArray} from '../redux/sagaMiddleware/sagaActions';

/** Keep unfinished full requests in the force-update batch alongside its deltas. */
export function withPendingForceUpdateRequests(
  requests: ApiJsonArray[], pending: ApiJsonArray[],
): ApiJsonArray[] {
  const key = (request: ApiJsonArray) => JSON.stringify([
    request.apiEndpoint, request.method, request.saveinDB,
    Object.entries(request.postdata || {}).sort(([a], [b]) => a.localeCompare(b)),
  ]);
  const merged = [...requests];
  const seen = new Set(merged.map(key));
  for (const request of pending) {
    if (!seen.has(key(request))) {
      merged.push(request);
      seen.add(key(request));
    }
  }
  return merged;
}
