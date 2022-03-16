import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
class LocalNotifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: true,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: false,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  schduleNotification(date,title,message,notiId) {
    console.log(notiId,"--notiId--",String(notiId));
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      id:notiId,
      title: '🔔 '+title,
      message: message,
      date,
    });
  }
  cancelReminderLocalNotification(notiId) {
    PushNotification.cancelLocalNotification(notiId);
  }
}

export default new LocalNotifications();