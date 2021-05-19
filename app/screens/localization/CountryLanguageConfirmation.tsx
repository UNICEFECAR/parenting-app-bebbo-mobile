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
  const saveSelection = () => {
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
              <Header2Text>You have selected the country language</Header2Text>
              <Header3Text>check once before proceeding</Header3Text>
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
                  <Header3Text>Country</Header3Text>
                </View>
                <View style={{flex: 3}}>
                  <Header2Text>{country.displayName}</Header2Text>
                </View>
              </View>

              <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Header3Text>Language</Header3Text>
                </View>
                <View style={{flex: 3}}>
                  <Header2Text>{language.displayName}</Header2Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Pressable
                  style={{padding: 10}}
                  onPress={() => navigation.navigate('CountrySelection')}>
                  <ButtonText>Edit</ButtonText>
                </Pressable>
              </View>
            </View>
          </LocalizationContainer>

          <View style={{flex: 1}}>
            <Pressable
              style={{backgroundColor: 'red', padding: 10}}
              onPress={() => saveSelection()}>
              <ButtonText>Continue</ButtonText>
            </Pressable>
          </View>
        </View>
      </Container>
    </>
  );
};

export default CountryLanguageConfirmation;
