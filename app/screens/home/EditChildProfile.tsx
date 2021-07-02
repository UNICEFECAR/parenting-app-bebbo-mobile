import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import ToggleRadios from '@components/ToggleRadios';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading4 } from '@styles/typography';
import React, { createRef, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image, Pressable,
    SafeAreaView,
    ScrollView, TextInput,
    View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { copyFile, DocumentDirectoryPath, exists, mkdir, unlink } from 'react-native-fs';
import { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import { addChild, deleteChild, getAllChildren, getAllConfigData, getNewChild } from '../../services/childCRUD';
import MediaPicker from '../../services/MediaPicker';
import { validateForm } from '../../services/Utils';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route: any,
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({ route, navigation }: Props) => {
let  childData  = route.params.childData;
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
  const editScreen = childData?.uuid != "" ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  let genders = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender,
  );
  genders=genders.map(v => ({...v, title: v.name}))
  //console.log(genders,"..genders..");
  //console.log(childData?.gender,"..childData?.gender..");
  const getDefaultgenderValue = ()=>{
    return childData?.uuid != "" ? genders.find(item=>item.id==childData?.gender) : {title:""}
  }
  
  //console.log(getDefaultgenderValue,"..getDefaultgenderValue..")
 
  const imageOptions = [
    { id: 0, iconName: 'ic_trash', name: t('cameraOption1') },
    { id: 1, iconName: 'ic_camera', name:  t('cameraOption2')},
    { id: 2, iconName: 'ic_gallery', name:  t('cameraOption3') },
  ];
  const actionSheetRef = createRef<any>();
  const [response, setResponse] = React.useState<any>(null);
  const [capturedPhoto, setCapturedImage] = React.useState(childData!=null && childData.photoUri!="" ? `${DocumentDirectoryPath}/${childData.photoUri}` :'');
  const [photoUri, setphotoUri] = React.useState("");
  const [tempImage,cleanUPImage]= React.useState("");
  let initialData: any = {};
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [name, setName] = React.useState(childData != null ? childData.name : '');
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date>();
  const [isPremature, setIsPremature] = React.useState<string>('false');
  const uuid = childData != null ? childData.uuid : '';
  const [isExpected,setIsExpected] = React.useState<string>('false');
  
  const sendData = (data: any) => { // the callback. Use a better name
   // console.log("111111")
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.dueDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    //console.log("2222")
    setIsExpected(String(data.isExpected));
    //console.log("333")
  };
  const [gender, setGender] = React.useState(childData != null ? childData.gender : '');
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    }, [])
  );
 const onChildPhotoChange=async (child: ChildEntity | undefined, image: ImageObject)=>{
    // Create Documents/children folder if it doesnt exist
    if (!(await exists(`${DocumentDirectoryPath}/children`))) {
        mkdir(`${DocumentDirectoryPath}/children`);
    }

    // Set newFilename
    let newFilename: string;

    let parts = image.path.split('.');
    let extension: string | null = null;
    if (parts.length > 1) {
        extension = parts[parts.length - 1].toLowerCase();
    };

    let timestamp = new Date().getTime();

    if (child) {
        if (extension) {
            newFilename = `${child.uuid}_${timestamp}.${extension}`;
        } else {
            newFilename = child.uuid + "_" + timestamp;
        };

        // Set destPath
        let destPath = `${DocumentDirectoryPath}/children/${newFilename}`;

        // Delete image if it exists
        if (await exists(destPath)) {
            await unlink(destPath);
        };

        // Copy image
        await copyFile(image.path, destPath);
        setphotoUri(destPath.replace(DocumentDirectoryPath, ''));
        // Save imageUri to realm
        // userRealmCommon.realm?.write(() => {
        //     child.photoUri = destPath.replace(DocumentDirectoryPath, '');
        // });
    };
};

  const handleImageOptionClick = async (index: number) => {
    if(index==0){
      // MediaPicker.cleanupSingleImage((image:any) => {
      //   // image.path ==>> file path 
      //   console.log(image,"..image..")
      // setphotoUri('');
      //});
      deleteImageFile(capturedPhoto).then(async (data:any)=>{
        //console.log(data,"..deleted..");
        let createresult = await userRealmCommon.updatePhotoUri<ChildEntity>(ChildEntitySchema,'', 'uuid ="' + childData?.uuid+ '"');
       // console.log(createresult,"..createresult..")
        if(createresult=='success'){
          MediaPicker.cleanupImages();
          setCapturedImage('');
        }
        else{
          Alert.alert("Try again...");
        }
       
      }).catch((error:any)=>{
        Alert.alert("Try again..");
      })

    }
    else if(index==1){
      MediaPicker.showCameraImagePicker((image:any) => {
        // image.path ==>> file path 
       // console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData,image);
       // setphotoUri(image.path)
      });
    }
    else if(index==2){
      MediaPicker.showGalleryImagePicker((image:any) => {
        // image.path ==>> file path 
       // console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData,image);
        //setphotoUri(image.path);
      });
    }
   
  };
  const deleteRecord = (index:number,dispatch:any,uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert('Delete Child', "Do you want to delete child?",
        [
          {
            text: "Cancel",
            onPress: () => reject("error"),
            style: "cancel"
          },
          { 
            text: "Delete", onPress: () => {
            deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"',resolve,reject);
            navigation.navigate('ChildProfileScreen')
          }
          }
        ]
      );
    });
   
  }
  useEffect(() => {
    // async function askPermissions() {
  
    //   if (Platform.OS === 'android') {
    //       await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses:any) => {
    //         console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
    //         console.log('WriteExternalSToage', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
    //         console.log('ReadExternalSToage', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
    //       });
    //   }

    //   if (Platform.OS === 'ios') {
    //    //   await Permissions.requestMultiple(['ios.permission.CAMERA', 'ios.permission.PHOTO_LIBRARY']);
    //   }
    // }

    // askPermissions();
  }, []);
  const AddChild = async () => {
    let insertData: any = editScreen ? await getNewChild(uuid,isExpected, plannedTermDate, isPremature, birthDate, '', name, photoUri, gender) : await getNewChild('',isExpected, plannedTermDate, isPremature, birthDate, '', name, photoUri, gender);
    let childSet: Array<any> = [];
    childSet.push(insertData);
   // console.log(insertData,"..insertData..");
    addChild(editScreen, 2, childSet, dispatch, navigation);
  }
  const getCheckedItem =(checkedItem:typeof genders[0])=>{
    //console.log(checkedItem);
    setGender(checkedItem.id);
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{ flex: 1, padding: 15 }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </View>
          <View style={{ flex: 9, padding: 7 }}>
          {
          childData && childData?.uuid!=""?(<Heading2w>{t('editChildProfileHeader')} </Heading2w>):( <Heading2w>{t('addChildProfileHeader')}</Heading2w>)
           
          }
          </View>
          <View style={{ flex: 9, padding: 7,alignItems:'flex-end' }}>
          {
          (childList?.length> 1 && childData && childData?.uuid!="") ? (
            <Heading2w onPress={() => deleteRecord(childData?.index,dispatch,childData?.uuid)}>Delete</Heading2w>
            ) :null
          }
           </View>
        </View>

        <ScrollView style={{ flex: 4 }}>
          <View style={{ flexDirection: 'column' }}>
         
          {
           
            (capturedPhoto!='' && capturedPhoto!=null && capturedPhoto!=undefined) ?
           
               <View
                 style={{ marginVertical: 24, alignItems: 'center' }} >
                    <View
                 style={{ marginVertical: 24, alignItems: 'flex-end' }} >
                    <Icon name="ic_camera" size={20} color="#FFF" onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}/>
              </View>
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{ width: 200, height: 200 }}
                    source={capturedPhoto!='' ? {uri:  "file://" +capturedPhoto } : null}
                  />
                
                </View>:
             <Pressable
              style={{
                height: 150,
                backgroundColor: SecondaryColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
              <Icon name="ic_camera" size={20} color="#FFF" />
            </Pressable>
              }
            <View style={{ padding: 10 }}>
              <LabelText>{t('childNameTxt')}</LabelText>
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  clearButtonMode="always"
                  onChangeText={(value) => { setName(value) }}
                  value={name}
                  // onChangeText={queryText => handleSearch(queryText)}
                  placeholder={t('childNamePlaceTxt')}
                  style={{
                    backgroundColor: '#FFF',
                  }}
                />
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                {genders.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{ padding: 10, backgroundColor: '#FFF', margin: 3 }}>
                      <Pressable
                        onPress={() => {
                          //console.log(item,"..item..");
                          setGender(item);
                        }}>
                        <Heading3>{item}</Heading3>
                      </Pressable>
                    </View>
                  );
                })}
              </View> */}
  <ToggleRadios options={genders} defaultValue={getDefaultgenderValue()} tickbgColor={headerColor} tickColor={"#FFF"} getCheckedItem={getCheckedItem}/>
      
              <ChildDate sendData={sendData} childData={childData} />

              <View style={{ width: '100%', marginTop: 30 }}>
                <ButtonPrimary onPress={() => {
                  //  console.log(birthDate,"..birthDate..");
                  //  console.log(isPremature,"..isPremature..");
                  //  console.log(plannedTermDate,"..plannedTermDate..");
                  //  console.log(isExpected,"..isExpected..");
                   const validated=validateForm(1,birthDate,isPremature,'',plannedTermDate,name,gender);
                   if(validated==true){
                    AddChild();
                   }
                   else{
                   Alert.alert(validated);
                   }
                  // AddChild()
                  // if(birthDate==null || birthDate==undefined){
                  //   Alert.alert('Please enter birth date');
                  // }
                  // else{
                  //   if(isPremature){
                  //     if(plannedTermDate==null || plannedTermDate==undefined){
                  //       Alert.alert('Please enter due date');
                  //     }
                  //     else{
                  //       AddChild();
                  //     }
                  //   }
                  //   else{
                  //     AddChild();
                  //    }
                  
                  // }
                }}>
                  {
                  childData && childData?.uuid!=""?(
                  <ButtonText>{t('editProfileBtn')}</ButtonText>):(
                  <ButtonText>{t('addProfileBtn')}</ButtonText>)
                  }
                </ButtonPrimary>
                 
               
              </View>
            </View>
          </View>
          <ActionSheet ref={actionSheetRef}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {
              imageOptions.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                      padding: 16,
                    }}>
                    <Pressable
                      style={{ alignItems: 'center' }}
                      onPress={() => {
                        actionSheetRef.current?.hide();
                        handleImageOptionClick(index);
                      }}>
                      <Icon name={item.iconName} size={50} color="#000" />
                      <Heading4>{item.name}</Heading4>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditChildProfile;
