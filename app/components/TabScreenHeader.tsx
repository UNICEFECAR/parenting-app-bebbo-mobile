import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2w,
  Heading3,
  Heading5,
  Heading5Bold,
  ShiftFromBottom20
} from '@styles/typography';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import BurgerIcon from './shared/BurgerIcon';
import {
  ButtonLinkView,
  ButtonPrimary,
  ButtonRow,
  ButtonSpacing,
  ButtonText,
  ButtonTextLine,
  ButtonTextSmLine
} from './shared/ButtonGlobal';
import {
  HeaderActionBox,
  HeaderActionView,
  HeaderRowView,
  HeaderTitleView
} from './shared/HeaderContainerStyle';
import {
  ProfileActionView,
  ProfileIconView,
  ProfileListView,
  ProfileListViewSelected,
  ProfileTextView
} from './shared/ProfileListingStyle';
const headerHeight = 50;
const TabScreenHeader = (props: any) => {
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
            <ProfileListViewSelected>
              <ProfileIconView>
                <Icon name="ic_baby" size={30} color="#000" />
              </ProfileIconView>
              <ProfileTextView>
                <Heading3>Jenny</Heading3>
                <Heading5>Girl</Heading5>
              </ProfileTextView>
              <ProfileActionView>
                <OuterIconRow>
                  <OuterIconLeft>
                    <TickView>
                      <Icon name="ic_tick" size={12} color="#009B00" />
                    </TickView>
                  </OuterIconLeft>
                </OuterIconRow>
                <Heading5Bold>Activated</Heading5Bold>
              </ProfileActionView>
            </ProfileListViewSelected>

            <ProfileListView>
              <ProfileIconView>
                <Icon name="ic_baby" size={30} color="#000" />
              </ProfileIconView>
              <ProfileTextView>
                <Heading3>Micheal</Heading3>
                <Heading5>Boy</Heading5>
              </ProfileTextView>
              <ProfileActionView>
                <ButtonTextSmLine>Activate Profile</ButtonTextSmLine>
              </ProfileActionView>
            </ProfileListView>

            <ButtonSpacing>
              <ButtonRow>
                <ShiftFromBottom20>
                  <ButtonLinkView
                    onPress={() => navigation.navigate('EditChildProfile')}>
                    <OuterIconRow>
                      <OuterIconLeft>
                        <Icon name="ic_plus" size={20} color="#000" />
                      </OuterIconLeft>
                      <ButtonTextLine> Add sister or brother</ButtonTextLine>
                    </OuterIconRow>
                  </ButtonLinkView>
                </ShiftFromBottom20>

                <ButtonPrimary
                  onPress={() => navigation.navigate('ChildProfileScreen')}>
                  <ButtonText>Manage Profile</ButtonText>
                </ButtonPrimary>
              </ButtonRow>
            </ButtonSpacing>
          </TouchableOpacity>
        </Pressable>
      </Modal>
      <HeaderRowView
        style={{
          backgroundColor: headerColor,
          maxHeight: headerHeight,
        }}>
        <BurgerIcon />
        <HeaderTitleView>
          <Heading2w> {props.title}</Heading2w>
        </HeaderTitleView>

        <HeaderActionView>
          <HeaderActionBox
            onPress={() => {
              // console.log(modalVisible);
              if (modalVisible) {
                setModalVisible(false);
              } else {
                setModalVisible(true);
              }
            }}>
            <Icon name="ic_baby" size={25} color="#000" />
          </HeaderActionBox>
        </HeaderActionView>
      </HeaderRowView>
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
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 0,

    borderColor: '#000',
    borderBottomWidth: 2,
  },

  modalText: {
    textAlign: 'center',
    borderBottomWidth: 2,
  },
});
