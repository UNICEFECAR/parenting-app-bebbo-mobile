import ActivitiesCategories from '@components/ActivitiesCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SafeAreaView, View } from 'react-native';
import { ThemeContext } from 'styled-components';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Notifications = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const {t} = useTranslation();
  const buttonData =[
    {iconName:'ic_growth',displayName:t('drawerMenu.cgTxt')},
    {iconName:'ic_milestone',displayName:t('drawerMenu.cdTxt')},
    {iconName:'ic_vaccination',displayName:t('drawerMenu.vcTxt')},
    {iconName:'ic_doctor_chk_up',displayName:t('drawerMenu.hcTxt')},

  ]
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
          <View style={{flex: 5,padding:8}}>
            <Heading2w> {t('notiScreen.headerTitle')}</Heading2w>
          </View>
        </View>
        <ActivitiesCategories
              borderColor={primaryColor}
              backgroundColor={primaryColor}
              buttonData={buttonData}
            />
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      </SafeAreaView>
    </>
  );
};
// Notifications.navigationOptions = screenProps => ({
//   title: 'Home',
// });
Notifications.navigationOptions = () => ({
  title: 'Notifications',
});
export default Notifications;
