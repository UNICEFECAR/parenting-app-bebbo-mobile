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
  ButtonText,
  Header,
  HeaderText,
  SelectionView,
} from '../../styles/style';
import {localization} from '@assets/data/localization';
import CountryItem from '@components/CountryItem';
import {useTranslation} from 'react-i18next';
import { useAppSelector } from '../../../App';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';

import OnboardingStyle from '@components/shared/OnboardingStyle';
import { ButtonSection, ButtonviewClick, ButtonviewNext } from '@components/shared/ButtonView';


// import {API_URL, API_TOKEN} from "@env";
//{navigation}: Props
type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
      name: string;
      displayName: string;
      languageCode: string;
      locale: string;
    }
}
const CountrySelection = (props: any) => {
  const [country, setCountry] = useState<localizationType>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  useEffect(() => {
    const selectedCountry: any= localization.find(country=> country.countryId === countryId)
    setCountry(selectedCountry);
  },[]);
  const renderItem = ({item}: any) => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );
  const { t } = useTranslation();
  // console.log("-----bj ",i18n);
  return (
    <>
    <OnboardingContainer>
    
    <OnboardingStyle title= {t('selectYourCountry').toString()} iconname= 'ic_country' />

        <SelectionView>
          <FlatList
            data={localization}
            renderItem={renderItem}
            keyExtractor={(item) => item.countryId.toString()}
          />
        </SelectionView>
        <ButtonSection>
        
        <ButtonviewNext>
            <ButtonviewClick 
            style={{}}
            onPress={() =>
              props.navigation.navigate('LanguageSelection', {country})
            }>
              <Icon name="ic_angle_right" size={32} color="#000" />
            </ButtonviewClick>
        </ButtonviewNext>
        
        </ButtonSection>
        </OnboardingContainer>
    </>
  );
};

export default CountrySelection;