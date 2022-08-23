import PushNotification from 'react-native-push-notification';
class LocalNotifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
      },
      onNotification: function (notification) {
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
    });
  }

  schduleNotification(date,title,message,notiId,notitype,uuid) {
    let notificationid = String(notiId).length > 9 ? String(notiId).substr(String(notiId).length-9) : String(notiId);
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      id:notificationid,
      title: title,
      userInfo: { notitype: notitype ,uuid:uuid},
      message: message,
      date,
      number: 1
    });
  }
  cancelReminderLocalNotification(notiId) {
    let notificationid = String(notiId).length > 9 ? String(notiId).substr(String(notiId).length-9) : String(notiId);
    PushNotification.cancelLocalNotification(notificationid);
  }
  cancelAllReminderLocalNotification() {
    PushNotification.cancelAllLocalNotifications();
  }
  getAllScheduledLocalNotifications() {
    PushNotification.getScheduledLocalNotifications((v)=> {
      console.log(v.length,"PushNotification.getScheduledLocalNotifications length---");
    })
  }
  getDeliveredNotifications() {
    PushNotification.getDeliveredNotifications((noti) => {
      console.log('DELIVERED NOTIFICATION',noti.length);
    })
  }
}

export default new LocalNotifications();