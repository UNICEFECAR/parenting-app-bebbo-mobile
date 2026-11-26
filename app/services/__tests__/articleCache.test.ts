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
  const failure = new Error('Invalid record for /private/caregiver-name.realm');
  const logged = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const create = realm.create;
  realm.create = (schema: string, row: any) => {
    if (row.id === 3) throw failure;
    return create(schema, row);
  };
  try {
    await expect(dataRealmCommon.createArticles(ArticleEntitySchema, [{id: 2, title: 'Valid'}, {id: 3, title: 'Bad'}], '')).resolves.toBe('fail');
    expect(rows).toEqual([{id: 1, title: 'Old content', isarticle_pinned: ''}]);
    expect(logged).toHaveBeenCalledTimes(1);
    const detail = logged.mock.calls[0][1] as Error;
    expect(detail.message).toBe('Application operation failed');
    expect(detail.stack).not.toContain('/private/caregiver-name.realm');
  } finally { logged.mockRestore(); }
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

test('archive cleanup deletes integer primary keys in every content collection, including numeric string IDs', async () => {
  const groups: Record<string, any[]> = {
    Articles: [{id: 58331}, {id: 1761}, {id: 99}],
    Activities: [{id: 10}], VideoArticles: [{id: 20}], FAQs: [{id: 30}],
  };
  realm.objectForPrimaryKey = jest.fn((schema: string, id: number) => groups[schema].find(row => row.id === id));
  realm.delete = (record: any) => {
    for (const key of Object.keys(groups)) groups[key] = groups[key].filter(row => row !== record);
  };
  realm.objects = jest.fn(() => {throw new Error('Archive cleanup must use typed primary keys');});
  const archive = {article: [58331, '1761', 999], activities: [10], video_article: ['20'], faq: [30]};
  await expect(dataRealmCommon.deleteDeltaData('VideoArticles', 'Articles', 'Activities', 'FAQs', archive)).resolves.toBe('success');
  expect(groups).toEqual({Articles: [{id: 99}], Activities: [], VideoArticles: [], FAQs: []});
  expect(realm.objectForPrimaryKey).toHaveBeenCalledWith('Articles', 1761);
  expect(realm.objects).not.toHaveBeenCalled();
});

test.each([null, {article: ['bad-id']}, {article: null, faq: {id: 30}}])('invalid archive data is retriable (%j)', async archive => {
  const logged = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    await expect(dataRealmCommon.deleteDeltaData('VideoArticles', 'Articles', 'Activities', 'FAQs', archive)).resolves.toBe('error');
  } finally {logged.mockRestore();}
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

test('accepts CMS empty formatted bodies and numeric strings in a fresh article',async()=>{
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema,
    [{id:2,title:'Article',body:false,do_not_feature:'1'}],'')).resolves.toBe('success');
  expect(rows[1]).toMatchObject({id:2,body:'',do_not_feature:1});
  expect(ArticleEntitySchema.properties.licensed).toMatchObject({type:'int',default:0});
  expect(ArticleEntitySchema.properties.mandatory).toMatchObject({type:'int',default:0});
});

test.each([
  [false, 0], [true, 1], ['0', 0], ['1', 1], [0, 0], [1, 1],
])('normalises CMS checkbox %p to integer %p before the Realm write', async (flag, expected) => {
  const create = realm.create;
  realm.create = (schema: string, record: any) => {
    if (!Number.isInteger(record.do_not_feature)) throw new Error('Expected integer do_not_feature');
    return create(schema, record);
  };
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema,
    [{id: 7716, title: 'Article', do_not_feature: flag}], '')).resolves.toBe('success');
  expect(rows.find(row => row.id === 7716)?.do_not_feature).toBe(expected);
});

test('Babuni boolean checkbox records do not roll back the rest of a downloaded batch', async () => {
  const create = realm.create;
  realm.create = (schema: string, record: any) => {
    if (!Number.isInteger(record.do_not_feature)) throw new Error('Expected integer do_not_feature');
    return create(schema, record);
  };
  const records = [
    {id: 2, title: 'Regular article', do_not_feature: '1'},
    {id: 7716, title: 'Article', do_not_feature: false},
    {id: 7721, title: 'Article', do_not_feature: false},
  ];
  await expect(dataRealmCommon.createArticles(ArticleEntitySchema, records, '')).resolves.toBe('success');
  expect(rows.map(row => row.id)).toEqual([1, 2, 7716, 7721]);
  expect(rows.slice(1).map(row => row.do_not_feature)).toEqual([1, 0, 0]);
  expect(records[1].do_not_feature).toBe(false);
});
