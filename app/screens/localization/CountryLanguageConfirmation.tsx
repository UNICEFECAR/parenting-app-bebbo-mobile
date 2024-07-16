import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonPrimary,
  ButtonTextLg,
  ButtonUpperCaseText,
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
  Heading3Regular,
  Heading4Centerr,
  Heading4Centerw,
  ShiftFromTop25
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
import { sponsors } from '@dynamicImportsClass/dynamicImports';
import * as RNLocalize from "react-native-localize";
import { secondaryBtnColor } from '@styles/style';
import { Pressable } from 'react-native';
import { fetchAPI } from '../../redux/sagaMiddleware/sagaActions';
import useNetInfoHook from '../../customHooks/useNetInfoHook';

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
  const [sponsorsData, setSponsorsData] = useState<any>();
  const [newLanguage, setNewLanguage] = useState<any>();
  const [luxonLanLocale, setLuxonLanLocale] = useState<any>();
  const [allCountriesData, setAllCountriesData] = useState<any>();
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
  const countrySelectedId = useAppSelector(
    (state: any) => state.selectedCountry.countrySelectedId,
  );
  const [loading, setLoading] = useState(true);
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );
  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  const selectedLocale = useAppSelector(
    (state: any) => state.selectedCountry.selectedLocale,
  );
  const userIsFirstTime = useAppSelector(
    (state: any) =>
      state.utilsData.userIsFirstTime
  );

  const incrementalSyncDT = useAppSelector((state: any) =>
    (state.utilsData.incrementalSyncDT),
  );
  const netInfo = useNetInfoHook();
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
  const allCountries = useAppSelector(
    (state: any) =>
      state.selectedCountry.countries != '' ? JSON.parse(state.selectedCountry.countries) : [],
  );
  const { t, i18n } = useTranslation();
  console.log(I18nManager.isRTL, "---is rtl val");

  // useEffect(() => {
  //   console.log('userIsFirstTime is', userIsFirstTime);

  //   if (!userIsFirstTime) {
  //     dispatch(fetchAPI(apiCountryJsonData, '', dispatch, navigation, languageCode, '', apiCountryJsonData, netInfo.isConnected)) // update loading state once API call is done
  //   } else {
  //     setLoading(false); // in case userIsFirstTime is true, we don't wait for API call
  //   }
  // }, [userIsFirstTime,dispatch]);

  // useEffect(() => {
  //   console.log('All data is', allCountries);
  //   setAllCountriesData(allCountries);
  // }, [userIsFirstTime]);

  // useEffect(() => {

  //   async function setCountries() {
  //     try {
  //       if (!userIsFirstTime) {
  //         await dispatch(fetchAPI(apiCountryJsonData, '', dispatch, navigation, languageCode, '', apiCountryJsonData, netInfo.isConnected)) // update loading state once API call is done
  //       } else {
  //         setLoading(false); // in case userIsFirstTime is true, we don't wait for API call
  //       }

  //     } catch (e: any) {
  //       console.log("Error");
  //       console.log(e.message);
  //     }
  //   }
  //   setCountries()
  // }, [userIsFirstTime,dispatch]);
  // useEffect(() => {
  //   if (!route.params.language) {
  //     console.log('Language data not available');
  //   } else if (Array.isArray(route.params.language)) {
  //     route.params.language.length > 0 ? setNewLanguage(route.params.language[0]) : setNewLanguage(null);
  //   } else if (typeof route.params.language === 'object') {
  //     setNewLanguage(route.params.language);
  //   } else {
  //     console.log('Invalid language data');
  //   }
  //   return (): any => {
  //     dispatch(setrestartOnLangChange('no'));
  //   }
  // }, [route.params]);
  const extractLanguageCode = (languageTag: string): string => {
    const [languageCode] = languageTag.split('-');
    return languageCode;
  };
  const getCountryByCountryCode = (countryCode: any): any => {
    const normalizedCountryCode = countryCode.toLowerCase(); // Normalize to lowercase for case-insensitive comparison

    for (const country of allCountries) {
      if (country.languages) { // Ensure country.languages is not null or undefined
        for (const language of country.languages) {
          if (language.languageCode.toLowerCase().includes(normalizedCountryCode)) {
            return country;
          }
        }
      }
    }

    return null; // Return null if country not found
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
          newCountryId = route.params.country.CountryID;
          newCountryLocale = route.params.country.luxonLocale;
          setCountryData(route.params.country)
        } else {
          newCountryId = countryId;
          newCountryLocale = selectedDefaultCountry;
        }
      } else {
        if (Object.keys(route.params).length === 0) {
          newCountryLocale = selectedDefaultCountry;
          newCountryId = countryId;
        } else {
          if (route.params != undefined) {
            newCountryLocale = route.params.language.luxonLocale;
            newCountryId = route.params.country.countryId;
          } else {
            newCountryLocale = selectedDefaultCountry;
            newCountryId = countryId;
          }
        }
      }



      console.log('newCountryId country is', newCountryId)
      const selectedCountry = allCountries.find(
        (country: any) => country.CountryID === newCountryId.toString(),
      )

      setSponsorsData(selectedCountry);
      const foundCountry = getCountryByCountryCode(RNLocalize.getCountry());
      console.log('Found country is', foundCountry)
      if (foundCountry != undefined && foundCountry != null) {
        if (countrySelectedId == 0) {
          setCountryData(foundCountry);
          const languagesWithLuxonLocale = foundCountry?.languages?.filter((lang: any) => lang.luxonLocale === selectedDefaultCountry || extractLanguageCode(lang.luxonLocale) === selectedLanguage);
          if (languagesWithLuxonLocale?.length != 0) {
            setNewLanguage(languagesWithLuxonLocale[0]);
          } else {
            const selectedLanData = foundCountry?.languages?.filter((lang: any) => lang.languageCode === languageCode);
            if (selectedLanData?.length > 0) {
              setNewLanguage(selectedLanData[0])
            } else {
              setNewLanguage(foundCountry?.languages[0])
            }
          }
        } else {
          setCountryData(selectedCountry);
          const languagesWithLuxonLocale = selectedCountry?.languages?.filter((lang: any) => lang.locale === locale);
          if (languagesWithLuxonLocale?.length != 0) {
            setNewLanguage(languagesWithLuxonLocale[0])
          } else {
            const selectedLanData = selectedCountry?.languages?.filter((lang: any) => lang.languageCode === languageCode);
            if (selectedLanData.length > 0) {
              setNewLanguage(selectedLanData[0])
            } else {
              setNewLanguage(foundCountry?.languages[0])
            }
          }
        }
      } else {
        setCountryData(selectedCountry);
        let filteredLanguage: any = null;
        console.log('selectedLocale is', selectedLocale, newLanguage)
        if (selectedLocale !== '') {
          filteredLanguage = selectedCountry?.languages?.filter((lang: any) => lang.locale === selectedLocale);
        } else {
          filteredLanguage = selectedCountry?.languages?.filter((lang: any) => lang.luxonLocale === selectedDefaultCountry || extractLanguageCode(lang.luxonLocale) === selectedLanguage);
        }
        if (filteredLanguage?.length > 0) {
          setNewLanguage(filteredLanguage[0]);
        } else {
          setNewLanguage(selectedCountry?.languages[0]);
        }
      }
    }
  }, [isVisible]);

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
      if (Object.keys(route.params).length !== 0) {
        dispatch(onLocalizationSelect(route.params));
        dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
        analytics().setUserProperties({ country: route.params.country.name, language: newLanguage.displayName })
      } else {
        console.log('countyData is', countryData);
        console.log('newLanguage is', newLanguage);
        const languageSelected = selectedLocale !== '' ? selectedLocale : locale;
        const filteredLan = countryData?.languages?.filter((lang: any) => lang.locale == newLanguage?.locale);
        dispatch(onLocalizationSelect({ "languages": filteredLan, "countryId": countryData?.countryId }));
        // dispatch(onLocalizationSelect(countryData));
        dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
        analytics().setUserProperties({ country: countryData.name, language: newLanguage.displayName })
      }

      // if (userIsOnboarded == true) {
      //   dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
      // }
      console.log('Sponsors Data for countryList', sponsorsData)
      dispatch(setSponsorStore(sponsorsData));
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
            <Heading4Centerr>{t('checkonce')}</Heading4Centerr>
          </OnboardingconfirmationHead>


          <LocalizationContainer>
            <LocalizationRow>

              <LocalizationCol>
                <Pressable style={{ flexDirection: 'row' }} onPress={(): any => navigation.navigate('CountrySelection', { country: countryData, language: newLanguage })}>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('country')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{countryData?.name}</Heading3>
                  </LocalizationcontentResult>
                </Pressable>
              </LocalizationCol>

              <LocalizationWithoutBorderCol>
                <Pressable style={{ flexDirection: 'row' }} onPress={(): any => navigation.navigate('LanguageSelection', { country: countryData, language: newLanguage, luxonlocale: luxonLanLocale != undefined ? luxonLanLocale : null, deviceLanCode: deviceLanCode != undefined ? deviceLanCode : null,isFromCountry:true })}>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('language')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{Array.isArray(route.params.language) ? language[0].displayName : newLanguage?.displayName}</Heading3>
                  </LocalizationcontentResult>
                </Pressable>
              </LocalizationWithoutBorderCol>

              <LocalizationAction>
              </LocalizationAction>
            </LocalizationRow>
            <ShiftFromTop25>
              <ButtonWithBorder onPress={(): any => navigation.navigate('CountrySelection', { country: countryData, language: newLanguage })}>
                <OuterIconRow>
                  <OuterIconLeft>
                    <IconML name="ic_edit" size={16} color={secondaryBtnColor} />
                  </OuterIconLeft>
                  <ButtonTextLg>{t('editCountryLang')}</ButtonTextLg>
                </OuterIconRow>
              </ButtonWithBorder>
            </ShiftFromTop25>

            <Flex1>
              <ButtonPrimary onPress={(): any => saveSelection()}>
                <ButtonUpperCaseText numberOfLines={2}>{t('continueCountryLang')}</ButtonUpperCaseText>
              </ButtonPrimary>
            </Flex1>
          </LocalizationContainer>
        </OnboardingContainer>


      </>
    </>
  );
};

export default CountryLanguageConfirmation;