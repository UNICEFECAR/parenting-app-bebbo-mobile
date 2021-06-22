import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading2w } from '@styles/typography';
import React, { useState } from 'react';
import { Button, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BurgerIcon from './shared/BurgerIcon';
const headerHeight=50;
const TabScreenHeader = (props:any) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = props.headerColor;
  const textColor = props.textColor;
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
            <Button
            title="Add sister or brother"
            onPress={() => navigation.navigate('EditChildProfile')}
          />
            <Button
            title="Manage Profile"
            onPress={() => navigation.navigate('ChildProfileScreen')}
          />
            {/* <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable> */}
          </TouchableOpacity>
        </Pressable>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: headerColor,
          maxHeight: headerHeight,
        }}>
        <BurgerIcon color={textColor}/>
        <View style={{ flex: 9,padding:10,alignContent:'flex-start'}} >
          <Heading2w style={{color:textColor}}> {props.title}</Heading2w>
        </View>
        <View style={{ flex: 1 ,padding:10,alignItems:'flex-end',}} >
          <Pressable onPress={() => {
            // console.log(modalVisible);
            if (modalVisible) { setModalVisible(false) }
            else { setModalVisible(true) }
          }}><Icon name="ic_baby" size={25} color={textColor} /></Pressable>
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
