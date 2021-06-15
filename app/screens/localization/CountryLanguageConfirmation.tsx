import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Pressable, Text, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../App';
import {onLocalizationSelect, setSponsorStore} from '../../redux/reducers/localizationSlice';
import {RootStackParamList} from '../../navigation/types';
import {
  Container,
  
  MiniHeader,
  Header2Text,
  Header3Text,
  
} from '../../styles/style';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../../redux/sagaMiddleware/sagaActions';
import { appConfig } from '../../types/apiConstants';
import OnboardingContainer, {LocalizationContainer,LocalizationAction, LocalizationRow,LocalizationCol, LocalizationcontentHead, LocalizationcontentResult, OnboardingContent, OnboardingconfirmationHead,OnboardingshiftHead } from '@components/shared/OnboardingContainer';


import Icon from '@components/shared/Icon';
import {  Heading2w, Heading3w,Heading3,Heading3Regular,HeadingRegular, Heading3Centerw, Heading2Centerw } from '../../styles/typography';
import { ButtonPrimary,ButtonContainer, ButtonTextsm,ButtonText } from '@components/shared/ButtonGlobal';

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
  console.log(country, language);
  // const countryId = useAppSelector(
  //     (state: any) => state.selectedCountry.countryId,
  //   );
  // const language = useAppSelector(
  //     (state: any) => state.selectedCountry.language,
  //   );
  const apiJsonData = [
    {apiEndpoint:appConfig.sponsors,method:'get',postdata:{},saveinDB:false}
    ]
  const { t, i18n } = useTranslation();
  const saveSelection = () => {
    // i18n.changeLanguage(language.locale);
    console.log(i18n.language);
    dispatch(onLocalizationSelect(route.params));
    dispatch(fetchAPI(apiJsonData,'CountryLanguageSelection',dispatch,navigation));
    // dispatch(onLanguageSelect(language));
    navigation.reset({
      index: 0,
      routes: [{name: 'Walkthrough'}],
    })
    // navigation.navigate('Walkthrough');

  };


  return (
    <>

    <OnboardingContainer>
      <OnboardingconfirmationHead>
       <Icon name= 'ic_country' size={100} color="#FFF" />
       <OnboardingshiftHead><Heading2Centerw>{t('countryLangSelection')}</Heading2Centerw></OnboardingshiftHead>
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
                <Pressable
                    onPress={() => navigation.navigate('CountrySelection')}>
                    <ButtonTextsm><Icon name="ic_edit" size={16} color="#000" />{t('editCountryLang')}</ButtonTextsm>
                  </Pressable>
                </LocalizationAction>
              </LocalizationRow>
                <ButtonContainer>
                  <ButtonPrimary
                    onPress={() => saveSelection()}>
                    <ButtonText>{t('continueCountryLang')}</ButtonText>
                  </ButtonPrimary>
                </ButtonContainer>
          </LocalizationContainer>
        </OnboardingContent>
    </OnboardingContainer>

    </>
  );
};

export default CountryLanguageConfirmation;
