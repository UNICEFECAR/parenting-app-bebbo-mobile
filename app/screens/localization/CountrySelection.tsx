import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {LocalizationStackParamList} from '../../navigation/types';
type CountrySelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'LanguageSelection'
>;

type Props = {
  navigation: CountrySelectionNavigationProp;
};
// import {defaultProps} from '../../interfaces/interface';
// import {darkTheme, lightTheme} from '../../theme/theme';
import {FlatList, Pressable} from 'react-native';
import {
  Container,
  ButtonText,
  Header,
  HeaderText,
  SelectionView,
} from '../../styles/style';
import {localization} from '../../assets/data/localization';
import CountryItem from '../../components/CountryItem';
//{navigation}: Props
const CountrySelection = (props: any) => {
  const [country, setCountry] = useState();
  const renderItem = ({item}: any) => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );

  return (
    <>
      <Container>
        <Header>
          <HeaderText>Select your country</HeaderText>
        </Header>
        <SelectionView>
          <FlatList
            data={localization}
            renderItem={renderItem}
            keyExtractor={(item) => item.callingCode.toString()}
          />
        </SelectionView>
        <Pressable
          style={{backgroundColor: 'red', padding: 10}}
          onPress={() =>
            props.navigation.navigate('LanguageSelection', {country})
          }>
          <ButtonText>go to LanguageSelection</ButtonText>
        </Pressable>
      </Container>
    </>
  );
};

export default CountrySelection;
