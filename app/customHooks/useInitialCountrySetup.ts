import {useEffect, useRef} from 'react';
import {setchatBotData} from '../redux/reducers/childSlice';
import {oncountrtIdChange} from '../redux/reducers/localizationSlice';
import {setInfoModalOpened} from '../redux/reducers/utilsSlice';

/** Initialise once metadata is available, without clearing an active FAQ on later refreshes. */
export function useInitialCountrySetup(
  countries: readonly {CountryID: unknown}[],
  countryId: unknown,
  fallbackId: unknown,
  dispatch: (action: any) => void,
): void {
  const done = useRef(false);
  useEffect(() => {
    if (!countries.length || done.current) return;
    const timer = setTimeout(() => {
      done.current = true;
      dispatch(setchatBotData([]));
      if (
        String(countryId) === '1' &&
        !countries.some(country => Number(country.CountryID) === 1)
      ) {
        dispatch(oncountrtIdChange(fallbackId));
      }
      dispatch(setInfoModalOpened({key: 'generateNotifications', value: true}));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countries, countryId, fallbackId, dispatch]);
}
