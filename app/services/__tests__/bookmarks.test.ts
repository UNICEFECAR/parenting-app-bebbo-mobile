jest.mock('../../database/dbquery/userRealmCommon', () => ({userRealmCommon:{getFilteredData:jest.fn(),updateFavorites:jest.fn()}}));
import {toggleBookmark} from '../bookmarks';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';
const data=jest.mocked(userRealmCommon);
beforeEach(()=>{jest.resetAllMocks();data.updateFavorites.mockResolvedValue('success');});
test.each([true,false])('returns the confirmed stored list and actual add/remove state (advice %s)', async advice=>{
  const field=advice?'favoriteadvices':'favoritegames';
  data.getFilteredData.mockResolvedValueOnce([{[field]:[]}]).mockResolvedValueOnce([{[field]:[12,13]}]);
  await expect(toggleBookmark('child-1','12',advice)).resolves.toEqual({ids:[12,13],added:true});
  data.getFilteredData.mockResolvedValueOnce([{[field]:[12,13]}]).mockResolvedValueOnce([{[field]:[13]}]);
  await expect(toggleBookmark('child-1',12,advice)).resolves.toEqual({ids:[13],added:false});
  expect(data.updateFavorites).toHaveBeenCalledWith(expect.anything(),12,advice?'advices':'games','uuid == "child-1"');
});
test('a missing/deleted active child fails safely before any write', async()=>{
  data.getFilteredData.mockResolvedValue([]);
  await expect(toggleBookmark('missing',12,true)).rejects.toThrow('Profile no longer available');
  expect(data.updateFavorites).not.toHaveBeenCalled();
});
test('a failed native write is never reported as a confirmed list', async()=>{
  data.getFilteredData.mockResolvedValue([{}]);data.updateFavorites.mockResolvedValue('catch');
  await expect(toggleBookmark('child',12,true)).rejects.toThrow('could not be saved');
  expect(data.getFilteredData).toHaveBeenCalledTimes(1);
});
test('a profile removed during a write does not crash while reading its bookmarks', async()=>{
  data.getFilteredData.mockResolvedValueOnce([{}]).mockResolvedValueOnce([]);
  await expect(toggleBookmark('child',12,false)).rejects.toThrow('Profile no longer available');
});
test.each([['bad" OR TRUEPREDICATE',12],['child','abc'],['child',0],['child',Infinity]])('rejects invalid ownership/content input %s %s', async (id,content)=>{
  await expect(toggleBookmark(id,content,true)).rejects.toThrow();
  expect(data.updateFavorites).not.toHaveBeenCalled();
});
