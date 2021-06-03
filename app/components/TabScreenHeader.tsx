import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Pressable, Modal, TouchableOpacity } from 'react-native';
const headerHeight=50;
const TabScreenHeader = (props:any) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Modal
        animationType="none"
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
            <Text style={styles.modalText}>Jenny</Text>
            <Text style={styles.modalText}>Michel </Text>

            <Text style={styles.modalText}>Add sister or brother</Text>
            <Text style={styles.modalText}>Manage Profile</Text>
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </TouchableOpacity>
        </Pressable>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: '#fff',
          maxHeight: headerHeight,
        }}>
        <View style={{ flex: 1, backgroundColor: 'red' }} >
          <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Text>Menu</Text>
          </Pressable>
        </View>
        <View style={{ flex: 3, backgroundColor: '#FFF' }} >
          <Text> {props.title}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'yellow' }} />
        <View style={{ flex: 1, backgroundColor: 'purple' }} >
          <Pressable onPress={() => {
            // console.log(modalVisible);
            if (modalVisible) { setModalVisible(false) }
            else { setModalVisible(true) }
          }}><Text>Beboo</Text></Pressable>
        </View>
      </View>
    </>
  );
};
export default TabScreenHeader;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingTop: headerHeight,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
