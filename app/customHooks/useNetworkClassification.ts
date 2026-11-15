import {useEffect} from 'react';
import {Platform} from 'react-native';
import {scheduleIdleTask} from '../services/scheduleIdleTask';

type NetworkSnapshot = {
  isConnected?: boolean | null;
  netType?: string;
  netValue?: {
    type?: string;
    details?: {cellularGeneration?: string} | null;
  } | null;
};

export function bandwidthClass(
  platform: string,
  connected: boolean | null | undefined,
  type?: string,
  generation?: string,
): string | null {
  if (connected == null) return null;
  if (!connected) return 'NoConnection';
  if (platform !== 'android' && platform !== 'ios') return null;
  if (
    type === 'unknown' ||
    type === 'other' ||
    (platform === 'android' && (type === 'bluetooth' || type === 'vpn')) ||
    (type === 'cellular' && (generation === '2g' || generation === '3g'))
  )
    return 'Lowbandwidth';
  return 'Highbandwidth';
}

/** Network work belongs to an effect so React actually runs its cancellation. */
export function useNetworkClassification(
  info: NetworkSnapshot,
  update: (value: string) => void,
  sync: (connected: boolean) => unknown,
): void {
  const connected = info.isConnected;
  const type = info.netType ?? info.netValue?.type;
  const generation = info.netValue?.details?.cellularGeneration;
  useEffect(() => {
    if (connected == null) return;
    const task = scheduleIdleTask(() => {
      if (connected) sync(true);
      const value = bandwidthClass(Platform.OS, connected, type, generation);
      if (value !== null) update(value);
    });
    return () => task.cancel();
  }, [connected, type, generation, update, sync]);
}
