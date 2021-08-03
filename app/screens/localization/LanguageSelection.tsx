import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import LanguageItem from '@components/LanguageItem';
import {
    BtnMultiple,
    ButtonviewClick,
    ButtonviewNext,
    ButtonviewPrevious
} from '@components/shared/ButtonView';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';

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
  const {t, i18n} = useTranslation();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useEffect(() => {
    const selectedLanguage = languages.find(
      (lang) => lang.languageCode === languageCode,
    );
    setLanguage(selectedLanguage);
  }, []);
  const renderItem = ({item}: any) => (
    <LanguageItem
      item={item}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const goToConfirmationScreen = () => {
    i18n.changeLanguage(language.locale);
    navigation.navigate('CountryLanguageConfirmation', {
      country,
      language,
    })
  }
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <OnboardingContainer>
        <OnboardingStyle
          title={t('selectYourLang').toString()}
          iconname="ic_act_language"
        />

        <SelectionView>
          <FlatList
            data={languages}
            renderItem={renderItem}
            keyExtractor={(item) => item.languageCode.toString()}
          />
        </SelectionView>
        <ShiftFromTopBottom10>
          <BtnMultiple>
            <ButtonviewNext>
              <ButtonviewClick onPress={() => navigation.goBack()}>
                <Icon name="ic_angle_left" size={32} color="#000" />
              </ButtonviewClick>
            </ButtonviewNext>
            {language ? (
              <ButtonviewNext>
                <ButtonviewClick
                  onPress={() => goToConfirmationScreen()}>
                  <Icon name="ic_angle_right" size={32} color="#000" />
                </ButtonviewClick>
              </ButtonviewNext>
            ) : <ButtonviewPrevious>
            <ButtonviewClick
              onPress={() =>{}
              }>
              <Icon name="ic_angle_right" size={32} color="#000" />
            </ButtonviewClick>
          </ButtonviewPrevious>}
          </BtnMultiple>
        </ShiftFromTopBottom10>
      </OnboardingContainer>
    </>
  );
};

export default LanguageSelection;
