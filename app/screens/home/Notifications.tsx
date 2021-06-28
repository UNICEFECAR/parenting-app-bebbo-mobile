import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import NotificationsCategories from '@components/NotificationsCategories';
import BurgerIcon from '@components/shared/BurgerIcon';
import Icon from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading5Bold } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { ThemeContext } from 'styled-components';
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
  const onchange = (selectedboxes) => {
    // console.log(selectedboxes);
  };
  const DATA = [
    {
      id: 0,
      title: "You haven't update your child's growth details from last 1 month",
      timeStamp: '10 minutes ago',
      type: 'growth',
      bgColor: growthColor,
    },
    {
      id: 2,
      title:
        "The next development milestones are set for jenny. Fill all the question to track you baby's milestones.",
      timeStamp: '15 minutes ago',
      type: 'development',
      bgColor: cdColor,
    },
    {
      id: 3,
      title: 'Reminder has been set for the vaccination',
      timeStamp: '19 minutes ago',
      type: 'vaccination',
      bgColor: vaccinationColor,
    },
    {
      id: 4,
      title: "Update your child growth data to track baby's growth",
      timeStamp: '20 minutes ago',
      type: 'healthchkp',
      bgColor: hkColor,
    },
  ];
  const geticonname = (type: string) => {
    return type == 'growth'
      ? 'ic_growth'
      : type == 'development'
      ? 'ic_milestone'
      : type == 'vaccination'
      ? 'ic_vaccination'
      : type == 'healthchkp'
      ? 'ic_doctor_chk_up'
      : '';
  };
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
          <View style={{flex: 5, padding: 8}}>
            <Heading2w> {t('notiScreenheaderTitle')}</Heading2w>
          </View>
          <View style={{flex: 1,flexDirection:'row'}}>
            <Icon name={'ic_sb_settings'} size={20} color="#FFF" />
            <Icon name={'ic_trash'} size={20} color="#FFF" />
          </View>
        </View>

        <NotificationsCategories onchange={onchange} />
        <View style={{marginVertical: 10}}>
          {DATA.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  // paddingVertical: 10,
                  marginVertical: 10,
                }}
                key={index}>
                <View
                  style={{
                    flex: 1,marginVertical:10
                  }}>
                  <Icon
                    name={geticonname(item.type)}
                    size={20}
                    color="#000"
                    style={{padding: 20,justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                    backgroundColor: item.bgColor,}}
                  />
                </View>

                <View style={{flexDirection: 'column', flex: 5}}>
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
                <Menu
                  renderer={renderers.ContextMenu}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onSelect={(value) =>
                    console.log(`Selected number: ${value} ${item}`)
                  }>
                  <MenuTrigger>
                    <Icon
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        alignSelf: 'center',
                      }}
                      name={'ic_kebabmenu'}
                      size={25}
                      color="#000"
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{
                      optionsContainer: {
                        marginTop: 30,
                        borderRadius: 10,
                        backgroundColor: primaryTintColor,
                      },
                      optionWrapper: {
                        borderBottomWidth: 1,
                        padding: 15,
                      },
                    }}>
                    <MenuOption value={1}>
                      <Heading5Bold>Delete this notification</Heading5Bold>
                    </MenuOption>
                    <MenuOption value={2}>
                      <Heading5Bold>Mark as Read</Heading5Bold>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    </>
  );
};
export default Notifications;
