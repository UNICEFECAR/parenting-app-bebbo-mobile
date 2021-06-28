import Icon from '@components/shared/Icon';
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
import React, { useContext, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { ThemeContext } from 'styled-components';
import { DashboardBottomTabParamList } from './types';
const DashboardBottomTab =
  createBottomTabNavigator<DashboardBottomTabParamList>();
const secondStack = createStackNavigator<any>();
const secondaryRoot=()=> {
    return (
      <secondStack.Navigator>
        <secondStack.Screen name="ChildgrowthTab" component={Childgrowth} options={{headerShown: false}} />
        <secondStack.Screen name="VaccinationTab" component={Vaccination} options={{headerShown: false}}/>
        <secondStack.Screen name="HealthCheckupsTab" component={HealthCheckups} options={{headerShown: false}}/>
      </secondStack.Navigator>
    );
  }
  
export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.SECONDARY_COLOR;
  const navigation = useNavigation();
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          setModalVisible(!modalVisible);
        }}>
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            style={styles.modalView}
            onPress={() => console.log('do nothing')}
            activeOpacity={1}>
            {/* <Pressable style={styles.item}>
              <Icon name="ic_milestone" size={20} color="#000" />
              <Text style={styles.modalText}>Add New Development Milestone</Text>
            </Pressable> */}
            <Pressable style={styles.item} onPress={()=>{setModalVisible(!modalVisible);navigation.navigate("Tools", { screen: 'VaccinationTab' })}}>
              <Icon name="ic_vaccination" size={20} color="#000" />
              <Text style={styles.modalText}>Add Vaccination Details</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={()=>{setModalVisible(!modalVisible);navigation.navigate("Tools", { screen: 'HealthCheckupsTab' })}}>
              <Icon name="ic_doctor_chk_up" size={20} color="#000" />
              <Text style={styles.modalText}>Add Health Checkup Details</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={()=>{setModalVisible(!modalVisible);navigation.navigate("Tools", { screen: 'ChildgrowthTab' })}}>
              <Icon name="ic_growth" size={20} color="#000" />
              <Text style={styles.modalText}>Add New Measurement Details</Text>
            </Pressable>
          </TouchableOpacity>
        </Pressable>
      </Modal>
      <DashboardBottomTab.Navigator  tabBarOptions={{
        activeTintColor: headerColor,
        inactiveTintColor:'#000',
        activeBackgroundColor:'#FFF',
        inactiveBackgroundColor:'#FFF'

      }}
      >
        <DashboardBottomTab.Screen name="Home" component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ic_sb_home" color={color} size={size} />
            ),
            unmountOnBlur:true,
          }} />
        <DashboardBottomTab.Screen name="Activities" component={Activities}
          options={{
            tabBarLabel: 'Play',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ic_activities" color={color} size={size} />
            ),
            unmountOnBlur:true,
          }} />
        <DashboardBottomTab.Screen
          component={secondaryRoot}
          name="Tools"
          options={{
            tabBarLabel: 'Tools',
            tabBarIcon: ({ color, size }) => (
              // <View
              //   style={{
              //     position: 'absolute',
              //     top: 5, // space from top
              //     justifyContent: 'center',
              //     alignItems: 'center',
              //   }}>  {/* </View> */}
                <Icon name="ic_sb_tools" color={color} size={size} style={{alignContent: 'center',}} />
            

            ),
            unmountOnBlur:true,
          }}
          listeners={({ }) => ({
            tabPress: (e) => {
              // navigation.dispatch(DrawerActions.openDrawer());
              setModalVisible(true);
              e.preventDefault();
            },
          })}
        />
        <DashboardBottomTab.Screen name="Articles" component={Articles}
          options={{
            tabBarLabel: 'Articles',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ic_articles" color={color} size={size} />
            ),
            unmountOnBlur:true,
          }} />
        <DashboardBottomTab.Screen name="ChildDevelopment" component={ChildDevelopment}
          options={{
            tabBarLabel: 'Track',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ic_milestone" color={color} size={size} />
            ),
            unmountOnBlur:true,
          }} />
        {/* <DashboardBottomTab.Screen name="SupportChat" component={SupportChat}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ic_chat" color={color} size={size} />
            ),
          }} /> */}
      </DashboardBottomTab.Navigator>
    </>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderTopColor:'#000',borderTopWidth:1,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // padding: 30,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 5,
  },
  item:{
    flexDirection:'row', borderBottomColor:'#EEE',borderBottomWidth:2,
    padding: 15,
  },
  modalText: {
    fontWeight: 'bold',
    marginLeft:10
  },
});
