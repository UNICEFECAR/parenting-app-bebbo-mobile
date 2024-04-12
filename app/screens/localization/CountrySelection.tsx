import { localization } from '@dynamicImportsClass/dynamicImports';
import CountryItem from '@components/CountryItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SelectionView } from '@styles/style';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { receiveAPIFailure } from '../../redux/sagaMiddleware/sagaSlice';
import * as RNLocalize from "react-native-localize";
import { ButtonLinkRow, ButtonPrimary, ButtonUpperCaseText } from '@components/shared/ButtonGlobal';
const CountrySelection = (props: any): any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const dispatch = useAppDispatch();
  const [country, setCountry] = useState<any>();
  const [language, setSelectedLanguage] = useState<any>(null);
  const [luxonLanLocale, setLuxonLanLocale] = useState<any>();
  const [deviceLanCode, setDeviceLangCode] = useState<any>();
  const isVisible = useIsFocused();
  const navigation = useNavigation<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const getCountryData = useAppSelector(
    (state: any) => state.AppLayoutDirectionParams,
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );

  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );

  useEffect(() => {
    if (props.route?.params?.country == country) {
      if (props.route?.params?.language != undefined) {
        setSelectedLanguage(props.route?.params?.language)
      }
    } else {
      setSelectedLanguage(null)
    }
  }, [props.route.params, country])

  useEffect(() => {
    const getSelectedLanguage = (): any => {
      const selectedLanguage = RNLocalize.getLocales(); // Get the locales
      return selectedLanguage[0]?.languageCode || 'en'; // Extract the language code
    };
    const getSelectedCountry = (): any => {
      const selectedLanguage = RNLocalize.getLocales(); // Get the locales
      return selectedLanguage[0]?.languageTag || 'en-Us'; // Extract the language code
    };

    const getCountryByCountryCode = (countryCode: any): any => {
      for (const country of localization) {
        for (const language of country.languages) {
          const [languageCodeFromLuxon, countryCodeFromLuxon] = language.luxonLocale.split('-');
          if (countryCodeFromLuxon === countryCode) {
            return country;
          }
        }
      }
      return null;
    };
    const selectedLanguage = getSelectedLanguage();
    const selectedDefaultCountry = getSelectedCountry();
    setLuxonLanLocale(selectedDefaultCountry)
    setDeviceLangCode(selectedLanguage)

    if (isVisible) {
      let newCountryId: any;
      let newCountryLocale: any;
      if (userIsOnboarded == true) {
        if (props.route.params.country && props.route.params.country != null && props.route.params.country != undefined) {
          newCountryId = props.route.params.country.countryId;
          newCountryLocale = props.route.params.country.luxonLocale;
          setCountry(props.route.params.country)
        } else {
          newCountryId = countryId;
          newCountryLocale = selectedDefaultCountry;
        }
      } else {
        if (props.route.params == undefined) {
          newCountryLocale = selectedDefaultCountry;
          newCountryId = countryId;
        } else {
          //  setCountry(props.route.params.country)
          newCountryId = props.route.params.country.countryId;
          if (props.route.params.language != undefined) {
            newCountryLocale = props.route.params.language.luxonLocale;
          } else {
            newCountryLocale = selectedDefaultCountry;
          }
        }
      }

      const selectedCountry = localization.find(
        (country: any) => country.countryId === newCountryId,
      );
      const foundCountry = getCountryByCountryCode(RNLocalize.getCountry());
      if (foundCountry != undefined && foundCountry != null) {
        if (props.route.params == undefined) {
          setCountry(foundCountry)
        } else {
          setCountry(selectedCountry)
        }
      } else {
        setCountry(selectedCountry)
      }

      const fetchData = async (): Promise<any> => {
        if (userIsOnboarded == false) {
          await userRealmCommon.deleteBy(ChildEntitySchema, "isMigrated == false");
          const data = await dataRealmCommon.deleteAllAtOnce();
          console.log(data, "..newdata..");
         // dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
          const payload = { errorArr: [], fromPage: 'OnLoad' }
          dispatch(receiveAPIFailure(payload));
        }
      }
      fetchData()

    }

  }, [isVisible, props.route.params]);
  const renderItem = ({ item }: any): any => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );

  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <OnboardingContainer>
        <Pressable
            onPress={(e: any): any => {
              console.log('Back icon click')
              navigation.navigate('CountryLanguageConfirmation')
            }}
          >
          <OnboardingStyle
            title={t('selectYourCountry').toString()}
            iconname="ic_back"
          />
          </Pressable>

          <SelectionView>
            {userIsOnboarded == true ?
              <FlatList
                data={localization}
                renderItem={renderItem}
                keyExtractor={(item): any => item.countryId.toString()}
              /> :
              <FlatList
                inverted
                data={localization}
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                renderItem={renderItem}
                keyExtractor={(item): any => item.countryId.toString()}
              />}
          </SelectionView>
          {/* {country ? (
            <ButtonSection>
              <ShiftFromTopBottom10>
                <ButtonviewNext>
                  <ButtonviewClick
                    onPress={(): any => {

                      props.navigation.navigate('LanguageSelection', { country: country, language: language, luxonlocale: luxonLanLocale != undefined ? luxonLanLocale : null, deviceLanCode: deviceLanCode != undefined ? deviceLanCode : null })
                    }
                    }>
                    <IconML name="ic_angle_right" size={32} color="#000" />
                  </ButtonviewClick>
                </ButtonviewNext>
              </ShiftFromTopBottom10>
            </ButtonSection>
          ) : (
            <ButtonviewPrevious>
              <ButtonviewClick onPress={(): any => {
                console.log("pressed")
              }}>
                <IconML name="ic_angle_right" size={32} color="#000" />
              </ButtonviewClick>
            </ButtonviewPrevious>
          )} */}
        <ButtonLinkRow>
          
              <ButtonPrimary onPress={():any =>{
                props.navigation.navigate('LanguageSelection', { country: country, language: language, luxonlocale: luxonLanLocale != undefined ? luxonLanLocale : null, deviceLanCode: deviceLanCode != undefined ? deviceLanCode : null })
              }}>
                <ButtonUpperCaseText numberOfLines={2}>{t('continueCountryLang')}</ButtonUpperCaseText>
              </ButtonPrimary>
            </ButtonLinkRow>
        </OnboardingContainer>
      
      </>
    </>
  );
};

export default CountrySelection;
