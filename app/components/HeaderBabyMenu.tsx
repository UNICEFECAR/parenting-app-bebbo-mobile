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
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import {
  getAllChildren,
  getAllConfigData,
  setActiveChild
} from '../services/childCRUD';
import { formatDate } from '../services/Utils';
import {
  ButtonContainer,
  ButtonLinkPress,
  ButtonPrimary,
  ButtonText,
  ButtonTextLine,
  ButtonTextSmLine
} from './shared/ButtonGlobal';
import { FDirRow, FlexColEnd } from './shared/FlexBoxStyle';
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
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  const {t} = useTranslation();
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
  console.log(currentActiveChild, '..currentActiveChild..');
  const child_age = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
  );
  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  //console.log(currentActiveChild,"..currentActiveChild..");
  const renderChildItem = (dispatch: any, data: any, index: number) => {
    const genderLocal =
      genders?.length > 0 && data.gender != ''
        ? genders.find((genderset) => String(genderset.id) === data.gender).name
        : data.gender;
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
                  source={{uri: 'file://' + CHILDREN_PATH + data.photoUri}}
                  // style={{borderRadius: 20, width: 40, height: 40}}
                  ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}</Heading3>
                <Heading5>{genderName}</Heading5>
              </ProfileSectionView>
              <Heading5>
                {t('childProfileBornOn', {
                  childdob:
                    data.birthDate != null ? formatDate(data.birthDate) : '',
                })}
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
                  source={{uri: 'file://' + CHILDREN_PATH + data.photoUri}}
                  // style={{borderRadius: 20, width: 40, height: 40}}
                  ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>

            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}</Heading3>
                <Heading5>{genderName}</Heading5>
              </ProfileSectionView>
              <Heading5>
                {t('childProfileBornOn', {
                  childdob:
                    data.birthDate != null ? formatDate(data.birthDate) : '',
                })}
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
                  <ButtonTextSmLine
                    onPress={() => {
                      setActiveChild(data.uuid, dispatch, child_age);
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
            {SortedchildList.length > 0 ? (
              <View style={{height: 220}}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={SortedchildList}
                  renderItem={({item, index}: any) =>
                    // return a component using that data
                    renderChildItem(dispatch, item, index)
                  }
                  keyExtractor={(item: {id: any}) => item.id}
                />
              </View>
            ) : null}

            <ButtonContainer>
              <ShiftFromBottom20>
                <ButtonLinkPress
                  onPress={() =>
                    navigation.navigate('EditChildProfile', {childData: null})
                  }>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={20} color="#000" />
                    </OuterIconLeft>
                    <ButtonTextLine>
                      {t('childSetupListaddSiblingBtn')}
                    </ButtonTextLine>
                  </OuterIconRow>
                </ButtonLinkPress>
              </ShiftFromBottom20>

              <ButtonPrimary
                onPress={() => navigation.navigate('ChildProfileScreen')}>
                <ButtonText>{t('manageProfileTxt')}</ButtonText>
              </ButtonPrimary>
            </ButtonContainer>
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
          <Icon name="ic_baby" size={25} color={props.color || '#FFF'} />
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
  cardcontainer: {
    flexGrow: 1,
  },
});
