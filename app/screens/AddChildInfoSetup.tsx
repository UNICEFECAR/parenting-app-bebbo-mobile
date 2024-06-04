import { bothChildGender, bothParentGender, regexpEmojiPresentation, tempRealmFile } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildSetupDivider,
  FormContainer1,
  FormInputBox,
  LabelText,
  OrHeadingView,
  ParentSetUpDivider,
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
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, ScrollView, Alert, Platform, StyleSheet } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { backup } from '../services/backup';
import { addChild, apiJsonDataGet, getAge, getNewChild, isFutureDate, setActiveChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import {
  Heading1Centerw,
  Heading4Regularw,
  ShiftFromTop20,
  Heading3w,
  ShiftFromTop25,
  Heading2Centerw,
  Heading3BoldCenterrw,
} from '../styles/typography';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import * as ScopedStorage from "react-native-scoped-storage";
import RNFS from 'react-native-fs';
import TextInputML from '@components/shared/TextInputML';
import { bgcolorWhite2 } from '@styles/style';
import AesCrypto from 'react-native-aes-crypto';
import { encryptionsIVKey, encryptionsKey } from 'react-native-dotenv';
import { logEvent } from '../services/EventSyncService';
import { EXPECTED_CHILD_ENTERED, ONBOARDING_SKIPPED } from '@assets/data/firebaseEvents';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { setAllLocalNotificationGenerateType } from '../redux/reducers/notificationSlice';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: bgcolorWhite2,
    flex: 1
  },
  flex2Style: {
    alignItems: 'flex-start'
  },
  flexRow1: {
    marginTop: 10
  },
  scrollViewStyle: {
    padding: 0,
    paddingTop: 0
  },
  textInputStyle: {
    width: '100%',
  },
  textParentInfoStyle: {
    textAlign: 'center'
  },
  dividerStyle: {
    marginEnd: 20
  },
  orDividerStyle: {
    width: 172,
    alignSelf: 'center',
  },
  uploadTextStyle: {
    color: "#1CABE2"
  },
})
const AddChildInfoSetup = ({ route, navigation }: Props): any => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState('');
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected, setIsExpected] = useState<string>('false');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const actionSheetRefImport = createRef<any>();
  const netInfo = useNetInfoHook();
  let relationshipData = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender : [],
  );
  const relationshipToParent = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  const actionSheetRef = createRef<any>();
  const [gender, setGender] = React.useState(0);
  const dispatch = useAppDispatch();
  const sendData = (data: any): any => { // the callback. Use a better name
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

  genders = genders.map((item: any) => ({ ...item, title: item.name })).filter(function (filterItem: any) {
    return filterItem.id != bothChildGender;
  });
  relationshipData = relationshipData.map((v: any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != bothParentGender;
  });
  const onImportCancel = (): any => {
    setImportAlertVisible(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log('taxonomyData is', relationshipToParent)
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
  useEffect(() => {
    setRelationship(route?.params.relationship)
    setRelationshipName(route?.params.relationshipname)
    setUserRelationToParent(route?.params.userRelationToParent)
  }, [route?.params])
  const getCheckedItem = (checkedItem: typeof genders[0]): any => {
    setGender(checkedItem.id);
  };
  const getCheckedParentItem = (checkedItem: any): any => {
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  const handleError = (err: any): any => {
    console.log(err, "..err")
    if (DocumentPicker.isCancel(err)) {
      console.log('Document pickup is cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.log('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  };
  const decryptData = (text: string, key: any): any => {
    return AesCrypto.decrypt(text, key, encryptionsIVKey, 'aes-256-cbc');
  }
  const handleImportedData = async (importedData: any, importedrealm: any): Promise<any> => {
    if (importedData.length > 0) {
      await userRealmCommon.openRealm();
      await userRealmCommon.deleteAllAtOnce();
      setIsImportRunning(false);
      setLoading(false);
      navigation.navigate('ChildImportSetup', {
        importResponse: JSON.stringify(importedData)
      });
      if (importedrealm) {
        importedrealm.close();
      }
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
  const importDataAndroid = async (): Promise<any> => {
    const dataset = await ScopedStorage.openDocument(true, 'utf8');
    let oldChildrenData: any = null;
    let importedrealm: any = null;
    if (dataset && dataset.data != "" && dataset.data != null && dataset.data != undefined) {
      if (dataset.name.endsWith('.json')) {
        const decryptedData = decryptData(dataset.data, encryptionsKey)
          .then((text: any) => {
            return text;
          })
          .catch((error: any) => {
            console.log("Decrypted error", error);
            throw error;
          });
        const importedJsonData = JSON.parse(await decryptedData);
        await RNFS.writeFile(tempRealmFile, JSON.stringify(decryptedData), "utf8");
        oldChildrenData = importedJsonData;
      } else {
        const base64Dataset = await ScopedStorage.openDocument(true, 'base64');
        await RNFS.writeFile(tempRealmFile, base64Dataset.data, "base64");
        importedrealm = await new Realm({ path: 'user1.realm' });
        const user1Path = importedrealm.path;
        console.log(user1Path, "..user1Path");
        oldChildrenData = importedrealm.objects('ChildEntity');
      }
      setImportAlertVisible(false);
      setLoading(true);
      setIsImportRunning(true);
      handleImportedData(oldChildrenData, importedrealm);
    }
  }
  const importDataIOS = async (): Promise<any> => {
    DocumentPicker.pick({
      allowMultiSelection: false,
      type: DocumentPicker.types.allFiles,
    })
      .then(async (res: any) => {
        console.log(res, "..res..");
        let oldChildrenData: any = null;
        let importedrealm: any = null;
        if (res.length > 0 && res[0].uri) {
          if (res[0].name.endsWith(".json")) {
            const exportedFileContent: any = await RNFS.readFile(decodeURIComponent(res[0].uri), 'utf8');
            const decryptedData = decryptData(exportedFileContent, encryptionsKey)
              .then((text: any) => {
                return text;
              })
              .catch((error: any) => {
                console.log("Decrypted error", error);
                throw error;
              });
            const importedData = JSON.parse(await decryptedData);
            await RNFS.writeFile(tempRealmFile, JSON.stringify(decryptedData), "utf8");
            oldChildrenData = importedData;
          } else {
            const exportedFileContent: any = await RNFS.readFile(decodeURIComponent(res[0].uri), 'base64');
            await RNFS.writeFile(tempRealmFile, exportedFileContent, "base64");
            importedrealm = await new Realm({ path: 'user1.realm' });
            if (importedrealm) {
              importedrealm.close();
            }
            importedrealm = await new Realm({ path: 'user1.realm' });
            const user1Path = importedrealm.path;
            console.log(user1Path, "..user1Path");
            oldChildrenData = importedrealm.objects('ChildEntity');
          }

          setImportAlertVisible(false);
          setLoading(true);
          setIsImportRunning(true);
          handleImportedData(oldChildrenData, importedrealm)

        }

      })
      .catch(handleError);
  }
  const importFromFile = async (): Promise<any> => {
    if (Platform.OS == "android") {
      await importDataAndroid();
    } else {
      importDataIOS();
    }
  }
  const importAllData = async (): Promise<any> => {
    setImportAlertVisible(false);
    setLoading(true);
    setIsImportRunning(true);
    //param 1 from settings import for navigation
    const importResponse = await backup.import1(navigation, languageCode, dispatch, childAge, genders);
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


  const AddChild = async (isDefaultChild: boolean, isDefaultName: boolean): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName;
    if (isDefaultName) {
      defaultName = 'Baby';
    } else {
      defaultName = name;
    }
    let insertData:any = null;
    if(isDefaultChild){
      insertData = await getNewChild('', "true", isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, null);
    }else{
      insertData = await getNewChild('', "false", isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, null);
    }
    const childSet: Array<any> = [];
    childSet.push(insertData);
    if (isDefaultChild) {
      const eventData = { 'name': ONBOARDING_SKIPPED }
      logEvent(eventData, netInfo.isConnected)
      if (childSet[0].isExpected == true || childSet[0].isExpected == 'true') {
        const eventData = { 'name': EXPECTED_CHILD_ENTERED }
        logEvent(eventData, netInfo.isConnected)
      }
      const isUserEnteredChildData = "true";
      await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childSet);
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId", childSet[0].uuid);
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", isUserEnteredChildData);
      await setActiveChild(languageCode, childSet[0].uuid, dispatch, childAge, false);
      // dispatch(setActiveChildData(childSet[0].uuid))
      const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: 'all' };
      await dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
      // console.log('childAge is',childAge,childSet)
      // const Ages = await getAge(childSet, childAge);
      // console.log('childAge is Ageds',Ages)
      // let apiJsonData;
      // if (Ages?.length > 0) {
      //   apiJsonData = apiJsonDataGet(String(Ages), "all")
      // }
      // else {
      //   apiJsonData = apiJsonDataGet("all", "all")
      // }
      const apiJsonData = apiJsonDataGet("all")
      console.log('child API json data is ', apiJsonData)
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoadingScreen',
            params: { apiJsonData: apiJsonData, prevPage: 'ChildSetup' },
          },
        ],
      });
      //addChild(languageCode, false, 0, childSet, dispatch, navigation, childAge, relationship, userRelationToParent, netInfo);
    } else {
      addChild(languageCode, false, 0, childSet, dispatch, navigation, childAge, relationship, userRelationToParent, netInfo, isDefaultChild, false);
    }
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return <>
    <View style={styles.containerView}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <OnboardingContainer>
          <OverlayLoadingComponent loading={loading} />
          <FlexRow>
            <ShiftFromTop25>
              <Pressable
                onPress={(e: any): any => {
                  navigation.navigate('ChildSetup')
                }}
              >
                <Icon name={'ic_back'} size={12} color="#2D2926" />
              </Pressable>
            </ShiftFromTop25>
            <OrHeadingView>

              <ChildSetupDivider style={styles.dividerStyle}></ChildSetupDivider>
              <ParentSetUpDivider></ParentSetUpDivider>
            </OrHeadingView>



          </FlexRow>

          <OnboardingHeading>

            <ChildCenterView>
              <Heading1Centerw>
                {t('childSetupheader')}
              </Heading1Centerw>
            </ChildCenterView>

          </OnboardingHeading>

          <FlexCol>
            <Heading3w style={styles.textParentInfoStyle}>
              {t('addBasicChildInfo')}
            </Heading3w>
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
                  onChangeText={(value: any): any => {
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
            <View>
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
            </View>


            <ButtonRow>
              <ButtonPrimary
                disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(0, birthDate, isPremature, relationship, plannedTermDate, name, gender) : !validateForm(3, birthDate, isPremature, relationship, plannedTermDate, name, gender)}
                onPress={(e: any): any => {
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
                    setTimeout(() => {
                      setLoading(false);
                      AddChild(false, false);
                    }, 0)
                  }
                  else {
                    console.log("in else");
                  }
                }}>
                <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
              </ButtonPrimary>
            </ButtonRow>


            <FlexCol>
              <ParentSetUpDivider style={styles.orDividerStyle}></ParentSetUpDivider>

              <ShiftFromTop20>
                <Heading2Centerw>{t('ORkeyText')}</Heading2Centerw>
              </ShiftFromTop20>


              <ShiftFromTop20>
                <Pressable onPress={(e: any): any => {

                  e.stopPropagation();
                  setTimeout(() => {
                    AddChild(true, true);
                  }, 0)
                }}>
                  <Heading3BoldCenterrw style={styles.uploadTextStyle}>
                    {t('walkthroughButtonSkip')}
                  </Heading3BoldCenterrw>

                </Pressable>
              </ShiftFromTop20>

              <ShiftFromTop20>
                <Flex2>
                  <Heading4Regularw>{t('childProfileSkipText')}</Heading4Regularw>
                </Flex2>

              </ShiftFromTop20>
            </FlexCol>
          </FlexCol>



        </OnboardingContainer>

      </ScrollView>



    </View>
  </>;
};

export default AddChildInfoSetup;