/** Schedule deferred work using the RN-supported idle callback API. */
export const scheduleIdleTask = (callback: () => unknown): { cancel: () => void } => {
  let cancelled = false;
  const handle = requestIdleCallback(() => {
    if (!cancelled) callback();
  });
  return {
    cancel: () => {
      cancelled = true;
      cancelIdleCallback(handle);
    },
  };
};
// RN provides these globals, but its strict TypeScript entry point omits them.
declare const requestIdleCallback: (callback: () => void) => number;
declare const cancelIdleCallback: (handle: number) => void;

