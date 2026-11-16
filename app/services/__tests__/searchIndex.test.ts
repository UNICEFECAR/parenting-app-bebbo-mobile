import MiniSearch from 'minisearch';
import {prepareSearchIndex, searchReadyIndex} from '../searchIndex';
const options = {fields: ['title'], storeFields: ['title']};
afterEach(() => jest.restoreAllMocks());

test('searching before the index is ready is safe', () => {
  expect(searchReadyIndex(null, 'sleep')).toEqual([]);
});

test('published indexes include all documents and support actual searches', async () => {
  let index: MiniSearch<any> | null = null;
  const job = prepareSearchIndex([{id: 1, title: 'Sleep'}, {id: 2, title: 'Nutrition'}], options, value => {index = value;});
  expect(index).toBeNull();
  await job.done;
  expect(searchReadyIndex(index, 'nutrition').map(item => item.id)).toEqual([2]);
});

test('a slow old-language build cannot overwrite a newer index', async () => {
  let finish!: () => void;
  const actual = MiniSearch.prototype.addAllAsync;
  jest.spyOn(MiniSearch.prototype, 'addAllAsync').mockImplementationOnce(function (this: MiniSearch<any>, documents) {
    return new Promise(resolve => {finish = async () => {await actual.call(this, documents); resolve(undefined);};});
  });
  const publish = jest.fn();
  const oldJob = prepareSearchIndex([{id: 1, title: 'Old language'}], options, publish);
  oldJob.cancel();
  const latest = prepareSearchIndex([{id: 2, title: 'New language'}], options, publish);
  await latest.done;
  finish();
  await oldJob.done;
  expect(publish).toHaveBeenCalledTimes(1);
  expect(publish.mock.calls[0][0].search('new')[0].id).toBe(2);
});

test('malformed index data reports failure without an unhandled rejection', async () => {
  const publish = jest.fn(), fail = jest.fn();
  const job = prepareSearchIndex([{id: 1, title: 'First'}, {id: 1, title: 'Duplicate'}], options, publish, fail);
  await job.done;
  expect(publish).not.toHaveBeenCalled();
  expect(fail).toHaveBeenCalledTimes(1);
});
