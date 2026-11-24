import {useCallback, useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const today = () => new Date().setHours(0, 0, 0, 0);

/** Refresh date-dependent UI after midnight, focus, or a device-clock change. */
export function useCalendarDay(): number {
  const [day, setDay] = useState(today);
  const refresh = useCallback(() => setDay(today()), []);
  useFocusEffect(refresh);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => listener.remove();
  }, [refresh]);
  useEffect(() => {
    const next = new Date();
    next.setHours(24, 0, 0, 0);
    const timer = setTimeout(refresh, next.getTime() - Date.now() + 1);
    return () => clearTimeout(timer);
  }, [day, refresh]);
  return day;
}
