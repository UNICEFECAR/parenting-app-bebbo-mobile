import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DashboardBottomTabParamList} from './types';
import Activities from '../screens/home/bottomTabs/Activities';
import Articles from '../screens/home/bottomTabs/Articles';
import SupportChat from '../screens/home/bottomTabs/SupportChat';
import Home from '../screens/home/bottomTabs/Home';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
const DashboardBottomTab =
  createBottomTabNavigator<DashboardBottomTabParamList>();
export default () => {
  const [modalVisible, setModalVisible] = useState(false);
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
            {/* <Pressable
              style={styles.modalText}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
            </Pressable> */}
            <Text style={styles.modalText}>Add New Development Milestone</Text>

            <Text style={styles.modalText}>Add Vaccination Details</Text>
            <Text style={styles.modalText}>Add Health Checkup Details</Text>
            <Text style={styles.modalText}>Add New Measurement Details</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </TouchableOpacity>
        </Pressable>
      </Modal>
      <DashboardBottomTab.Navigator>
        <DashboardBottomTab.Screen name="Home" component={Home} />
        <DashboardBottomTab.Screen name="Activities" component={Activities} />
        <DashboardBottomTab.Screen
          component={SupportChat}
          name="Add"
          listeners={({}) => ({
            tabPress: (e) => {
              // navigation.dispatch(DrawerActions.openDrawer());
              setModalVisible(true);
              e.preventDefault();
            },
          })}
        />
        <DashboardBottomTab.Screen name="Articles" component={Articles} />
        <DashboardBottomTab.Screen name="SupportChat" component={SupportChat} />
      </DashboardBottomTab.Navigator>
    </>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 2,
  },
});
