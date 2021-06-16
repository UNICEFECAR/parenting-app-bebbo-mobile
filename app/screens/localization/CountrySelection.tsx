import { localization } from '@assets/data/localization';
import CountryItem from '@components/CountryItem';
import { ButtonSection, ButtonviewClick, ButtonviewNext } from '@components/shared/ButtonView';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  SelectionView
} from '@styles/style';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import {defaultProps} from '../../interfaces/interface';
// import {darkTheme, lightTheme} from '../../theme/theme';
import { FlatList } from 'react-native';
import { useAppSelector } from '../../../App';

type CountrySelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'LanguageSelection'
>;

type Props = {
  navigation: CountrySelectionNavigationProp;
};



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