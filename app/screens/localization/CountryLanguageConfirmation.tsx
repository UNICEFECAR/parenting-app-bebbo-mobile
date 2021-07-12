import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {

    ButtonLinkText,
    ButtonPrimary,
    ButtonText,
    ButtonTextLg
} from '@components/shared/ButtonGlobal';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import OnboardingContainer, {
    LocalizationAction,
    LocalizationCol,
    LocalizationContainer,
    LocalizationcontentHead,
    LocalizationcontentResult,
    LocalizationRow,
    OnboardingconfirmationHead,
    OnboardingContent,
    OnboardingshiftHead
} from '@components/shared/OnboardingContainer';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    Heading2Centerw,
    Heading3,
    Heading3Centerw,
    Heading3Regular
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch } from '../../../App';
import { appConfig } from '../../assets/translations/appOfflineData/apiConstants';
import { onLocalizationSelect } from '../../redux/reducers/localizationSlice';
import { fetchAPI } from '../../redux/sagaMiddleware/sagaActions';

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
  //console.log(country, language);
  const apiJsonData = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
  ];
  const {t, i18n} = useTranslation();
  const saveSelection = () => {
    // i18n.changeLanguage(language.locale);
    //console.log(i18n.language);
    dispatch(onLocalizationSelect(route.params));
    dispatch(
      fetchAPI(apiJsonData, 'CountryLanguageSelection', dispatch, navigation),
    );
    // dispatch(onLanguageSelect(language));
    navigation.reset({
      index: 0,
      routes: [{name: 'Walkthrough'}],
    });
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'HomeDrawerNavigator',
    //     },
    //   ],
    // });
    // navigation.navigate('Walkthrough');
  };

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <OnboardingContainer>
        <OnboardingconfirmationHead>
          <Icon name="ic_country" size={100} color="#FFF" />
          <OnboardingshiftHead>
            <Heading2Centerw>{t('countryLangSelection')}</Heading2Centerw>
          </OnboardingshiftHead>
          <Heading3Centerw>{t('checkonce')}</Heading3Centerw>
        </OnboardingconfirmationHead>

        <OnboardingContent>
          <LocalizationContainer>
            <LocalizationRow>
              <LocalizationCol>
                <LocalizationcontentHead>
                  <Heading3Regular>{t('country')}</Heading3Regular>
                </LocalizationcontentHead>
                <LocalizationcontentResult>
                  <Heading3>{country.displayName}</Heading3>
                </LocalizationcontentResult>
              </LocalizationCol>

              <LocalizationCol>
                <LocalizationcontentHead>
                  <Heading3Regular>{t('language')}</Heading3Regular>
                </LocalizationcontentHead>
                <LocalizationcontentResult>
                  <Heading3>{language.displayName}</Heading3>
                </LocalizationcontentResult>
              </LocalizationCol>

              <LocalizationAction>
                <ButtonLinkText
                  onPress={() => navigation.navigate('CountrySelection')}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_edit" size={16} color="#000" />
                    </OuterIconLeft>
                    <ButtonTextLg>{t('editCountryLang')}</ButtonTextLg>
                  </OuterIconRow>
                </ButtonLinkText>
              </LocalizationAction>
            </LocalizationRow>
            <Flex1>
              <ButtonPrimary onPress={() => saveSelection()}>
                <ButtonText>{t('continueCountryLang')}</ButtonText>
              </ButtonPrimary>
            </Flex1>
          </LocalizationContainer>
        </OnboardingContent>
      </OnboardingContainer>
    </>
  );
};

export default CountryLanguageConfirmation;
