import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import {ButtonPrimary} from '@components/shared/ButtonGlobal';
import {
  LocalizationCol,
  LocalizationContainer,
  LocalizationcontentHead,
  LocalizationcontentResult,
  LocalizationRow,
} from '@components/shared/OnboardingContainer';
import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Text,
  Button,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import styled, {ThemeContext} from 'styled-components/native';
import {useAppSelector} from '../../../App';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import {ButtonText, Container} from '../../styles/style';
import {
  Heading1,
  Heading3Regular,
  Heading4,
  Heading6,
  Heading3,
} from '../../styles/typography';
import {localization} from '@assets/data/localization';
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
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const {t, i18n} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  console.log(countryId);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useEffect(() => {
    const selectedCountry: any = localization.find(
      (country) => country.countryId === countryId,
    );
    setCountry(selectedCountry);
    const selectedLanguage: any = selectedCountry.languages.find(
      (language) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    // console.log(selectedCountry,selectedLanguage);
  }, []);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <BurgerIcon />
          </View>
          <View style={{flex: 3}}>
            <Text> {'Settings'}</Text>
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
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? headerColor : '#f4f3f4'}
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
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? headerColor : '#f4f3f4'}
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
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? headerColor : '#f4f3f4'}
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
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? headerColor : '#f4f3f4'}
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
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? headerColor : '#f4f3f4'}
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
          <View style={{paddingHorizontal: 15,}}>
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
                <ButtonText>{t('editCountryLang')}</ButtonText>
              </Pressable>
            </View>
            <LocalizationContainer>
              <LocalizationRow>
                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('country')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{country.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>

                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('language')}</Heading3Regular>
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
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>Export All Saved Data</ButtonText>
              </ButtonPrimary>
            </View>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>Import All Saved Data</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
          {/* <VectorImage source={require('@assets/svg/ic_gdrive.svg')} />
          <Button
            title="Toggle"
            onPress={() =>
              props.navigation.dispatch(DrawerActions.toggleDrawer())
            }
          /> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
