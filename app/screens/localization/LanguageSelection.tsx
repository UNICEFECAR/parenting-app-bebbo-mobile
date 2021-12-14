import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import LanguageItem from '@components/LanguageItem';
import {
  BtnMultiple,
  ButtonviewClick,
  ButtonviewNext,
  ButtonviewPrevious
} from '@components/shared/ButtonView';
import Icon, { IconML } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, I18nManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppLayoutDirection, setAppLayoutDirectionParams, setAppLayoutDirectionScreen, setrestartOnLangChange } from '../../redux/reducers/localizationSlice';

type LanguageSelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'CountryLanguageConfirmation'
>;
type Props = {
  navigation: LanguageSelectionNavigationProp;
};
const LanguageSelection = ({route, navigation}: Props) => {
  const [language, setLanguage] = useState();
  const {country,languagenew} = route.params;
  //console.log(languagenew,"--languagenew--");
  const languages = country.languages;
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );
  useEffect(() => {
    // AsyncStorage.setItem('isDirectionChanged','No')
    let newLanguageId: any,selectedLanguage;
    // if(userIsOnboarded == true){
      if(languagenew && languagenew != null){
        newLanguageId = languagenew.languageCode;
      }else {
        newLanguageId = languageCode;
      }
    // }else {
    //   newLanguageId = languageCode;
    // }
    selectedLanguage = languages.find(
      (lang) => lang.languageCode === newLanguageId,
    );
    setLanguage(selectedLanguage);
  }, []);
  const renderItem = ({item}: any) => (
    <LanguageItem
      item={item}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const goToConfirmationScreen = () => {
    i18n.changeLanguage(language?.locale)
    .then(() => {
      if(language?.locale == 'GRarb' || language?.locale == 'GRda')
      {
        if(AppLayoutDirection == 'ltr') {
          dispatch(setrestartOnLangChange('yes'));
          dispatch(setAppLayoutDirection('rtl'));
          dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
          dispatch(setAppLayoutDirectionParams({
            country,
            language,
          }));
          Platform.OS=='ios'? setTimeout(()=>{
          I18nManager.forceRTL(true);
          RNRestart.Restart();
          },100):
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }else {
          I18nManager.forceRTL(true);
        }
      }else {
        if(AppLayoutDirection == 'rtl') {
          dispatch(setrestartOnLangChange('yes'));
          dispatch(setAppLayoutDirection('ltr'));
          dispatch(setAppLayoutDirectionScreen('CountryLanguageConfirmation'));
          dispatch(setAppLayoutDirectionParams({
            country,
            language,
          }));
          Platform.OS=='ios'? setTimeout(()=>{
          I18nManager.forceRTL(false);
          RNRestart.Restart();
          },100):
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        }else {
          I18nManager.forceRTL(false);
        }
      }
    })
    navigation.navigate('CountryLanguageConfirmation', {
      country,
      language,
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
            keyExtractor={(item) => item.languageCode.toString()}
          />
        </SelectionView>
        <ShiftFromTopBottom10>
          <BtnMultiple>
            <ButtonviewNext>
              <ButtonviewClick onPress={() => navigation.goBack()}>
                <IconML name="ic_angle_left" size={32} color="#000" />
              </ButtonviewClick>
            </ButtonviewNext>
            {language ? (
              <ButtonviewNext>
                <ButtonviewClick
                  onPress={() => goToConfirmationScreen()}>
                  <IconML name="ic_angle_right" size={32} color="#000" />
                </ButtonviewClick>
              </ButtonviewNext>
            ) : <ButtonviewPrevious>
            <ButtonviewClick
              onPress={() =>{}
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
