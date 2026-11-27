import type {ApiJsonArray} from '../redux/sagaMiddleware/sagaActions';

/** Join existing loading-screen batches only at the agreed content update points. */
export function withStringSync(
  requests: ApiJsonArray[],
  stringsEndpoint: string,
  prevPage: string,
  downloadWeeklyData = false,
): ApiJsonArray[] {
  const shouldSync = prevPage === 'CountryLanguageSelection' ||
    prevPage === 'CountryLangChange' || prevPage === 'ForceUpdate' ||
    prevPage === 'DownloadUpdate' || prevPage === 'DownloadAllData' ||
    prevPage === 'Home' ||
    (prevPage === 'PeriodicSync' && downloadWeeklyData === true);
  if (!shouldSync || requests.some(item => item.apiEndpoint === stringsEndpoint)) return requests;
  return [...requests, {apiEndpoint: stringsEndpoint, method: 'get', postdata: {}, saveinDB: false}];
}
