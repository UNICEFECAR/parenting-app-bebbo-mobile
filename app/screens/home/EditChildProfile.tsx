import { both_child_gender, regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import {
  ButtonContainer,
  ButtonDelPress,
  ButtonPrimary,
  ButtonText,
  ButtonTextSmLineW
} from '@components/shared/ButtonGlobal';
import {
  FormContainerFlex,
  FormInputBox,
  FormInputGroup,
  LabelText
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconBox } from '@components/shared/Icon';
import { ProfileEditView } from '@components/shared/ProfileListingStyle';
import ToggleRadios from '@components/ToggleRadios';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading2w,
  Heading4,
  Heading4Regular, ShiftFromTop10
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { createRef, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet, TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionSheet from 'react-native-actions-sheet';
import { copyFile, exists, mkdir, unlink } from 'react-native-fs';
import { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import {
  addChild,
  deleteChild, getNewChild
} from '../../services/childCRUD';
import MediaPicker from '../../services/MediaPicker';
import { validateForm } from '../../services/Utils';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route: any;
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({ route, navigation }: Props) => {
  let childData = route.params.childData;
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  // if(childList.length>0 && childData!=null){
  // childData=childList.filter(item =>item.uuid == childData?.uuid)[0];
  // }
  // console.log(childData,"..childData..");
  // console.log(childData.birthDate,"..birthObject..");
  const editScreen = childData && childData.uuid != '' ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id != both_child_gender;
  });
  console.log(genders, "..genders..");
  //console.log(childData?.gender,"..childData?.gender..");
  // const getDefaultgenderValue = () => {
  //   return childData?.uuid != ''
  //     ? genders.find((item) => item.id == childData?.gender)
  //     : { title: '' };
  // };

  //console.log(getDefaultgenderValue,"..getDefaultgenderValue..")

  const imageOptions = [
    { id: 0, iconName: 'ic_trash', name: t('cameraOption1') },
    // { id: 1, iconName: 'ic_camera', name: t('cameraOption2') },
    { id: 2, iconName: 'ic_gallery', name: t('cameraOption3') },
  ];
  const actionSheetRef = createRef<any>();
  const [response, setResponse] = React.useState<any>(null);
  const [capturedPhoto, setCapturedImage] = React.useState('');
  const [photoUri, setphotoUri] = React.useState('');
  const [photoDeleted, setPhotoDeleted] = React.useState(false);
  const [defaultGenderValue, setDefaultGenderValue] = React.useState<any>(null);
  const [addChildParam, setAddChild] = React.useState(true);
  const [tempImage, cleanUPImage] = React.useState('');
  let initialData: any = {};
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
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const sendData = (data: any) => {
    // the callback. Use a better name
    console.log("111111", data)
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    //console.log("2222")
    setIsExpected(String(data.isExpected));
    //console.log("333")
  };
  const [gender, setGender] = React.useState(
    childData != null ? childData.gender : 0,
  );
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
    return () => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove()};
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      // getAllConfigData(dispatch);
      console.log(childData, '..childData..');
      // if(photoUri!='' && photoUri!=null && photoUri!=undefined){
      //   imageOptions = [
      //    // { id: 0, iconName: 'ic_trash', name: t('cameraOption1') },
      //     { id: 1, iconName: 'ic_camera', name:  t('cameraOption2')},
      //     { id: 2, iconName: 'ic_gallery', name:  t('cameraOption3') },
      //   ];
      // }
      if (childData != undefined && childData != null && childData != '' && childData.uuid != '') {
        setphotoUri(childData.photoUri);
       console.log(childData.photoUri, "..childData.photoUri..");
        if (childData.photoUri != '' && childData.photoUri != null && childData.photoUri != undefined) {
          setCapturedImage('file://' + `${CHILDREN_PATH}/${childData.photoUri}`);
        }
        sendData(childData);
      }
      setDefaultGenderValue(childData && childData.uuid? genders.find((item) => item.id == childData?.gender):{ title: '' })
    }, []),
  );


  const onChildPhotoChange = async (image: ImageObject,
  ) => {
    // Create Documents/children folder if it doesnt exist
    if (!(await exists(CHILDREN_PATH))) {
      mkdir(CHILDREN_PATH);
    }
    setCapturedImage(image.path);
    setPhotoDeleted(false);
  };
  const removePhoto = () => {

    deleteImageFile(capturedPhoto)
      .then(async (data: any) => {
        console.log(childData, "..deleted..");
        MediaPicker.cleanupImages();
        setphotoUri('');
        setCapturedImage('');
        //   if(childData && childData.uuid!="" && childData.uuid!=null){
        //   let createresult = await userRealmCommon.updatePhotoUri<ChildEntity>(
        //     ChildEntitySchema,
        //     '',
        //     'uuid ="' + childData?.uuid + '"',
        //   );
        //   // console.log(createresult,"..createresult..")
        //   if (createresult == 'success') {
        //     MediaPicker.cleanupImages();
        //     setphotoUri('');
        //     setCapturedImage('');
        //   } else {
        //     Alert.alert(t('tryText'));
        //   }
        // }
        // else{
        //   MediaPicker.cleanupImages();
        //   setphotoUri('');
        //   setCapturedImage('');
        // }
      })
      .catch((error: any) => {
        Alert.alert(t('tryText'));
      });
  };
  const handleImageOptionClick = async (item:any,index: number) => {
    console.log(item,"..item")
    if (item.id == 0) {
      // MediaPicker.cleanupSingleImage((image:any) => {
      //   // image.path ==>> file path
      //   console.log(image,"..image..")
      // setphotoUri('');
      //});

      Alert.alert(t('removePhotoTxt'), t('removeWarnTxt'), [
        {
          text: t('removePhotoOption1'),
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: t('removePhotoOption2'),
          onPress: () => {
            setPhotoDeleted(true);
            // removePhoto();
          },
        },
      ]);
    } 
    else if (item.id == 1) {
      MediaPicker.showCameraImagePicker((image: any) => {
        // image.path ==>> file path
        // console.log(image,"..image..");
        // cleanUPImage(image);
        // setCapturedImage(image.path);
        onChildPhotoChange(image);
        // setphotoUri(image.path)
      });
    } 
    else if (item.id == 2) {
      MediaPicker.showGalleryImagePicker((image: any) => {
        console.log(image)
        // image.path ==>> file path
        // console.log(image,"..image..");
        // cleanUPImage(image);
        // setCapturedImage(image.path);
        onChildPhotoChange(image);
        //setphotoUri(image.path);
      });
    }
  };
  const deleteRecord = (index: number, dispatch: any, uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'), [
        {
          text: t('removeOption1'),
          onPress: () => reject('error'),
          style: 'cancel',
        },
        {
          text: t('removeOption2'),
          onPress: () => {
            deleteChild(
              languageCode,
              index,
              dispatch,
              'ChildEntity',
              uuid,
              'uuid ="' + uuid + '"',
              resolve,
              reject,
              child_age,
              t
            );
            navigation.navigate('ChildProfileScreen');
          },
        },
      ]);
    });
  };
  // useEffect(() => {
  //   // async function askPermissions() {

  //   //   if (Platform.OS === 'android') {
  //   //       await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses:any) => {
  //   //         console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
  //   //         console.log('WriteExternalSToage', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
  //   //         console.log('ReadExternalSToage', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
  //   //       });
  //   //   }

  //   //   if (Platform.OS === 'ios') {
  //   //    //   await Permissions.requestMultiple(['ios.permission.CAMERA', 'ios.permission.PHOTO_LIBRARY']);
  //   //   }
  //   // }

  //   // askPermissions();
  // }, []);
  const setPhoto = async (uuid: string) => {
    console.log(capturedPhoto, "..capturedPhoto..");
    let parts = capturedPhoto.split('.');
    let extension: string | null = null;
    if (parts.length > 1) {
      extension = parts[parts.length - 1].toLowerCase();
    }
    let newFilename: string;
    let timestamp = new Date().getTime();
    if (extension) {
      newFilename = `${uuid}_${timestamp}.${extension}`;
    } else {
      newFilename = uuid + '_' + timestamp;
    }

    // Set destPath
    let destPath = `${CHILDREN_PATH}/${newFilename}`;
    setDestPath(destPath);
    // Delete image if it exists
    if (await exists(destPath)) {
      await unlink(destPath);
    }

    // Copy image
    await copyFile(capturedPhoto, destPath);
    console.log(capturedPhoto, "..imagepath..");
    console.log(destPath, "..destPath..");
    console.log(destPath.replace(CHILDREN_PATH, ''), "..destPath..");
    setphotoUri(destPath.replace(CHILDREN_PATH, ''));
    return destPath.replace(CHILDREN_PATH, '');
  }
  const AddChild = async () => {
    // if dob /plannedTermDate changes, append notifications to current child's notifications in slice
    let insertData: any = editScreen
      ? await getNewChild(
        uuid,
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
        uuidv4(),
        isExpected,
        plannedTermDate,
        isPremature,
        birthDate,
        name,
        photoUri,
        gender,
        createdAt
      );
    let childSet: Array<any> = [];
    console.log(capturedPhoto, '..capturedPhoto..');
    console.log(photoDeleted, '..photoDeleted..');
    if (photoDeleted == true) {
      removePhoto();
      insertData.photoUri = '';
    }
    else {
      if (capturedPhoto != null && capturedPhoto != undefined && capturedPhoto != '') {
        insertData.photoUri = await setPhoto(insertData.uuid);
      }
    }
    childSet.push(insertData);
    console.log(insertData, '..insertData..');
    console.log(childSet, '..childSet..');
    addChild(languageCode, editScreen, 2, childSet, dispatch, navigation, child_age, null,null);
  };

  const getCheckedItem = (checkedItem: typeof genders[0]) => {
    //console.log(checkedItem);
    // if (
    //   typeof checkedItem.id === 'string' ||
    //   checkedItem.id instanceof String
    // ) {
    //   setGender(checkedItem.id);
    // } else { 
    //   setGender(String(checkedItem.id));
    // }
    setGender(checkedItem.id);
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            {childData && childData?.uuid != '' ? (
              <Heading2w numberOfLines={1}>{t('editChildProfileHeader')} </Heading2w>
            ) : (
              <Heading2w numberOfLines={1}>{t('addChildProfileHeader')}</Heading2w>
            )}
          </HeaderTitleView>
          {childList?.length > 1 && childData && childData?.uuid != '' ? (
          <HeaderActionView>
              <ButtonDelPress
                onPress={() =>
                  deleteRecord(childData?.index, dispatch, childData?.uuid)
                }>
                <ButtonTextSmLineW>{t('growthScreendeletebtnText')}</ButtonTextSmLineW>
              </ButtonDelPress>
            
          </HeaderActionView>
          ) : null}
        </HeaderRowView>
        <ScrollView style={{ flex: 4 }}>
          {/* <Text>{capturedPhoto}</Text> */}
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
                  <ProfileEditView>
                    <Icon
                      name="ic_edit"
                      size={16}
                      color="#000"
                      onPress={() => {
                        actionSheetRef.current?.setModalVisible();
                      }}
                    />
                  </ProfileEditView>
                </ImageBackground>
              </View>
            ) : (
              <Pressable
                style={{
                  height: 180,
                  backgroundColor: SecondaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <IconBox>
                  <Icon name="ic_camera" size={24} color="#000" />
                </IconBox>
                <ShiftFromTop10>
                  <Heading4Regular>{t('uploadPhtototxt')}</Heading4Regular>
                </ShiftFromTop10>
              </Pressable>
            )}
            <MainContainer>
              <FormInputGroup>
                <ShiftFromTop10>
                  <LabelText>{t('childNameTxt')}</LabelText>
                  <FormInputBox>
                    <TextInput
                      style={{ width: '100%' }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={30}
                      clearButtonMode="always"
                      onChangeText={(value) => {
                        console.log(value, "..value")
                        // setName(value.replace(/\s/g, ''));
                        if (value.replace(/\s/g, "") == "") {
                          console.log("..11value")
                          setName(value.replace(/\s/g, ''));
                        } else {
                          // console.log("..22value");
                          // console.log("ah4567".match(regexpEmojiPresentation));
                          // console.log("ahh".match(regexpEmojiPresentation));
                          // if (/[\p{L}]+/u.test(value)) {
                          //   console.log("only text",value);
                            setName(value.replace(regexpEmojiPresentation, ''));
                          // }
                          // else{
                          //   console.log("having a number",value);
                          // }
                        }
                        // setName(value==""?value.replace(/\s/g, ''):value);
                      }}
                      // value={name.replace(/\s/g, '')}
                      value={name}
                      // onChangeText={queryText => handleSearch(queryText)}
                      placeholder={t('childNamePlaceTxt')}
                      allowFontScaling={false}
                    />
                  </FormInputBox>
                </ShiftFromTop10>
              </FormInputGroup>
              <FormContainerFlex>
                <ToggleRadios
                  options={genders}
                  defaultValue={defaultGenderValue}
                  tickbgColor={headerColor}
                  tickColor={'#FFF'}
                  getCheckedItem={getCheckedItem}
                />
              </FormContainerFlex>
              <ShiftFromTop10>
                <ChildDate sendData={sendData} childData={childData} dobMax={new Date()} prevScreen="EditScreen" />
              </ShiftFromTop10>
            </MainContainer>
          </FlexCol>
          <ActionSheet ref={actionSheetRef}>
            <MainContainer>
              <ArticleHeading>
                <Heading2>{t('cameraOptionsHeader')}</Heading2>
              </ArticleHeading>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                {imageOptions.map((item, index) => {
                    if (
                    index == 0 &&
                    (capturedPhoto == '' ||
                      capturedPhoto == null ||
                      capturedPhoto == undefined || photoDeleted==true)
                  ) {
                    console.log(capturedPhoto,"..capturedPhoto")
                    console.log(photoDeleted,"..photoDeleted")
                    return null;
                  } else {
                    return (
                      <View
                        key={index}
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                          padding: 16,

                          flex: 1,

                        }}>
                        <Pressable
                          style={{ alignItems: 'center' }}
                          onPress={() => {
                            actionSheetRef.current?.hide();
                            handleImageOptionClick(item,index);
                          }}>
                          <Icon name={item.iconName} size={50} color="#000" />
                          <Heading4 style={{ flexShrink: 1, textAlign: 'center', marginTop: 10 }}>{item.name}</Heading4>
                        </Pressable>
                      </View>
                    );
                  }
                })}
              </View>
            </MainContainer>
          </ActionSheet>
        </ScrollView>
        <ButtonContainer>
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
            onPress={(e) => {
              e.preventDefault();
              setAddChild(false);
              //  console.log(birthDate,"..birthDate..");
              //  console.log(isPremature,"..isPremature..");
              //  console.log(plannedTermDate,"..plannedTermDate..");
              //  console.log(isExpected,"..isExpected..");
              if (addChildParam == true) {
                const validated = validateForm(
                  1,
                  birthDate,
                  isPremature,
                  '',
                  plannedTermDate,
                  name,
                  gender,
                );
                if (validated == true) {
                  console.log("24455e655")
                  AddChild();
                } else {
                }
              }

            }}>
            {childData && childData?.uuid != '' ? (
              <ButtonText numberOfLines={2}>{t('babyNotificationUpdateBtn')}</ButtonText>
            ) : (
              <ButtonText numberOfLines={2}>{t('addProfileBtn')}</ButtonText>
            )}
          </ButtonPrimary>
        </ButtonContainer>
      </View>
    </>
  );
};
export default EditChildProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 180,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  text: {
    alignSelf: 'flex-end',
    position: 'absolute', // add if dont work with above
    right: 10,
    top: 10,
  },
});
