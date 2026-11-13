import {dataRealmCommon} from '../../database/dbquery/dataRealmCommon';
import {ArticleEntitySchema} from '../../database/schema/ArticleSchema';
jest.mock('../../instances', () => ({appConfig: {isArticlePinned: '1'}}));
jest.mock('../../database/config/dataDbConfig', () => ({openDataRealm: jest.fn(), deleteDataRealm: jest.fn()}));
let rows: any[];
let realm: any;
beforeEach(() => {
  rows = [{id: 1, title: 'Old content', isarticle_pinned: ''}];
  realm = {
    write: (work: () => void) => work(),
    objects: () => ({filtered: (query: string) => rows.filter(row => query.includes(String(row.id)))}),
    objectForPrimaryKey: (_schema: string, id: number) => rows.find(row => row.id === id),
    create: (_schema: string, record: any) => {const i = rows.findIndex(row => row.id === record.id); if (i < 0) rows.push({...record}); else rows[i] = {...rows[i], ...record};},
  };
  dataRealmCommon.realm = realm;
});
afterEach(() => {dataRealmCommon.realm = undefined;});

test('pinning an existing article also refreshes its downloaded content', async () => {
  await dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 1, title: 'Updated content'}], '1');
  expect(rows[0]).toEqual({id: 1, title: 'Updated content', isarticle_pinned: '1'});
});

test('cache writes return a usable completion result', async () => {
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 2, title: 'New'}], '')).resolves.toBe('success');
});

test('refreshing regular content retains an existing pinned flag', async () => {
  rows[0].isarticle_pinned = '1';
  await dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 1, title: 'Fresh regular result'}], '');
  expect(rows[0]).toEqual({id: 1, title: 'Fresh regular result', isarticle_pinned: '1'});
});

test('a failed insert rolls back the whole downloaded article batch', async () => {
  realm.write = (work: () => void) => {
    const before = JSON.parse(JSON.stringify(rows));
    try {return work();} catch (error) {rows = before; throw error;}
  };
  const create = realm.create;
  realm.create = (schema: string, row: any) => {
    if (row.id === 3) throw new Error('Invalid article');
    return create(schema, row);
  };
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 2, title: 'Valid'}, {id: 3, title: 'Bad'}], '')).resolves.toBe('fail');
  expect(rows).toEqual([{id: 1, title: 'Old content', isarticle_pinned: ''}]);
});

test.each(['regular', 'reference', 'archive'])('%s cache confirms completion outside the Realm transaction callback', async kind => {
  const result = kind === 'regular'
    ? await dataRealmCommon.create(ArticleEntitySchema, [])
    : kind === 'reference'
      ? await dataRealmCommon.createStandardDev({weight_for_height: [], height_for_age: []} as any)
      : await dataRealmCommon.deleteDeltaData('VideoArticles', 'Articles', 'Activities', 'FAQs', {});
  expect(result).toBe('success');
});

test('unavailable storage is not reported as a successful cache update', async () => {
  dataRealmCommon.realm = undefined;
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 1}], '')).resolves.toBe('fail');
});

test('changing content country/language preserves caregiver settings and pending analytics', async () => {
  const groups: Record<string, any[]> = {
    ConfigSettings: [{key: 'userName', value: 'Caregiver'}, {key: 'currentActiveChildId', value: 'saved'}],
    Event: [{name: 'child_added', isSynchronized: false}],
    Articles: [{id: 1}], Country: [{CountryID: 'old'}],
  };
  realm.schema = Object.keys(groups).map(name => ({name}));
  realm.objects = (name: string) => groups[name];
  realm.delete = (records: any[]) => {for (const key of Object.keys(groups)) if (groups[key] === records) groups[key] = [];};
  realm.deleteAll = () => {for (const key of Object.keys(groups)) groups[key] = [];};
  expect(await dataRealmCommon.deleteAllAtOnce()).toBe('success');
  expect(groups.ConfigSettings).toHaveLength(2);
  expect(groups.Event).toHaveLength(1);
  expect(groups.Articles).toHaveLength(0);
  expect(groups.Country).toHaveLength(0);
});
