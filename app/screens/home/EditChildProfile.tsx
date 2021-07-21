import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
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
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconBox } from '@components/shared/Icon';
import ToggleRadios from '@components/ToggleRadios';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading2w,
  Heading4,
  Heading4Regular,
  Heading4Regularw,
  ShiftFromTop10
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { createRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { copyFile, exists, mkdir, unlink } from 'react-native-fs';
import { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import {
  addChild,
  deleteChild,
  getAllChildren,
  getAllConfigData,
  getNewChild
} from '../../services/childCRUD';
import MediaPicker from '../../services/MediaPicker';
import { validateForm } from '../../services/Utils';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route: any;
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({route, navigation}: Props) => {
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
  const editScreen = childData?.uuid != '' ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  let genders = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender:[],
  );
  genders = genders.map((v) => ({...v, title: v.name}))
  // .filter(function (e, i, a) {
  //   return e.id!=0;
  // });
  console.log(genders,"..genders..");
  //console.log(childData?.gender,"..childData?.gender..");
  const getDefaultgenderValue = () => {
    return childData?.uuid != ''
      ? genders.find((item) => item.id == childData?.gender)
      : {title: ''};
  };

  //console.log(getDefaultgenderValue,"..getDefaultgenderValue..")

  const imageOptions = [
    {id: 0, iconName: 'ic_trash', name: t('cameraOption1')},
    {id: 1, iconName: 'ic_camera', name: t('cameraOption2')},
    {id: 2, iconName: 'ic_gallery', name: t('cameraOption3')},
  ];
  const actionSheetRef = createRef<any>();
  const [response, setResponse] = React.useState<any>(null);
  const [capturedPhoto, setCapturedImage] = React.useState(
    childData != null && childData.photoUri != ''
      ? `${CHILDREN_PATH}/${childData.photoUri}`
      : '',
  );
  const [photoUri, setphotoUri] = React.useState('');
  const [tempImage, cleanUPImage] = React.useState('');
  let initialData: any = {};
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [name, setName] = React.useState(
    childData != null ? childData.childName : '',
  );
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date>();
  const [isPremature, setIsPremature] = React.useState<string>('false');
  const uuid = childData != null ? childData.uuid : '';
  const [isExpected, setIsExpected] = React.useState<string>('false');
  const [destPath, setDestPath] = React.useState<string>('');
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
  );
  const sendData = (data: any) => {
    // the callback. Use a better name
    // console.log("111111")
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    //console.log("2222")
    setIsExpected(String(data.isExpected));
    //console.log("333")
  };
  const [gender, setGender] = React.useState(
    childData != null ? childData.gender : '',
  );
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
      console.log(childData, '..childData..');
      // if(photoUri!='' && photoUri!=null && photoUri!=undefined){
      //   imageOptions = [
      //    // { id: 0, iconName: 'ic_trash', name: t('cameraOption1') },
      //     { id: 1, iconName: 'ic_camera', name:  t('cameraOption2')},
      //     { id: 2, iconName: 'ic_gallery', name:  t('cameraOption3') },
      //   ];
      // }
      if (childData != null && childData.uuid != '') {
        setphotoUri(childData.photoUri);
        sendData(childData);
      }
    }, []),
  );
  const onChildPhotoChange = async (
    child: ChildEntity | undefined,
    image: ImageObject,
  ) => {
    MediaPicker.cleanupImages();
    // Create Documents/children folder if it doesnt exist
    if (!(await exists(CHILDREN_PATH))) {
      mkdir(CHILDREN_PATH);
    }

    // Set newFilename
    let newFilename: string;

    let parts = image.path.split('.');
    let extension: string | null = null;
    if (parts.length > 1) {
      extension = parts[parts.length - 1].toLowerCase();
    }

    let timestamp = new Date().getTime();

    if (child) {
      if (extension) {
        newFilename = `${child.uuid}_${timestamp}.${extension}`;
      } else {
        newFilename = child.uuid + '_' + timestamp;
      }

      // Set destPath
      let destPath = `${CHILDREN_PATH}/${newFilename}`;
      setDestPath(destPath);
      // Delete image if it exists
      if (await exists(destPath)) {
        await unlink(destPath);
      }

      // Copy image
      await copyFile(image.path, destPath);
      console.log(image.path);
      console.log(destPath);
      setphotoUri(destPath.replace(CHILDREN_PATH, ''));
      // Save imageUri to realm
      // userRealmCommon.realm?.write(() => {
      //     child.photoUri = destPath.replace(DocumentDirectoryPath, '');
      // });
    }
  };
  const removePhoto = () => {
    deleteImageFile(capturedPhoto)
      .then(async (data: any) => {
        //console.log(data,"..deleted..");
        let createresult = await userRealmCommon.updatePhotoUri<ChildEntity>(
          ChildEntitySchema,
          '',
          'uuid ="' + childData?.uuid + '"',
        );
        // console.log(createresult,"..createresult..")
        if (createresult == 'success') {
          MediaPicker.cleanupImages();
          setphotoUri('');
          setCapturedImage('');
        } else {
          Alert.alert('Try again...');
        }
      })
      .catch((error: any) => {
        Alert.alert('Try again..');
      });
  };
  const handleImageOptionClick = async (index: number) => {
    if (index == 0) {
      // MediaPicker.cleanupSingleImage((image:any) => {
      //   // image.path ==>> file path
      //   console.log(image,"..image..")
      // setphotoUri('');
      //});

      Alert.alert(t('removePhotoTxt'), t('removeWarnTxt'), [
        {
          text: t('removePhotoOption1'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('removePhotoOption2'),
          onPress: () => {
            removePhoto();
          },
        },
      ]);
    } else if (index == 1) {
      MediaPicker.showCameraImagePicker((image: any) => {
        // image.path ==>> file path
        // console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData, image);
        // setphotoUri(image.path)
      });
    } else if (index == 2) {
      MediaPicker.showGalleryImagePicker((image: any) => {
        // image.path ==>> file path
        // console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData, image);
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
              index,
              dispatch,
              'ChildEntity',
              uuid,
              'uuid ="' + uuid + '"',
              resolve,
              reject,
              child_age,
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
  const AddChild = async () => {
    let insertData: any = editScreen
      ? await getNewChild(
          uuid,
          isExpected,
          plannedTermDate,
          isPremature,
          birthDate,
          '',
          name,
          photoUri,
          gender,
        )
      : await getNewChild(
          '',
          isExpected,
          plannedTermDate,
          isPremature,
          birthDate,
          '',
          name,
          photoUri,
          gender,
        );
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(insertData, '..insertData..');
    addChild(editScreen, 2, childSet, dispatch, navigation, child_age);
  };
  const getCheckedItem = (checkedItem: typeof genders[0]) => {
    //console.log(checkedItem);
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setGender(checkedItem.id);
    } else {
      setGender(String(checkedItem.id));
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
            {childData && childData?.uuid != '' ? (
              <Heading2w>{t('editChildProfileHeader')} </Heading2w>
            ) : (
              <Heading2w>{t('addChildProfileHeader')}</Heading2w>
            )}
          </HeaderTitleView>
          <HeaderActionView>
            {childList?.length > 1 && childData && childData?.uuid != '' ? (
              <Heading4Regularw
                onPress={() =>
                  deleteRecord(childData?.index, dispatch, childData?.uuid)
                }>
                {t('growthScreendeletebtnText')}
              </Heading4Regularw>
            ) : null}
          </HeaderActionView>
        </HeaderRowView>
        <ScrollView style={{flex: 4}}>
          <FlexCol>
            {photoUri != '' && photoUri != null && photoUri != undefined ? (
              <View style={styles.container}>
                <ImageBackground
                  source={
                    photoUri != ''
                      ? {uri: 'file://' + CHILDREN_PATH + photoUri}
                      : null
                  }
                  style={styles.image}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 100,
                      margin: 10,
                      padding: 10,
                    }}>
                    <Icon
                      name="ic_edit"
                      size={16}
                      color="#000"
                      onPress={() => {
                        actionSheetRef.current?.setModalVisible();
                      }}
                    />
                  </View>
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
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={30}
                      clearButtonMode="always"
                      onChangeText={(value) => {
                        setName(value);
                      }}
                      value={name}
                      // onChangeText={queryText => handleSearch(queryText)}
                      placeholder={t('childNamePlaceTxt')}
                    />
                  </FormInputBox>
                </ShiftFromTop10>
              </FormInputGroup>
              <FormContainerFlex>
                <ToggleRadios
                  options={genders}
                  defaultValue={getDefaultgenderValue()}
                  tickbgColor={headerColor}
                  tickColor={'#FFF'}
                  getCheckedItem={getCheckedItem}
                />
              </FormContainerFlex>
              <ShiftFromTop10>
                <ChildDate sendData={sendData} childData={childData} />
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
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                {imageOptions.map((item, index) => {
                  console.log(
                    index == 0 &&
                      (photoUri == '' ||
                        photoUri == null ||
                        photoUri == undefined),
                  );
                  if (
                    index == 0 &&
                    (photoUri == '' ||
                      photoUri == null ||
                      photoUri == undefined)
                  ) {
                    return null;
                  } else {
                    return (
                      <View
                        key={index}
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                          padding: 16,
                        }}>
                        <Pressable
                          style={{alignItems: 'center'}}
                          onPress={() => {
                            actionSheetRef.current?.hide();
                            handleImageOptionClick(index);
                          }}>
                          <Icon name={item.iconName} size={50} color="#000" />
                          <Heading4>{item.name}</Heading4>
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
            onPress={() => {
              //  console.log(birthDate,"..birthDate..");
              //  console.log(isPremature,"..isPremature..");
              //  console.log(plannedTermDate,"..plannedTermDate..");
              //  console.log(isExpected,"..isExpected..");
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
                AddChild();
              } else {
              }
            }}>
            {childData && childData?.uuid != '' ? (
              <ButtonText>{t('editProfileBtn')}</ButtonText>
            ) : (
              <ButtonText>{t('addProfileBtn')}</ButtonText>
            )}
          </ButtonPrimary>
        </ButtonContainer>
      </SafeAreaView>
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
