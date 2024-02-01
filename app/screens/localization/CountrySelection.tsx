import { localization } from '@dynamicImportsClass/dynamicImports';
import CountryItem from '@components/CountryItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonSection,
  ButtonviewClick,
  ButtonviewNext,
  ButtonviewPrevious
} from '@components/shared/ButtonView';
import { IconML } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { useIsFocused } from '@react-navigation/native';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, NativeModules, Platform } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setSponsorStore } from '../../redux/reducers/localizationSlice';
import { receiveAPIFailure } from '../../redux/sagaMiddleware/sagaSlice';
import * as RNLocalize from "react-native-localize";
const CountrySelection = (props: any): any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const dispatch = useAppDispatch();
  const [country, setCountry] = useState<any>();
  const [luxonLanLocale, setLuxonLanLocale] = useState<any>();
  const [deviceLanCode, setDeviceLangCode] = useState<any>();
  const isVisible = useIsFocused();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );

  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );


  useEffect(() => {
    console.log('params data is', props)
    console.log('All logs is here')
    console.log('All Data from Device locales', RNLocalize.getLocales());
    console.log('Country is', RNLocalize.getCountry());
    console.log('CountryId is', RNLocalize.getCountry());
    const getSelectedLanguage = ():any => {
      const selectedLanguage = RNLocalize.getLocales(); // Get the locales
      return selectedLanguage[0]?.languageCode || 'en'; // Extract the language code
    };
    const getSelectedCountry = ():any => {
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
        } else {
          newCountryId = countryId;
          newCountryLocale = selectedDefaultCountry;
        }
      } else {
        if (props.route.params == undefined) {
          newCountryLocale = selectedDefaultCountry;
          newCountryId = countryId;
        } else {
          newCountryId = props.route.params.country.countryId;
          newCountryLocale = props.route.params.country.luxonLocale;
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
        console.log('Luxon locale not found in the provided data', selectedCountry);
        setCountry(selectedCountry)
      }

      const fetchData = async (): Promise<any> => {
        if (userIsOnboarded == false) {
          await userRealmCommon.deleteBy(ChildEntitySchema, "isMigrated == false");
          const data = await dataRealmCommon.deleteAllAtOnce();
          console.log(data, "..newdata..");
          dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
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
          <OnboardingStyle
            title={t('selectYourCountry').toString()}
            iconname="ic_country"
          />

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
          {country ? (
            <ButtonSection>
              <ShiftFromTopBottom10>
                <ButtonviewNext>
                  <ButtonviewClick
                    onPress={(): any => {

                      props.navigation.navigate('LanguageSelection', { country: country, languagenew: props.route.params && props.route.params.language ? props.route.params.language : null, luxonlocale: luxonLanLocale != undefined ? luxonLanLocale : null, deviceLanCode: deviceLanCode != undefined ? deviceLanCode : null })
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
          )}
        </OnboardingContainer>
      </>
    </>
  );
};

export default CountrySelection;
