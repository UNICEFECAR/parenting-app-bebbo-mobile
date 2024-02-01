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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2Centerw,
  Heading3,
  Heading3Centerw,
  Heading3Regular
} from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, Platform, BackHandler } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { allApisObject, appConfig } from '../../assets/translations/appOfflineData/apiConstants';
import { onLocalizationSelect, setrestartOnLangChange, setSponsorStore } from '../../redux/reducers/localizationSlice';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import RNRestart from 'react-native-restart';
import {localization} from '@dynamicImportsClass/dynamicImports';

type CountryLanguageConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Walkthrough'
>;
type Props = {
  navigation: CountryLanguageConfirmationNavigationProp;
  route: any;
};
const CountryLanguageConfirmation = ({route}: Props):any => {
  const {country, language} = route.params;
  const dispatch = useAppDispatch();
  const [newLanguage,setNewLanguage] = useState<any>();
  const [isObject,setIsObject] = useState<any>();
  const navigation = useNavigation<any>();
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
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
  const incrementalSyncDT = useAppSelector((state: any) =>
      (state.utilsData.incrementalSyncDT),
    );
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
  
  const {t, i18n} = useTranslation();
  console.log(I18nManager.isRTL,"---is rtl val");
  useEffect(() => {
      if (!route.params.language) {
      console.log('Language data not available');
    } else if (Array.isArray(route.params.language)) {
       route.params.language.length > 0 ? setNewLanguage(route.params.language[0]) : setNewLanguage(null);
    } else if (typeof route.params.language === 'object') {
      setNewLanguage(route.params.language);
    } else {
      console.log('Invalid language data');
    }
    return ():any => {
      dispatch(setrestartOnLangChange('no'));
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = ():any => {
          i18n.changeLanguage(locale);
          navigation.goBack()
        return true;
      };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);

    return ():any => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove()
    };
  }, []),
  );


  const saveSelection = ():any => {
    i18n.changeLanguage(newLanguage.locale)
    .then(() => {
      if(newLanguage?.locale == 'GRarb' || newLanguage?.locale == 'GRda')
      {
        if(AppLayoutDirection == 'ltr') {
          //remove rtl on backhandler
          Platform.OS=='ios'? setTimeout(()=>{
          I18nManager.forceRTL(true);
          RNRestart.Restart();
          },100):
          setTimeout(()=>{
          I18nManager.forceRTL(true);
          RNRestart.Restart()
          },0);
        }else {
          I18nManager.forceRTL(true);
        }
      }else {
        I18nManager.forceRTL(false);
      }
    })
    
    if(userIsOnboarded == true && (newLanguage.languageCode == languageCode))
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
      console.log(newLanguage,"..newLanguage");
      dispatch(onLocalizationSelect(route.params));
      dispatch(setInfoModalOpened({key:'dailyMessageNotification', value: ''}));
      analytics().setUserProperties({country:route.params.country.displayName,language:newLanguage.displayName})
      if(userIsOnboarded == true){
        dispatch(setSponsorStore({country_national_partner:null,country_sponsor_logo:null}));
      }
        navigation.navigate('LoadingScreen', {
          apiJsonData: userIsOnboarded == true ? allApisObject(false,incrementalSyncDT) : apiJsonData, 
          prevPage: userIsOnboarded == true ? 'CountryLangChange' :'CountryLanguageSelection'
        });
    }
  };
  
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  return (
    <>
    <>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} key={newLanguage}/>
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
                  <Heading3>{ Array.isArray(route.params.language) ?language[0].displayName:language.displayName}</Heading3>
                </LocalizationcontentResult>
              </LocalizationCol>

              <LocalizationAction>
                <ButtonLinkText
                  onPress={():any => {
                    if(localization.length == 1) {
                      navigation.navigate('LanguageSelection',{country:country,languagenew:newLanguage})
                    }else {
                      navigation.navigate('CountrySelection',{country:country,language:newLanguage})
                    }
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
              <ButtonPrimary onPress={():any => saveSelection()}>
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
