import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import NotificationsCategories from '@components/NotificationsCategories';
import BurgerIcon from '@components/shared/BurgerIcon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from 'react-native';
import { ThemeContext } from 'styled-components';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
const Notifications = () => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const { t } = useTranslation();
  const onchange = (selectedboxes) => {
    console.log(selectedboxes);
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: primaryColor,
            maxHeight: 50,
          }}>
          <View style={{ flex: 1 }}>
            <BurgerIcon />
          </View>
          <View style={{ flex: 5, padding: 8 }}>
            <Heading2w> {t('notiScreen.headerTitle')}</Heading2w>
          </View>
        </View>

        <NotificationsCategories onchange={onchange} />
      </SafeAreaView>
    </>
  )
}
export default Notifications;
