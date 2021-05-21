import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../App';
import {onLocalizationSelect} from '../../redux/reducers/localizationSlice';
import {RootStackParamList} from '../../navigation/types';
import {
  Container,
  ButtonText,
  MiniHeader,
  Header2Text,
  Header3Text,
  LocalizationContainer,
} from '../../styles/style';
import { useTranslation } from 'react-i18next';
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
  // const callingCode = useAppSelector(
  //     (state: any) => state.selectedCountry.callingCode,
  //   );
  // const language = useAppSelector(
  //     (state: any) => state.selectedCountry.language,
  //   );

  const { t, i18n } = useTranslation();
  const saveSelection = () => {
    // i18n.changeLanguage(language.locale);
    console.log(i18n.language);
    dispatch(onLocalizationSelect(route.params));
    // dispatch(onLanguageSelect(language));
    navigation.navigate('Walkthrough');
  };
  return (
    <>
      <Container>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <MiniHeader>
              <Header2Text>{t('countryLangSelection')}</Header2Text>
              <Header3Text>{t('checkonce')}</Header3Text>
            </MiniHeader>
          </View>
          <LocalizationContainer>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Header3Text>{t('country')}</Header3Text>
                </View>
                <View style={{flex: 3}}>
                  <Header2Text>{country.displayName}</Header2Text>
                </View>
              </View>

              <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Header3Text>{t('language')}</Header3Text>
                </View>
                <View style={{flex: 3}}>
                  <Header2Text>{language.displayName}</Header2Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Pressable
                  style={{padding: 10}}
                  onPress={() => navigation.navigate('CountrySelection')}>
                  <ButtonText>{t('editCountryLang')}</ButtonText>
                </Pressable>
              </View>
            </View>
          </LocalizationContainer>

          <View style={{flex: 1}}>
            <Pressable
              style={{backgroundColor: 'red', padding: 10}}
              onPress={() => saveSelection()}>
              <ButtonText>{t('continueCountryLang')}</ButtonText>
            </Pressable>
          </View>
        </View>
      </Container>
    </>
  );
};

export default CountryLanguageConfirmation;
