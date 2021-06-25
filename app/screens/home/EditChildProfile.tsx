import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading3, Heading4 } from '@styles/typography';
import React, { createRef, useContext, useEffect } from 'react';
import {
  Image, Pressable,
  SafeAreaView,
  ScrollView, TextInput,
  View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components';
import { useAppDispatch } from '../../../App';
import { addChild, getAllChildren, getAllConfigData, getNewChild } from '../../services/childCRUD';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route:any,
  navigation: NotificationsNavigationProp;
};

const CROPPED_IMAGE_WIDTH = 800;
const CROPPED_IMAGE_HEIGHT = 800;
const EditChildProfile = ({route,navigation}: Props) => {
  const {childData}=route.params;
  
  // console.log(childData,"..childData..");
  // console.log(childData.birthDate,"..birthObject..");
  let editScreen = childData?.uuid != "" ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch=useAppDispatch();
  
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  const genders = ['boy', 'girl'];
  const imageOptions = [
    {id: 0, iconName: 'ic_trash', name: 'Remove Photo'},
    {id: 1, iconName: 'ic_camera', name: 'Camera'},
    {id: 2, iconName: 'ic_gallery', name: 'Gallery'},
  ];
  const actionSheetRef = createRef<any>();
  const [response, setResponse] = React.useState<any>(null);
 
  const [photoUri, setphotoUri] = React.useState("");
  let initialData: any = {};
  const [birthDate, setBirthDate] =  React.useState<Date>();
  const [name, setName] = React.useState(editScreen ?childData.name:'');
  const [plannedTermDate, setPlannedTermDate] =  React.useState<Date>();
  const [isPremature, setIsPremature] =  React.useState<string>('false');
  const uuid= childData != null ? childData.uuid:'';
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.dueDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
   // 
  };
  const [gender, setGender] = React.useState(editScreen?childData.gender:'');
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
     
    },[])
  );
  const handleImageOptionClick = (index: number) => {
    if (index === 0) {
      ImagePicker.openPicker({
        includeBase64: false,
        compressImageMaxWidth: 500,
        compressImageMaxHeight: 500,
        cropping: true,
        width: CROPPED_IMAGE_WIDTH, // Width of result image when used with cropping option
        height: CROPPED_IMAGE_HEIGHT,
        freeStyleCropEnabled: true,
        showCropGuidelines: true,
        multiple:false
      })
        .then((image: ImageObject | ImageObject[]) => {
          if (!Array.isArray(image)) {
         //   console.log(image)
            // this.setState(
            //   {
            //     imageUri: image.path,
            //   },
            //   () => {
            //     if (this.props.onChange && image.path) {
            //       this.props.onChange(image);
            //     }
            //   },
            // );
          }
        })
        .catch((error) => {
          if (error.message != 'User cancelled image selection') {
           // console.log(error);
          }
        });
    } else {
      ImagePicker.openCamera({
        includeBase64: false,
        compressImageMaxWidth: 500,
        compressImageMaxHeight: 500,
        cropping: true,
        width: CROPPED_IMAGE_WIDTH, // Width of result image when used with cropping option
        height: CROPPED_IMAGE_HEIGHT,
        freeStyleCropEnabled: true,
        showCropGuidelines: true,
        multiple:false
      }).then((image) => {
        //console.log(image);
        // setResponse(image)
      });
    }
  };
  useEffect(() => {
    async function askPermissions() {
        // if (Platform.OS === 'android') {
        //     await Permissions.requestMultiple([
        //         'android.permission.CAMERA',
        //         'android.permission.WRITE_EXTERNAL_STORAGE',
        //     ]);
        // }

        // if (Platform.OS === 'ios') {
        //     await Permissions.requestMultiple(['ios.permission.CAMERA', 'ios.permission.PHOTO_LIBRARY']);
        // }
    }

    askPermissions();
}, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#FFF" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 9, padding: 7}}>
              <Heading2w>
                {'Edit Child Profile'}
              </Heading2w>
            </View>
          </View>

        <ScrollView style={{flex: 4}}>
          <View style={{flexDirection: 'column'}}>
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
            {response?.assets &&
              response?.assets.map(({uri}) => (
                <View
                  key={uri}
                  style={{marginVertical: 24, alignItems: 'center'}}>
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{width: 200, height: 200}}
                    source={{uri: uri}}
                  />
                </View>
              ))}
            <View style={{padding: 10}}>
              <LabelText>Name</LabelText>
              <View style={{flex: 1}}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  onChangeText={(value) => { setName(value) }}
                  value={name}
                  // onChangeText={queryText => handleSearch(queryText)}
                  placeholder="Enter your child name"
                  style={{
                    backgroundColor: '#FFF',
                  }}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                {genders.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{padding: 10, backgroundColor: '#FFF', margin: 3}}>
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
              </View>

              <ChildDate sendData={sendData} childData={childData} />

              <View style={{width: '100%', marginTop: 30}}>
                <ButtonPrimary onPress={() => {
                   let insertData: any = editScreen ? getNewChild(uuid, plannedTermDate,  isPremature, birthDate,'', name, photoUri, gender):getNewChild('', plannedTermDate, isPremature,birthDate,'',name,photoUri,gender);
                   let childSet: Array<any> = [];
                   childSet.push(insertData);
                   //console.log(insertData,"..insertData..");
                   addChild(editScreen,2,childSet,dispatch,navigation);  
                  
                }}>
                  <ButtonText>Update Profile</ButtonText>
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
              {imageOptions.map((item, index) => {
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
              })}
            </View>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditChildProfile;
