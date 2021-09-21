
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import HeaderBabyMenu from '@components/HeaderBabyMenu';
import NotificationItem from '@components/NotificationItem';
import NotificationsCategories from '@components/NotificationsCategories';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonColTwo, ButtonContainerTwo, ButtonSecondary, ButtonSecondaryTint, ButtonText } from '@components/shared/ButtonGlobal';
import { SafeAreaContainer } from '@components/shared/Container';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconRow, OuterIconSpace } from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading4Center } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setAllNotificationData } from '../../redux/reducers/notificationSlice';
import { getCurrentChildAgeInDays, isFutureDate } from '../../services/childCRUD';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
const Notifications = () => {
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

  let allnotis = useAppSelector((state: any) => (state.notificationData.notifications));
  console.log(allnotis, "allnotis");
  const calculateNotis = (currentChildNotis: any) => {
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
      let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
      const combinedNotis = currentChildallnoti.sort(
        (a: any, b: any) => a.days_from - b.days_from,
      ).reverse()
        .filter((item) => {
          return item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childCrateDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis())
        });
      console.log(combinedNotis, "combinedNotis")
      setNotifications(combinedNotis)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log(allnotis) //allnotis.gwcdnotis,allnotis.hcnotis,allnotis.vcnotis
      if (allnotis.length > 0) {
        const currentChildNotis = allnotis.find((item) => item.childuuid == activeChild.uuid)
        // console.log(currentChildNotis,"allfilteredNotis")
        calculateNotis(currentChildNotis)
      }
    }, [activeChild.uuid, allnotis])
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
    let allNotifications = [...allnotis];
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
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
    return currentChildNotis
  }
  const onItemDeleteMarked = (notiItem: any) => {
    console.log(notiItem);
    let allNotifications = allnotis;
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
      currentChildNotis.gwcdnotis = allgwcdnotis
    } else if (notiItem.type == 'vc') {
      const notitoUpdateIndex = currentChildNotis.vcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
      delete newItem.isChecked;
      let allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex] = newItem;
      currentChildNotis.vcnotis = allvcnotis
    } else if (notiItem.type == 'hc') {
      const notitoUpdateIndex = currentChildNotis.hcnotis.findIndex((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type))
      let newItem: any = { ...notiItem };
      newItem.isDeleted = newItem.isDeleted == true ? false : true;
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
        console.log(newItem, "deleteItem")
        // currentChildNotis.reminderNotis = currentChildNotis.reminderNotis.map((item) => (item.days_from == notiItem.days_from) && (item.days_to == notiItem.days_to) && (item.type == notiItem.type) ? newItem : item);

        let allremindenotis = [...currentChildNotis.reminderNotis]
        allremindenotis[notitoUpdateIndex] = newItem;
        currentChildNotis.reminderNotis = allremindenotis
      }
    }
    allNotifications[currentChildIndex] = currentChildNotis
    console.log(allNotifications, "AFTERDELETE allNotifications")
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
  }
  const deleteSelectedNotifications = async () => {

    let allNotifications = [...allnotis];
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
    console.log(allNotifications, "allNotifications")
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
    setIsDeleteEnabled(!isDeleteEnabled);
    setCheckedNotifications([]);
  }
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <FlexCol>
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
              {isFutureDate(activeChild?.birthDate) ? null :
                <OuterIconSpace>
                  <Pressable onPress={() => { setIsDeleteEnabled(!isDeleteEnabled); setCheckedNotifications([]); }}>
                    <Icon name={'ic_trash'} size={20} color="#FFF" />
                  </Pressable>
                </OuterIconSpace>}
            </OuterIconRow>
            <HeaderBabyMenu />
          </HeaderRowView>
          {isFutureDate(activeChild?.birthDate) ? <Heading4Center>{t('noDataTxt')}</Heading4Center> :
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
                    <ButtonSecondary onPress={() => { deleteSelectedNotifications() }}>
                      <ButtonText numberOfLines={2}>{t('notiDelSelected', { count: checkedNotifications.length })} </ButtonText>
                    </ButtonSecondary>
                  </ButtonColTwo>

                </ButtonContainerTwo>
              </>
            ) : null}

        </FlexCol>
      </SafeAreaContainer>
    </>
  );
};
export default Notifications;