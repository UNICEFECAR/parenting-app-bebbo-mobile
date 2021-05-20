import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
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
import {useTranslation} from 'react-i18next';
import { useAppSelector } from '../../../App';

//{navigation}: Props
type localizationType = {
  name: string;
  displayName: string;
  callingCode: number;
  languages: {
      name: string;
      displayName: string;
      languageCode: string;
      locale: string;
    }
}
const CountrySelection = (props: any) => {
  const [country, setCountry] = useState<localizationType>();
  const callingCode = useAppSelector(
    (state: any) => state.selectedCountry.callingCode,
  );
  useEffect(() => {
    const selectedCountry = localization.find(country=> country.callingCode === callingCode)
    setCountry(selectedCountry);
  },[]);
  const renderItem = ({item}: any) => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );
  const { t } = useTranslation();
  // console.log("-----bj ",i18n);
  return (
    <>
      <Container>
        <Header>
          <HeaderText>{t('selectYourCountry')}</HeaderText>
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
          <ButtonText>{t('goToLanguageSelection')}</ButtonText>
        </Pressable>
      </Container>
    </>
  );
};

export default CountrySelection;
