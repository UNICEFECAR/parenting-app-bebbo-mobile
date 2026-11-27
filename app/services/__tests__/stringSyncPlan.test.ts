import {withStringSync} from '../../localization/stringSyncPlan';

const articles = {apiEndpoint: 'articles', method: 'get', postdata: {}, saveinDB: true};
test.each([
  ['CountryLanguageSelection', false],
  ['CountryLangChange', false],
  ['ForceUpdate', false],
  ['DownloadUpdate', false],
  ['DownloadAllData', false],
  ['Home', false],
  ['PeriodicSync', true],
])('strings join the existing %s loading batch (weekly: %s)', (page, weekly) => {
  const requests = [articles];
  const planned = withStringSync(requests, 'strings', page as string, weekly as boolean);
  expect(planned).toEqual([articles, {apiEndpoint: 'strings', method: 'get', postdata: {}, saveinDB: false}]);
  expect(requests).toEqual([articles]);
  expect(withStringSync(planned, 'strings', page as string, weekly as boolean)).toHaveLength(2);
});
test.each(['', 'PeriodicSync', 'ImportScreen',
  'Terms', 'ChildSetup', 'AddEditChild', 'Survey', 'VideoArticle', 'RelatedVideoArticle'])(
  'no extra strings request for %s without a weekly sync', page => {
    const requests = [articles];
    expect(withStringSync(requests, 'strings', page)).toBe(requests);
  },
);
