/**
 * @jest-environment node
 * @jest-environment-options {"customExportConditions": ["node", "node-addons"]}
 */
import reducer, {receiveAPIFailure} from '../../redux/sagaMiddleware/sagaSlice';
jest.mock('../../instances', () => ({appConfig: {apiConfig: {surveys: 'surveys'}}}));
const request = (apiEndpoint: string, postdata = {}) => ({apiEndpoint, postdata, method: 'get', saveinDB: true});
const apply = (state: any, errorArr: any[], attempted: any[] = [], fromPage = 'Terms') =>
  reducer(state, receiveAPIFailure({errorArr, attempted, fromPage}));

test('offline onboarding screens merge and deduplicate pending content including strings', () => {
  const taxonomy = request('taxonomies');
  let state = apply(undefined, [taxonomy, request('strings')]);
  state = apply(state, [taxonomy, request('activities'), request('milestones')]);
  state = apply(state, [request('articles')], [], 'ChildSetup');
  expect(state.errorObj.map((item: any) => item.apiEndpoint)).toEqual([
    'taxonomies', 'strings', 'activities', 'milestones', 'articles',
  ]);
});

test('partial recovery removes only successful requests and preserves concurrent failures', () => {
  const articles = request('articles'), games = request('activities'), milestones = request('milestones');
  let state = apply(undefined, [articles, games]);
  state = apply(state, [milestones]);
  state = apply(state, [games], [articles, games], 'Home');
  expect(state.errorObj).toEqual([games, milestones]);
  state = apply(state, [], [games, milestones], 'Home');
  expect(state.errorObj).toEqual([]);
});

test('a successful delta download does not erase a pending full download', () => {
  const full = request('activities');
  const delta = request('activities', {datetime: 'today'});
  const state = apply(apply(undefined, [full]), [], [delta], 'PeriodicSync');
  expect(state.errorObj).toEqual([full]);
});

test('successful force updates clear matching requests without clearing unrelated failures', () => {
  const games = request('activities'), article = request('articles', {page: 2});
  const state = apply(apply(undefined, [games, article]), [], [games], 'ForceUpdate');
  expect(state.errorObj).toEqual([article]);
});

test('survey failures stay out of the content recovery queue', () => {
  expect(apply(undefined, [request('surveys')]).errorObj).toEqual([]);
});
