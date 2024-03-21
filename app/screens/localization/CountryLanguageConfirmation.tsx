import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonLinkText,
  ButtonPrimary,
  ButtonTertiaryMd,
  ButtonText,
  ButtonTextLg,
  ButtonWithBorder
} from '@components/shared/ButtonGlobal';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import Icon, { IconML, OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import OnboardingContainer, {
  LocalizationAction,
  LocalizationCol,
  LocalizationWithoutBorderCol,
  LocalizationContainer,
  LocalizationcontentHead,
  LocalizationcontentResult,
  LocalizationRow,
  OnboardingconfirmationHead,
  OnboardingContent,
  OnboardingshiftHead
} from '@components/shared/OnboardingContainer';
import { RootStackParamList } from '@navigation/types';
import analytics from '@react-native-firebase/analytics';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2Centerw,
  Heading3,
  Heading3Centerw,
  Heading3Regular
} from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Platform, BackHandler, Text, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { allApisObject, appConfig } from '../../assets/translations/appOfflineData/apiConstants';
import { oncountrtIdChange, onLocalizationSelect, setAppLayoutDirectionParams, setrestartOnLangChange, setSponsorStore } from '../../redux/reducers/localizationSlice';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import RNRestart from 'react-native-restart';
import { localization, sponsers } from '@dynamicImportsClass/dynamicImports';
import * as RNLocalize from "react-native-localize";
import { secondaryBtnColor } from '@styles/style';

type CountryLanguageConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Terms'
>;
type Props = {
  navigation: CountryLanguageConfirmationNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: '#2D2926',
    marginBottom: 22
  }
})
const CountryLanguageConfirmation = ({ route }: Props): any => {
  const { country, language } = route.params;
  const dispatch = useAppDispatch();
  const [countryData, setCountryData] = useState<any>();
  const [sponsersData, setSponsersData] = useState<any>();
  const [newLanguage, setNewLanguage] = useState<any>();
  const [luxonLanLocale, setLuxonLanLocale] = useState<any>();
  const [deviceLanCode, setDeviceLangCode] = useState<any>();
  const isVisible = useIsFocused();
  const [isObject, setIsObject] = useState<any>();
  const navigation = useNavigation<any>();
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
 
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );
  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  const incrementalSyncDT = useAppSelector((state: any) =>
    (state.utilsData.incrementalSyncDT),
  );
  const apiJsonData = [
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
  ];

  const { t, i18n } = useTranslation();
  console.log(I18nManager.isRTL, "---is rtl val");
  useEffect(() => {
    console.log('Route Params is here......', route.params);
    if (!route.params.language) {
      console.log('Language data not available');
    } else if (Array.isArray(route.params.language)) {
      route.params.language.length > 0 ? setNewLanguage(route.params.language[0]) : setNewLanguage(null);
    } else if (typeof route.params.language === 'object') {
      setNewLanguage(route.params.language);
    } else {
      console.log('Invalid language data');
    }
    return (): any => {
      dispatch(setrestartOnLangChange('no'));
    }
  }, [route.params]);
  const extractLanguageCode = (languageTag: string): string => {
    const [languageCode] = languageTag.split('-');
    return languageCode;
  };
  const getCountryByCountryCode = (countryCode: any): any => {
    for (const country of localization) {
      for (const language of country.languages) {
        const [languageCodeFromLuxon, countryCodeFromLuxon] = language.luxonLocale.split('-');
        if (countryCodeFromLuxon === countryCode) {
          return country;
        }
      }
    }
    return null;
  };
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch((state: any) => {
          // Remove the home route from the stack
          const routes = state.routes.filter((r: any) => r.name !== 'LoadingScreen');

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
    const getSelectedLanguage = (): any => {
      const selectedLanguage = RNLocalize.getLocales(); // Get the locales
      return selectedLanguage[0]?.languageCode || 'en'; // Extract the language code
    };
    const getSelectedCountry = (): any => {
      const selectedLanguage = RNLocalize.getLocales(); // Get the locales
      return selectedLanguage[0]?.languageTag || 'en-Us'; // Extract the language code
    };

    const selectedLanguage = getSelectedLanguage();
    const selectedDefaultCountry = getSelectedCountry();
    console.log('Selected luxon from Device', selectedDefaultCountry)
    console.log('Selected Language from Device', selectedLanguage)
    setLuxonLanLocale(selectedDefaultCountry)
    setDeviceLangCode(selectedLanguage)

    // setLuxonLanLocale(selectedDefaultCountry)
    // setDeviceLangCode(selectedLanguage)

    if (isVisible) {
      let newCountryId: any;
      let newCountryLocale: any;
      if (userIsOnboarded == true) {
        if (route.params.country && route.params.country != null && route.params.country != undefined) {
          newCountryId = route.params.country.countryId;
          newCountryLocale = route.params.country.luxonLocale;
          setCountryData(route.params.country)
        } else {
          newCountryId = countryId;
          newCountryLocale = selectedDefaultCountry;
        }
      } else {
        if (Object.keys(route.params).length === 0) {
          console.log('newCountry id is',countryId)
          newCountryLocale = selectedDefaultCountry;
          newCountryId = countryId;
        } else {
          //  setCountry(props.route.params.country)
          // newCountryId = route.params.country.countryId;
          console.log('Language is from params', route.params.language)
          if (route.params != undefined) {
            console.log('Language is from params', route.params.country.countryId)
            newCountryLocale = route.params.language.luxonLocale;
            newCountryId = route.params.country.countryId;
          } else {
            newCountryLocale = selectedDefaultCountry;
            newCountryId = countryId;
          }
        }
      }

      const selectedCountry = localization.find(
        (country: any) => country.countryId === newCountryId,
      );
      const countrySponsersData = sponsers.find(
        (country: any) => country.id === selectedCountry.countryId,
      )
      console.log('Seleted  country is', countrySponsersData)
      console.log('selectedCountry  country is', selectedCountry)
      setSponsersData(countrySponsersData);

      const foundCountry = getCountryByCountryCode(RNLocalize.getCountry());
      console.log('Found country is', foundCountry)
      if (foundCountry != undefined && foundCountry != null) {
        console.log('params is here', route.params);
        if (Object.keys(route.params).length !== 0) {
          // console.log('Country is here');
          setCountryData(selectedCountry);
          setNewLanguage(route.params.language)
        } else {
          console.log('Country is here', selectedDefaultCountry, selectedLanguage);
          if(selectedCountry==foundCountry || selectedCountry.countryId ==126 ){
          setCountryData(foundCountry);
          const languagesWithLuxonLocale = foundCountry?.languages?.filter((lang: any) => lang.luxonLocale === selectedDefaultCountry || extractLanguageCode(lang.luxonLocale) === selectedLanguage);
          if (languagesWithLuxonLocale?.length != 0) {
            console.log('Country is here new', languagesWithLuxonLocale[0]);
            setNewLanguage(languagesWithLuxonLocale[0])
          } else {
            setNewLanguage(foundCountry.languages[0])
          }
        }else{
          setCountryData(selectedCountry);
          const languagesWithLuxonLocale = selectedCountry?.languages?.filter((lang: any) => lang.luxonLocale === selectedDefaultCountry || extractLanguageCode(lang.luxonLocale) === selectedLanguage);
          if (languagesWithLuxonLocale?.length != 0) {
            console.log('Country is here new', languagesWithLuxonLocale[0]);
            setNewLanguage(languagesWithLuxonLocale[0])
          } else {
            setNewLanguage(foundCountry.languages[0])
          }
        }
          //   setNewLanguage(foundCountry.languages[0])
        }
      } else {
        console.log('Test log ', selectedCountry?.languages[0].displayName)
        setNewLanguage(selectedCountry?.languages[0])
        setCountryData(selectedCountry)
      }
    }
  }, [isVisible]);
  useEffect(() => {
    console.log('New Language is', newLanguage)
  }, [newLanguage])
  useFocusEffect(
    React.useCallback(() => {
      const backAction = (): any => {
        i18n.changeLanguage(locale);
        navigation.goBack()
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      navigation.addListener('gestureEnd', backAction);

      return (): any => {
        // dispatch(onLocalizationSelect(route.params));
        navigation.removeListener('gestureEnd', backAction);
        backHandler.remove()
      };
    }, []),
  );


  const saveSelection = (): any => {
    i18n.changeLanguage(newLanguage.locale)
      .then(() => {
        if (newLanguage?.locale == 'GRarb' || newLanguage?.locale == 'GRda') {
          if (AppLayoutDirection == 'ltr') {
            //remove rtl on backhandler
            Platform.OS == 'ios' ? setTimeout(() => {
              I18nManager.forceRTL(true);
              RNRestart.Restart();
            }, 100) :
              setTimeout(() => {
                I18nManager.forceRTL(true);
                RNRestart.Restart()
              }, 0);
          } else {
            I18nManager.forceRTL(true);
          }
        } else {
          I18nManager.forceRTL(false);
        }
      })

    if (userIsOnboarded == true && (newLanguage.languageCode == languageCode)) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomeDrawerNavigator',
          },
        ],
      });
    } else {
      console.log(newLanguage, "..newLanguage");
      if (Object.keys(route.params).length !== 0) {
        console.log(route.params, "routeparams");
        dispatch(onLocalizationSelect(route.params));
        dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
        analytics().setUserProperties({ country: route.params.country.displayName, language: newLanguage.displayName })
      } else {
        console.log(countryData, "countryData");
        dispatch(onLocalizationSelect(countryData));
        dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
        analytics().setUserProperties({ country: countryData.displayName, language: newLanguage.displayName })
      }

      // if (userIsOnboarded == true) {
      //   dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
      // }
     console.log('Sponsers Data for countryList',sponsersData)
      dispatch(setSponsorStore(sponsersData));
      navigation.navigate('LoadingScreen', {
        apiJsonData: userIsOnboarded == true ? allApisObject(false, incrementalSyncDT) : apiJsonData,
        prevPage: userIsOnboarded == true ? 'CountryLangChange' : 'CountryLanguageSelection'
      });
    }
  };

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} key={newLanguage} />
        <OnboardingContainer>

          <OnboardingconfirmationHead>
            <Text style={styles.welcomeText}>{t('welcomeText')}</Text>
            <Icon name="ic_country" size={100} color="#00AEEF" />
            <OnboardingshiftHead>
              <Heading2Centerw>{t('countryLangSelection')}</Heading2Centerw>
            </OnboardingshiftHead>
            <Heading3Centerw>{t('checkonce')}</Heading3Centerw>
          </OnboardingconfirmationHead>

          <OnboardingContent>

            <LocalizationContainer>
              <LocalizationRow>
                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('country')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{countryData?.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>

                <LocalizationWithoutBorderCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('language')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{Array.isArray(route.params.language) ? language[0].displayName : newLanguage?.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationWithoutBorderCol>

                <LocalizationAction>

                </LocalizationAction>
              </LocalizationRow>

              <ButtonWithBorder onPress={(): any => navigation.navigate('CountrySelection', { country: countryData, language: newLanguage })}>
                <OuterIconRow>
                  <OuterIconLeft>
                    <IconML name="ic_edit" size={16} color={secondaryBtnColor} />
                  </OuterIconLeft>
                  <ButtonTextLg>{t('editCountryLang')}</ButtonTextLg>
                </OuterIconRow>
              </ButtonWithBorder>
              <Flex1>
                <ButtonPrimary onPress={(): any => saveSelection()}>
                  <ButtonText numberOfLines={2}>{t('continueCountryLang')}</ButtonText>
                </ButtonPrimary>
              </Flex1>
            </LocalizationContainer>

          </OnboardingContent>

        </OnboardingContainer>
      </>
    </>
  );
};

export default CountryLanguageConfirmation;
