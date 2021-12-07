import { both_child_gender, both_parent_gender, femaleData, maleData, regexpEmojiPresentation, relationShipFatherId, relationShipMotherId } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonPrimaryMd, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildContentArea, ChildRelationList, ChildSection, FormContainer, FormContainer1, FormContainerFlex, FormDateAction, FormDateText, FormInputBox, FormInputGroup, LabelText, OrDivider, OrHeadingView, OrView, TextBox
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import { FlexDirRowSpace, FlexCol, FlexRow, Flex1, Flex3, Flex2, FDirRow } from '@components/shared/FlexBoxStyle';

import OnboardingHeading from '@components/shared/OnboardingHeading';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dobMax } from '@types/types';
import { Settings } from 'luxon';
import React, { createRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, ScrollView, Alert, Modal, StyleSheet, TextInput, PermissionsAndroid, Platform } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { backup } from '../services/backup';
import { addChild, getNewChild, isFutureDate } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3,
  Heading4Regularw,
  ShiftFromTop30,
  ShiftFromTop20,
  SideSpacing25,
  Heading3Centerw,
  Heading2w,
  ShiftFromTop10,
  Heading1,
  Heading4Regular,
  ShiftFromTopBottom5
} from '../styles/typography';
import { VerticalDivider } from '@components/shared/Divider';
import AlertModal from '@components/AlertModal';
import { BannerContainer } from '@components/shared/Container';
import { SettingHeading, SettingShareData, SettingOptions } from '@components/shared/SettingsStyle';
import VectorImage from 'react-native-vector-image';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import DocumentPicker from 'react-native-document-picker';
// import { ChildEntity } from '../database/schema/ChildDataSchema';

import RNFS from 'react-native-fs';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp,
};
const ChildSetup = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState('');
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected, setIsExpected] = useState<string>('false');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const actionSheetRefImport = createRef<any>();
  const netInfoval = useNetInfoHook();
  // const relationshipData = ['Father', 'Mother', 'Other'];
  let relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
  );
  const relationship_to_parent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const actionSheetRef = createRef<any>();
  const [gender, setGender] = React.useState(0);
  const dispatch = useAppDispatch();
  let initialData: any = {};
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id != both_child_gender;
  });
  relationshipData = relationshipData.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id != both_parent_gender;
  });
  const onImportCancel = () => {
    setImportAlertVisible(false);
  }
  //console.log(genders, "..genders..");
  //console.log(childData?.gender,"..childData?.gender..");
  useFocusEffect(
    React.useCallback(() => {
      // const fetchData = async () => {  
      // }
      // fetchData();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch(state => {
          // 
          // Remove the home route from the stack
          const routes = state.routes.filter(r => r.name !== 'LoadingScreen');

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 500);
    }, [])
  );
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
  const getCheckedParentItem = (checkedItem: any) => {
    // console.log(checkedItem, "..checkedItem");
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  const importFromFile=async()=>{
    const res: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    })
    console.log(res, "..res..");


    if (res.length > 0 && res[0].uri) {
      const exportedFileContent:any = await RNFS.readFile(res[0].uri, 'base64');
      console.log(exportedFileContent,"..newexportedFileContent..")
     // console.log(oldChildrenData,"..newoldChildrenData..")
      const exportedFileContentRealm:any = await RNFS.writeFile(RNFS.TemporaryDirectoryPath + '/' + 'user1.realm',exportedFileContent,"base64");
      const importedrealm = await new Realm({ path: RNFS.TemporaryDirectoryPath + '/' + 'user1.realm'});
      console.log(importedrealm,"...importedrealm");
      const user1Path = importedrealm.path;
      const oldChildrenData = importedrealm.objects('ChildEntity');
      console.log(exportedFileContent,"..newexportedFileContent..")
      console.log(oldChildrenData,"..newoldChildrenData..")
      setImportAlertVisible(false);
      setLoading(true);
      setIsImportRunning(true);
      if (oldChildrenData.length > 0) {
        setIsImportRunning(false);
        setLoading(false);
        navigation.navigate('ChildImportSetup', {
          importResponse: JSON.stringify(oldChildrenData)
        });
        importedrealm.close();
        try {
          Realm.deleteFile({ path:  RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
      } catch (error) {
          //console.log(error);
      } 
      }
      else {
        setLoading(false);
        setIsImportRunning(false);
      }
     
    }

  }
  const importAllData = async () => {
    setImportAlertVisible(false);
    setLoading(true);
    setIsImportRunning(true);
    //param 1 from settings import for navigation
    const importResponse = await backup.import1(navigation, languageCode, dispatch, child_age, genders);
    //console.log(importResponse, "..111111importResponse");
    if (importResponse.length > 0) {
      setIsImportRunning(false);
      setLoading(false);
      navigation.navigate('ChildImportSetup', {
        importResponse: JSON.stringify(importResponse)
      });
      // actionSheetRef1.current?.setModalVisible();
      // setParentSection(true);  

    }
    else {
      setLoading(false);
      setIsImportRunning(false);
    }
    // Alert.alert(t('importText'), t("dataConsistency"),
    //   [
    //     {
    //       text: t("retryCancelPopUpBtn"),
    //       onPress: () => {

    //       },
    //       style: "cancel"
    //     },
    //     {
    //       text: t('continueCountryLang'), onPress: async () => {
    //        // console.log(userRealmCommon.realm?.path, "..path")
    //         // this.setState({ isImportRunning: true, });
    //         setLoading(true);
    //         setIsImportRunning(true);
    //         //param 1 from settings import for navigation
    //         const importResponse = await backup.import1(navigation, languageCode, dispatch, child_age, genders);
    //         //console.log(importResponse, "..111111importResponse");
    //         if (importResponse.length > 0) {
    //           setIsImportRunning(false);
    //           setLoading(false);
    //           navigation.navigate('ChildImportSetup',{
    //             importResponse:JSON.stringify(importResponse)
    //           });
    //           // actionSheetRef1.current?.setModalVisible();
    //           // setParentSection(true);  

    //         }
    //         else {
    //           setLoading(false);
    //           setIsImportRunning(false);
    //         }
    //         // this.setState({ isImportRunning: false, });
    //         // setIsImportRunning(false);
    //       }
    //     }
    //   ]
    // );
  }


  const AddChild = async () => {
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    // let defaultName = t('defaultChildPrefix') + (allJsonDatanew?.length + 1);
    let defaultName = name;
    let insertData: any = await getNewChild('', isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, null);
    let childSet: Array<any> = [];
    childSet.push(insertData);
    // console.log(childSet, "..childSet..");
    addChild(languageCode, false, 0, childSet, dispatch, navigation, child_age, relationship, userRelationToParent);
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <View style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView contentContainerStyle={{ padding: 0, paddingTop: 0 }}>
          <OnboardingContainer>
            <OverlayLoadingComponent loading={loading} />
            <OnboardingHeading>
              <ChildCenterView>
                <Heading1Centerw>
                  {t('childSetupheader')}
                </Heading1Centerw>
              </ChildCenterView>

            </OnboardingHeading>

            <FlexCol>
              <FlexRow style={{ marginTop: 10 }}>
                <Flex2>
                  <Heading4Regularw>{t('importOnboardingText')}</Heading4Regularw>
                </Flex2>
                <Flex1>
                  <ButtonPrimaryMd
                    disabled={isImportRunning}
                    onPress={(e) => {
                      e.stopPropagation();
                      // importAllData();
                      actionSheetRefImport.current?.setModalVisible(true);
                    }}>
                    <ButtonText>{t('OnboardingImportButton')}</ButtonText>
                  </ButtonPrimaryMd>
                </Flex1>
              </FlexRow>
              <FlexRow>
                <Flex1>
                  <OrView>
                    <OrDivider><Text></Text></OrDivider>
                    <OrHeadingView>
                      <Heading3Centerw>{t('ORkeyText')}</Heading3Centerw>
                    </OrHeadingView>

                  </OrView>
                </Flex1>
              </FlexRow>
            </FlexCol>

            <FlexCol>
              <Heading2w>
                {t('addChildText')}
              </Heading2w>
              <ChildDate sendData={sendData} dobMax={dobMax} prevScreen="Onboarding" />
              <ShiftFromTop20>
                <LabelText>{t('childNameTxt')}</LabelText>
                <FormInputBox>
                  <TextInput
                    style={{ width: '100%' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={30}
                    clearButtonMode="always"
                    onChangeText={(value) => {
                      //console.log(value, "..value")
                      // setName(value.replace(/\s/g, ''));
                      if (value.replace(/\s/g, "") == "") {
                        //console.log("..11value")
                        setName(value.replace(/\s/g, ''));
                      } else {
                        setName(value.replace(regexpEmojiPresentation, ''));
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
              </ShiftFromTop20>
              {
                birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ?
                  <FormContainer1>
                    <LabelText>{t('genderLabel')}</LabelText>
                    <ToggleRadios
                      options={genders}
                      tickbgColor={headerColor}
                      tickColor={'#FFF'}
                      getCheckedItem={getCheckedItem}
                    />
                  </FormContainer1>
                  : null
              }


              <ShiftFromTop20>
                <FormInputGroup
                  onPress={() => {
                    actionSheetRef.current?.setModalVisible();
                  }}>
                  <LabelText>{t('childSetuprelationSelectTitle')}</LabelText>
                  <FormInputBox>
                    <FormDateText>
                      <Text>{relationshipname ? relationshipname : t('childSetuprelationSelectText')}</Text>
                    </FormDateText>
                    <FormDateAction>
                      <Icon name="ic_angle_down" size={10} color="#000" />
                    </FormDateAction>
                  </FormInputBox>
                </FormInputGroup>
              </ShiftFromTop20>

              <View>
                {
                  userRelationToParent != null && userRelationToParent != undefined && userRelationToParent != relationShipMotherId && userRelationToParent != relationShipFatherId ?
                    <FormContainer1>
                      <LabelText>{t('parentGender')}</LabelText>
                      <ToggleRadios
                        options={relationshipData}
                        tickbgColor={headerColor}
                        tickColor={'#FFF'}
                        getCheckedItem={getCheckedParentItem}
                      />
                    </FormContainer1>
                    : null
                }
              </View>


            </FlexCol>



          </OnboardingContainer>

        </ScrollView>
        <ActionSheet ref={actionSheetRef}>

          <View>
            {/* {relationshipData.map((item, index) => {
                return (
                  <ChildRelationList key={index}>
                    <Pressable
                      onPress={() => {
                        if (typeof item.id === 'string' || item.id instanceof String) {
                          setRelationship(item.id);
                        }
                        else {
                          setRelationship(String(item.id));
                        }
                        setRelationshipName(item.name);
                        actionSheetRef.current?.hide();
                      }}>
                      <Heading3>{item.name}</Heading3>
                    </Pressable>
                  </ChildRelationList>
                );
              })} */}
            {relationship_to_parent.map((item, index) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={() => {
                      // console.log(item, "..item..");
                      setUserRelationToParent(item.id);
                      //   if(item.id == relationShipFatherId  || item.id == relationShipMotherId || relationship == '' || relationship == null || relationship == undefined){
                      //     setRelationship('');
                      //  }
                      //  if(item.id != relationShipFatherId  && item.id != relationShipMotherId && relationship != '' && relationship != null && relationship != undefined){
                      //   setRelationship('');
                      //  }
                      // console.log(userRelationToParent, "..userRelationToParent..");
                      if (item.id == relationShipMotherId) {
                        if (typeof femaleData.id === 'string' || femaleData.id instanceof String) {
                          setRelationship(femaleData.id);
                        }
                        else {
                          setRelationship(String(femaleData.id));
                        }
                      }
                      else if (item.id == relationShipFatherId) {
                        if (typeof maleData.id === 'string' || maleData.id instanceof String) {
                          setRelationship(maleData.id);
                        }
                        else {
                          setRelationship(String(maleData.id));
                        }
                      }
                      else {
                        //console.log(item.id, "..item.id");
                        //console.log(relationship, "..relationship..");
                        //console.log(userRelationToParent, "..userRelationToParent..");
                        if (userRelationToParent == relationShipMotherId || userRelationToParent == relationShipFatherId) {
                          setRelationship('');
                        }
                      }
                      setRelationshipName(item.name);
                      actionSheetRef.current?.hide();
                    }}>
                    <Heading3>{item.name}</Heading3>
                  </Pressable>
                </ChildRelationList>
              );
            })}

          </View>
        </ActionSheet>
        <ActionSheet ref={actionSheetRefImport}>
          <BannerContainer>
            <SettingHeading>
              <Heading1>{t('settingScreenimportOptionHeader')}</Heading1>
            </SettingHeading>
            <SettingShareData>
              <FDirRow>
                {/* <SettingOptions>
                    <Pressable onPress={() => {
                      console.log("icon clicked");
                      //if(netInfoval && netInfoval.isConnected==true){
                      exportFile()
                      // }
                      // else{
                      //   Alert.alert('',t('noInternet'));
                      // }
                    }}>
                      <Icon name="ic_sb_shareapp" size={30} color="#000" />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreenshareBtntxt')}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions> */}
                  <SettingOptions>
                  <Pressable onPress={() => {
                    //  console.log("icon clicked");
                    actionSheetRefImport.current?.setModalVisible(false);
                    setTimeout(async () => {
                      try {
                        //import
                        if (Platform.OS === "android") {
                          console.log("1233");
                          const userResponse = await PermissionsAndroid.requestMultiple([
                            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                          ]);
                          console.log(userResponse,"..userResponse..")
                          if (userResponse) {
                            importFromFile();
                          }
                        }
                        else{
                          importFromFile();
                        }
                      

                      } catch (err) {
                        if (DocumentPicker.isCancel(err)) {
                          // User cancelled the picker, exit any dialogs or menus and move on
                        } else {
                          throw err
                        }
                      }
                    }, 350);
                  }}>
                    <Icon name="ic_sb_shareapp" size={30} color="#000" />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreenshareBtntxt')}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                </SettingOptions>
                <SettingOptions>
                  <Pressable onPress={() => {
                    //  console.log("icon clicked");
                    actionSheetRefImport.current?.setModalVisible(false);
                    if (netInfoval && netInfoval.isConnected == true) {
                      setImportAlertVisible(true);
                    }
                    else {
                      Alert.alert('', t('noInternet'));
                    }

                  }}>
                    <VectorImage
                      source={require('@assets/svg/ic_gdrive.svg')}
                    />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>
                        {t('settingScreengdriveBtntxt')}
                      </Heading4Regular>
                    </ShiftFromTopBottom5>
                  </Pressable>

                </SettingOptions>
                
              </FDirRow>
            </SettingShareData>
          </BannerContainer>
        </ActionSheet>
        <SideSpacing25>
          <ButtonRow>
            <ButtonPrimary
              disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(0, birthDate, isPremature, relationship, plannedTermDate, name, gender) : !validateForm(3, birthDate, isPremature, relationship, plannedTermDate, name, gender)}
              onPress={(e) => {
                e.stopPropagation();
                // console.log(birthDate,"..birthDate..");
                // console.log(isPremature,"..isPremature..");
                // console.log(plannedTermDate,"..plannedTermDate..");
                // console.log(isExpected,"..isExpected..");
                // AddChild();
                // console.log(birthDate,"..birthDate..");
                let validated: any = false;
                if (birthDate != null && birthDate != undefined && !isFutureDate(birthDate)) {
                  validated = validateForm(0, birthDate, isPremature, relationship, plannedTermDate, name, gender);
                }
                else if (birthDate != null && birthDate != undefined && isFutureDate(birthDate)) {
                  validated = validateForm(3, birthDate, isPremature, relationship, plannedTermDate, name, gender);
                }
                //console.log(validated, "..validated..");
                if (validated == true) {
                  AddChild();
                }
                else {
                  //  Alert.alert(validated);
                }

              }}>
              <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
        </SideSpacing25>
        <AlertModal loading={isImportAlertVisible} disabled={isImportRunning} message={t("dataConsistency")} title={t('importText')} cancelText={t("retryCancelPopUpBtn")} onConfirm={importAllData} onCancel={onImportCancel}></AlertModal>

      </View>
    </>
  );
};

export default ChildSetup;
// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     alignItems: 'center',
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     backgroundColor: '#00000040',
//   }
// });