
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
import { Heading2w } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
import { getAllNotifications } from '../../services/notificationService';
import { useAppDispatch, useAppSelector } from '../../../App';
import { getCurrentChildAgeInDays } from '../../services/childCRUD';
import { DateTime } from 'luxon';
import { LabelText } from '@components/shared/ChildSetupStyle';
import { setAllNotificationData } from '../../redux/reducers/notificationSlice';
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

  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  
  let allnotis = useAppSelector((state: any) =>(state.notificationData.notifications));
  const calculateNotis = (currentChildNotis:any)=>{
      if(currentChildNotis){
      let currentChildallnoti:any= [];
          currentChildNotis.gwcdnotis.forEach((item)=>{
            currentChildallnoti.push(item)
          })
          currentChildNotis.hcnotis.forEach((item)=>{
            currentChildallnoti.push(item)
          })
          currentChildNotis.vcnotis.forEach((item)=>{
            currentChildallnoti.push(item)
          })
      const combinedNotis = currentChildallnoti.sort(
        (a: any, b: any) => a.days_from - b.days_from,
      ).reverse();
      // console.log(combinedNotis,"combinedNotis")
      setNotifications(combinedNotis)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log(allnotis) //allnotis.gwcdnotis,allnotis.hcnotis,allnotis.vcnotis
      if(allnotis.length>0){
        const currentChildNotis = allnotis.find((item) => item.childuuid == activeChild.uuid)
        // console.log(currentChildNotis,"allfilteredNotis")
        calculateNotis(currentChildNotis)
    }
    }, [activeChild.uuid])
  );
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  const onCategorychange = (selectedCategories: any) => {
    console.log(selectedCategories);
    const selectedFilters = selectedCategories.filter(category => category.isActivated == true);
    console.log(selectedFilters, "selectedFilters")
  };
  const onNotiItemChecked = (itemIndex: number, isChecked: boolean) => {
    console.log(itemIndex, isChecked, selectedCategories)

  }
  const onItemReadMarked = (notiItem:any)=>{
    console.log(notiItem);
    let allNotifications = [...allnotis];
    console.log(allNotifications,"copiedAllNOTI")
    let currentChildNotis  = {...allNotifications.find((item) => item.childuuid == activeChild.uuid)}
    let currentChildIndex  = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    console.log(currentChildNotis,currentChildIndex,"currentChildNotis")
    if(notiItem.type == 'gw' || notiItem.type=='cd'){
      const notitoUpdateIndex =  currentChildNotis.gwcdnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isRead = newItem.isRead ?false:true;
      let allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis
    }else if(notiItem.type == 'vc'){
      const notitoUpdateIndex =  currentChildNotis.vcnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isRead = newItem.isRead ?false:true;
      let allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.gwcdnotis = allvcnotis
    }else if(notiItem.type == 'hc'){
      const notitoUpdateIndex =  currentChildNotis.hcnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isRead = newItem.isRead ?false:true;
      let allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.hcnotis = allhcnotis
    }
    allNotifications[currentChildIndex] =currentChildNotis
    console.log(allNotifications,"allNotifications")
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
  }
  const onItemDeleteMarked = (notiItem:any)=>{
    console.log(notiItem);
    let allNotifications = [...allnotis];
    console.log(allNotifications,"copiedAllNOTI")
    let currentChildNotis  = {...allNotifications.find((item) => item.childuuid == activeChild.uuid)}
    let currentChildIndex  = allNotifications.findIndex((item) => item.childuuid == activeChild.uuid)
    console.log(currentChildNotis,currentChildIndex,"currentChildNotis")
    if(notiItem.type == 'gw' || notiItem.type=='cd'){
      const notitoUpdateIndex =  currentChildNotis.gwcdnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isDeleted = newItem.isDeleted ?false:true;
      let allgwcdnotis = [...currentChildNotis.gwcdnotis]
      allgwcdnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.gwcdnotis = allgwcdnotis
    }else if(notiItem.type == 'vc'){
      const notitoUpdateIndex =  currentChildNotis.vcnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isDeleted = newItem.isDeleted ?false:true;
      let allvcnotis = [...currentChildNotis.vcnotis]
      allvcnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.gwcdnotis = allvcnotis
    }else if(notiItem.type == 'hc'){
      const notitoUpdateIndex =  currentChildNotis.hcnotis.findIndex((item)=>item == notiItem)
      let newItem:any = {...notiItem};
      newItem.isDeleted = newItem.isDeleted ?false:true;
      let allhcnotis = [...currentChildNotis.hcnotis]
      allhcnotis[notitoUpdateIndex]=newItem;
      currentChildNotis.hcnotis = allhcnotis
    }
    allNotifications[currentChildIndex] =currentChildNotis
    console.log(allNotifications,"allNotifications")
    dispatch(setAllNotificationData(allNotifications));
    calculateNotis(currentChildNotis);
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
              <OuterIconSpace>
                <Pressable onPress={() => setIsDeleteEnabled(!isDeleteEnabled)}>
                  <Icon name={'ic_trash'} size={20} color="#FFF" />
                </Pressable>
              </OuterIconSpace>
            </OuterIconRow>
            <HeaderBabyMenu />
          </HeaderRowView>

          <ScrollView style={{ flex: 7 }}>
            <NotificationsCategories onchange={onCategorychange} />
            <View style={{ marginVertical: 0 }}>
              {

                notifications.map((item, index) => {
                  return (
                    <View key={index}>
                      <NotificationItem
                        item={item}
                        itemIndex={index}
                        isDeleteEnabled={isDeleteEnabled}
                        onItemChecked={onNotiItemChecked}
                        onItemReadMarked={onItemReadMarked}
                        onItemDeleteMarked={onItemDeleteMarked}
                      />
                    </View>
                  );
                })}
            </View>
          </ScrollView>
          {
            isDeleteEnabled ? (
              <>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint onPress={() => setIsDeleteEnabled(!isDeleteEnabled)}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary>
                      <ButtonText numberOfLines={2}>{t('notiDelSelected', { count: notifications.filter(item => item.isChecked === true).length })} </ButtonText>
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