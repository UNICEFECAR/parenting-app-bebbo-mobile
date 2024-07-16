import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import LanguageItem from '@components/LanguageItem';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectionView } from '@styles/style';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, I18nManager, Platform, Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import RNRestart from 'react-native-restart';
import { onLocalizationSelect, setAppLayoutDirection, setAppLayoutDirectionParams, setAppLayoutDirectionScreen, setrestartOnLangChange, setSponsorStore } from '../../redux/reducers/localizationSlice';
import { localization, sponsors } from '@dynamicImportsClass/dynamicImports';
import { allApisObject, appConfig, buildFor, buildForBebbo, buildForFoleja } from '@assets/translations/appOfflineData/apiConstants';
import { Flex5 } from '@components/shared/FlexBoxStyle';
import { ButtonPrimary, ButtonUpperCaseText } from '@components/shared/ButtonGlobal';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import analytics from '@react-native-firebase/analytics';
import { useIsFocused } from '@react-navigation/native';
type LanguageSelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'CountryLanguageConfirmation'
>;
type Props = {
  navigation: LanguageSelectionNavigationProp;
  route: any;
};
const LanguageSelection = ({ route, navigation }: Props): any => {
  const [language, setLanguage] = useState<any>();
  console.log("in lang file ---", route?.params);
  let country: any, languagenew: any;
  if (buildFor == buildForFoleja && (route.params == null || route.params == undefined || route.params?.country == null)) {
    console.log("in if--");
    country = localization[localization.length - 1];
    languagenew = null;
  } else {
    country = route?.params?.country;
    languagenew = route?.params?.language;
  }
  const [sponsorsData, setSponsorsData] = useState<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const languages = country?.languages;
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const isVisible = useIsFocused();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
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

  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );
  const extractLanguageCode = (languageTag: string): string => {
    const [languageCode] = languageTag.split('-');
    return languageCode;
  };
  useEffect(() => {
    if (route?.params?.language != undefined) {
      setLanguage(route?.params?.language)
    } else {
      console.log('languages for foleja is', languages)
      if (buildFor == String(buildForFoleja)) {
        setLanguage(languages[0])
      } else {
        const languagesWithLuxonLocale = country?.languages?.filter((lang: any) => lang.luxonLocale === route.params.luxonlocale || extractLanguageCode(lang.luxonLocale) === route.params.deviceLanCode);

        if (languagesWithLuxonLocale?.length != 0) {
          setLanguage(languagesWithLuxonLocale)
        } else {
          setLanguage(languages[0])
        }

      }


    }
  }, [route?.params?.language]);
  useEffect(() => {
    if (isVisible) {
      let newCountryId: any;
      let newCountryLocale: any;
      if (userIsOnboarded == true) {
        if (route.params.country && route.params.country != null && route.params.country != undefined) {
          newCountryId = route.params.country.countryId
        } else {
          newCountryId = countryId;
        }
      } else {
        if (Object.keys(route.params).length === 0) {
          newCountryId = countryId;
        } else {
          
          if (route.params != undefined) {
            newCountryId = route.params.country.countryId;
          } else {
            newCountryId = countryId;
          }
        }
      }

      const selectedCountry = localization.find(
        (country: any) => country.CountryID === newCountryId,
      );

      const countrySponsorsData = sponsors.find(
        (country: any) => country.id === selectedCountry.CountryID,
      )
      console.log('Seleted  country is', countrySponsorsData)
      console.log('selectedCountry country is', selectedCountry)
      setSponsorsData(countrySponsorsData);
    }
  }, [isVisible]);
  const renderItem = ({ item, index }: any): any => (
    <LanguageItem
      item={item}
      index={index}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const rtlConditions = (language: any): any => {

    // if (language?.locale == 'GRarb' || language?.locale == 'GRda') {
    //   if (AppLayoutDirection == 'ltr') {
    //     dispatch(setrestartOnLangChange('yes'));
    //     dispatch(setAppLayoutDirection('rtl'));
    //     dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
    //     dispatch(setAppLayoutDirectionParams({
    //       country,
    //       language,
    //     }));
    //     Platform.OS == 'ios' ? setTimeout(() => {
    //       I18nManager.forceRTL(true);
    //       RNRestart.Restart();
    //     }, 100) :
    //       setTimeout(() => {
    //         I18nManager.forceRTL(true);
    //         RNRestart.Restart();
    //       }, 0);
    //   } else {
    //     I18nManager.forceRTL(true);
    //   }
    // } else {
    //   if (AppLayoutDirection == 'rtl') {

    //     dispatch(setrestartOnLangChange('yes'));
    //     dispatch(setAppLayoutDirection('ltr'));
    //     dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
    //     dispatch(setAppLayoutDirectionParams({
    //       country,
    //       language,
    //     }));
    //     Platform.OS == 'ios' ?
    //       setTimeout(() => {
    //         I18nManager.forceRTL(false);
    //         RNRestart.Restart();
    //       }, 100) :
    //       setTimeout(() => {
    //         I18nManager.forceRTL(false);
    //         RNRestart.Restart();
    //       }, 0);
    //   } else {
    //     I18nManager.forceRTL(false);
    //   }
    // }
    // navigation.navigate('CountryLanguageConfirmation', {
    //   country,
    //   language,
    // })
    i18n.changeLanguage(language.locale)
    .then(() => {
      if (language?.locale == 'GRarb' || language?.locale == 'GRda') {
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

  if (userIsOnboarded == true && (language.languageCode == languageCode)) {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeDrawerNavigator',
        },
      ],
    });
  } else {
    console.log(language, "..newLanguage");
    if (Object.keys(route.params).length !== 0) {
      console.log(route.params.country.languages[0], "routeparams");
      const filteredLan = route.params?.country?.languages?.filter((lang:any)=>lang.languageCode==language.languageCode);
      console.log('filtered language is',filteredLan)
      dispatch(onLocalizationSelect({"languages":filteredLan,"countryId": route.params.country?.countryId}));
      dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
      analytics().setUserProperties({ country: route.params.country.displayName, language: language.displayName })
    } else {
      console.log(country, "countryData");
      dispatch(onLocalizationSelect(country));
      dispatch(setInfoModalOpened({ key: 'dailyMessageNotification', value: '' }));
      analytics().setUserProperties({ country: country.displayName, language: language.displayName })
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
  }
  const goToConfirmationScreen = (): any => {
    let newLanguage: any = null
    if (language?.locale != undefined) {
      newLanguage = language
    } else {
      newLanguage = language[0]
    }
    i18n.changeLanguage(newLanguage.locale)
      .then(() => {
        if (buildFor == buildForBebbo) {
          const rotwLanguagelocaleen = localization[localization.length - 1].languages[0].locale;
          const rotwLanguagelocaleru = localization[localization.length - 1].languages[1].locale;
          console.log('rest of the world title',newLanguage)
          console.log('rotwLanguagelocaleru of the world title',rotwLanguagelocaleru)
          if (newLanguage?.locale == rotwLanguagelocaleen || newLanguage?.locale == rotwLanguagelocaleru) {
            Alert.alert(t('restOfTheWorldAlertTitle'), t('restOfTheWorldAlertText'),
              [
                {
                  text: t('restOfTheWorldOkTitle'), onPress: async (): Promise<any> => {
                    rtlConditions(newLanguage)
                  }
                }
              ]
            );
          } else {
            rtlConditions(newLanguage);
          }
        } else {
          rtlConditions(newLanguage);
        }
      }).catch((error: any) => {
        console.log('error', error)
      })

  }
  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer>
          <Pressable
            onPress={(e: any): any => {
              console.log('Back icon click')
              navigation.navigate('CountrySelection', {
                country,
                language,
              })
            }}
          >
            <OnboardingStyle
              title={t('selectYourLang').toString()}
              iconname="ic_back"
            />
          </Pressable>


          <SelectionView>
            <FlatList
              data={languages}
              renderItem={renderItem}
              keyExtractor={(item): any => item.languageCode.toString()}
            />
          </SelectionView>

          <Flex5>
            <ButtonPrimary onPress={(): any => {
             goToConfirmationScreen()
              // props.navigation.navigate('LanguageSelection', { country: country, language: language, luxonlocale: luxonLanLocale != undefined ? luxonLanLocale : null, deviceLanCode: deviceLanCode != undefined ? deviceLanCode : null })
            }}>
              <ButtonUpperCaseText numberOfLines={2}>{t('continueCountryLang')}</ButtonUpperCaseText>
            </ButtonPrimary>
          </Flex5>
        </OnboardingContainer>
      </>
    </>
  );
};

export default LanguageSelection;
