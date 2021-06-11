import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList} from 'react-native';
import { SelectionView } from '../../styles/style';

import { LocalizationStackParamList } from '../../navigation/types';
import LanguageItem from '@components/LanguageItem';
import { useAppSelector } from '../../../App';
import Icon from '@components/shared/Icon';
import { useTranslation } from 'react-i18next';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import { BtnMultiple, ButtonSection, ButtonviewClick, ButtonviewNext, ButtonviewPrevious } from '@components/shared/ButtonView';
type LanguageSelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'CountryLanguageConfirmation'
>;
type Props = {
  navigation: LanguageSelectionNavigationProp;
};
const LanguageSelection = ({ route, navigation }: Props) => {
  const [language, setLanguage] = useState();
  const { country } = route.params;
  // console.log(country);
  const languages = country.languages;
  const { t } = useTranslation();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useEffect(() => {
    const selectedLanguage = languages.find(lang => lang.languageCode === languageCode)
    setLanguage(selectedLanguage);
  }, []);
  const renderItem = ({ item }: any) => (
    <LanguageItem
      item={item}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  return (
    <>


      <OnboardingContainer>
        <OnboardingStyle title={t('selectYourCountry').toString()} iconname='ic_act_language' />



        <SelectionView>
          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.languageCode.toString()}
          />
        </SelectionView>
        {language ? (


          <BtnMultiple>
            <ButtonviewPrevious>
              <ButtonviewClick onPress={() =>
                navigation.goBack()
              }>
                <Icon name="ic_angle_left" size={32} color="#000" />
                {/* <Image style={{width:50,height:50}} source={ require( '@assets/ic_prev_arrow.png') } /> */}
              </ButtonviewClick>
            </ButtonviewPrevious>
            <ButtonviewNext>
              <ButtonviewClick onPress={() =>
                navigation.navigate('CountryLanguageConfirmation', {
                  country,
                  language,
                })
              }>
                {/* <ButtonText>{t('goToConfirm')}</ButtonText> */}
                <Icon name="ic_angle_right" size={32} color="#000" />
              </ButtonviewClick>
            </ButtonviewNext>
          </BtnMultiple>


        ) : null}
      </OnboardingContainer>
    </>
  );
};

export default LanguageSelection;
