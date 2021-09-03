
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
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInDays } from '../../services/childCRUD';
import { DateTime } from 'luxon';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
const Notifications = () => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const growthColor = themeContext.colors.CHILDGROWTH_COLOR;
  const vaccinationColor = themeContext.colors.VACCINATION_COLOR;
  const hkColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const cdColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedCategories, setselectedCategories] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // let allnotis = useAppSelector((state: any) =>
  // (state.notificationData.notifications != "" ? JSON.parse(state.notificationData.notifications) : []
  // ));
  // allnotis = allnotis.sort(function (a, b) {
  //   return a.days_from - b.days_from;
  // });
  // console.log(allnotis, "allnotis", new Date(activeChild.createdAt), new Date(activeChild.birthDate));

  

  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  // childBirthDate<childCreateDate ?activeChild.createdAt:activeChild.birthDate
  console.log(childAgeInDays, "childAgeInDays");
  // const notifications = ;
  // console.log(notifications, "all notis till prev and current date", notifications.length);


  const onCategorychange = (selectedCategories:any) => {
    console.log(selectedCategories);
    const selectedFilters = selectedCategories.filter(category=>category.isActivated==true);
    console.log(selectedFilters,"selectedFilters")
    // const filteredNotications:any[] = [];
    // if(selectedFilters.length>0){
    //   selectedFilters.forEach(category => {
    //     console.log(category.type,"category")
    //     // console.log( allnotis.filter(notification => {notification.type == category.type}))
    //   //  allnotis.map(notification => {notification.type == category.type}).forEach(element => {
    //   //   filteredNotications.push(element)
    //   //  });
    // })
    // console.log(filteredNotications,"filteredNotications")
    // // newArray[itemIndex].isChecked=isChecked;
    // setNotifications(filteredNotications);
    // }else{
    //   setNotifications(allnotis.filter((item) => item.days_from <= childAgeInDays).reverse());
    // }
  };
  const onNotiItemChecked = (itemIndex: number, isChecked: boolean) => {
    console.log(itemIndex,isChecked,selectedCategories)
    
  } 
  // useEffect(() => {
  //   const childCreateDate = DateTime.fromJSDate(new Date(activeChild.createdAt));
  // const childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate));
  // console.log(childCreateDate < childBirthDate? activeChild.birthDate: activeChild.createdAt);
  //   if(childCreateDate < childBirthDate){
  //     setNotifications(allnotis.filter((item) => item.days_from <= childAgeInDays));
  //     console.log('inif')
  //   }else{
  //     console.log('inelse') //show current period's notifications if child was created after birth date
  //     setNotifications(allnotis.filter((item) => item.days_from < childAgeInDays && item.days_to>=childAgeInDays));
  //      //  allnotis.filter((item) => item.days_from < childAgeInDays))
  //   }
  //   // show all notifications if child was created before birth date or what? =>expecting child case
  //   // after period passed , show all previous period's notifications  till childcreate date or child dob ?
    
  // }, [])
  // let childAge = useAppSelector(
  //   (state: any) =>
  //     state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  // );
  // let allHealthCheckupsData = useAppSelector(
  //   (state: any) =>
  //   state.utilsData.healthCheckupsData != '' ? JSON.parse(state.utilsData.healthCheckupsData) : [],
  // );
  // const taxonomy = useAppSelector(
  //   (state: any) =>
  //     (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  // );
  // let allGrowthPeriods = taxonomy?.growth_period;
  // let allVaccinePeriods = useAppSelector(
  //   (state: any) =>
  //   state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  // );
  const calcAllNotis = ()=>{
  //  console.log(JSON.stringify(getAllNotifications(childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods)))
  }
  // useEffect(() => {
   
  //  return () => {
    // const { notifications }  =  getAllNotificationsForActiveChild();
    // console.log(notifications);
    // setNotifications(notifications);
  //  };
  // },[]);

  // const { notifications } = ;
  // console.log("notifications", notifications.length)
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
                <Pressable onPress={() => calcAllNotis()}>
                {/* <Pressable onPress={() => navigation.navigate('SettingsScreen')}> */}
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