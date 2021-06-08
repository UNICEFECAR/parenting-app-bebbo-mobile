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
import {FlatList, Image, Pressable, StyleSheet, View} from 'react-native';
import {
  Container,
  ButtonText,
  Header,
  HeaderText,
  SelectionView,
} from '../../styles/style';
import {localization} from '../../assets/data/localization';
import CountryItem from '@components/CountryItem';
import {useTranslation} from 'react-i18next';
import { useAppSelector } from '../../../App';
// import {API_URL, API_TOKEN} from "@env";
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
          {/* <HeaderText>{API_URL}</HeaderText> */}
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
          style={{marginTop:30,marginStart:300,marginBottom:10,marginEnd:10,borderRadius: 20,justifyContent: 'flex-end',alignItems: 'flex-end',}}
          onPress={() =>
            props.navigation.navigate('LanguageSelection', {country})
          }>
          {/* <ButtonText>{t('goToLanguageSelection')}</ButtonText> */}
          {/* <View style={{width: 40,height: 40,backgroundColor: 'rgba(0, 0, 0, .2)',borderRadius: 20,justifyContent: 'center',alignItems: 'center',}}> */}
            <Image style={{width:50,height:50}} source={ require( '../../assets/ic_next_arrow.png') } />
          {/* </View> */}
        </Pressable>
      </Container>
    </>
  );
};

export default CountrySelection;

export const styles = StyleSheet.create({
  // Header CSS
  headerMenuIcon: {
    marginLeft: 10,
  },

});