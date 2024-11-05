import { bothChildGender, girlChildGender, regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import {
  ButtonMangeProfileContainer,
  ButtonPrimary,
  ButtonUpperCaseText,
} from '@components/shared/ButtonGlobal';
import {
  FormContainerFlex,
  FormInputBox,
  FormInputGroup,
  LabelText
} from '@components/shared/ChildSetupStyle';
import { MainContainer, MainManageProfileContainer } from '@components/shared/Container';
import { FlexCol, FlexRow } from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconBox, IconML } from '@components/shared/Icon';
import { ProfileEditView } from '@components/shared/ProfileListingStyle';
import ToggleRadios from '@components/ToggleRadios';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading2w,
  Heading4,
  Heading4Regular, ShiftFromTop10,
  ShiftFromTop15,
  ShiftFromTop20
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { copyFile, exists, mkdir, unlink } from 'react-native-fs';
import { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import {
  addChild,
  deleteChild, getAllChildren, getNewChild,
  setActiveChild
} from '../../services/childCRUD';
import MediaPicker from '../../services/MediaPicker';
import { validateForm } from '../../services/Utils';
import TextInputML from '@components/shared/TextInputML';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../../database/schema/ConfigSettingsSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import { bgcolorWhite, childProfileBgColor, secondaryBtnColor } from '@styles/style';
import Checkbox, { CheckboxActive, CheckboxItem } from '@components/shared/CheckboxStyle';
import VectorImage from 'react-native-vector-image';
import { cameraProfileImage } from '@dynamicImportsClass/dynamicImports';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route: any;
  navigation: NotificationsNavigationProp;
};
const styles = StyleSheet.create({
  actionsheetView: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alignItemsCenter: { alignItems: 'center' },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 180,
  },
  flex1: { flex: 1 },
  flex4: { flex: 4 },
  headerRowView: { maxHeight: 50 },
  headetTitleText: {
    color: bgcolorWhite
  },
  heading4: { flexShrink: 1, marginTop: 10, textAlign: 'center' },

  image: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  innerImageView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  innerPressableView: {
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
  padding0: { padding: 0 },
  pressableView: { paddingLeft: 10, paddingRight: 10 },
  width100: { width: '100%' }
});

const EditChildProfile = ({ route, navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const childData = route.params.childData;
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const editScreen = childData && childData.uuid != '' ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext?.colors.SECONDARY_COLOR;
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v: any) => ({ ...v, title: v.name })).filter(function (e: { id: number }, i: any, a: any) {
    console.log(i, a);
    return e.id != bothChildGender;
  });

  const imageOptions = [
    { id: 0, iconName: 'ic_trash', name: t('cameraOption1') },
    { id: 1, iconName: 'ic_camera', name: t('cameraOption2') },
    { id: 2, iconName: 'ic_gallery', name: t('cameraOption3') },
  ];
  const actionSheetRef = createRef<any>();
  const [capturedPhoto, setCapturedImage] = React.useState('');
  const [photoUri, setphotoUri] = React.useState('');
  const [photoDeleted, setPhotoDeleted] = React.useState(false);
  const [defaultGenderValue, setDefaultGenderValue] = React.useState<any>(null);
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [name, setName] = React.useState(
    childData != null ? childData.childName : '',
  );
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date>();
  const [isPremature, setIsPremature] = React.useState<string>('false');
  const uuid = childData != null ? childData.uuid : '';
  const createdAt = childData != null ? childData.createdAt : null;
  const [isExpected, setIsExpected] = React.useState<string>('false');
  const [destPath, setDestPath] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const isFocused = useIsFocused()
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const sendData = (data: any): any => {
    // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    const myString: any = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  const [gender, setGender] = React.useState(
    childData != null ? childData.gender : 0,
  );
  const handleBack = (): any => {
    const backAction = (): any => {
      //console.log("11")
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);

    return (): any => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }
  useEffect(() => {

    handleBack();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (childData != undefined && childData != null && childData != '' && childData.uuid != '') {
        setphotoUri(childData.photoUri);
        if (childData.photoUri != '' && childData.photoUri != null && childData.photoUri != undefined) {
          setCapturedImage('file://' + `${CHILDREN_PATH}/${childData.photoUri}`);
        }
        sendData(childData);
      }
      if (childData != null && childData.uuid !== '' && childData?.gender === 0) {
        setDefaultGenderValue(genders.find((item: any) => item.id === girlChildGender))
        setGender(girlChildGender);
      } else {
        setDefaultGenderValue(genders.find((item: any) => item.id === childData?.gender))
      }
      console.log(destPath)
    }, []),
  );

  console.log("=========>",genders)


  const onChildPhotoChange = async (image: ImageObject,
  ): Promise<any> => {
    // Create Documents/children folder if it doesnt exist
    if (!(await exists(CHILDREN_PATH))) {
      mkdir(CHILDREN_PATH);
    }
    setCapturedImage(image.path);
    setPhotoDeleted(false);
  };
  const removePhoto = (): any => {

    deleteImageFile(capturedPhoto)
      .then(async (data: any) => {
        console.log(data);
        MediaPicker.cleanupImages();
        setphotoUri('');
        setCapturedImage('');
      })
      .catch((error: any) => {
        console.log(error);
        Alert.alert(t('tryText'));
      });
  };
  const handleImageOptionClick = async (item: any, index: number): Promise<any> => {
    console.log('index is', index)
    console.log('Obn image click1')
    if (item.id == 0) {
      Alert.alert(t('removePhotoTxt'), t('removeWarnTxt'), [
        {
          text: t('removePhotoOption1'),
          onPress: (): any => {
            console.log("pressed")
          },
          style: 'cancel',
        },
        {
          text: t('removePhotoOption2'),
          onPress: (): any => {
            setPhotoDeleted(true);
          },
        },
      ]);
    }
    else if (item.id == 1) {
      console.log('Obn image click2')
      MediaPicker.showCameraImagePicker((image: any) => {
        console.log(image, "..image..");
        onChildPhotoChange(image);
      });
    }
    else if (item.id == 2) {
      console.log('Obn image click3')
      MediaPicker.showGalleryImagePicker((image: any) => {
        onChildPhotoChange(image);
      });
    }
  };
  const deleteRecord = (index: number, dispatch: any, uuid: string, childList: any): any => {
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'), [
        {
          text: t('removeOption1'),
          onPress: (): any => resolve('error'),
          style: 'cancel',
        },
        {
          text: t('removeOption2'),
          onPress: async (): Promise<any> => {
            if (index == 0) {
              const filterList = childList.filter((item: any) => item.uuid != uuid)
              const selectedUuid = filterList[0];
              dispatch(setActiveChildData(selectedUuid))
            }
            await deleteChild(
              navigation,
              languageCode,
              index,
              dispatch,
              'ChildEntity',
              uuid,
              'uuid ="' + uuid + '"',
              resolve,
              reject,
              childAge,
              t,
              childList
            );
            navigation.navigate('ChildProfileScreen')


          },
        },
      ]);
    });
  };
  const setPhoto = async (uuid: string): Promise<any> => {
    const parts = capturedPhoto.split('.');
    let extension: string | null = null;
    if (parts.length > 1) {
      extension = parts[parts.length - 1].toLowerCase();
    }
    let newFilename: string;
    const timestamp = new Date().getTime();
    if (extension) {
      newFilename = `${uuid}_${timestamp}.${extension}`;
    } else {
      newFilename = uuid + '_' + timestamp;
    }

    // Set destPath
    const destPath = `${CHILDREN_PATH}/${newFilename}`;
    setDestPath(destPath);
    console.log(destPath);
    // Delete image if it exists
    if (await exists(destPath)) {
      await unlink(destPath);
    }

    // Copy image
    await copyFile(capturedPhoto, destPath);
    setphotoUri(destPath.replace(CHILDREN_PATH, ''));
    return destPath.replace(CHILDREN_PATH, '');
  }
  const AddChild = async (): Promise<any> => {
    // if dob /plannedTermDate changes, append notifications to current child's notifications in slice
    const isDefaultChild = "false";
    const insertData: any = editScreen
      ? await getNewChild(
        uuid,
        isDefaultChild,
        isExpected,
        plannedTermDate,
        isPremature,
        birthDate,
        name,
        photoUri,
        gender,
        createdAt,
      )
      : await getNewChild(
        uuid,
        '',
        isExpected,
        plannedTermDate,
        isPremature,
        birthDate,
        name,
        photoUri,
        gender,
        createdAt
      );
    const childSet: Array<any> = [];
    if (photoDeleted == true) {
      removePhoto();
      insertData.photoUri = '';
    }
    else {
      if (capturedPhoto != null && capturedPhoto != undefined && capturedPhoto != '') {
        insertData.photoUri = await setPhoto(insertData.uuid);
      }
    }
    console.log(insertData, "...insertData")
    childSet.push(insertData);
    setLoading(false);
    console.log('Edited data is',childSet)
    addChild(languageCode, editScreen, 2, childSet, dispatch, navigation, childAge, null, null, netInfo,false,true,'');
  };

  const getCheckedItem = (checkedItem: typeof genders[0]): any => {
    setGender(checkedItem.id);
  };
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: bgcolorWhite }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={[styles.headerRowView, {
            backgroundColor: headerColor,
          }]}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={(): any => {
                navigation.goBack();
              }}>
              <IconML name={'ic_back'} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            {childData && childData?.uuid != '' ? (
              <Heading2w style={styles.headetTitleText} numberOfLines={1}>{t('babyNotificationUpdateBtn')} </Heading2w>
            ) : (
              <Heading2w style={styles.headetTitleText} numberOfLines={1}>{t('addChildProfileHeader')}</Heading2w>
            )}
          </HeaderTitleView>
          {childList?.length > 1 && childData && childData?.uuid != '' ? (
            <HeaderActionView style={styles.padding0}>
              <Pressable style={styles.pressableView} onPress={(): any => {
                console.log('ChildData position', childData)
                if (childData?.index == undefined) {
                  deleteRecord(0, dispatch, childData?.uuid, childList)
                } else {
                  deleteRecord(childData?.index, dispatch, childData?.uuid, childList)
                }
                // deleteRecord(childData?.index, dispatch, childData?.uuid)
              }
              }>
                <Icon name={'ic_trash'} size={20} color="#FFF" />
              </Pressable>
            </HeaderActionView>
          ) : null}
        </HeaderRowView>
        <ScrollView style={styles.flex4}>
          <OverlayLoadingComponent loading={loading} />
          <FlexCol>
            {capturedPhoto != '' && capturedPhoto != null && capturedPhoto != undefined && photoDeleted == false ? (
              <View style={styles.container}>
                <ImageBackground
                  source={
                    capturedPhoto != ''
                      ? { uri: capturedPhoto }
                      : null
                  }
                  style={styles.image}>
                  <ProfileEditView onPress={(): any => {
                    actionSheetRef.current?.setModalVisible(true);
                  }}>
                    <Icon
                      name="ic_edit"
                      size={16}
                      color="#000"

                    />
                  </ProfileEditView>
                </ImageBackground>
              </View>
            ) : (
              <Pressable
                style={[styles.innerPressableView, {
                  backgroundColor: childProfileBgColor,

                }]}
                onPress={(): any => {
                  actionSheetRef.current?.setModalVisible(true);
                }}>
                    <VectorImage source={cameraProfileImage} />
                <ShiftFromTop10>
                  <Heading4Regular>{t('uploadPhtototxt')}</Heading4Regular>
                </ShiftFromTop10>
              </Pressable>
            )}
            <MainManageProfileContainer>
              <FormInputGroup>
                <ShiftFromTop10>
                  <LabelText>{t('childNameTxt')}</LabelText>
                  <FormInputBox>
                    <TextInputML
                      style={styles.width100}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={30}
                      clearButtonMode="always"
                      onChangeText={(value: string): any => {
                        if (value.replace(/\s/g, "") == "") {
                          setName(value.replace(/\s/g, ''));
                        } else {
                          setName(value.replace(regexpEmojiPresentation, ''));
                        }
                      }}
                      value={name}
                      //placeholder={t('childNamePlaceTxt')}
                      //placeholderTextColor={"#77777779"}
                      allowFontScaling={false}
                    />
                  </FormInputBox>
                </ShiftFromTop10>
              </FormInputGroup>

              {childData && childData?.uuid != '' ? 
              <ChildDate sendData={sendData} childData={childData} dobMax={new Date()}/>: 
              <ChildDate sendData={sendData} childData={childData} dobMax={new Date()} prevScreen="EditScreen" />
            }

              <FormContainerFlex>
                <LabelText>{t('genderLabel')}</LabelText>
                <ToggleRadios
                  options={genders}
                  defaultValue={defaultGenderValue}
                  tickbgColor={headerColor}
                  tickColor={'#FFF'}
                  getCheckedItem={getCheckedItem}
                />
              </FormContainerFlex>
              {/* <CheckboxItem>
              <View>
                {toggleCheckBox ? (
                  <CheckboxActive
                    style={
                      disablePrematureCheck ? styles.disabledCheckBox : null
                    }>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem> */}
            </MainManageProfileContainer>
          </FlexCol>
          <ShiftFromTop10>
            <ButtonMangeProfileContainer>
              <ButtonPrimary
                disabled={
                  !validateForm(
                    1,
                    birthDate,
                    isPremature,
                    '',
                    plannedTermDate,
                    name,
                    gender,
                  )
                }
                onPress={(e: any): any => {
                  e.preventDefault();
                  setLoading(true);
                  const validated = validateForm(
                    1,
                    birthDate,
                    isPremature,
                    '',
                    plannedTermDate,
                    name,
                    gender,
                  );
                  console.log("24455e655", validated)
                  if (validated == true) {
                    setTimeout(() => {
                      //setLoading(false);
                      AddChild();
                    }, 0)
                  }
                  // }

                }}>
                {childData && childData?.uuid != '' ? (
                  <ButtonUpperCaseText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonUpperCaseText>
                ) : (
                  <ButtonUpperCaseText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonUpperCaseText>
                )}
              </ButtonPrimary>
            </ButtonMangeProfileContainer>
          </ShiftFromTop10>


          <ActionSheet ref={actionSheetRef}>
            <MainContainer>
              <ArticleHeading>
                <Heading2>{t('cameraOptionsHeader')}</Heading2>
              </ArticleHeading>
              <View
                style={styles.actionsheetView}>
                {imageOptions.map((item, index) => {
                  console.log('imageOptions', item)
                  if (
                    index == 0 &&
                    (capturedPhoto == '' ||
                      capturedPhoto == null ||
                      capturedPhoto == undefined || photoDeleted == true)
                  ) {
                    return null;
                  } else {
                    return (
                      <View
                        key={index}
                        style={styles.innerImageView}>
                        <Pressable
                          style={styles.alignItemsCenter}
                          onPress={(): any => {
                            console.log('Obn image click')
                            //  actionSheetRef.current?.hide();
                            actionSheetRef.current?.setModalVisible(false);
                            handleImageOptionClick(item, index);
                          }}>
                          <Icon name={item.iconName} size={50} color="#000" />
                          <Heading4 style={styles.heading4}>{item.name}</Heading4>
                        </Pressable>
                      </View>
                    );
                  }
                })}
              </View>
            </MainContainer>
          </ActionSheet>
        </ScrollView>

      </View>
    </>
  );
};
export default EditChildProfile;
