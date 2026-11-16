import {recoverTaxonomySnapshot} from '../taxonomyRecovery';
const valid = {relationship_to_parent: [{id: 1, unique_name: 'mother'}]};
test('valid cached taxonomy does not open storage or change metadata', async () => {
  const load = jest.fn();
  await expect(recoverTaxonomySnapshot(JSON.stringify(valid),load)).resolves.toEqual({data: valid,recovered:false});
  expect(load).not.toHaveBeenCalled();
});
test.each(['{"truncated":', 'null', '42', '[]'])('invalid persisted JSON is replaced only by valid loaded metadata (%s)', async value => {
  const load = jest.fn().mockResolvedValue(valid);
  await expect(recoverTaxonomySnapshot(value,load)).resolves.toEqual({data:valid,recovered:true});
  expect(load).toHaveBeenCalledTimes(1);
});
test('missing/corrupt fallback remains an explicit failure, without manufacturing metadata or deleting data', async () => {
  await expect(recoverTaxonomySnapshot('bad',async () => undefined)).rejects.toThrow('Invalid taxonomy cache');
});
