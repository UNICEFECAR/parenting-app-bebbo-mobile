import { localization } from '@assets/data/localization';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonPrimary } from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import {
  LocalizationCol,
  LocalizationContainer,
  LocalizationcontentHead,
  LocalizationcontentResult,
  LocalizationRow
} from '@components/shared/OnboardingContainer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ButtonText } from '@styles/style';
import {
  Heading1, Heading2w, Heading3, Heading3Regular,
  Heading4,
  Heading6
} from '@styles/typography';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';

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
  const trackTrueColor =primaryTintColor;
  const trackFalseColor = '#C8D6EE';
  const thumbTrueColor = primaryColor
  const thumbFalseColor ='#9598BE';
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
      (language:any) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    // console.log(selectedCountry,selectedLanguage);
  }, []);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: primaryColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <BurgerIcon />
          </View>
          <View style={{flex: 3}}>
            <Heading2w> {'Settings'}</Heading2w>
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{padding: 15}}>
            <Heading1>Notifications</Heading1>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                I want to receive Notifications through the application
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                I want to receive Notifications related to child growth
                monitoring
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                I want to receive Notifications related to monitoring of child
                development
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                I want to receive Notifications related to health check-ups and
                vaccinations
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                padding: 10,
              }}>
              <Text>
                Notifications are published with different frequency, from daily
                to monthly and are integral part of the app functionality. You
                can decide to hide notifications on your home screen. You can
                also fully disable this function at any point in the app
                settings what will result in limited app functionality.
              </Text>
            </View>
          </View>
          <View style={{padding: 15}}>
            <Heading1>Data Saver Mode</Heading1>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
                I don't want to download any images of any articles or updates
                due to low internet speed.
              </Text>
            </View>
          </View>
          <View style={{padding: 15}}>
            <Heading1>Download Data</Heading1>
            <Heading4>Download latest Data updates</Heading4>
            <Heading6>Data last updated on 17 dec 2020 02:32pm</Heading6>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>Download Update</ButtonText>
              </ButtonPrimary>
            </View>
            <Heading4>Download all app data</Heading4>
            <Heading6>
              Download all app Data which optimized for offline use
            </Heading6>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>Download All Data</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{flexDirection: 'row'}}>
              <Heading1>Country and language</Heading1>
              <Pressable
                style={{padding: 10}}
                onPress={() => {
                  //reset navigation to localization
                  props.navigation.navigate('Localization', {
                    screen: 'CountrySelection',
                  });

                  // props.navigation.navigate('CountrySelection')
                }}>
                <ButtonText>{t('localization.editCountryLang')}</ButtonText>
              </Pressable>
            </View>
            <LocalizationContainer>
              <LocalizationRow>
                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('localization.country')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{country.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>

                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('localization.language')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{language.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>
              </LocalizationRow>
            </LocalizationContainer>
          </View>

          <View style={{padding: 15}}>
            <Heading1>Data Export / Import</Heading1>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <ButtonText>Export All Saved Data</ButtonText>
              </ButtonPrimary>
            </View>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>Import All Saved Data</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
          {/* 
          <Button
            title="Toggle"
            onPress={() =>
              props.navigation.dispatch(DrawerActions.toggleDrawer())
            }
          /> */}
          <ActionSheet ref={actionSheetRef}>
            <View>
              <View style={styles.modalView}>
                <Heading1> Export Data on</Heading1>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.item}>
                    <Icon name="ic_sb_shareapp" size={30} color="#000" />
                    <Text style={styles.modalText}>Share</Text>
                  </View>
                  <View style={styles.item}>
                    <VectorImage
                      source={require('@assets/svg/ic_gdrive.svg')}
                    />
                    <Text style={styles.modalText}>Google Drive</Text>
                  </View>
                </View>
              </View>
            </View>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    elevation: 5,
  },
  item: {
    flexDirection: 'column',
    borderBottomColor: '#EEE',
    borderBottomWidth: 2,
    alignItems: 'center',
    padding: 15,
  },
  modalText: {
    fontWeight: 'bold',
    marginVertical: 15,
  },
});
