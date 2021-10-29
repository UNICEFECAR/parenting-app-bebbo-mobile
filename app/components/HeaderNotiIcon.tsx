import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading6 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useAppSelector } from '../../App';
import { isFutureDate } from '../services/childCRUD';
import Icon from './shared/Icon';
import { BubbleContainer, BubbleView } from './shared/NavigationDrawer';
const headerHeight = 50;
const HeaderNotiIcon = (props: any) => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  let allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
  const [notifications, setNotifications] = useState<any[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      // Your dismiss logic here 

      if (allnotis.length > 0) {
        const currentChildNotis = allnotis?.find((item) => item.childuuid == activeChild.uuid)
        console.log(currentChildNotis, "allfilteredNotis")
        //notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis
        if (!isFutureDate(activeChild?.birthDate)) {
        if (currentChildNotis) {
          let currentChildallnoti: any = [];
          if (currentChildNotis.gwcdnotis) {
            currentChildNotis.gwcdnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // // notiExist.gwcdnotis?.forEach((item)=>{
          // //   allgwnoti.push(item)
          // // })
          if (currentChildNotis.hcnotis) {
            currentChildNotis.hcnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // // notiExist.vcnotis?.forEach((item)=>{
          // //   allvcnotis.push(item)
          // // })
          if (currentChildNotis.vcnotis) {
            currentChildNotis.vcnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          if (currentChildNotis.reminderNotis) {
            currentChildNotis.reminderNotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // console.log(allnotis)

          // let fromDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).plus({ days: item.days_from });
          // let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
          let childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
          //  (item.days_from < childAgeInDays && childCrateDate <= fromDate)
          let toDay = DateTime.fromJSDate(new Date()).toMillis();


          let combinedNotis = currentChildallnoti.sort(
            (a: any, b: any) => a.days_from - b.days_from,
          ).filter((item) => { return item.isRead == false && item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis()) });
          console.log(combinedNotis, "combinedNotis")
          // const toRemove = combinedNotis.filter(item => item.title == "cdNoti2" && item.days_to >= childAgeInDays)
          // console.log(toRemove, "findcdNoti")
          // combinedNotis = combinedNotis.filter(function (el) {
          //   return !toRemove.includes(el);
          // });
          // delete item from combinedNotis item => { item.title == 'cdNoti2' && childAgeInDays >= item.days_to })
          setNotifications(currentChildallnoti.length>0?combinedNotis:[])
        }
      }else{
        setNotifications([]);
      }
      }
    
  }, [activeChild.uuid, allnotis]),
  );
  const navigation = useNavigation();
  return (
    <>
      <Pressable onPress={() => navigation.navigate('NotificationsScreen')} style={{flexDirection:'row'}}>
      <Icon name="ic_sb_notification" size={32} color={props.color} style={{position: 'relative'}}/>
      {notifications.length > 0 ? 
      <BubbleContainer style={{ position: 'absolute',right:-12,top:-5,justifyContent:'center',alignItems:'center'}}>
              <BubbleView>
                <Heading6>{notifications.length}</Heading6>
              </BubbleView>
            </BubbleContainer>
              : null}
              </Pressable>
    </>
  );
};
export default HeaderNotiIcon;

