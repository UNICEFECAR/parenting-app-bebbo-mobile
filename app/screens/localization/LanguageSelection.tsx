import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import LanguageItem from '@components/LanguageItem';
import {
  BtnMultiple,
  ButtonviewClick,
  ButtonviewNext,
  ButtonviewPrevious
} from '@components/shared/ButtonView';
import { IconML } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, FlatList, I18nManager, LayoutAnimation, Platform, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import RNRestart from 'react-native-restart';
import { onLocalizationSelect, setAppLayoutDirection, setAppLayoutDirectionParams, setAppLayoutDirectionScreen, setrestartOnLangChange } from '../../redux/reducers/localizationSlice';
import { localization } from '@dynamicImportsClass/dynamicImports';
import { buildFor, buildForBebbo, buildForFoleja } from '@assets/translations/appOfflineData/apiConstants';

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
  console.log("in lang file ---", route.params);
  let country: any, languagenew: any;
  if (buildFor == buildForFoleja && (route.params == null || route.params == undefined || route.params?.country == null)) {
    console.log("in if--");
    country = localization[localization.length - 1];
    languagenew = null;
  } else {
    country = route.params.country;
    languagenew = route.params.language;
  }
  const languages = country?.languages;
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
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
      console.log('languages for foleja is',languages)
      if (buildFor == String(buildForFoleja)){
        setLanguage(languages[0])
      }else{
        const languagesWithLuxonLocale = country.languages.filter((lang: any) => lang.luxonLocale === route.params.luxonlocale || extractLanguageCode(lang.luxonLocale) === route.params.deviceLanCode);
        if (languagesWithLuxonLocale.length != 0) {
          setLanguage(languagesWithLuxonLocale)
        } else {
          setLanguage(languages[0])
        }
      }
    
    
    }
  }, [route?.params?.language]);

  const renderItem = ({ item, index }: any): any => (
    <LanguageItem
      item={item}
      index={index}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const rtlConditions = (language: any): any => {

    if (language?.locale == 'GRarb' || language?.locale == 'GRda') {
      if (AppLayoutDirection == 'ltr') {
        dispatch(setrestartOnLangChange('yes'));
        dispatch(setAppLayoutDirection('rtl'));
        dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
        dispatch(setAppLayoutDirectionParams({
          country,
          language,
        }));
        Platform.OS == 'ios' ? setTimeout(() => {
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }, 100) :
          setTimeout(() => {
            I18nManager.forceRTL(true);
            RNRestart.Restart();
          }, 0);
      } else {
        I18nManager.forceRTL(true);
      }
    } else {
      if (AppLayoutDirection == 'rtl') {

        dispatch(setrestartOnLangChange('yes'));
        dispatch(setAppLayoutDirection('ltr'));
        dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
        dispatch(setAppLayoutDirectionParams({
          country,
          language,
        }));
        Platform.OS == 'ios' ?
          setTimeout(() => {
            I18nManager.forceRTL(false);
            RNRestart.Restart();
          }, 100) :
          setTimeout(() => {
            I18nManager.forceRTL(false);
            RNRestart.Restart();
          }, 0);
      } else {
        I18nManager.forceRTL(false);
      }
    }
    navigation.navigate('CountryLanguageConfirmation', {
      country,
      language,
    })
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
          <OnboardingStyle
            title={t('selectYourLang').toString()}
            iconname="ic_act_language"
          />

          <SelectionView>
            <FlatList
              data={languages}
              renderItem={renderItem}
              keyExtractor={(item): any => item.languageCode.toString()}
            />
          </SelectionView>
          <ShiftFromTopBottom10>
            <BtnMultiple>
              {localization.length > 1 ?
                <ButtonviewNext>
                  <ButtonviewClick onPress={(): any => {
                    navigation.navigate('CountrySelection', {
                      country,
                      language,
                    })
                  }}>
                    <IconML name="ic_angle_left" size={32} color="#000" />
                  </ButtonviewClick>
                </ButtonviewNext>
                : <View></View>
              }
              {language ? (
                <ButtonviewNext>
                  <ButtonviewClick
                    onPress={(): any => {
                      goToConfirmationScreen()
                    }
                    }>
                    <IconML name="ic_angle_right" size={32} color="#000" />
                  </ButtonviewClick>
                </ButtonviewNext>
              ) : <ButtonviewPrevious>
                <ButtonviewClick
                  onPress={(): any => {
                    console.log("pressed")
                  }
                  }>
                  <IconML name="ic_angle_right" size={32} color="#000" />
                </ButtonviewClick>
              </ButtonviewPrevious>}
            </BtnMultiple>
          </ShiftFromTopBottom10>
        </OnboardingContainer>
      </>
    </>
  );
};

export default LanguageSelection;
