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
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal, Platform, Pressable, StyleSheet, View,StatusBar
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import {
  getAllChildren,
  getAllConfigData,
  isFutureDate,
  setActiveChild
} from '../services/childCRUD';
import { getStatusBarHeight } from '../services/StatusBarHeight';
import { formatDate } from '../services/Utils';
import {
  ButtonContainer,
  ButtonLinkPress,
  ButtonPrimary,
  ButtonText,
  ButtonTextLine,
  ButtonTextSmLine
} from './shared/ButtonGlobal';
import { FDirRow, FlexCol, FlexColEnd } from './shared/FlexBoxStyle';
import { HeaderActionBox, HeaderActionView } from './shared/HeaderContainerStyle';
import {
  ProfileActionView,
  ProfileIconView,
  ProfileListView,
  ProfileListViewSelected,
  ProfileSectionView,
  ProfileTextView
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
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  const { t } = useTranslation();
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
  const currentActiveChild = activeChild.uuid;
  console.log(activeChild, '..activeChild..');
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  console.log(getStatusBarHeight(0), "..getStatusBarHeight..");
  const renderChildItem = (dispatch: any, data: any, index: number) => {
    console.log(genders, ".genders.")
    const genderLocal =
      genders?.length > 0 && data.gender != ''
        ? genders.find((genderset) => genderset.id === parseInt(data.gender)).name
        : '';
    const genderName: string = genderLocal;
    return (
      <View key={index}>
        {currentActiveChild != '' &&
          currentActiveChild != null &&
          currentActiveChild != undefined &&
          currentActiveChild == data.uuid ? (
          <ProfileListViewSelected>
            <ProfileIconView>
              {data.photoUri != '' ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                // style={{borderRadius: 20, width: 40, height: 40}}
                ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView>
                {/* <Heading3>{data.childName}, <Heading5 style={{ fontWeight: 'normal' }}>{genderName}</Heading5></Heading3> */}
                <Heading3>{data.childName}
                {genderName!='' && genderName!=null && genderName!=undefined ?<Heading5 style={{fontWeight:'normal'}}>{', '+genderName}</Heading5>:null}
              </Heading3>
              </ProfileSectionView>
              {/* <Heading5>
                {t('childProfileBornOn', {
                  childdob:
                    data.birthDate != null ? formatDate(data.birthDate) : '',
                })}
              </Heading5> */}
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate,luxonLocale) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                {/* Premature Tag Insert Here */}
                {/* <ShiftFromBottom5>
            <PrematureTag>
          <Heading5BoldW>
              {t('developScreenprematureText')}
            </Heading5BoldW>
          </PrematureTag>
          </ShiftFromBottom5> */}
                {/* Premature Tag End Here */}
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <TickView>
                        <Icon name="ic_tick" size={12} color="#009B00" />
                      </TickView>
                    </OuterIconLeft>
                  </OuterIconRow>

                  <Heading5Bold>{t('childActivatedtxt')}</Heading5Bold>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListViewSelected>
        ) : (
          <ProfileListView>
            <ProfileIconView>
              {data.photoUri != '' ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                // style={{borderRadius: 20, width: 40, height: 40}}
                ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>

            <ProfileTextView>
              <ProfileSectionView>
                {/* <Heading3>{data.childName}, <Heading5 style={{ fontWeight: 'normal' }}>{genderName}</Heading5></Heading3> */}
                <Heading3>{data.childName}
                {genderName!='' && genderName!=null && genderName!=undefined ?<Heading5 style={{fontWeight:'normal'}}>{', '+genderName}</Heading5>:null}
              </Heading3>
           
              </ProfileSectionView>
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate,luxonLocale) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                {/* Premature Tag Insert Here */}
                {/* <ShiftFromBottom5>
              <PrematureTag>
              <Heading5BoldW>
              {t('developScreenprematureText')}
              </Heading5BoldW>
              </PrematureTag>
              </ShiftFromBottom5> */}
                {/* Premature Tag End Here */}
                <FDirRow>
                  <ButtonTextSmLine  numberOfLines={2}
                    onPress={() => {
                      setModalVisible(false);
                      setActiveChild(languageCode, data.uuid, dispatch, child_age);
                    }}>
                    {t('childActivatebtn')}
                  </ButtonTextSmLine>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListView>
        )}
      </View>
    );
  };
  return (
    <>
      <Modal
        style={styles.mainModal}
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

           <View
            style={styles.modalView}
          // onPress={() => console.log('do nothing')}
          // activeOpacity={1}
          >
            {SortedchildList.length > 0 ? (
              <View style={{ height: 'auto',minHeight:100, maxHeight: 150, backgroundColor:'transparent',zIndex:9999,position:'relative',width:"100%"}}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={SortedchildList}
                  renderItem={({ item, index }: any) =>
                    // return a component using that data
                    renderChildItem(dispatch, item, index)
                  }
                  keyExtractor={(item: { uuid: any }) => item.uuid}
                />
              </View>
            ) : null}

            <ButtonContainer>
              <ShiftFromBottom20>
                <ButtonLinkPress
                  onPress={() =>{
                    setModalVisible(false);
                    navigation.navigate('EditChildProfile', { childData: null })
                  }
                  }>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={20} color="#000" />
                    </OuterIconLeft>
                    <ButtonTextLine numberOfLines={2}>
                      {t('childSetupListaddSiblingBtn')}
                    </ButtonTextLine>
                  </OuterIconRow>
                </ButtonLinkPress>
              </ShiftFromBottom20>

              <ButtonPrimary
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ChildProfileScreen')
                  }}>
                <ButtonText numberOfLines={2}>{t('manageProfileTxt')}</ButtonText>
              </ButtonPrimary>
            </ButtonContainer>
          </View>
        <View 
          style={styles.centeredView}
          // onPress={() => {
          //   setModalVisible(!modalVisible);
          //   if (modalVisible) {
          //     getAllChildren(dispatch);
          //     getAllConfigData(dispatch);
          //   }
          // }}
          >
            <View style={{flex:1,backgroundColor:'transparent'}}>
            <Pressable style={{backgroundColor:'transparent',zIndex:9999,height:headerHeight,position:'absolute',top:0,left:0,width:"100%"}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                    if (modalVisible) {
                      getAllChildren(dispatch);
                      getAllConfigData(dispatch);
                    }

                }}>
            </Pressable>
        </View>
        </View>
        <View style={{backgroundColor:'transparent',opacity:0.5,zIndex:2,position:'absolute',width:'100%',height:'100%'}} >
        <Pressable style={{backgroundColor:'transparent',width:'100%',height:'100%',position:'relative'}} 
        onPress={() => {
          setModalVisible(false);
        }}>
        </Pressable>
        </View>
      </Modal>

      <HeaderActionView>
        <HeaderActionBox
          onPress={() => {
             console.log(modalVisible,"..modalVisible..");
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
          {/* <Icon name="ic_baby" size={25} color={props.color || '#FFF'} /> */}
          {activeChild.photoUri != '' ? (
            <ImageIcon
              source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}
            // style={{borderRadius: 20, width: 40, height: 40}}
            ></ImageIcon>
          ) : (
            <Icon name="ic_baby" size={25} color={props.color || '#FFF'} />
          )}
        </HeaderActionBox>
      </HeaderActionView>
    </>
  );
};
export default HeaderBabyMenu;
const styles = StyleSheet.create({
  centeredView: {
    //  flex: 1,
    //  flexDirection:'column',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginTop: headerHeight,
    // backgroundColor:'red',
    // zIndex:999999,
    // position:'relative',
    width:'100%',
    // marginTop:headerHeight,
    left:0,
    height:'100%',
    position:'relative',
    zIndex:1,
  },
  mainModal:{
    // backgroundColor:'blue',
    // zIndex:999999,
    // position:'absolute',
    // width:'100%',
    // top:headerHeight,
    // left:0,
    // height:'100%',
    // flex: 1,
  },
  modalView: {
    // margin: 20,
    // flex: 1,
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 0,
    borderColor: '#000',
    borderBottomWidth: 2,
    position:'relative',
    zIndex:3,
       ...Platform.select({
        ios: {
          top:getStatusBarHeight(0)>20?headerHeight-2:35,
          marginTop:getStatusBarHeight(0)>20?headerHeight-2:35
        },
      android: {
        marginTop:headerHeight,
      },
    })
  },

  modalText: {
    textAlign: 'center',
    borderBottomWidth: 2,
  },
  cardcontainer: {
    flexGrow: 1,
  },
});
