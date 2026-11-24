import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {AppState} from 'react-native';
import {useCalendarDay} from '../../customHooks/useCalendarDay';
import {currentChildAgeBracket, isFutureCalendarDate} from '../calendarDate';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) => require('react').useEffect(callback, [callback]),
}));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const pregnancy = {id: 9, days_from: -280, days_to: -1};
const firstMonth = {id: 1, days_from: 0, days_to: 30};
const secondMonth = {id: 2, days_from: 31, days_to: 60};
const brackets = [pregnancy, firstMonth, secondMonth];
const child = {birthDate: new Date(2026, 10, 25, 18).toISOString(), isExpected: 'true', taxonomyData: pregnancy};

test.each([24, 25, 26])('expected child is classified from the calendar date on November %s', day => {
  const now = new Date(2026, 10, day).getTime();
  expect(isFutureCalendarDate(child.birthDate, now)).toBe(day < 25);
  expect(currentChildAgeBracket(child, brackets, 9, now)).toBe(day < 25 ? pregnancy : firstMonth);
  expect(child.taxonomyData).toBe(pregnancy); // Rendering does not overwrite the stored profile.
});

test('premature babies use their corrected age and cannot return to Pregnancy after birth', () => {
  const premature = {...child, birthDate: new Date(2026, 9, 1).toISOString(), plannedTermDate: child.birthDate, isPremature: 'true'};
  expect(currentChildAgeBracket(premature, brackets, 9, new Date(2026, 10, 24).getTime())).toBe(firstMonth);
  expect(currentChildAgeBracket(premature, brackets, 9, new Date(2026, 11, 26).getTime())).toBe(secondMonth);
});

test('a flavour without Pregnancy falls back to its youngest bracket', () => {
  expect(currentChildAgeBracket(child, [firstMonth, secondMonth], 9, new Date(2026, 10, 24).getTime())).toBe(firstMonth);
});

test('age advances past the saved bracket and remains in the oldest available bracket', () => {
  expect(currentChildAgeBracket(child, brackets, 9, new Date(2026, 11, 26).getTime())).toBe(secondMonth);
  expect(currentChildAgeBracket(child, brackets, 9, new Date(2027, 10, 25).getTime())).toBe(secondMonth);
});

test('mounted date-dependent UI refreshes at midnight and after a device date change', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 24, 23, 59, 59));
  let onAppState: any;
  const remove = jest.fn();
  const subscription = jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => {
    onAppState = callback;
    return {remove};
  });
  let day = 0;
  function Probe() { day = useCalendarDay(); return null; }
  let renderer: TestRenderer.ReactTestRenderer;
  act(() => { renderer = TestRenderer.create(<Probe />); });
  expect(isFutureCalendarDate(child.birthDate, day)).toBe(true);
  act(() => { jest.advanceTimersByTime(1001); });
  expect(isFutureCalendarDate(child.birthDate, day)).toBe(false);
  expect(currentChildAgeBracket(child, brackets, 9, day)).toBe(firstMonth);
  act(() => { jest.setSystemTime(new Date(2026, 11, 26)); onAppState('active'); });
  expect(currentChildAgeBracket(child, brackets, 9, day)).toBe(secondMonth);
  act(() => renderer.unmount());
  expect(remove).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
  subscription.mockRestore();
  jest.useRealTimers();
});
