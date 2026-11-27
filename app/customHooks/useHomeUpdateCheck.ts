import {useEffect, useRef} from 'react';
import {useCommittedRef} from './useCommittedRef';
import {scheduleIdleTask} from '../services/scheduleIdleTask';

/** Retry readiness transitions without overlapping checks or losing a reconnect. */
export function useHomeUpdateCheck(
  check: () => Promise<void>, focused: boolean, connected: boolean | null, promptEnabled: boolean,
): void {
  const latest = useCommittedRef({check, focused, connected});
  const running = useRef(false);
  const pending = useRef(false);
  useEffect(() => {
    if (!focused || connected == null) return;
    pending.current = true;
    const task = scheduleIdleTask(async () => {
      if (running.current) return;
      running.current = true;
      try {
        while (pending.current) {
          pending.current = false;
          const input = latest.current;
          if (!input.focused || input.connected == null) break;
          await input.check();
        }
      } finally { running.current = false; }
    });
    return () => {
      pending.current = false;
      task.cancel();
    };
  }, [focused, connected, promptEnabled, latest]);
}
