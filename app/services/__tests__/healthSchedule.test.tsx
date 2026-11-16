import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {useAllHealthCheckupPeriods} from '../healthCheckupService';
import {useAllVaccinePeriods} from '../vacccineService';
import {readJsonArray, readVaccineIds} from '../healthInput';

const mockContext = React.createContext<any>({});
jest.mock('../../../App', () => ({useAppSelector: (select: any) =>
  select(require('react').useContext(mockContext))}));
jest.mock('../selectors', () => ({
  selectActiveChild: (state: any) => state.child,
  selectAllTaxonomyData: (state: any) => state.taxonomy,
  selectVaccineData: (state: any) => state.vaccines,
  selectHealthCheckupsData: (state: any) => state.checkups,
}));
jest.mock('../Utils', () => ({formatStringDate: (value: number) => new Date(value).toISOString()}));
jest.mock('../../instances', () => ({appConfig: {maxPeriodDays: 10000}}));
jest.mock('react-i18next', () => ({useTranslation: () => {
  require('react').useState(0); // A real hook detects changes to the number of periods.
  return {t: (key: string) => key};
}}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer | undefined;
let result: any;
function Harness({kind}: {kind: 'health' | 'vaccine'}) {
  const health = useAllHealthCheckupPeriods();
  const vaccine = useAllVaccinePeriods();
  result = kind === 'health' ? health : vaccine;
  return null;
}
function render(state: any, kind: 'health' | 'vaccine' = 'health') {
  const tree = <mockContext.Provider value={state}><Harness kind={kind} /></mockContext.Provider>;
  act(() => {if (renderer) renderer.update(tree); else renderer = TestRenderer.create(tree);});
}
afterEach(() => {if (renderer) act(() => renderer!.unmount()); renderer = undefined;});
const state = () => ({
  child: {birthDate: '2020-01-01', measures: [] as any[]},
  taxonomy: {growth_period: [{id: 1, vaccination_opens: 0}, {id: 2, vaccination_opens: 365}]},
  vaccines: [{id: 10, uuid: 'v1', growth_period: 1, old_calendar: 0}, {id: 20, uuid: 'v2', growth_period: 2, old_calendar: 0}],
  checkups: [{id: 1, growth_period: 1}, {id: 2, growth_period: 2}],
});
function freeze(value: any): any {
  if (value && typeof value === 'object') {Object.values(value).forEach(freeze); Object.freeze(value);}
  return value;
}

test('health periods may arrive, change count and be cleared without changing hook order', () => {
  render({...state(), checkups: []});
  render(state());
  expect(result.sortedGroupsForPeriods).toHaveLength(2);
  render({...state(), checkups: [state().checkups[0]]});
  render({...state(), checkups: []});
});
test('schedule calculation does not mutate memoised selector output across renders', () => {
  const input = freeze(state());
  const before = JSON.stringify(input);
  render(input);
  const first = JSON.stringify(result);
  render(input);
  expect(JSON.stringify(input)).toBe(before);
  expect(JSON.stringify(result)).toBe(first);
});
test.each([undefined, null, '', '{bad', '{}', 'null', '42', '[null,{},[],{"uuid":null}]'])('bad vaccine metadata cannot crash either schedule: %s', value => {
  const input = state();
  input.child.measures.push({uuid: 'm1', measurementPlace: 0, measurementDate: Date.parse('2020-01-02'), didChildGetVaccines: true, vaccineIds: value});
  render(input);
  render(input, 'vaccine');
  expect(result.doneVCcount).toBe(0);
});
test('valid recorded vaccines and measurement dates survive invalid neighbouring entries', () => {
  const input = state();
  const date = Date.parse('2020-01-02');
  input.child.measures.push({measurementDate: date, didChildGetVaccines: true, vaccineIds: '[null,{"uuid":"v1"},{}]'});
  render(input, 'vaccine');
  expect(result.doneVCcount).toBe(1);
  expect(result.sortedGroupsForPeriods[0].vaccines[0]).toMatchObject({uuid: 'v1', isMeasured: true, measurementDate: date});
});
test('both schedules tolerate child and taxonomy not loaded yet', () => {
  render({});
  render({}, 'vaccine');
  expect(result.sortedGroupsForPeriods).toEqual([]);
});
test('JSON boundary accepts arrays only, preserves valid entries and does not write to inputs', () => {
  const input = freeze([{uuid: 0}, {uuid: 'country-vaccine', customField: 'kept'}, {uuid: ''}, null]);
  expect(readVaccineIds(input)).toEqual(input.slice(0, 2));
  expect(readJsonArray('{"length":1}')).toEqual([]);
});
