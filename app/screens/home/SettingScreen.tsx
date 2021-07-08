import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { BannerContainer, MainContainer } from '@components/shared/Container';
import {
  FDirRow,
  FDirRowStart,
  Flex1,
  Flex2,
  Flex3,
  FlexDirRowSpace
} from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import {
  SettingHeading,
  SettingOptions,
  SettingShareData
} from '@components/shared/SettingsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Regular,
  Heading6,
  ShiftFromBottom10,
  ShiftFromTop10,
  ShiftFromTop20,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5
} from '@styles/typography';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { localization } from '../../assets/data/localization';
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
  const {t, i18n} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const actionSheetRef = createRef<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const [modalVisible, setModalVisible] = useState(false);
  // console.log(countryId);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
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
      <SafeAreaView style={{flex: 1}}>
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
                    {t('settingScreennotiType2')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
            </ShiftFromBottom10>

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
                    {t('settingScreennotiType3')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
            </ShiftFromBottom10>

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
                    {t('settingScreennotiType4')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
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
                downloadDate: '17 dec 2020 02:32pm',
              })}
            </Heading6>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreendownldupdateBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
            <ShiftFromTop20>
              <Heading4>{t('settingScreendownldSubHeader2Text')}</Heading4>
              <Heading6>{t('settingScreendownldSubHeader3Text')}</Heading6>
            </ShiftFromTop20>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreendownldallBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <FlexDirRowSpace>
                <Heading1>{t('settingScreenlocalizationHeader')}</Heading1>
                <Pressable
                  onPress={() => props.navigation.navigate('Localization')}>
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
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <ButtonText>{t('settingScreenexportBtnText')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTopBottom10>
            <ShiftFromTopBottom10>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreenimportBtnText')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTopBottom10>
          </MainContainer>

          <ActionSheet ref={actionSheetRef}>
            <BannerContainer>
              <SettingHeading>
                <Heading1>{t('settingScreenexportOptionHeader')}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                    <Icon name="ic_sb_shareapp" size={30} color="#000" />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>
                        {t('settingScreenshareBtntxt')}
                      </Heading4Regular>
                    </ShiftFromTopBottom5>
                  </SettingOptions>
                  <SettingOptions>
                    <VectorImage
                      source={require('@assets/svg/ic_gdrive.svg')}
                    />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>
                        {t('settingScreengdriveBtntxt')}
                      </Heading4Regular>
                    </ShiftFromTopBottom5>
                  </SettingOptions>
                </FDirRow>
              </SettingShareData>
            </BannerContainer>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  // modalView: {
  //   backgroundColor: 'white',
  //   elevation: 5,
  // },
  // item: {
  //   flexDirection: 'column',
  //   borderBottomColor: '#EEE',
  //   borderBottomWidth: 2,
  //   alignItems: 'center',
  //   padding: 15,
  // },
  // modalText: {
  //   fontWeight: 'bold',
  //   marginVertical: 15,
  // },
});
