import {initialLanguage} from "../../services/initialLanguage";
import {useCommittedRef} from "../../customHooks/useCommittedRef";
import {CommonActions} from "@react-navigation/native";
import {applyLanguageDirection} from "../../localization/layoutDirection";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import LanguageItem from "@components/LanguageItem";
import OnboardingContainer from "@components/shared/OnboardingContainer";
import OnboardingStyle from "@components/shared/OnboardingStyle";
import { LocalizationStackParamList, RootStackParamList } from "@navigation/types";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SelectionViewLang } from "@styles/style";
import { useContext, useEffect, useState } from "react";
import { dataRealmCommon } from "../../database/dbquery/dataRealmCommon";
import { receiveAPIFailure } from "../../redux/sagaMiddleware/sagaSlice";
import { useTranslation } from "react-i18next";
import {Alert, FlatList, Pressable} from 'react-native';
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../App";
import {
  onLocalizationSelect,
  setSponsorStore,
} from "../../redux/reducers/localizationSlice";
import { appConfig, localization } from "../../instances";
import { Flex5 } from "@components/shared/FlexBoxStyle";
import {
  ButtonPrimary,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import "moment/min/locales";
import "moment/locale/bn-bd"; // import for bangla language
import "moment/locale/bn"; // import for bangla language
import "moment/locale/sq";
import "moment/locale/sr";
import "moment/locale/tr";
import { getLanguageCode } from "../../services/Utils";
import { recordError, setUserProperties } from "../../services/firebaseAnalytics";
import { selectAllCountries } from "../../services/selectors";
type LanguageSelectionNavigationProp = CompositeNavigationProp<
  StackNavigationProp<LocalizationStackParamList, "LanguageSelection">,
  StackNavigationProp<RootStackParamList>
>;
type Props = {
  navigation: LanguageSelectionNavigationProp;
  route: any;
};
const LanguageSelection = ({ route, navigation }: Props): any => {
  const [language, setLanguage] = useState<any>();
  const allCountries = useAppSelector(selectAllCountries);
  let country: any;
  if (
    appConfig.buildFor == appConfig.buildForFoleja &&
    (route.params == null ||
      route.params == undefined ||
      route.params?.country == null)
  ) {
    console.log("in if--");
    country = allCountries[allCountries.length - 1];
  } else {
    country = route?.params?.country;
  }
  const [sponsorsData, setSponsorsData] = useState<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId
  );
  const userIsOnboarded = useAppSelector(
    (state: any) => state.utilsData.userIsOnboarded
  );
  const languages = country?.languages;
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const isVisible = useIsFocused();
  useAppSelector((state:any)=>state.selectedCountry.languageCode);


  useIsFocused();
  const incrementalSyncDT = useAppSelector(
    (state: any) => state.utilsData.incrementalSyncDT
  );
  const apiJsonData = [
    {
      apiEndpoint: appConfig.apiConfig.taxonomies,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.basicPages,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
  ];

  const locale = useAppSelector((state: any) => state.selectedCountry.locale);
  // Re-read route defaults without resetting an explicit caregiver selection during editing.
  const languageDefaults = useCommittedRef(() => ({languages, luxonLocale: route?.params?.luxonlocale, deviceCode: route?.params?.deviceLanCode}));
  useEffect(() => {
    const inputs = languageDefaults.current();
    setLanguage(initialLanguage(route?.params?.language, inputs.languages, inputs.luxonLocale, inputs.deviceCode,
      String(appConfig.buildFor) === String(appConfig.buildForFoleja)));
  }, [route?.params?.language, languageDefaults]);
  // Keep current inputs for this focus/selection command without resetting drafts on metadata writes.
  const languageChoiceInputs = useCommittedRef(() => ({allCountries, countryId, dispatch, route, userIsOnboarded}));
  useEffect(() => {
    const {allCountries: inputAllCountries, countryId: inputCountryId, dispatch: inputDispatch, route: inputRoute, userIsOnboarded: inputUserIsOnboarded} = languageChoiceInputs.current();

    if (isVisible) {
      let newCountryId: any;

      if (inputUserIsOnboarded == true) {
        if (
          inputRoute.params.country &&
          inputRoute.params.country != null &&
          inputRoute.params.country != undefined
        ) {
          newCountryId = inputRoute.params.country?.countryId;
        } else {
          newCountryId = inputCountryId;
        }
      } else {
        if (Object.keys(inputRoute.params ?? {}).length === 0) {
          newCountryId = inputCountryId;
        } else {
          if (inputRoute.params != undefined) {
            newCountryId = inputRoute.params?.country?.countryId;
          } else {
            newCountryId = inputCountryId;
          }
        }
      }
      const fetchData = async (): Promise<any> => {
        if (inputUserIsOnboarded == false && inputRoute.params?.isDirect) {
          // A lost onboarding flag must never delete caregiver-created profiles.
          // isMigrated identifies imported records, not disposable setup data.
          const data = await dataRealmCommon.deleteAllAtOnce();
          console.log(data, "..newdata..");
          // dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
          const payload = { errorArr: [], fromPage: "OnLoad" };
          inputDispatch(receiveAPIFailure(payload));
        }
      };
      fetchData();

      const selectedCountry = inputAllCountries.find(
        (country: any) => country.CountryID == newCountryId
      );

      // const countrySponsorsData = allCountries.find(
      //   (country: any) => country.id === selectedCountry.CountryID,
      // )
      console.log("selectedCountry country is", selectedCountry);
      setSponsorsData(inputRoute?.params?.country);
    }
  }, [isVisible, languageChoiceInputs]);
  const renderItem = ({ item, index }: any): any => (
    <LanguageItem
      item={item}
      index={index}
      currentItem={language}
      setLanguage={setLanguage}
    />
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const rtlConditions = async (language: any): Promise<any> => {
    try {
      moment.locale(getLanguageCode(language?.languageCode));
      await i18n.changeLanguage(language?.locale || "en");

      if (
        userIsOnboarded === true &&
        language?.locale === locale &&
        (route.params?.country?.CountryID ??
          route.params?.country?.countryId ??
          country?.CountryID ??
          country?.countryId) === countryId
      ) {
        if (await applyLanguageDirection(language, { screen: "HomeDrawerNavigator" }))
          return;
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "HomeDrawerNavigator",
            },
          ],
        }));
      } else {
        console.log(language, "..newLanguage");
        if (Object.keys(route.params ?? {}).length !== 0) {
          console.log(route.params?.country?.CountryID, "routeparams is");
          const filteredLan = route.params?.country?.languages?.filter(
            (lang: any) => lang?.locale === language?.locale
          );
          console.log("filtered language is", filteredLan);
          dispatch(
            onLocalizationSelect({
              languages: filteredLan,
              countryId: route.params.country?.CountryID,
            })
          );
          dispatch(setInfoModalOpened({ key: "dailyMessageNotification", value: "" }));
          try {
            await setUserProperties({
              country: route.params?.country?.name,
              language: language?.displayName,
            });
          } catch (error) {
            console.error("Error setting user properties:", error);
          }
        } else {
          console.log(country, "countryData");
          dispatch(onLocalizationSelect(country));
          dispatch(setInfoModalOpened({ key: "dailyMessageNotification", value: "" }));
          try {
            await setUserProperties({
              country: country?.displayName,
              language: language?.displayName,
            });
          } catch (error) {
            console.error("Error setting user properties:", error);
          }
        }

        // if (userIsOnboarded == true) {
        //   dispatch(setSponsorStore({ country_national_partner: null, country_sponsor_logo: null }));
        // }
        dispatch(setSponsorStore(sponsorsData));
        const params = {
          apiJsonData:
            userIsOnboarded == true
              ? appConfig.allApisObject(false, incrementalSyncDT)
              : apiJsonData,
          prevPage:
            userIsOnboarded == true ? "CountryLangChange" : "CountryLanguageSelection",
        };
        console.log(params, "Sponsors Data for countryList", sponsorsData, userIsOnboarded);
        if (await applyLanguageDirection(language, { screen: "LoadingScreen", params }))
          return;
        navigation.navigate("LoadingScreen", params);
      }
    } catch (error) {
      console.error("Unable to apply selected language", error);
      Alert.alert("", t("generalError"));
    }
  };
  const goToConfirmationScreen = (): any => {
    let newLanguage: any = null;
    if (language?.locale != undefined) {
      newLanguage = language;
    } else if (Array.isArray(language) && language.length > 0) {
      newLanguage = language[0];
    } else {
      // throw new Error('Language is not defined or empty'); when we have error handling if language is undefined or empty
      recordError(
        "Language is not defined or empty" + JSON.stringify(language)
      );
      console.log("Language is not defined or empty");

      return;
    }
    i18n
      .changeLanguage(newLanguage?.locale || "en")
      .then(() => {
        if (
          route.params?.country?.CountryID == appConfig.restOfTheWorldCountryId
        ) {
          const rotwLanguagelocaleen =
            localization[localization.length - 1]?.languages[0]?.locale;
          const rotwLanguagelocaleru =
            localization[localization.length - 1]?.languages[1]?.locale;
          console.log("rest of the world title", newLanguage);
          console.log(
            "rotwLanguagelocaleru of the world title",
            rotwLanguagelocaleru
          );
          if (
            newLanguage?.locale == rotwLanguagelocaleen ||
            newLanguage?.locale == rotwLanguagelocaleru
          ) {
            // The hook's t may still be bound to the previous locale in this callback.
            const alertT = i18n.getFixedT(newLanguage?.locale || "en");
            Alert.alert(
              alertT("restOfTheWorldAlertTitle"),
              alertT("restOfTheWorldAlertText"),
              [
                {
                  text: alertT("restOfTheWorldOkTitle"),
                  onPress: async (): Promise<any> => {
                    rtlConditions(newLanguage);
                  },
                },
              ]
            );
          } else {
            rtlConditions(newLanguage);
          }
        } else {
          rtlConditions(newLanguage);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer>
          <Pressable
            onPress={(_e: any): any => {
              console.log("Back icon click");
              if (route?.params?.isSetting) {
                navigation?.goBack();
              } else {
                route?.params?.isFromCountry
                  ? navigation.navigate("CountryLanguageConfirmation")
                  : navigation.navigate("CountrySelection", {
                      country,
                      language,
                    });
              }
            }}
          >
            <OnboardingStyle
              title={t("selectYourLang").toString()}
              iconname="ic_back"
            />
          </Pressable>

          <SelectionViewLang>
            <FlatList
              data={languages}
              renderItem={renderItem}
              keyExtractor={(item): any => item.languageCode.toString()}
            />
          </SelectionViewLang>

          <Flex5>
            <ButtonPrimary onPress={(): any => goToConfirmationScreen()}>
              <ButtonUpperCaseText numberOfLines={2}>
                {t("continueCountryLang")}
              </ButtonUpperCaseText>
            </ButtonPrimary>
          </Flex5>
        </OnboardingContainer>
      </>
    </>
  );
};

export default LanguageSelection;
