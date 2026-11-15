import {useEffect} from 'react';
import {
  setAllScheduledLocalNotificationData,
  setAllLocalNotificationData,
  setAllLocalNotificationGenerateType,
} from '../redux/reducers/notificationSlice';
import {scheduleIdleTask} from '../services/scheduleIdleTask';

export function usePendingLocalNotifications(
  pending: boolean,
  notifications: any[],
  setPending: (value: boolean) => void,
  dispatch: (action: any) => void,
): void {
  useEffect(() => {
    if (!pending) return;
    const task = scheduleIdleTask(() => {
      dispatch(setAllScheduledLocalNotificationData([]));
      dispatch(setAllLocalNotificationData(notifications));
      dispatch(
        setAllLocalNotificationGenerateType({
          generateFlag: false,
          generateType: 'add',
          childuuid: 'all',
        }),
      );
      setPending(false);
    });
    return () => task.cancel();
  }, [pending, notifications, setPending, dispatch]);
}
