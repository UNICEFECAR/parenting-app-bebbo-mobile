import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView6,
  TickView4
} from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import { useNavigation } from '@react-navigation/native';
import {
  Heading3,
  Heading5,
  ShiftFromBottom10
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal, Platform, Pressable, StyleSheet, View
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
  ButtonPrimary,
  ButtonUpperCaseText
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
import { bgcolorBlack2, bgcolortransparent, bgcolorWhite } from '@styles/style';

const headerHeight = 50;
const styles = StyleSheet.create({
  OuterIconLeftPadding: {
    paddingLeft: 30
  },
  centeredPressable: {
    backgroundColor: bgcolortransparent,
    height: headerHeight,
    left: 0,
    position: 'absolute',
    top: 0,
    width: "100%",
    zIndex: 9999
  },
  centeredView: {
    height: '100%',
    left: 0,
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  hbMenuView: {
    backgroundColor: bgcolortransparent,
    height: '100%',
    opacity: 0.5,
    position: 'absolute',
    width: '100%',
    zIndex: 2
  },
  hbPressable: {
    backgroundColor: bgcolortransparent,
    height: '100%',
    position: 'relative',
    width: '100%'
  },
  heading5Fontwg: {
    fontWeight: 'normal'
  },
  innerCenteredView: {
    backgroundColor: bgcolortransparent, flex: 1
  },
  mainModal: {

  },
  modalView: {
    backgroundColor: bgcolorWhite,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomWidth: 2,
    borderColor: bgcolorBlack2,
    padding: 0,
    position: 'relative',
    zIndex: 3,
    ...Platform.select({
      ios: {
        top: getStatusBarHeight(0) > 20 ? headerHeight - 2 : 35,
        marginTop: getStatusBarHeight(0) > 20 ? headerHeight - 2 : 35
      },
      android: {
        marginTop: headerHeight,
      },
    })
  },
  pressableProfile: {
    paddingBottom: 7,
    paddingTop: 7
  },
  sortedChildListView: {
    backgroundColor: bgcolortransparent,
    height: 'auto',
    maxHeight: 150,
    minHeight: 100,
    position: 'relative',
    width: "100%",
    zIndex: 9999
  }
});
const HeaderBabyMenu = (props: any): any => {
  const { setProfileLoading } = props;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const [modalVisible, setModalVisible] = useState(false);
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
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const SortedchildList = [...childList].sort((a: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  const renderChildItem = (dispatch: any, data: any, index: number): any => {
    const genderLocal =
      genders?.length > 0 && data.gender != ''
        ? genders.find((genderset: any) => genderset.id === parseInt(data.gender)).name
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
              {(data.photoUri != '' && data.photoUri != null) ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                ></ImageIcon>
              ) : (
                genderName !== '' ?
                  (genderName === t('chilGender1') ?
                    <Icon name="ic_baby" size={36} color="#000" /> :
                    <Icon name="ic_baby_girl" size={36} color="#000" />) :
                  <Icon name="ic_baby_girl" size={36} color="#000" />
              )}
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}
                  {genderName != '' && genderName != null && genderName != undefined ? <Heading5 style={styles.heading5Fontwg}>{', ' + genderName}</Heading5> : 
                  <Heading5 style={styles.heading5Fontwg}>{', ' + t('chilGender2')}</Heading5>
                  }
                </Heading3>
              </ProfileSectionView>
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <TickView6>
                        <Icon name="ic_activate_tag" size={11} color="#009B00" />
                      </TickView6>
                    </OuterIconLeft>
                  </OuterIconRow>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListViewSelected>
        ) : (
          <ProfileListView>
            <ProfileIconView>
              {(data.photoUri) ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                ></ImageIcon>
              ) : (
                genderName !== '' ?
                  (genderName === t('chilGender1') ?
                    <Icon name="ic_baby" size={36} color="#000" /> :
                    <Icon name="ic_baby_girl" size={36} color="#000" />) :
                  <Icon name="ic_baby_girl" size={36} color="#000" />
              )}
            </ProfileIconView>

            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}
                  {genderName != '' && genderName != null && genderName != undefined ? <Heading5 style={styles.heading5Fontwg}>{', ' + genderName}</Heading5> : null}
                </Heading3>

              </ProfileSectionView>
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                <FDirRow>
                  <Pressable style={styles.pressableProfile}
                    onPress={(): any => {
                      setModalVisible(false);
                      setProfileLoading(true);
                      setTimeout(async () => {
                        const setData = await setActiveChild(languageCode, data.uuid, dispatch, childAge, true);
                        if (setData == "activeset") {
                          setProfileLoading(false);
                        }
                      }, 0);
                    }}>
                    <OuterIconRow>
                      <OuterIconLeft style={styles.OuterIconLeftPadding}>
                        <TickView4>
                        </TickView4>
                      </OuterIconLeft>
                    </OuterIconRow>
                  </Pressable>
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
        onRequestClose={(): any => {
          setModalVisible(false);
        }}
        onDismiss={(): any => {
          setModalVisible(false);
        }}>

        <View
          style={styles.modalView}
        >
          {SortedchildList.length > 0 ? (
            <View style={styles.sortedChildListView}>
              <FlatList
                nestedScrollEnabled={true}
                data={SortedchildList}
                renderItem={({ item, index }: any): any =>
                  // return a component using that data
                  renderChildItem(dispatch, item, index)
                }
                keyExtractor={(item: { uuid: any }): any => item.uuid}
              />
            </View>
          ) : null}

          <ButtonContainer>


            <ButtonPrimary
              disabled={false}
              onPress={(): any => {
                setModalVisible(false);
                navigation.navigate('ChildProfileScreen')
              }}>
              <ButtonUpperCaseText numberOfLines={2}>{t('manageProfileTxt')}</ButtonUpperCaseText>
            </ButtonPrimary>
          </ButtonContainer>
        </View>
        <View
          style={styles.centeredView}>
          <View style={styles.innerCenteredView}>
            <Pressable style={styles.centeredPressable}
              onPress={(): any => {
                setModalVisible(!modalVisible);
                if (modalVisible) {
                  getAllChildren(dispatch, childAge, 0);
                  getAllConfigData(dispatch);
                }
              }}>
            </Pressable>
          </View>
        </View>
        <View style={styles.hbMenuView} >
          <Pressable style={styles.hbPressable}
            onPress={(): any => {
              setModalVisible(false);
            }}>
          </Pressable>
        </View>
      </Modal>

      <HeaderActionView>
        <HeaderActionBox
          onPress={(): any => {
            setModalVisible(!modalVisible);
            if (modalVisible) {
              getAllChildren(dispatch, childAge, 0);
              getAllConfigData(dispatch);
            }
          }}>
          {(activeChild.photoUri != '' && activeChild.photoUri != null) ? (
            <ImageIcon
              source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}></ImageIcon>
          ) : (
            activeChild.gender != '' ? activeChild.gender == '40' ? <Icon name="ic_baby" size={30} color={props.color || '#FFF'} /> : <Icon name="ic_baby_girl" size={30} color={props.color || '#FFF'} /> : <Icon name="ic_baby_girl" size={30} color={props.color || '#FFF'} />
          )}
        </HeaderActionBox>
      </HeaderActionView>
    </>
  );
};
export default HeaderBabyMenu;

