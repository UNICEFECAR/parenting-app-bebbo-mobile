import {useLayoutEffect, useRef} from 'react';

/** Stable access to the latest committed inputs for event/focus callbacks.
 * Updating these inputs does not itself restart an editable form or subscription.
 */
export function useCommittedRef<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
