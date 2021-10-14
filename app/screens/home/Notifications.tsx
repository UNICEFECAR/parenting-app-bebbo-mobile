
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import HeaderBabyMenu from '@components/HeaderBabyMenu';
import NotificationItem from '@components/NotificationItem';
import NotificationsCategories from '@components/NotificationsCategories';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonColTwo, ButtonContainerTwo, ButtonSecondary, ButtonSecondaryTint, ButtonText } from '@components/shared/ButtonGlobal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconRow, OuterIconSpace } from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading4Center } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, BackHandler, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setAllNotificationData } from '../../redux/reducers/notificationSlice';
import { getCurrentChildAgeInDays, isFutureDate } from '../../services/childCRUD';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
const Notifications = () => {
  let allnotis = useAppSelector((state: any) => (state.notificationData.notifications));
  console.log(allnotis, "allnotis");
  const [allChildnotification, setAllChildNotification] = useState<any[]>([]);
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  // const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  // const growthColor = themeContext.colors.CHILDGROWTH_COLOR;
  // const vaccinationColor = themeContext.colors.VACCINATION_COLOR;
  // const hkColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  // const cdColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [selectedCategories, setselectedCategories] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [checkedNotifications, setCheckedNotifications] = useState<any[]>(
    [],
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const onBackPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeDrawerNavigator' }],
    });
      return true;
  }
  useEffect(() => {
    // const currentDate = DateTime.now().plus({days:-8}).toMillis();
    // dispatch(setSyncDate({key: 'userOnboardedDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    navigation.addListener('gestureEnd', onBackPress);
    return () => {
      navigation.removeListener('gestureEnd', onBackPress);
      backHandler.remove()};
  }, []);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
  const handleAppStateChange = (nextAppState) => {
    console.log('App State: ' + nextAppState);
    if (appState != nextAppState) {
      if (appState.current.match(/inactive|background/) 
            && nextAppState === 'active') {
        console.log(
          'App State: ' +
          'App has come to the foreground!'
        );
        console.log("App has come to the foreground!",allChildnotification);
        if (allChildnotification.length > 0) {
          console.log(allChildnotification,"in if from background")
          const currentChildNotis = allChildnotification.find((item) => item.childuuid == activeChild.uuid)
          console.log(currentChildNotis,"allfilteredNotis")
          calculateNotis(currentChildNotis)
        }

      }
      console.log('App State: ' + nextAppState);
      appState.current = nextAppState;
    }
  };
  // useEffect(() => {
  //   const subscription:any = AppState.addEventListener("change", nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       console.log("App has come to the foreground!",allChildnotification);
  //       if (allChildnotification.length > 0) {
  //         console.log(allChildnotification,"in if from background")
  //         const currentChildNotis = allChildnotification.find((item) => item.childuuid == activeChild.uuid)
  //         console.log(currentChildNotis,"allfilteredNotis")
  //         calculateNotis(currentChildNotis)
  //       }
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     console.log()
  //     AppState.removeEventListener("change",subscription)
  //     subscription?.remove();
  //   };
  // }, []);
  const calculateNotis = (currentChildNotis: any) => {
    console.log(currentChildNotis, "currentChildNotis")
    if (currentChildNotis) {
      console.log(currentChildNotis, "currentChildNotis")
      let currentChildallnoti: any = [];
      if (currentChildNotis.gwcdnotis) {
        currentChildNotis.gwcdnotis.forEach((item) => {
          let newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.hcnotis) {
        currentChildNotis.hcnotis.forEach((item) => {
          let newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.vcnotis) {
        currentChildNotis.vcnotis.forEach((item) => {
          let newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.reminderNotis) {
        currentChildNotis.reminderNotis.forEach((item) => {
          let newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      let toDay = DateTime.fromJSDate(new Date()).toMillis();
      let childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
      // let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
      const combinedNotis = currentChildallnoti.sort(
        (a: any, b: any) => a.days_from - b.days_from,
      ).reverse()
        .filter((item) => {
          return item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis())
        });
      console.log(combinedNotis, "combinedNotis")
      setNotifications(combinedNotis)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      setAllChildNotification(allnotis);
      // console.log(allnotis) //allnotis.gwcdnotis,allnotis.hcnotis,allnotis.vcnotis
      if (allChildnotification.length > 0) {
        const currentChildNotis = allChildnotification.find((item) => item.childuuid == activeChild.uuid)
        // console.log(currentChildNotis,"allfilteredNotis")
        calculateNotis(currentChildNotis)
      }
    }, [activeChild.uuid, allChildnotification])
  );
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  const onCategorychange = async (selectedCategoriesParam: any) => {
    console.log(selectedCategoriesParam);
    const selectedFilters = selectedCategoriesParam.filter(category => category.isActivated == true).map(item => {
      return item.type
    });
    if (selectedFilters.includes('vc')) {
      selectedFilters.push('vcr')
    }
    if (selectedFilters.includes('hc')) {
      selectedFilters.push('hcr')
    }
    setselectedCategories(selectedFilters)

    // on vc hc reminder check add reminder category to list, and remove vica versa
    console.log(selectedFilters, "selectedFilters")
  };
  const onNotiItemChecked = (item: any, isChecked: boolean) => {
    console.log(item, isChecked, checkedNotifications.length, "checkedNotifications")
    if (isChecked == true) {
      const allCheckedNotis = [
        ...checkedNotifications,
        item
      ];
      setCheckedNotifications(allCheckedNotis);
      console.log(checkedNotifications, "checkedNotifications,in if");

    } else {
      const allCheckedNotis = [...checkedNotifications].filter(
        (element) => element !== item,
      );
      setCheckedNotifications(allCheckedNotis);
      console.log(checkedNotifications, "checkedNotifications");
    }

  }
  const onItemReadMarked = async (notiItem: any) => {
    console.log(notiItem);
    let allNotifications = [...allChildnotification];
    console.log(allNotifications, "copiedAllNOTI")
    let currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    let currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    console.log(currentChildNotis, currentChildIndex, "currentChildNotis")
    if (notiItem.type == 'gw' || notiItem.type == 'cd') {
      const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      let allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis
    } else if (notiItem.type == 'vc') {
      const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      let allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.vcnotis = allvcnotis
    } else if (notiItem.type == 'hc') {
      const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      let allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.hcnotis = allhcnotis
    } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
      if (currentChildNotis.reminderNotis) {
        const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        let newItem: any = { ...notiItem };
        newItem.isRead = (newItem.isRead == true) ? false : true;
        delete newItem.isChecked;
        let allremindenotis = [...currentChildNotis.reminderNotis]
        allremindenotis[notitoUpdateIndex] = newItem;
        currentChildNotis.reminderNotis = allremindenotis
      }
    }
    allNotifications[currentChildIndex] = currentChildNotis
    console.log(allNotifications, "allNotifications")
    setAllChildNotification(allNotifications);
    dispatch(setAllNotificationData(allNotifications));
    
    calculateNotis(currentChildNotis);
    return currentChildNotis
  }
  const onItemDeleteMarked = (notiItem: any) => {
    console.log(notiItem);
    let allNotifications = [...allChildnotification];
    console.log(allNotifications, "copiedAllNOTI")
    let currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    let currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    console.log(currentChildNotis, currentChildIndex, "currentChildNotis")
    if (notiItem.type == 'gw' || notiItem.type == 'cd') {
      const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      let allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis;
      allNotifications[currentChildIndex] = currentChildNotis
      console.log(allNotifications, "AFTERDELETE allNotifications")
     setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      // setAllNotification(allNotifications);
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'vc') {
      const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      let allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.vcnotis = allvcnotis;
      allNotifications[currentChildIndex] = currentChildNotis
      console.log(allNotifications, "AFTERDELETE allNotifications");
      setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      // setAllNotification(allNotifications);
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'hc') {
      const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      let allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.hcnotis = allhcnotis
      allNotifications[currentChildIndex] = currentChildNotis
      console.log(allNotifications, "AFTERDELETE allNotifications")
     setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      // setAllNotification(allNotifications);
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
      if (currentChildNotis.reminderNotis) {
        const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        let newItem: any = { ...notiItem };
        newItem.isDeleted = true;
        delete newItem.isChecked;
        console.log(newItem, "deleteItem")
        // currentChildNotis.reminderNotis = currentChildNotis.reminderNotis.map((item) => (item.uuid == notiItem.uuid) && (item.type == notiItem.type) ? newItem : item);
        let allremindenotis = [...currentChildNotis.reminderNotis]
        allremindenotis[notitoUpdateIndex] = newItem;
        currentChildNotis.reminderNotis = allremindenotis;
        console.log(currentChildNotis, "currentChildNotis");
        allNotifications[currentChildIndex] = currentChildNotis
        console.log(allNotifications, "AFTERDELETE allNotifications");
        setAllChildNotification(allNotifications);
        dispatch(setAllNotificationData(allNotifications));
        // setAllNotification(allNotifications);
        calculateNotis(currentChildNotis);
      }
    }

  }
  const deleteSelectedNotifications = async () => {

    let allNotifications = [...allChildnotification];
    console.log(allNotifications, "copiedAllNOTI")
    let currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    let currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)

    console.log(checkedNotifications);

    // allNotifications[currentChildIndex] = currentChildNotis
    // console.log(allNotifications, "allNotifications")


    checkedNotifications.map(async (notiItem) => {
      console.log(notiItem);

      if (notiItem.type == 'gw' || notiItem.type == 'cd') {
        const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        let newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        let allgwcdnotis = [...currentChildNotis.gwcdnotis]
        allgwcdnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.gwcdnotis = allgwcdnotis
      } else if (notiItem.type == 'vc') {
        const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        let newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        let allvcnotis = [...currentChildNotis.vcnotis]
        allvcnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.vcnotis = allvcnotis
      } else if (notiItem.type == 'hc') {
        const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        let newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        let allhcnotis = [...currentChildNotis.hcnotis]
        allhcnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.hcnotis = allhcnotis
      } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
        if (currentChildNotis.reminderNotis) {
          const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
          let newItem: any = { ...notiItem };
          newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
          delete newItem.isChecked;
          let allremindenotis = [...currentChildNotis.reminderNotis]
          allremindenotis[notitoUpdateIndex] = newItem;
          currentChildNotis.reminderNotis = allremindenotis;
          //if reminder date time is passed from currentdate time,, then delete the reminder
          // "notiItem.growth_period" will have element.reminderTime,
          // "notiItem. periodName"will have element.reminderDate,
        }
      }
    })
    allNotifications[currentChildIndex] = currentChildNotis
    console.log(allNotifications, "allNotifications");
    setAllChildNotification(allNotifications)
    dispatch(setAllNotificationData(allNotifications));
    // setAllNotification(allNotifications);
    calculateNotis(currentChildNotis);
    setIsDeleteEnabled(!isDeleteEnabled);
    setCheckedNotifications([]);
  }
  return (
    <>
      <View style={{flex:1,backgroundColor:primaryColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View style={{ flex:1,flexDirection: 'column', paddingBottom: 35,backgroundColor:'#FFF'}}>
          <HeaderRowView
            style={{
              backgroundColor: primaryColor,
              maxHeight: 50,
            }}>

            <BurgerIcon />

            <HeaderTitleView style={{ flex: 2 }}>
              <Heading2w>{t('notiScreenheaderTitle')}</Heading2w>
            </HeaderTitleView>

            <OuterIconRow>
              <OuterIconSpace>
                <Pressable onPress={() => navigation.navigate('SettingsScreen')}>
                  <Icon name={'ic_sb_settings'} size={22} color="#FFF" />
                </Pressable>
              </OuterIconSpace>
              {isFutureDate(activeChild?.birthDate) || notifications.length == 0 ? null :
                <OuterIconSpace>
                  <Pressable onPress={() => { setIsDeleteEnabled(!isDeleteEnabled); setCheckedNotifications([]); }}>
                    <Icon name={'ic_trash'} size={20} color="#FFF" />
                  </Pressable>
                </OuterIconSpace>}
            </OuterIconRow>
            <HeaderBabyMenu />
          </HeaderRowView>
          {isFutureDate(activeChild?.birthDate) ? <Heading4Center style={{marginTop:10}}>{t('noDataTxt')}</Heading4Center> :
            notifications.length > 0 ?
              <ScrollView style={{ flex: 7, }}>
                <NotificationsCategories onchange={onCategorychange} />
                <View style={{ marginVertical: 0, paddingBottom: 10 }}>
                  {

                    notifications.map((item, index) => {
                      if (selectedCategories.length == 0) {
                        return (
                          <View key={index}>
                            <NotificationItem
                              item={item}
                              itemIndex={index}
                              isDeleteEnabled={isDeleteEnabled}
                              onItemChecked={onNotiItemChecked}
                              onItemReadMarked={onItemReadMarked}
                              onItemDeleteMarked={onItemDeleteMarked}
                              childAgeInDays={childAgeInDays}
                              activeChild={activeChild}
                            />
                          </View>
                        );
                      } else {
                        if (selectedCategories.includes(item.type)) {
                          return (
                            <View key={index}>
                              <NotificationItem
                                item={item}
                                itemIndex={index}
                                isDeleteEnabled={isDeleteEnabled}
                                onItemChecked={onNotiItemChecked}
                                onItemReadMarked={onItemReadMarked}
                                onItemDeleteMarked={onItemDeleteMarked}
                                childAgeInDays={childAgeInDays}
                                activeChild={activeChild}
                              />
                            </View>
                          );
                        }
                      }

                    })}
                </View>
              </ScrollView> : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
          {
            isDeleteEnabled ? (
              <>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint onPress={() => { setIsDeleteEnabled(!isDeleteEnabled); setCheckedNotifications([]) }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary onPress={() => { deleteSelectedNotifications() }}  disabled={checkedNotifications.length==0?true:false}>
                      <ButtonText numberOfLines={2}>{t('notiDelSelected', { count: checkedNotifications.length })} </ButtonText>
                    </ButtonSecondary>
                  </ButtonColTwo>

                </ButtonContainerTwo>
              </>
            ) : null}

        </View>
      </View>
    </>
  );
};
export default Notifications;