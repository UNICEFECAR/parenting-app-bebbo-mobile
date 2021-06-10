import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Pressable, Text, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../App';
import {onLocalizationSelect, setSponsarStore} from '../../redux/reducers/localizationSlice';
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
import { fetchAPI } from '../../redux/sagaMiddleware/sagaActions';
import { appConfig } from '../../types/apiConstants';
import ImageStorage from '../../downloadImages/ImageStorage';
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
    dispatch(fetchAPI(apiJsonData,'CountryLanguageSelection'));
    // dispatch(onLanguageSelect(language));
    navigation.reset({
      index: 0,
      routes: [{name: 'Walkthrough'}],
    })
    // navigation.navigate('Walkthrough');

  };


  return (
    <>
      <Container>
        <View style={{flex: 1}}>
          <View style={{flex: 1,marginBottom:50}}>
            {/* <View style={{justifyContent:'center',padding:'35%'}}>
              
            </View> */}
            <MiniHeader>
              <Image
                  style={{width:100,height:100,marginBottom:20}}
                  source={require('../../assets/ic_globe.png')}
                />
              <Header2Text>{t('countryLangSelection')}</Header2Text>
              <Header3Text>{t('checkonce')}</Header3Text>
            </MiniHeader>
          </View>
          <LocalizationContainer>
            <View
              style={{
                flex: 1,
              }}>
              <View style={{flex: 2, flexDirection: 'row',alignItems:'center'}}>
                <View style={{flex: 1}}>
                  <Header3Text>{t('country')}</Header3Text>
                </View>
                <View style={{flex: 2}}>
                  <Header2Text>{country.displayName}</Header2Text>
                </View>
              </View>

              <View style={{flex: 2, flexDirection: 'row',alignItems:'center'}}>
                <View style={{flex: 1}}>
                  <Header3Text>{t('language')}</Header3Text>
                </View>
                <View style={{flex: 2}}>
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
              style={{backgroundColor: '#00AEEF', padding: 10}}
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
