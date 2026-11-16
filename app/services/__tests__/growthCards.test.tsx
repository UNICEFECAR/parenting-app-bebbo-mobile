import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';
import {appTheme} from '../../instances/bebbo/styles/theme';
import ChartHeightForAge from '../../components/growth/ChartHeightForAge';
import ChartWeightForHeight from '../../components/growth/ChartWeightForHeight';
import GrowthChart from '../../components/growth/GrowthChart';

let mockChild: any;
const mockIds = {boyChildGender: 'boy', girlChildGender: 'girl'};
jest.mock('../../../App', () => ({useAppSelector: (select: any) => select({child: mockChild, utilsData: {taxonomyIds: mockIds}})}));
jest.mock('../selectors', () => ({selectActiveChild: (state: any) => state.child}));
jest.mock('@react-navigation/native', () => ({useNavigation: () => ({navigate: jest.fn()}), useFocusEffect: (callback: any) => require('react').useEffect(callback, [callback])}));
jest.mock('../growthService', () => ({formatHeightData: (data: any) => data}));
jest.mock('../interpretationService', () => ({useInterpretationHeightForAge: () => ({}), useInterpretationWeightForHeight: () => ({})}));
jest.mock('../../components/shared/RelatedArticles', () => () => null);
jest.mock('../../components/shared/Icon', () => () => null);
jest.mock('../../components/growth/GrowthChart', () => ({__esModule: true, default: () => null, chartTypes: {HeightForAge: 'height', WeightForHeight: 'weight'}}));
jest.mock('../../instances', () => ({
  appConfig: {boyChildGender: 40, girlChildGender: 41, heightForAge: 1, weightForHeight: 2},
  standardDevDataForChart: [
    {id: 'boy-height', growth_type: 1, child_gender: 'boy'},
    {id: 'girl-height', growth_type: 1, child_gender: 'girl'},
    {id: 'boy-weight', growth_type: 2, child_gender: 'boy'},
    {id: 'girl-weight', growth_type: 2, child_gender: 'girl'},
    {id: 'legacy-girl-height', growth_type: 1, child_gender: 41},
    {id: 'legacy-girl-weight', growth_type: 2, child_gender: 41},
  ],
}));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer | undefined;
beforeEach(() => {jest.useFakeTimers(); mockChild = {gender: 'girl', birthDate: '2020-01-01', taxonomyData: {}, measures: []};});
afterEach(() => {if (renderer) act(() => renderer!.unmount()); renderer = undefined; jest.clearAllTimers(); jest.useRealTimers();});
function render(Component: React.ComponentType) {
  act(() => {renderer = TestRenderer.create(<ThemeProvider theme={appTheme}><Component /></ThemeProvider>);});
  act(() => jest.advanceTimersByTime(2000));
  return renderer!.root.findByType(GrowthChart).props;
}

test.each(['boy', 40, '40', ''])('weight-for-height uses the selected boy reference for %s', gender => {
  mockChild.gender = gender;
  const props = render(ChartWeightForHeight);
  expect(JSON.stringify(props)).toContain('boy-weight');
  expect(JSON.stringify(props)).not.toContain('girl-weight');
  expect(JSON.stringify(props)).not.toContain('boy-height');
});
test.each(['girl', 41, '41'])('weight-for-height uses the girl reference despite boy taxonomy being present: %s', gender => {
  mockChild.gender = gender;
  const props = render(ChartWeightForHeight);
  expect(JSON.stringify(props)).toContain('girl-weight');
  expect(JSON.stringify(props)).not.toContain('boy-weight');
  expect(JSON.stringify(props)).not.toContain('girl-height');
});
test('height reference does not mix in a different growth type through numeric gender fallback', () => {
  const props = render(ChartHeightForAge);
  expect(JSON.stringify(props)).toContain('legacy-girl-height');
  expect(JSON.stringify(props)).not.toContain('legacy-girl-weight');
});
test('height card sorts a copy of measurements, leaving shared profile data unchanged', () => {
  mockChild.measures = Object.freeze([{measurementDate: 2}, {measurementDate: 1}]);
  render(ChartHeightForAge);
  expect(mockChild.measures.map((item: any) => item.measurementDate)).toEqual([2, 1]);
});
test.each([ChartHeightForAge, ChartWeightForHeight])('growth card tolerates profile data still loading', Component => {
  mockChild = undefined;
  expect(() => render(Component)).not.toThrow();
});
test.each([ChartHeightForAge, ChartWeightForHeight])('leaving a growth card cancels its pending reveal timer', Component => {
  act(() => {renderer = TestRenderer.create(<ThemeProvider theme={appTheme}><Component /></ThemeProvider>);});
  expect(jest.getTimerCount()).toBe(1);
  act(() => renderer!.unmount());
  renderer = undefined;
  expect(jest.getTimerCount()).toBe(0);
});
