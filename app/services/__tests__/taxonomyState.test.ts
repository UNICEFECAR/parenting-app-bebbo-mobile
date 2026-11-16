import {utilsSlice} from '../../redux/reducers/utilsSlice';
jest.mock('@reduxjs/toolkit', () => ({createSlice: (options: any) => ({
  caseReducers: options.reducers, getInitialState: () => options.initialState, actions: {},
})}));
jest.mock('../../instances', () => ({appConfig: {
  relationshipUniqueName: {relationShipMotherId: 'mother', relationShipFatherId: 'father', relationShipOtherCaregiverId: 'other', relationShipServiceProviderId: 'provider'},
  childGenderUniqueName: {bothChildGender: 'both', girlChildGender: 'girl', boyChildGender: 'boy'},
  parentGenderUniqueName: {bothParentGender: 'both', maleParentGender: 'male', femaleParentGender: 'female'},
  articleCategoryArray: ['health', 'nutrition'], activityCategoryArray: ['motor'],
}}));
const apply = (payload: any) => {
  const state = JSON.parse(JSON.stringify(utilsSlice.getInitialState()));
  (utilsSlice.caseReducers.setTaxonomyIds as any)(state, {payload});
  return state.taxonomyIds;
};
test.each([undefined, null, {}, {relationship_to_parent: []}])('missing optional taxonomy groups cannot crash startup (%j)', payload => {
  expect(() => apply(payload)).not.toThrow();
  expect(apply(payload).articleCategoryArray).toEqual([]);
});
test('category order follows each flavour configuration and omits missing categories', () => {
  expect(apply({category: [{unique_name: 'nutrition', id: 8}, {unique_name: 'health', id: 3}]}).articleCategoryArray).toEqual([3, 8]);
});
test('dictionary-shaped legacy catalogues and malformed rows are handled safely', () => {
  const result = apply({relationship_to_parent: {one: {unique_name: 'provider'}}, category: {a: null, b: {unique_name: 'health', id: '3'}}});
  expect(result.relationShipServiceProviderId).toBe('provider');
  expect(result.articleCategoryArray).toEqual([3]);
});
test('non-array groups and invalid IDs do not leak undefined category entries', () => {
  const result = apply({child_gender: 'invalid', parent_gender: [null], category: [{unique_name: 'health', id: {value: 1}}]});
  expect(result.articleCategoryArray).toEqual([]);
});
