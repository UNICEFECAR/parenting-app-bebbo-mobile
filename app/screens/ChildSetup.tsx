import { bothChildGender, bothParentGender, femaleData, maleData, regexpEmojiPresentation, relationShipFatherId, relationShipMotherId, tempRealmFile } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonPrimaryMd, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildRelationList,
  ChildSetupDivider,
  ChildTabView,
  FormContainer1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
  OrDivider,
  OrHeadingView,
  OrView,
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
import { validateForm, validateParentsForm } from '../services/Utils';
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
  Heading3w,
  ShiftFromTop50,
  Heading3Centerrw,
  Heading3BoldCenterrw,
  ShiftFromTop40,
  ShiftFromTop25,
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
import { bgcolorWhite2, primaryColor } from '@styles/style';
import AesCrypto from 'react-native-aes-crypto';
import { encryptionsIVKey, encryptionsKey } from 'react-native-dotenv';
import BackgroundColors from '@components/shared/BackgroundColors';

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
    alignItems: 'center',
    marginVertical: 20
  },
  flexRow1: {
    marginTop: 10
  },
  scrollViewStyle: {
    padding: 0,
    paddingTop: 0
  },
  textInputStyle: {
    width: '100%'
  },
  textParentInfoStyle: {
    textAlign: 'center'
  },
  importTextStyle: {
    fontWeight: 700
  },
  uploadTextStyle: {
    color: "#1CABE2"
  },
  orDividerStyle: {
    width: 172,
    alignSelf: 'center',
  },
  dividerStyle: {
    marginEnd: 20
  }
})
const ChildSetup = ({ navigation }: Props): any => {
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

  genders = genders.map((v: any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != bothChildGender;
  });
  relationshipData = relationshipData.map((v: any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != bothParentGender;
  });
  const onImportCancel = (): any => {
    setImportAlertVisible(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log('relationshipToParent is', relationshipToParent)
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
      console.log('cancelled')
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
      importDataAndroid();
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
  const AddChild = async (isDefaultChild: boolean): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName;
    if (isDefaultChild) {
      defaultName = t('childInfoBabyText');
    } else {
      defaultName = name;
    }

    const insertData: any = await getNewChild('', isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, null);
    const childSet: Array<any> = [];
    childSet.push(insertData);

    addChild(languageCode, false, 0, childSet, dispatch, navigation, childAge, relationship, userRelationToParent, netInfo, isDefaultChild);
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return <>
    <View style={styles.containerView}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <OnboardingContainer>
          <OverlayLoadingComponent loading={loading} />
          <OrHeadingView>
            <ParentSetUpDivider style={styles.dividerStyle}></ParentSetUpDivider>
            <ChildSetupDivider></ChildSetupDivider>
          </OrHeadingView>
          <OnboardingHeading>

            <ChildCenterView>
              <Heading1Centerw>
                {t('childSetupheader')}
              </Heading1Centerw>
            </ChildCenterView>

          </OnboardingHeading>

          <FlexCol>
            <Heading3w style={styles.textParentInfoStyle}>
              {t('addBasicParentsInfo')}
            </Heading3w>
            {/* <ChildDate sendData={sendData} dobMax={dobMax} prevScreen="Onboarding" /> */}
            <ShiftFromTop50>
              <LabelText>{t('parentNameText')}</LabelText>
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
                  placeholder={t('parentNamePlaceTxt')}
                  placeholderTextColor={"gray"}
                  allowFontScaling={false}
                />
              </FormInputBox>
            </ShiftFromTop50>

            {/* {
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
            } */}


            <ShiftFromTop20>
              <FormInputGroup
                onPress={(): any => {
                  console.log('actionsheet visiblity', actionSheetRef.current)
                  actionSheetRef.current?.setModalVisible(true);
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
          <ShiftFromTop25>
            <ButtonPrimary
              disabled={!validateParentsForm(0, relationship, name)}
              onPress={(e: any): any => {
                e.stopPropagation();
                setLoading(true);
                let validated: any = false;
                validated = validateParentsForm(0, relationship, name);

                if (validated == true) {
                  setTimeout(() => {
                    setLoading(false);
                    console.log('parentalRole', relationshipname)
                    if (relationshipname == 'service provider') {
                      AddChild(true);
                    } else {
                      navigation.navigate('AddChildSetup', {
                        birthDate: birthDate,
                        relationship: relationship,
                        relationshipname: relationshipname,
                        userRelationToParent: userRelationToParent
                      })
                    }
                  }, 0)
                }
                else {
                  console.log("in else");
                }
              }}>
              <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
            </ButtonPrimary>
          </ShiftFromTop25>

          <FlexCol>
            {/* <FlexRow>
              <Flex1>
                <OrView>
                  <OrDivider><Text></Text></OrDivider>
                  <OrHeadingView>
                    <Heading3Centerw>{t('ORkeyText')}</Heading3Centerw>
                  </OrHeadingView>

                </OrView>
              </Flex1>
            </FlexRow> */}
            <FlexRow>
              <Flex2 style={styles.flex2Style}>
                <Heading4Regularw style={styles.importTextStyle}>{t('importOnboardingText')}</Heading4Regularw>
                <Heading4Regularw>{t('importOnboardingText1')}</Heading4Regularw>
              </Flex2>

            </FlexRow>
            <FlexCol>
              <ShiftFromTop20>
                <ParentSetUpDivider style={styles.orDividerStyle}></ParentSetUpDivider>
                <Heading3BoldCenterrw style={styles.flex2Style}>{t('ORkeyText')}</Heading3BoldCenterrw>
              </ShiftFromTop20>


            </FlexCol>
            <Pressable onPress={(e: any): any => {

              e.stopPropagation();
              actionSheetRefImport.current?.setModalVisible(true);
            }}>
              <Heading3BoldCenterrw style={styles.uploadTextStyle}>
                {t('OnboardingImportButton')}
              </Heading3BoldCenterrw>

            </Pressable>
            <Flex2 style={styles.flex2Style}>
              <Heading4Regularw>{t('importOnboardingText2')}</Heading4Regularw>
            </Flex2>
          </FlexCol>


        </OnboardingContainer>

      </ScrollView>
      <ActionSheet ref={actionSheetRef}>

        <View style={{ marginBottom: 20 }}>
          {relationshipToParent.map((item: any, index: any) => {
            return (
              <ChildRelationList key={index}>
                <Pressable
                  onPress={(): any => {
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
                    console.log('relationship name', item.name)
                    setRelationshipName(item.name);
                    actionSheetRef.current?.setModalVisible(false);
                  }}>
                  <Heading3>{console.log(item.name)}
                    {item.name}
                  </Heading3>
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
                <Pressable onPress={(): any => {
                  actionSheetRefImport.current?.setModalVisible(false);
                  setTimeout(async () => {
                    try {
                      //import
                      if (Platform.OS === "android") {
                        console.log("1233");
                        importFromFile();
                      }
                      else {
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
                <Pressable onPress={(): any => {
                  actionSheetRefImport.current?.setModalVisible(false);
                  if (netInfo && netInfo.isConnected == true) {
                    if (Platform.OS == 'ios') {
                      setTimeout(() => {
                        setImportAlertVisible(true);
                      }, 350)
                    }
                    else {
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

      <AlertModal loading={isImportAlertVisible} disabled={isImportRunning} message={t("dataConsistency")} title={t('importText')} cancelText={t("retryCancelPopUpBtn")} onConfirm={importAllData} onCancel={onImportCancel}></AlertModal>

    </View>
  </>;
};

export default ChildSetup;