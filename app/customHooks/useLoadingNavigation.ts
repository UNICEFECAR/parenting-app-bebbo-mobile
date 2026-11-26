import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {useFocusEffect, usePreventRemove} from '@react-navigation/native';

type FlowNavigation = {
  navigate: (...args: any[]) => void;
  replace: (...args: any[]) => void;
  reset: (...args: any[]) => void;
  dispatch: (...args: any[]) => void;
};
type Completion = {run: () => void};

/** Only the processing flow receives this navigation object, never back handlers. */
export function useLoadingNavigation<T extends FlowNavigation>(navigation: T): T {
  const [completion, setCompletion] = useState<Completion | null>(null);
  const executed = useRef<Completion | null>(null);

  // Block every removal while processing, including parent-stack actions.
  // Back does not change completion state or touch the running request.
  usePreventRemove(completion === null, () => {});
  useFocusEffect(useCallback(() => {
    const hardware = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => hardware.remove();
  }, []));

  // Commit the unlocked state before dispatching the flow's next-screen action.
  useEffect(() => {
    if (completion && executed.current !== completion) {
      executed.current = completion;
      completion.run();
    }
  }, [completion]);

  return useMemo(() => ({
    ...navigation,
    navigate: (...args: any[]) => setCompletion({run: () => navigation.navigate(...args)}),
    replace: (...args: any[]) => setCompletion({run: () => navigation.replace(...args)}),
    reset: (...args: any[]) => setCompletion({run: () => navigation.reset(...args)}),
    dispatch: (...args: any[]) => setCompletion({run: () => navigation.dispatch(...args)}),
  }) as T, [navigation]);
}
