import { FDirRow } from '@components/shared/FlexBoxStyle';
import { BottomBarBg, BottomBarList } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Activities from '@screens/home/bottomTabs/Activities';
import Articles from '@screens/home/bottomTabs/Articles';
import ChildDevelopment from '@screens/home/bottomTabs/ChildDevelopment';
import Home from '@screens/home/bottomTabs/Home';
import Childgrowth from '@screens/home/Childgrowth';
import HealthCheckups from '@screens/home/HealthCheckups';
import Vaccination from '@screens/home/Vaccination';
import { Heading3 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  StyleSheet, TouchableOpacity
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { DashboardBottomTabParamList } from './types';
const styles = StyleSheet.create({
  bottomtabIconStyle:{alignContent: 'center'},
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

const DashboardBottomTab =
  createBottomTabNavigator<DashboardBottomTabParamList>();
const secondStack = createStackNavigator<any>();
const secondaryRoot = () => {
  return (
    <secondStack.Navigator
      initialRouteName="ChildgrowthTab"
    >
      <secondStack.Screen name="ChildgrowthTab" component={Childgrowth} options={{ headerShown: false }} />
      <secondStack.Screen name="VaccinationTab" component={Vaccination} options={{ headerShown: false }} />
      <secondStack.Screen name="HealthCheckupsTab" component={HealthCheckups} options={{ headerShown: false }} />
    </secondStack.Navigator>
  );
}

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}>
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <TouchableOpacity

            onPress={() => {
              console.log("pressed")

            }}
            activeOpacity={1}>
            <BottomBarBg>
              <Pressable onPress={() => { setModalVisible(false); navigation.navigate("Tools", { screen: 'VaccinationTab' }) }}>
                <BottomBarList>
                  <FDirRow>
                    <OuterIconRow>
                      <OuterIconLeft>
                        <Icon name="ic_vaccination" size={24} color="#000" />
                      </OuterIconLeft>
                    </OuterIconRow>
                    <Heading3>{t('tabbarLabel6')}</Heading3>
                  </FDirRow>
                </BottomBarList>
              </Pressable>
              <Pressable onPress={() => { setModalVisible(false); navigation.navigate("Tools", { screen: 'HealthCheckupsTab' }) }}>
                <BottomBarList>
                  <FDirRow>
                    <OuterIconRow>
                      <OuterIconLeft>
                        <Icon name="ic_doctor_chk_up" size={24} color="#000" />
                      </OuterIconLeft>
                    </OuterIconRow>

                    <Heading3>{t('tabbarLabel7')}</Heading3>
                  </FDirRow>
                </BottomBarList>
              </Pressable>
              <Pressable onPress={() => { setModalVisible(false); navigation.navigate("Tools", { screen: 'ChildgrowthTab' }) }}>
                <BottomBarList>
                  <FDirRow>
                    <OuterIconRow>
                      <OuterIconLeft>
                        <Icon name="ic_growth" size={24} color="#000" />
                      </OuterIconLeft>
                    </OuterIconRow>
                    <Heading3>{t('tabbarLabel8')}</Heading3>
                  </FDirRow>
                </BottomBarList>

              </Pressable>

            </BottomBarBg>
          </TouchableOpacity>
        </Pressable>

      </Modal>
      <DashboardBottomTab.Navigator
        backBehavior={'firstRoute'}
        detachInactiveScreens={true}
        tabBarOptions={{
          activeTintColor: headerColor,
          inactiveTintColor: '#000',
          activeBackgroundColor: '#FFF',
          inactiveBackgroundColor: '#FFF',
          keyboardHidesTabBar: true,
          labelPosition: 'below-icon'

        }}
      >
        <DashboardBottomTab.Screen name="Home" component={Home}
          options={{
            tabBarLabel: t('tabbarLabel1'),
            tabBarIcon: ({ color, size }:any) => (
              <Icon name="ic_sb_home" color={color} size={size} />
            ),
            unmountOnBlur: true,
          }} />
        <DashboardBottomTab.Screen name="Activities" component={Activities} initialParams={{ categoryArray: [], currentSelectedChildId: 0, backClicked: 'no' }}
          options={{
            tabBarLabel: t('tabbarLabel2'),
            tabBarIcon: ({ color, size }:any) => (
              <Icon name="ic_activities" color={color} size={size} />
            ),
          }} />
        <DashboardBottomTab.Screen
          component={secondaryRoot}
          name="Tools"
          options={{
            tabBarLabel: t('tabbarLabel3'),
            tabBarIcon: ({ color, size }:any) => (
              <Icon name="ic_sb_tools" color={color} size={size} style={styles.bottomtabIconStyle} />
            ),
            unmountOnBlur: true,
          }}
          listeners={({ }) => ({
            tabPress: (e) => {
              setModalVisible(true);
              e.preventDefault();
            },
          })}
        />
        <DashboardBottomTab.Screen name="Articles" component={Articles} initialParams={{ categoryArray: [], backClicked: 'no' }}
          options={{
            tabBarLabel: t('tabbarLabel4'),
            tabBarIcon: ({ color, size }:any) => (
              <Icon name="ic_articles" color={color} size={size} />
            ),
            unmountOnBlur: true,
          }} />
        <DashboardBottomTab.Screen name="ChildDevelopment" component={ChildDevelopment} initialParams={{ currentSelectedChildId: 0 }}
          options={{
            tabBarLabel: t('tabbarLabel5'),
            tabBarIcon: ({ color, size }:any) => (
              <Icon name="ic_milestone" color={color} size={size} />
            ),
            unmountOnBlur: true,
          }} />
      </DashboardBottomTab.Navigator>
    </>
  );
};
