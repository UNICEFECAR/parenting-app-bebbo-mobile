import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
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
    let notificationid = String(notiId).substr(String(notiId).length-9);
    console.log(notiId,"--notiId--",notificationid);
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      id:notificationid,
      title: title,
      message: message,
      date,
    });
  }
  cancelReminderLocalNotification(notiId) {
    let notificationid = String(notiId).substr(String(notiId).length-9);
    PushNotification.cancelLocalNotification(notificationid);
  }
  cancelAllReminderLocalNotification() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export default new LocalNotifications();