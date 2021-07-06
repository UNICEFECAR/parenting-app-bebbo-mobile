import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import { useNavigation } from '@react-navigation/native';
import {
  Heading3,
  Heading5,
  Heading5Bold,
  ShiftFromBottom20
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import {
  getAllChildren,
  getAllConfigData,
  setActiveChild
} from '../services/childCRUD';
import { formatDate } from '../services/Utils';
import {
  ButtonLinkPress,
  ButtonPrimary,
  ButtonRow, ButtonSpacing, ButtonText,
  ButtonTextLine, ButtonTextSmLine
} from './shared/ButtonGlobal';
import {
  HeaderActionBox, HeaderActionView
} from './shared/HeaderContainerStyle';
import {
  ProfileActionView, ProfileIconView, ProfileListView, ProfileListViewSelected, ProfileTextView
} from './shared/ProfileListingStyle';
  const headerHeight = 50;
  const HeaderBabyMenu = (props: any) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    // useFocusEffect(
    //   React.useCallback(() => {
    //     getAllChildren(dispatch);
    //     getAllConfigData(dispatch);
    //   }, []),
    // );
    const genders = useAppSelector(
      (state: any) =>
        JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender,
    );
    const [modalVisible, setModalVisible] = useState(false);
    const headerColor = props.headerColor;
    const textColor = props.textColor;
  
   
    const childList = useAppSelector((state: any) =>
      state.childData.childDataSet.allChild != ''
        ? JSON.parse(state.childData.childDataSet.allChild)
        : [],
    );
 const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const currentActiveChild =activeChild.uuid;
  console.log(currentActiveChild,"..currentActiveChild..")
  const child_age = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
  );
    // const allConfigData = useAppSelector((state: any) =>
    //   state.variableData?.variableData != ''
    //     ? JSON.parse(state.variableData?.variableData)
    //     : state.variableData?.variableData,
    // );
    // const currentActiveChildId =
    //   allConfigData?.length > 0
    //     ? allConfigData.filter((item) => item.key === 'currentActiveChildId')
    //     : [];
    // //  console.log(currentActiveChildId,"..currentActiveChildId")
    // const currentActiveChild =
    //   currentActiveChildId?.length > 0 ? currentActiveChildId[0].value : null;
      const SortedchildList = [...childList].sort((a:any, b:any)=>{
        if (a.uuid == currentActiveChild) return -1;
      });
    //console.log(currentActiveChild,"..currentActiveChild..");
    const renderChildItem = (dispatch: any, data: any, index: number,genderName:string) => (
      <View key={index}>
        {currentActiveChild != '' &&
        currentActiveChild != null &&
        currentActiveChild != undefined &&
        currentActiveChild == data.uuid ? (
          <ProfileListViewSelected>
            <ProfileIconView>
            {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
            </ProfileIconView>
            <ProfileTextView>
              <Heading3>{data.childName}</Heading3>
              <Heading5>{genderName}</Heading5>
              <Heading5>Born on {data.birthDate!=null  ? formatDate(data.birthDate):''}</Heading5>
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
        ) : (
          <ProfileListView key={index}>
            <ProfileIconView>
            {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
            </ProfileIconView>
            <ProfileTextView>
              <Heading3>{data.childName}</Heading3>
              <Heading5>{genderName}</Heading5>
              <Heading5>Born on {data.birthDate!=null  ? formatDate(data.birthDate):''}</Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <ButtonTextSmLine
                onPress={() => {
                  setActiveChild(data.uuid,dispatch,child_age);
                }}>
                Activate Profile
              </ButtonTextSmLine>
            </ProfileActionView>
          </ProfileListView>
        )}
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
            setModalVisible(false);
          }}
          onDismiss={() => {
            setModalVisible(false);
          }}>
          <Pressable
            style={styles.centeredView}
            onPress={() => {
              setModalVisible(!modalVisible);
              if (modalVisible) {
                getAllChildren(dispatch);
                getAllConfigData(dispatch);
                }
            }}>
            <TouchableOpacity
              style={styles.modalView}
              onPress={() => console.log('do nothing')}
              activeOpacity={1}>
              {SortedchildList.length > 0
                ? SortedchildList.map((item: ChildEntity, index: number) => {
                    // console.log(childList,"..childList123..");
                    // if(genders?.length>0 && item.gender!=""){
                    //   item.gender=genders.find(genderset => genderset.id === item.gender);
                    // }
                    const genderLocal=(genders?.length>0 && item.gender!="")?genders.find(genderset => genderset.id === item.gender).name:item.gender;
                   // console.log(genderLocal,"..genderLocal..");
                    return renderChildItem(dispatch, item, index,genderLocal);
                  })
                : null}
  
              <ButtonSpacing>
                <ButtonRow>
                  <ShiftFromBottom20>
                    <ButtonLinkPress
                      onPress={() =>
                        navigation.navigate('EditChildProfile', {childData: null})
                      }>
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
       
  
          <HeaderActionView>
            <HeaderActionBox
              onPress={() => {
                // console.log(modalVisible);
                // if (modalVisible) {
                //   setModalVisible(false);
                // } else {
                  
                //   setModalVisible(true);
                // }
                setModalVisible(!modalVisible);
                if (modalVisible) {
                getAllChildren(dispatch);
                getAllConfigData(dispatch);
                }
              }}>
              <Icon name="ic_baby" size={25} color={props.color || '#FFF'}/>
            </HeaderActionBox>
          </HeaderActionView>
      </>
    );
  };
  export default HeaderBabyMenu;
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
  