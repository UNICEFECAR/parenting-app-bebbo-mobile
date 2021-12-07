import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {

  ButtonLinkText,
  ButtonPrimary,
  ButtonText,
  ButtonTextLg
} from '@components/shared/ButtonGlobal';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import Icon, { IconML, OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import OnboardingContainer, {
  LocalizationAction,
  LocalizationCol,
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
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2Centerw,
  Heading3,
  Heading3Centerw,
  Heading3Regular
} from '@styles/typography';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Text } from 'react-native';
import { BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { appConfig } from '../../assets/translations/appOfflineData/apiConstants';
import { onLocalizationSelect, setAppLayoutDirection, setAppLayoutDirectionParams, setAppLayoutDirectionScreen, setrestartOnLangChange, setSponsorStore } from '../../redux/reducers/localizationSlice';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import RNRestart from 'react-native-restart';

type CountryLanguageConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Walkthrough'
>;
type Props = {
  navigation: CountryLanguageConfirmationNavigationProp;
};
const CountryLanguageConfirmation = ({route, navigation}: Props) => {
  const {country, language} = route.params;
  const dispatch = useAppDispatch();
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );
  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  //console.log(country,"---country",countryId);
  //console.log(country, language);
  const apiJsonData = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
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
  const apiJsonDataOnboarded = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
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
    {
      apiEndpoint: appConfig.videoArticles,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.dailyMessages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.activities,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.surveys,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestones,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childDevelopmentData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinations,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthCheckupData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinePinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childGrowthPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childdevGirlPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childdevBoyPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthcheckupPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
        apiEndpoint: appConfig.standardDeviation,
        method: 'get',
        postdata: {},
        saveinDB: true,
    }
  ];
  const {t, i18n} = useTranslation();
  console.log(I18nManager.isRTL,"---is rtl val");

  useEffect(() => {
    console.log("confirm useeffect called");
    // dispatch(setrestartOnLangChange('no'));

    return () => {
      dispatch(setrestartOnLangChange('no'));
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Alert.alert("focuseffect--",JSON.stringify(countryId));
      const backAction = () => {
        // if (userIsOnboarded == true) {
          i18n.changeLanguage(locale);
          navigation.goBack()
        // }else {
        //   navigation.goBack()
        // }
        return true;
      };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);

    return () => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove()
    };
  }, []),
  );

  const saveSelection = () => {
    i18n.changeLanguage(language.locale)
    .then(() => {
      if(language.locale == 'RSen')
      {
        if(AppLayoutDirection == 'ltr') {
          //remove rtl on backhandler
          // dispatch(setAppLayoutDirection('rtl'));
          // dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
          // dispatch(setAppLayoutDirectionParams({
          //   country,
          //   language,
          // }));
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }else {
          I18nManager.forceRTL(true);
        }
      }else {
        I18nManager.forceRTL(false);
      }
    })
    console.log(language,"..language");
    //Settings.defaultLocale = language.luxonLocale;
    if(userIsOnboarded == true && (language.languageCode == languageCode))
    {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'HomeDrawerNavigator',
          },
        ],
      });
    }else {
      dispatch(onLocalizationSelect(route.params));
      dispatch(setInfoModalOpened({key:'dailyMessageNotification', value: ''}));
      analytics().setUserProperties({country:route.params.country.displayName,language:route.params.language.displayName})
      if(userIsOnboarded == true){
        dispatch(setSponsorStore({country_national_partner:null,country_sponsor_logo:null}));
      }
        navigation.navigate('LoadingScreen', {
          apiJsonData: userIsOnboarded == true ? apiJsonDataOnboarded : apiJsonData, 
          prevPage: userIsOnboarded == true ? 'CountryLangChange' :'CountryLanguageSelection'
        });
    }
  };
  
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
    <>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} key={language}/>
      <OnboardingContainer>
        <OnboardingconfirmationHead>
          <Icon name="ic_country" size={100} color="#FFF" />
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

              <LocalizationAction>
                <ButtonLinkText
                  onPress={() => {
                    //console.log(language,"country--",country);
                    navigation.navigate('CountrySelection',{country:country,language:language})
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <IconML name="ic_edit" size={16} color="#000" />
                    </OuterIconLeft>
                    <ButtonTextLg>{t('editCountryLang')}</ButtonTextLg>
                  </OuterIconRow>
                </ButtonLinkText>
              </LocalizationAction>
            </LocalizationRow>
            <Flex1>
              <ButtonPrimary onPress={() => saveSelection()}>
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
