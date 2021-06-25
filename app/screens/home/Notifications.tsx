import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import NotificationsCategories from '@components/NotificationsCategories';
import BurgerIcon from '@components/shared/BurgerIcon';
import Icon from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
const Notifications = () => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const {t} = useTranslation();
  const onchange = (selectedboxes) => {
   // console.log(selectedboxes);
  };
  const DATA = [
    {
      id: 0,
      title: "You haven't update your child's growth details from last 1 month",
      timeStamp: '10 minutes ago',
      type: 'growth',
    },
    {
      id: 2,
      title:
        "The next development milestones are set for jenny. Fill all the question to track you baby's milestones.",
      timeStamp: '15 minutes ago',
      type: 'development',
    },
    {
      id: 3,
      title: 'Reminder has been set for the vaccination',
      timeStamp: '19 minutes ago',
      type: 'vaccination',
    },
    {
      id: 4,
      title: "Update your child growth data to track baby's growth",
      timeStamp: '20 minutes ago',
      type: 'healthchkp',
    },
  ];
  const geticonname =(type:string)=>{
   return type=="growth" ? ("ic_growth"): type=="development" ?  "ic_milestone":type=="vaccination" ?  "ic_vaccination":type=="healthchkp" ?  "ic_doctor_chk_up":"";
  }
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: primaryColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <BurgerIcon />
          </View>
          <View style={{ flex: 5, padding: 8 }}>
            <Heading2w> {t('notiScreenheaderTitle')}</Heading2w>
          </View>
        </View>

        <NotificationsCategories onchange={onchange} />
        <View style={{margin: 10}}>
          {DATA.map((item, index) => {
            return (
              <View style={{flexDirection: 'row', padding: 10, margin: 10}}>
                <Icon name={geticonname(item.type)} size={20} color="#000" style={{flex:1}}/>
                <View style={{flexDirection: 'column',flex:5}}>
                  <View>
                    <Text>{item.title}</Text>
                    <Text>{item.timeStamp}</Text>
                  </View>
                  <View
                    style={{
                      padding: 1,
                      margin: 5,
                      backgroundColor: '#000',
                    }}></View>
                </View>
                <Icon
                  style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
                  name={'ic_kebabmenu'}
                  size={20}
                  color="#000"
                />
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    </>
  );
};
export default Notifications;
