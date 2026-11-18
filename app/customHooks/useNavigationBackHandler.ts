import {useCallback, useLayoutEffect, useRef} from 'react';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

type BackNavigation = {addListener: (event: any, listener: any) => () => void};

/** Keep one subscription while focused, but invoke the latest committed route handler. */
export function useNavigationBackHandler(
  navigation: BackNavigation,
  handler: () => boolean,
): void {
  const current = useRef(handler);
  useLayoutEffect(() => {
    current.current = handler;
  }, [handler]);
  useFocusEffect(useCallback(() => {
    const onBack = () => current.current();
    const hardware = BackHandler.addEventListener('hardwareBackPress', onBack);
    const unsubscribe = navigation.addListener('gestureEnd', onBack);
    return () => {
      unsubscribe();
      hardware.remove();
    };
  }, [navigation]));
}
