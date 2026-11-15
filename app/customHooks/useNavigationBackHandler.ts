import {useEffect, useLayoutEffect, useRef} from 'react';
import {BackHandler} from 'react-native';

type BackNavigation = {addListener: (event: any, listener: any) => () => void};

/** Keep the mounted subscription, but invoke the latest committed route handler. */
export function useNavigationBackHandler(
  navigation: BackNavigation,
  handler: () => boolean,
): void {
  const current = useRef(handler);
  useLayoutEffect(() => {
    current.current = handler;
  }, [handler]);
  useEffect(() => {
    const onBack = () => current.current();
    const hardware = BackHandler.addEventListener('hardwareBackPress', onBack);
    const unsubscribe = navigation.addListener('gestureEnd', onBack);
    return () => {
      unsubscribe();
      hardware.remove();
    };
  }, [navigation]);
}
