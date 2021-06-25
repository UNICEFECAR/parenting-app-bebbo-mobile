import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Heading2w,
  Heading3,
  Heading5,
  Heading5Bold,
  ShiftFromBottom20
} from '@styles/typography';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import { getAllChildren, getAllConfigData, setActiveChild } from '../services/childCRUD';
import BurgerIcon from './shared/BurgerIcon';
import { ButtonLinkText, ButtonSpacing, ButtonTextSmLine, ButtonLinkPress, ButtonPrimary, ButtonRow, ButtonText,ButtonTextLine } from './shared/ButtonGlobal';
import { HeaderRowView, HeaderTitleView,HeaderActionView,HeaderActionBox} from './shared/HeaderContainerStyle';
import { ProfileListViewSelected,ProfileListView,ProfileIconView,ProfileTextView,ProfileActionView} from './shared/ProfileListingStyle';
const headerHeight=50;
const TabScreenHeader = (props:any) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    },[])
  );
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  const allConfigData = useAppSelector(
    (state: any) => state.variableData?.variableData != '' ? JSON.parse(state.variableData?.variableData) :state.variableData?.variableData
  );
  const currentActiveChildId=allConfigData?.length>0?allConfigData.filter(item => item.key === "currentActiveChildId"):[];
  //  console.log(currentActiveChildId,"..currentActiveChildId")
  const currentActiveChild=currentActiveChildId?.length>0?currentActiveChildId[0].value:null;
  //console.log(currentActiveChild,"..currentActiveChild..");
  const renderDailyReadItem = (dispatch: any, data: any, index: number) => (
 
    <View key={index}>
      {
         ((currentActiveChild !=""  &&  currentActiveChild !=null  &&  currentActiveChild !=undefined) && currentActiveChild==data.uuid) ? (
       <ProfileListViewSelected>
        <ProfileIconView>
          <Icon name="ic_baby" size={30} color="#000" />
        </ProfileIconView>
        <ProfileTextView>
          <Heading3>{data.name?data.name:"Child"+(index+1)}</Heading3>
          <Heading5>{data.gender}</Heading5>
          <Heading5>Born on {data.birthDate}</Heading5>
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
            ) :
                <ProfileListView key={index}>
          <ProfileIconView>
            <Icon name="ic_baby" size={30} color="#000" />
          </ProfileIconView>
          <ProfileTextView>
            <Heading3>{data.name?data.name:"Child"+(index+1)}</Heading3>
            <Heading5>{data.gender}</Heading5>
            <Heading5>Born on {data.birthDate}</Heading5>
          </ProfileTextView>
          <ProfileActionView>
            <ButtonTextSmLine onPress={() => {
                    setActiveChild(data.uuid)
                    }}>Activate Profile</ButtonTextSmLine>
          </ProfileActionView>
        </ProfileListView>
}
  </View>
  );

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
            {
          childList.length> 0 ? (
              childList.map((item: ChildEntity, index: number) => {
               // console.log(childList,"..childList123..");
                return renderDailyReadItem(dispatch,item,index);
              })
            ) :null
          }
           

            <ButtonSpacing>
            <ButtonRow>
          <ShiftFromBottom20>
            <ButtonLinkPress
              
              onPress={() => navigation.navigate('EditChildProfile',{childData:null})}>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_plus" size={20} color="#000" />
                </OuterIconLeft>
                <ButtonTextLine> Add sister or brother</ButtonTextLine>
              </OuterIconRow>
            </ButtonLinkPress>
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
