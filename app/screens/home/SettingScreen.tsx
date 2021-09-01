import { backUpPath } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonModal,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import Checkbox, {
  CheckboxActive,
  CheckboxItem
} from '@components/shared/CheckboxStyle';
import { FormOuterCheckbox } from '@components/shared/ChildSetupStyle';
import {
  BannerContainer,
  MainContainer,
  SafeAreaContainer
} from '@components/shared/Container';
import {
  FDirRow,
  FDirRowStart,
  Flex1,
  Flex2,
  Flex3,
  FlexDirRowSpace
} from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  SettingHeading,
  SettingOptions,
  SettingShareData
} from '@components/shared/SettingsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Centerr,
  Heading4Regular,
  Heading6,
  ShiftFromBottom10,
  ShiftFromTop10,
  ShiftFromTop20,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5,
  SideSpacing10
} from '@styles/typography';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { localization } from '../../assets/data/localization';
import { backup } from '../../services/backup';
import { formatStringDate } from '../../services/Utils';
import RNFS from 'react-native-fs';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { addPrefixForAndroidPaths, setActiveChild } from '../../services/childCRUD';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../../database/schema/ConfigSettingsSchema';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setAllChildData } from '../../redux/reducers/childSlice';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};
type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
    name: string;
    displayName: string;
    languageCode: string;
    locale: string;
  };
};
const SettingScreen = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const trackTrueColor = primaryTintColor;
  const trackFalseColor = '#C8D6EE';
  const thumbTrueColor = primaryColor;
  const thumbFalseColor = '#9598BE';
  const dispatch = useAppDispatch();
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const {t, i18n} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isImportRunning, setIsImportRunning] = useState(false);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const importAllData=async ()=>{
    console.log(userRealmCommon.realm?.path,"..path")
    // this.setState({ isImportRunning: true, });
    setIsImportRunning(true);
    const importResponse = await backup.import(props.navigation,languageCode,dispatch,child_age,genders);
    console.log(importResponse,"..importResponse");
    // this.setState({ isImportRunning: false, });
    setIsImportRunning(false);
}

const exportFile=async ()=>{
  Alert.alert('Coming Soon');
}
const exportToDrive=async ()=>{
  setIsExportRunning(true);
  const exportIsSuccess = await backup.export();
  setIsExportRunning(false);
  if (!exportIsSuccess) {
    Alert.alert(t('settingsButtonExportError'))
    // ToastAndroid.show(t('settingExportError'), 6000);
  } else {
    Alert.alert(t('settingExportSuccess'));
    
  };
 
 // actionSheetRef.current?.setModalVisible(false); 
}
const exportAllData=async ()=>{
  
  actionSheetRef.current?.setModalVisible(); 
 
};
  const toggleSwitch = () => {
    //  analytics().logEvent(DEVELOPMENT_NOTIFICATION) //GROWTH_NOTIFICATION //VACCINE_HEALTHCHECKUP_NOTIFICATION
    setIsEnabled((previousState) => !previousState);}
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const actionSheetRef = createRef<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  useEffect(() => {
    const selectedCountry: any = localization.find(
      (country) => country.countryId === countryId,
    );
    setCountry(selectedCountry);
    const selectedLanguage: any = selectedCountry.languages.find(
      (language: any) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    // console.log(selectedCountry,selectedLanguage);
  }, []);
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <TabScreenHeader
          title={t('settingScreenheaderTitle')}
          headerColor={primaryColor}
          textColor="#FFF"
        />

        <ScrollView style={{flex: 1}}>
          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreennotiHeaderText')}</Heading1>
            </SettingHeading>
            <ShiftFromBottom10>
              <FDirRowStart>
                <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <Flex1>
                  <Heading4Regular>
                    {t('settingScreennotiType1')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {isEnabled ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{borderWidth: 1}}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType2')}
                    </Heading4Regular>
                  </Flex1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {isEnabled ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{borderWidth: 1}}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType3')}
                    </Heading4Regular>
                  </Flex1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {isEnabled ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{borderWidth: 1}}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType4')}
                    </Heading4Regular>
                  </Flex1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <View>
              <Heading4Regular>{t('settingScreennotiInfo')}</Heading4Regular>
            </View>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreendataSaverHeaderText')}</Heading1>
            </SettingHeading>

            <ShiftFromBottom10>
              <FDirRowStart>
                <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <Flex1>
                  <Heading4Regular>
                    {t('settingScreendataSaverSubText')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
            </ShiftFromBottom10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreendownldHeaderText')}</Heading1>
            </SettingHeading>
            <Heading4>{t('settingScreendownldSubHeaderText')}</Heading4>
            <Heading6>
              {t('settingScreendownldlast', {
                downloadDate: formatStringDate(new Date(),luxonLocale),
              })}
            </Heading6>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldupdateBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
            <ShiftFromTop20>
              <Heading4>{t('settingScreendownldSubHeader2Text')}</Heading4>
              <Heading6>{t('settingScreendownldSubHeader3Text')}</Heading6>
            </ShiftFromTop20>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldallBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <FlexDirRowSpace>
                <Heading1>{t('settingScreenlocalizationHeader')}</Heading1>
                <Pressable onPress={() => 
                  {
                    console.log("icon clicked");
                    setModalVisible(true)
                  }}>
                  <Icon name="ic_edit" size={16} color="#000" />
                </Pressable>
              </FlexDirRowSpace>
            </SettingHeading>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t('country')}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{country.displayName}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t('language')}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{language.displayName}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreenieHeader')}</Heading1>
            </SettingHeading>
            <ShiftFromTopBottom10>
              <ButtonPrimary
               disabled={isExportRunning || isImportRunning}
               onPress={() => { exportAllData(); }}>
                <ButtonText numberOfLines={2}>{t('settingScreenexportBtnText')}</ButtonText>
              </ButtonPrimary>
              {/* {isExportRunning && (
                                        <ActivityIndicator animating={true} />
                                    )} */}
              
            </ShiftFromTopBottom10>
            <ShiftFromTopBottom10>
              <ButtonPrimary  disabled={isExportRunning || isImportRunning} onPress={() => {
                importAllData()
              }}>
              <ButtonText numberOfLines={2}>{t('settingScreenimportBtnText')}</ButtonText>
              </ButtonPrimary>
              {/* {isImportRunning && (
              <ActivityIndicator animating={true}/>
              )} */}
               {/* <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center' }}>
                                    <UserRealmConsumer>
                                        {(userRealmContext: UserRealmContextValue) => (
                                            <RoundedButton
                                                text={'Import Button New'}
                                                iconName="file-import"
                                                disabled={isExportRunning || isImportRunning}
                                                onPress={() => { importAllData(userRealmContext) }}
                                                style={{ flex: 1 }}
                                            />
                                        )}
                                    </UserRealmConsumer>

                                    
                                </View> */}
            </ShiftFromTopBottom10>
            <OverlayLoadingComponent loading={(isExportRunning || isImportRunning) ? true: false} />   
          </MainContainer>

          <ActionSheet ref={actionSheetRef}>
            <BannerContainer>
              <SettingHeading>
                <Heading1>{t('settingScreenexportOptionHeader')}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                  <Pressable onPress={() => 
                  {
                    console.log("icon clicked");
                    exportFile()
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
                  <Pressable onPress={() => 
                  {
                    console.log("icon clicked");
                    actionSheetRef.current?.setModalVisible(false); 
                    exportToDrive();
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
        </ScrollView>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(false);
          }}
          onDismiss={() => {
            setModalVisible(false);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={() => {
                    console.log('close');
                    setModalVisible(false);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <ModalPopupContent>
                <Heading4Centerr>
                  {t('localizationChangeModalText')}
                </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
                <ButtonModal
                  //disabled={true}
                  onPress={() => {
                    console.log('close');
                    setModalVisible(false);
                    // props.navigation.reset({
                    //   index: 0,
                    //   routes: [{name: 'Localization'}],
                    // });
                    props.navigation.navigate('Localization',
                    {
                      screen:'CountrySelection',
                      params:{country:null,language:null}
                    });
                    // props.navigation.navigate('Localization')
                  }}>
                  <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaContainer>
    </>
  );
};

export default SettingScreen;
