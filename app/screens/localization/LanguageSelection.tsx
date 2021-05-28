import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable, View} from 'react-native';
import {
  Container,
  ButtonText,
  Header,
  HeaderText,
  SelectionView,
} from '../../styles/style';
import {LocalizationStackParamList} from '../../navigation/types';
import LanguageItem from '../../components/LanguageItem';
import { useAppSelector } from '../../../App';
import { localization } from '../../assets/data/localization';
import { useTranslation } from 'react-i18next';
type LanguageSelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'CountryLanguageConfirmation'
>;
type Props = {
  navigation: LanguageSelectionNavigationProp;
};
const LanguageSelection = ({route, navigation}: Props) => {
  const [language, setLanguage] = useState();
  const {country} = route.params;
  // console.log(country);
  const languages = country.languages;
  const { t } = useTranslation();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useEffect(() => {
    const selectedLanguage = languages.find(lang=> lang.languageCode === languageCode)
    setLanguage(selectedLanguage);
  },[]);
  const renderItem = ({item}: any) => (
    <LanguageItem
      item={item}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  return (
    <>
      <Container>
        <Header>
          <HeaderText>{t('selectYourLang')}</HeaderText>
        </Header>
        <SelectionView>
          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.languageCode.toString()}
          />
        </SelectionView>
        {language ? (
          <View style={{flex:1,flexDirection: 'row',alignItems:'flex-end',padding:15}}>
            <Pressable
              style={{flex:1,flexDirection: 'column',backgroundColor: 'white',borderRadius: 20,justifyContent: 'center',alignItems: 'flex-start',}}
              onPress={() =>
                navigation.goBack()
              }>
                <Image style={{width:50,height:50}} source={ require( '../../assets/ic_prev_arrow.png') } />
            </Pressable>
          <Pressable
            style={{flex:1,flexDirection: 'column',backgroundColor: 'white',borderRadius: 20,justifyContent: 'center',alignItems: 'flex-end',}}
            onPress={() =>
              navigation.navigate('CountryLanguageConfirmation', {
                country,
                language,
              })
            }>
            {/* <ButtonText>{t('goToConfirm')}</ButtonText> */}
            <Image style={{width:50,height:50}} source={ require( '../../assets/ic_next_arrow.png') } />
          </Pressable>
          
        </View>
        ) : null}
      </Container>
    </>
  );
};

export default LanguageSelection;
