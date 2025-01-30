import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import HeaderBabyMenu from '@components/HeaderBabyMenu';
import HeaderNotiIcon from '@components/HeaderNotiIcon';
import NotificationItem from '@components/NotificationItem';
import NotificationsCategories from '@components/NotificationsCategories';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonColTwo, ButtonContainerTwo, ButtonSecondary, ButtonSecondaryTint, ButtonText } from '@components/shared/ButtonGlobal';
import { HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconRow, OuterIconSpace } from '@components/shared/Icon';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { bgcolorWhite, bgcolorWhite2 } from '@styles/style';
import { Heading2w, Heading4Center } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, AppState, BackHandler, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setAllNotificationData } from '../../redux/reducers/notificationSlice';
import { getCurrentChildAgeInDays, isFutureDate } from '../../services/childCRUD';
const styles = StyleSheet.create(
  {
    buttonContainerTwo: { backgroundColor: bgcolorWhite2 },
    flex1: { flex: 1 },
    flex2: { flex: 2 },
    flex7: { flex: 7 },
    headerTitleTextColor: {
      color: bgcolorWhite
    },
    mainOuterView: { flex: 1, flexDirection: 'column', backgroundColor: bgcolorWhite2 },
    marginTop10: { marginTop: 10 },
    maxHeight50: { maxHeight: 50 },
    notiCategoriesView: { flex: 1, marginVertical: 0, paddingBottom: 10 },
    paddingBottom8: { paddingBottom: '8%' }
  }
)
const Notifications = (): any => {
  const allnotis = useAppSelector((state: any) => (state.notificationData.notifications));
  const [allChildnotification, setAllChildNotification] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext?.colors.PRIMARY_COLOR;
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [selectedCategories, setselectedCategories] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [checkedNotifications, setCheckedNotifications] = useState<any[]>(
    [],
  );
  const flatListRefNoti = useRef(null);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const onBackPress = (): any => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeDrawerNavigator' }],
    });
    return true;
  }
  useFocusEffect(
    React.useCallback(() => {
      navigation.dispatch(DrawerActions.closeDrawer());
    }, [navigation])
  );

  useEffect(() => {
    // navigation.dispatch(DrawerActions.closeDrawer());
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    navigation.addListener('gestureEnd', onBackPress);
    return (): any => {
      navigation.removeListener('gestureEnd', onBackPress);
      backHandler.remove()
    };
  }, []);
  const appState = useRef(AppState.currentState);
  const calculateNotis = (currentChildNotis: any): any => {
    if (currentChildNotis != undefined) {
      const currentChildallnoti: any = [];
      if (currentChildNotis.gwcdnotis) {
        currentChildNotis.gwcdnotis.forEach((item: any) => {
          const newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.hcnotis) {
        currentChildNotis.hcnotis.forEach((item: any) => {
          const newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.vcnotis) {
        currentChildNotis.vcnotis.forEach((item: any) => {
          const newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      if (currentChildNotis.reminderNotis) {
        currentChildNotis.reminderNotis.forEach((item: any) => {
          const newItem = { ...item }
          newItem['isChecked'] = false;
          currentChildallnoti.push(newItem)
        })
      }
      const toDay = DateTime.fromJSDate(new Date()).toMillis();
      const childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
      const combinedNotis = currentChildallnoti.sort(
        (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
      ).reverse()
        .filter((item: any) => {
          return item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis())
        });
      setNotifications(combinedNotis)
      setIsLoading(false)
    } else {
      setNotifications([]);
      setIsLoading(false)
    }
  }
  const handleAppStateChange = (nextAppState: any): any => {
    if (appState != nextAppState) {
      if (appState.current.match(/inactive|background/)
        && nextAppState === 'active') {
        if (allChildnotification.length > 0) {
          const currentChildNotis = allChildnotification.find((item: any) => item.childuuid == activeChild.uuid)
          calculateNotis(currentChildNotis)
        }

      }
      appState.current = nextAppState;
    }
  };
  useEffect(() => {
    // AppState.addEventListener('change', handleAppStateChange);
    // return ():any => {
    //   AppState.removeEventListener('change', handleAppStateChange);
    // };
    const eventListener = AppState.addEventListener('change', handleAppStateChange)

    return (): any => {
      eventListener.remove()
      // AppState.removeEventListener('change', updateTrackingStatus)
    }
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      setAllChildNotification(allnotis);
      if (allnotis.length > 0) {
        const currentChildNotis = allnotis.find((item: any) => item.childuuid == activeChild.uuid)
        calculateNotis(currentChildNotis)
      }
    }, [activeChild.uuid, allnotis])
  );
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  const onCategorychange = async (selectedCategoriesParam: any): Promise<any> => {
    const selectedFilters = selectedCategoriesParam.filter((category: any) => category.isActivated == true).map((item: any) => {
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
  };
  const onNotiItemChecked = (item: any, isChecked: boolean): any => {
    if (isChecked == true) {
      const allCheckedNotis = [
        ...checkedNotifications,
        item
      ];
      setCheckedNotifications(allCheckedNotis);

    } else {
      const allCheckedNotis = [...checkedNotifications].filter(
        (element) => element !== item,
      );
      setCheckedNotifications(allCheckedNotis);
    }

  }
  const onItemReadMarked = async (notiItem: any): Promise<any> => {
    const allNotifications = [...allChildnotification];
    const currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    const currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    if (notiItem.type == 'gw' || notiItem.type == 'cd') {
      const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      const allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis
    } else if (notiItem.type == 'vc') {
      const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      const allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.vcnotis = allvcnotis
    } else if (notiItem.type == 'hc') {
      const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isRead = (newItem.isRead == true) ? false : true;
      delete newItem.isChecked;
      const allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.hcnotis = allhcnotis
    } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
      if (currentChildNotis.reminderNotis) {
        const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item: any) => (item.uuid == notiItem.uuid) && (item.type == notiItem.type) && (item.subtype == notiItem.subtype) && (item.subtypeid == notiItem.subtypeid));
        const newItem: any = { ...notiItem };
        newItem.isRead = (newItem.isRead == true) ? false : true;
        delete newItem.isChecked;
        const allremindenotis = [...currentChildNotis.reminderNotis]
        allremindenotis[notitoUpdateIndex] = newItem;
        currentChildNotis.reminderNotis = allremindenotis
      }
    }
    allNotifications[currentChildIndex] = currentChildNotis
    setAllChildNotification(allNotifications);
    dispatch(setAllNotificationData(allNotifications));

    calculateNotis(currentChildNotis);
    return currentChildNotis
  }
  const onItemDeleteMarked = (notiItem: any): any => {
    const allNotifications = [...allChildnotification];
    const currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    const currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    if (notiItem.type == 'gw' || notiItem.type == 'cd') {
      const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      const allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis;
      allNotifications[currentChildIndex] = currentChildNotis
      setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'vc') {
      const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      const allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.vcnotis = allvcnotis;
      allNotifications[currentChildIndex] = currentChildNotis
      setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'hc') {
      const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      const newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      const allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.hcnotis = allhcnotis
      allNotifications[currentChildIndex] = currentChildNotis
      setAllChildNotification(allNotifications);
      dispatch(setAllNotificationData(allNotifications));
      calculateNotis(currentChildNotis);
    } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
      if (currentChildNotis.reminderNotis) {
        const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item: any) => (item.uuid == notiItem.uuid) && (item.type == notiItem.type) && (item.subtype == notiItem.subtype) && (item.subtypeid == notiItem.subtypeid));
        const newItem: any = { ...notiItem };
        newItem.isDeleted = true;
        delete newItem.isChecked;
        const allremindenotis = [...currentChildNotis.reminderNotis]
        allremindenotis[notitoUpdateIndex] = newItem;
        currentChildNotis.reminderNotis = allremindenotis;
        allNotifications[currentChildIndex] = currentChildNotis
        console.log(allNotifications, "AFTERDELETE allNotifications");
        setAllChildNotification(allNotifications);
        dispatch(setAllNotificationData(allNotifications));
        calculateNotis(currentChildNotis);
      }
    }

  }
  const deleteSelectedNotifications = async (): Promise<any> => {

    const allNotifications = [...allChildnotification];
    const currentChildNotis = { ...allNotifications.find((item) => item.childuuid == activeChild.uuid) }
    const currentChildIndex = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    checkedNotifications.map(async (notiItem: any) => {
      if (notiItem.type == 'gw' || notiItem.type == 'cd') {
        const notitoUpdateIndex = currentChildNotis.gwcdnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        const newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        const allgwcdnotis = [...currentChildNotis.gwcdnotis]
        allgwcdnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.gwcdnotis = allgwcdnotis
      } else if (notiItem.type == 'vc') {
        const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        const newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        const allvcnotis = [...currentChildNotis.vcnotis]
        allvcnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.vcnotis = allvcnotis
      } else if (notiItem.type == 'hc') {
        const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item: any) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
        const newItem: any = { ...notiItem };
        newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
        delete newItem.isChecked;
        const allhcnotis = [...currentChildNotis.hcnotis]
        allhcnotis[notitoUpdateIndex] = newItem;
        currentChildNotis.hcnotis = allhcnotis
      } else if (notiItem.type == 'hcr' || notiItem.type == 'vcr') {
        if (currentChildNotis.reminderNotis) {
          const notitoUpdateIndex = currentChildNotis.reminderNotis.findIndex((item: any) => (item.uuid == notiItem.uuid) && (item.type == notiItem.type) && (item.subtype == notiItem.subtype) && (item.subtypeid == notiItem.subtypeid));
          const newItem: any = { ...notiItem };
          newItem.isDeleted = (newItem.isDeleted == true) ? false : true;
          delete newItem.isChecked;
          const allremindenotis = [...currentChildNotis.reminderNotis]
          allremindenotis[notitoUpdateIndex] = newItem;
          currentChildNotis.reminderNotis = allremindenotis;
        }
      }
    })
    allNotifications[currentChildIndex] = currentChildNotis
    setAllChildNotification(allNotifications)
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
    setIsDeleteEnabled(!isDeleteEnabled);
    setCheckedNotifications([]);
  }
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: primaryColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View style={styles.mainOuterView}>
          <HeaderRowView
            style={[styles.maxHeight50, {
              backgroundColor: primaryColor
            }]}>

            <BurgerIcon />

            <HeaderTitleView style={styles.flex2}>
              <Heading2w style={styles.headerTitleTextColor}>{t('notiScreenheaderTitle')}</Heading2w>
            </HeaderTitleView>

            <OuterIconRow>
              <OuterIconSpace>
                <HeaderNotiIcon color="#000" isVisibleIcon={false} />
                <Pressable onPress={(): any => navigation.navigate('SettingsScreen')}>
                  <Icon name={'ic_sb_settings'} size={22} color="#FFF" />
                </Pressable>
              </OuterIconSpace>
              {isFutureDate(activeChild?.birthDate) || notifications.length == 0 ? null :
                <OuterIconSpace>
                  <Pressable onPress={(): any => { setIsDeleteEnabled(!isDeleteEnabled); setCheckedNotifications([]); }}>
                    <Icon name={'ic_trash'} size={20} color="#FFF" />
                  </Pressable>
                </OuterIconSpace>}
            </OuterIconRow>
            <HeaderBabyMenu setProfileLoading={setProfileLoading} />
          </HeaderRowView>
          {isFutureDate(activeChild?.birthDate) ? <Heading4Center style={styles.marginTop10}>{t('noDataTxt')}</Heading4Center> :
            notifications.length > 0 ?
              <View style={styles.flex7}>
                <NotificationsCategories onchange={onCategorychange} />
                <View style={styles.notiCategoriesView}>
                  {
                    notifications?.length > 0 ?
                      selectedCategories.length == 0 || (selectedCategories.length > 0 && notifications.filter((item: { type: any; }) => selectedCategories.includes(item.type)).length > 0) ?
                        <FlatList
                          ref={flatListRefNoti}
                          data={selectedCategories.length == 0 ? notifications : notifications.filter((item: { type: any; }) => selectedCategories.includes(item.type))}
                          contentContainerStyle={styles.paddingBottom8}
                          onScroll={(e: any): any => {
                            console.log("e--", e);
                          }}
                          nestedScrollEnabled={true}
                          // keyboardDismissMode={"on-drag"}
                          // keyboardShouldPersistTaps='always'
                          removeClippedSubviews={true} // Unmount components when outside of window 
                          initialNumToRender={8} // Reduce initial render amount
                          maxToRenderPerBatch={8} // Reduce number in each render batch
                          updateCellsBatchingPeriod={100} // Increase time between renders
                          windowSize={30} // Reduce the window size
                          scrollIndicatorInsets={{ right: 1 }}
                          renderItem={({ item, index }): any => <NotificationItem
                            item={item}
                            itemIndex={index}
                            isDeleteEnabled={isDeleteEnabled}
                            onItemChecked={onNotiItemChecked}
                            onItemReadMarked={onItemReadMarked}
                            onItemDeleteMarked={onItemDeleteMarked}
                            childAgeInDays={childAgeInDays}
                            activeChild={activeChild}
                          />
                          }
                          keyExtractor={(_item: any, index: { toString: () => any; }): any => index.toString()}
                        /> : <Heading4Center>{t('noDataTxt')}</Heading4Center>
                      : <Heading4Center>{t('noDataTxt')}</Heading4Center>
                  }
                </View>
              </View> : isLoading == true ? <ActivityIndicator size="large" color={primaryColor} animating={true} /> : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
          {
            isDeleteEnabled ? (
              <>
                <ButtonContainerTwo style={styles.buttonContainerTwo}>
                  <ButtonColTwo>
                    <ButtonSecondaryTint onPress={(): any => { setIsDeleteEnabled(!isDeleteEnabled); setCheckedNotifications([]) }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary onPress={(): any => { deleteSelectedNotifications() }} disabled={checkedNotifications.length == 0 ? true : false}>
                      <ButtonText numberOfLines={2}>{t('notiDelSelected', { count: checkedNotifications.length })} </ButtonText>
                    </ButtonSecondary>
                  </ButtonColTwo>

                </ButtonContainerTwo>
              </>
            ) : null}

        </View>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};
export default Notifications;