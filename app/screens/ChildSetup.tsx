import { both_child_gender, both_parent_gender, femaleData, maleData, regexpEmojiPresentation, relationShipFatherId, relationShipMotherId, tempRealmFile } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonPrimaryMd, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildRelationList,
  FormContainer1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
  OrDivider,
  OrHeadingView,
  OrView,
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import { FlexCol, FlexRow, Flex1, Flex2, FDirRow } from '@components/shared/FlexBoxStyle';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dobMax } from '@types/types';
import React, { createRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, ScrollView, Alert, Platform, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
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
  ShiftFromTop20,
  SideSpacing25,
  Heading3Centerw,
  Heading2w,
  Heading1,
  Heading4Regular,
  ShiftFromTopBottom5,
} from '../styles/typography';
import AlertModal from '@components/AlertModal';
import { BannerContainer } from '@components/shared/Container';
import { SettingHeading, SettingShareData, SettingOptions } from '@components/shared/SettingsStyle';
import VectorImage from 'react-native-vector-image';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import * as ScopedStorage from "react-native-scoped-storage";
import RNFS from 'react-native-fs';
import TextInputML from '@components/shared/TextInputML';
import { primaryColor } from '@styles/style';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor:primaryColor,
    flex:1
  },
  flex2Style: { 
    alignItems:'flex-start'
  },
  flexRow1: { 
    marginTop:10
  },
  scrollViewStyle: { 
    padding: 0,
    paddingTop: 0
  },
  textInputStyle: { 
    width: '100%'
  }
})
const ChildSetup = ({ navigation }: Props):any => {
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
  const sendData = (data: any):any => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    const myString = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v:any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != both_child_gender;
  });
  relationshipData = relationshipData.map((v:any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != both_parent_gender;
  });
  const onImportCancel = ():any => {
    setImportAlertVisible(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch(state => {
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
  const getCheckedItem = (checkedItem: typeof genders[0]):any => {
    setGender(checkedItem.id);
  };
  const getCheckedParentItem = (checkedItem: any):any => {
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  const handleError = (err: any):any => {
    console.log(err,"..err")
    if (DocumentPicker.isCancel(err)) {
      console.log('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.log('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  };
  const importFromFile=async():Promise<any>=>{
    if(Platform.OS=="android"){
      const dataset=await ScopedStorage.openDocument(true,'base64');
      console.log(dataset,"..dataset");
      if (dataset && dataset.data!="" && dataset.data!=null && dataset.data!=undefined) {
         await RNFS.writeFile(tempRealmFile,dataset.data,"base64");
         const importedrealm = await new Realm({ path: 'user1.realm'});
         console.log(importedrealm,"...importedrealm");
         const user1Path = importedrealm.path;
         console.log(user1Path, "..user1Path");
         const oldChildrenData = importedrealm.objects('ChildEntity');
         console.log(oldChildrenData,"..newoldChildrenData..")
         setImportAlertVisible(false);
         setLoading(true);
         setIsImportRunning(true);
         if (oldChildrenData.length > 0) {
           await userRealmCommon.openRealm();
           await userRealmCommon.deleteAllAtOnce();
           setIsImportRunning(false);
           setLoading(false);
           navigation.navigate('ChildImportSetup', {
             importResponse: JSON.stringify(oldChildrenData)
           });
           importedrealm.close();
           try {
             Realm.deleteFile({ path: tempRealmFile });
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
    else{
    DocumentPicker.pick({
      allowMultiSelection: false,
      type: DocumentPicker.types.allFiles,
    })
  .then(async (res:any)=>{
    console.log(res, "..res..");
    if (res.length > 0 && res[0].uri) {
      const exportedFileContent: any = await RNFS.readFile(decodeURIComponent(res[0].uri), 'base64');
      const exportedFileContentRealm: any = await RNFS.writeFile(tempRealmFile, exportedFileContent, "base64");
      let importedrealm=await new Realm({ path:'user1.realm' });
      if(importedrealm){
        importedrealm.close();
      }
      importedrealm=await new Realm({ path:'user1.realm' });
            const user1Path = importedrealm.path;
            console.log(user1Path, "..user1Path");
            const oldChildrenData = importedrealm.objects('ChildEntity');
            console.log(exportedFileContentRealm, "..exportedFileContentRealm..")
            console.log(oldChildrenData, "..newoldChildrenData..")
      setImportAlertVisible(false);
      setLoading(true);
      setIsImportRunning(true);
      if (oldChildrenData.length > 0) {
        await userRealmCommon.openRealm();
        await userRealmCommon.deleteAllAtOnce();
        setIsImportRunning(false);
        setLoading(false);
        navigation.navigate('ChildImportSetup', {
          importResponse: JSON.stringify(oldChildrenData)
        });
        importedrealm.close();
        try {
          Realm.deleteFile({ path: tempRealmFile});
      } catch (error) {
          //console.log(error);
      } 
      
      }
      else {
        setLoading(false);
        setIsImportRunning(false);
      }
     
    }
   
  })
  .catch(handleError);
   }
  }
  const importAllData = async ():Promise<any> => {
    setImportAlertVisible(false);
    setLoading(true);
    setIsImportRunning(true);
    //param 1 from settings import for navigation
    const importResponse = await backup.import1(navigation, languageCode, dispatch, child_age, genders);
    if (importResponse.length > 0) {
      setIsImportRunning(false);
      setLoading(false);
      navigation.navigate('ChildImportSetup', {
        importResponse: JSON.stringify(importResponse)
      });
    }
    else {
      setLoading(false);
      setIsImportRunning(false);
    }
  }


  const AddChild = async ():Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    const defaultName = name;
    const insertData: any = await getNewChild('', isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, null);
    const childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode, false, 0, childSet, dispatch, navigation, child_age, relationship, userRelationToParent);
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return <>
    <View style={styles.containerView}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
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
              <FlexRow style={styles.flexRow1}>
                <Flex2 style={styles.flex2Style}>
                <Heading4Regularw>{t('importOnboardingText')}</Heading4Regularw>
              </Flex2>
              <Flex1>
                <ButtonPrimaryMd
                  disabled={isImportRunning}
                  onPress={(e):any => {
                    e.stopPropagation();
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
                <TextInputML
                  style={styles.textInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  clearButtonMode="always"
                  onChangeText={(value):any => {
                    if (value.replace(/\s/g, "") == "") {
                      setName(value.replace(/\s/g, ''));
                    } else {
                      setName(value.replace(regexpEmojiPresentation, ''));
                    }
                  }}
                  value={name}
                  placeholder={t('childNamePlaceTxt')}
                  placeholderTextColor={"gray"}
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
                onPress={():any => {
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
          {relationship_to_parent.map((item: any, index: any) => {
            return (
              <ChildRelationList key={index}>
                <Pressable
                  onPress={():any => {
                    setUserRelationToParent(item.id);
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
                <SettingOptions>
                <Pressable onPress={():any => {
                  actionSheetRefImport.current?.setModalVisible(false);
                  setTimeout(async () => {
                    try {
                      //import
                      if (Platform.OS === "android") {
                        console.log("1233");
                          importFromFile();
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
                 <VectorImage source={require('@assets/svg/ic_file.svg')} />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>
                        {t('importBtntxt')}
                      </Heading4Regular>
                    </ShiftFromTopBottom5>
                  </Pressable>
              </SettingOptions>
              <SettingOptions>
                <Pressable onPress={():any => {
                  actionSheetRefImport.current?.setModalVisible(false);
                  if (netInfoval && netInfoval.isConnected == true) {
                    if(Platform.OS=='ios'){
                      setTimeout(()=>{
                        setImportAlertVisible(true);
                      },350)
                    }
                    else{
                      setImportAlertVisible(true);
                    }
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
            onPress={(e):any => {
              e.stopPropagation();
              setLoading(true);
              let validated: any = false;
              if (birthDate != null && birthDate != undefined && !isFutureDate(birthDate)) {
                validated = validateForm(0, birthDate, isPremature, relationship, plannedTermDate, name, gender);
              }
              else if (birthDate != null && birthDate != undefined && isFutureDate(birthDate)) {
                validated = validateForm(3, birthDate, isPremature, relationship, plannedTermDate, name, gender);
              }
              if (validated == true) {
                setTimeout(()=>{
                  setLoading(false);
                  AddChild();
                },0)
              }
              else {
                console.log("in else");
              }
            }}>
            <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </SideSpacing25>
      <AlertModal loading={isImportAlertVisible} disabled={isImportRunning} message={t("dataConsistency")} title={t('importText')} cancelText={t("retryCancelPopUpBtn")} onConfirm={importAllData} onCancel={onImportCancel}></AlertModal>

    </View>
  </>;
};

export default ChildSetup;