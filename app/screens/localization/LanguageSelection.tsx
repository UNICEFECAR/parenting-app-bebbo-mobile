import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, Pressable} from 'react-native';
import {
  Container,
  ButtonText,
  Header,
  HeaderText,
  SelectionView,
} from '../../styles/style';
import {LocalizationStackParamList} from '../../navigation/types';
import LanguageItem from '../../components/LanguageItem';
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
          <HeaderText>Select country's Language</HeaderText>
        </Header>
        <SelectionView>
          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.languageCode.toString()}
          />
        </SelectionView>
        {language ? (
          <Pressable
            style={{backgroundColor: 'red', padding: 10}}
            onPress={() =>
              navigation.navigate('CountryLanguageConfirmation', {
                country,
                language,
              })
            }>
            <ButtonText>go to Confirm</ButtonText>
          </Pressable>
        ) : null}
      </Container>
    </>
  );
};

export default LanguageSelection;
