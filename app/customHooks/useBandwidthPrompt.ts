import {useEffect, useRef} from 'react';
import {retryAlert1} from '../services/commonApiService';
import {onNetworkStateChange} from '../redux/reducers/bandwidthSlice';

/** Optional prompts must not replace the first-download recovery dialog. */
export function useBandwidthPrompt(
  onboarded: boolean,
  network: string,
  enabled: boolean,
  dispatch: (action: any) => void,
): void {
  const latest = useRef({enabled, dispatch});
  latest.current = {enabled, dispatch};
  useEffect(() => {
    if (!onboarded) return;
    let active = true;
    const timer = setTimeout(async () => {
      const before = latest.current.enabled;
      const low = network === 'Lowbandwidth';
      if ((!low && network !== 'Highbandwidth') || before === low) return;
      try {
        const answer = await retryAlert1(low ? 1 : 0, low ? 1 : 0);
        if (active && answer === 'yes' && latest.current.enabled === before) {
          latest.current.dispatch(onNetworkStateChange(low));
        }
      } catch {
        // An optional preference prompt must not interrupt navigation/downloads.
      }
    }, 1000);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [onboarded, network]);
}
