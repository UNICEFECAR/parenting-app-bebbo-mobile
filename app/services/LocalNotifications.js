import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Alert } from 'react-native';
class LocalNotifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN---:', token);
      },
      onNotification: function (notification) {
        //Alert.alert('NOTIFICATION:', 'NOTIFICATION Recieved:');
      
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
      // console.log('SN --- ', rn);
    });
  }

  schduleNotification(date,title,message,notiId,notitype,uuid) {
    //console.log(uuid,"...uuid..")
    let notificationid = String(notiId).length > 9 ? String(notiId).substr(String(notiId).length-9) : String(notiId);
    // console.log(notiId,"--notiId--",notificationid);
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      id:notificationid,
      title: title,
      userInfo: { notitype: notitype ,uuid:uuid},
      message: message,
      date,
      number: 1
      // largeIcon: "ic_launcher",
      // smallIcon: "ic_notification"
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