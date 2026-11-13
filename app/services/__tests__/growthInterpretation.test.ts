import {getInterpretationHeightForAge, getInterpretationWeightForHeight} from '../interpretationService';
jest.mock('../../../App', () => ({useAppSelector: (select: any) => select({utilsData: {
  height_for_age: JSON.stringify([{child_age: [1], goodText: {name: 'good'}, warrningSmallLengthText: {name: 'short'}, emergencySmallLengthText: {name: 'very-short'}, warrningBigLengthText: {name: 'tall'}}]),
  weight_for_height: JSON.stringify([{child_age: [1], goodText: {name: 'good'}, warrningSmallHeightText: {name: 'small'}, emergencySmallHeightText: {name: 'very-small'}, warrningBigHeightText: {name: 'big'}, emergencyBigHeightText: {name: 'very-big'}}]),
}})}));
const reference = [{name: 10, sd2neg: 50, sd3neg: 40, sd2: 75, sd3: 80}];
const measured = {height: '60', weight: '', measurementDate: Date.parse('2024-01-11T00:00:00Z')};

test('a height-only record is interpreted using its height rather than zero', () => {
  const result = getInterpretationHeightForAge(reference, '2024-01-01T00:00:00Z', {id: 1}, measured as any);
  expect(result.interpretationText.name).toBe('good');
  expect(result.goodMeasure).toBe(true);
});

test('Realm Date values and exported millisecond dates produce the same result', () => {
  const first = getInterpretationHeightForAge(reference, '2024-01-01T00:00:00Z', {id: 1}, {...measured, weight: '10'} as any);
  const second = getInterpretationHeightForAge(reference, new Date('2024-01-01T00:00:00Z'), {id: 1}, {...measured, measurementDate: new Date(measured.measurementDate)} as any);
  expect(second).toEqual(first);
});

test('a missing height is not interpreted as an actual zero measurement', () => {
  expect(getInterpretationHeightForAge(reference, '2024-01-01T00:00:00Z', {id: 1}, {...measured, height: ''} as any).goodMeasure).toBeUndefined();
});

test('missing taxonomy during profile loading does not crash the growth card', () => {
  expect(() => getInterpretationHeightForAge(reference, '2024-01-01T00:00:00Z', undefined, measured as any)).not.toThrow();
});

test('an existing boundary warning is not accompanied by a healthy status flag', () => {
  const result = getInterpretationWeightForHeight([{name: 60, sd2neg: 10, sd3neg: 8, sd2: 20, sd3: 25}], {id: 1}, {weight: '10', height: '60'} as any);
  expect(result.interpretationText.name).toBe('small');
  expect(result.goodMeasure).toBe(false);
});

// Exactly -3 SD belongs to the existing warning range, with no unclassified gap.
test('the exact lower height boundary has an interpretation', () => {
  const result = getInterpretationHeightForAge(reference, '2024-01-01T00:00:00Z', {id: 1}, {...measured, height: '40'} as any);
  expect(result.interpretationText.name).toBe('short');
  expect(result.goodMeasure).toBe(false);
});
