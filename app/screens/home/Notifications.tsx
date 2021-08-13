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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
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
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  
  const DATA = [
    {
      id: 0,
      title: "You haven't update your child's growth details from last 1 month",
      timeStamp: '10 minutes ago',
      type: 'growth',
      bgColor: growthColor,
      isChecked:false,
    },
    {
      id: 2,
      title:
        "The next development milestones are set for jenny. Fill all the question to track you baby's milestones.",
      timeStamp: '15 minutes ago',
      type: 'development',
      bgColor: cdColor,
      isChecked:false,
    },
    {
      id: 3,
      title: 'Reminder has been set for the vaccination',
      timeStamp: '19 minutes ago',
      type: 'vaccination',
      bgColor: vaccinationColor,
      isChecked:false,
    },
    {
      id: 4,
      title: "Update your child growth data to track baby's growth",
      timeStamp: '20 minutes ago',
      type: 'healthchkp',
      bgColor: hkColor,
      isChecked:false,
    },
    {
      id: 5,
      title: "You haven't update your child's growth details from last 1 month",
      timeStamp: '10 minutes ago',
      type: 'growth',
      bgColor: growthColor,
      isChecked:false,
    },
    {
      id: 6,
      title:
        "The next development milestones are set for jenny. Fill all the question to track you baby's milestones.",
      timeStamp: '15 minutes ago',
      type: 'development',
      bgColor: cdColor,
      isChecked:false,
    },
    {
      id: 7,
      title: 'Reminder has been set for the vaccination',
      timeStamp: '19 minutes ago',
      type: 'vaccination',
      bgColor: vaccinationColor,
      isChecked:false,
    },
    {
      id: 8,
      title: "Update your child growth data to track baby's growth",
      timeStamp: '20 minutes ago',
      type: 'healthchkp',
      bgColor: hkColor,
      isChecked:false,
    },
    {
      id: 9,
      title: 'Reminder has been set for the vaccination',
      timeStamp: '19 minutes ago',
      type: 'vaccination',
      bgColor: vaccinationColor,
      isChecked:false,
    },
    {
      id: 10,
      title: "Update your child growth data to track baby's growth",
      timeStamp: '20 minutes ago',
      type: 'healthchkp',
      bgColor: hkColor,
      isChecked:false,
    },
  ];
  const [allData, setallData] = useState(DATA);
  const onCategorychange = (selectedCategories) => {
    console.log(selectedCategories);
  };
  const onNotiItemChecked =(itemIndex:number,isChecked:boolean)=>{
    const newArray = [...allData];
    newArray[itemIndex].isChecked=isChecked;
    setallData(newArray);
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
           
            <HeaderTitleView style={{flex: 2}}>
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
          
          <ScrollView style={{flex: 7}}>
            <NotificationsCategories onchange={onCategorychange} />
            <View style={{marginVertical: 0}}>
              {
               
              allData.map((item, index) => {
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
                    <ButtonText numberOfLines={2}>{t('notiDelSelected',{count:allData.filter(item=>item.isChecked===true).length})} </ButtonText>
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