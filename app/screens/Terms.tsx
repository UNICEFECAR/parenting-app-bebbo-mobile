import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonPrimary,
  ButtonTermsRow,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import Checkbox, {
  CheckboxActive,
  CheckboxItem,
  FormOuterTermsCheckbox,
} from "@components/shared/CheckboxStyle";
import { LabelTextTerms } from "@components/shared/ChildSetupStyle";
import Icon from "@components/shared/Icon";
import { RootStackParamList } from "@navigation/types";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { appConfig } from "../instance";
import { setAcceptTerms, setTaxonomyIds } from "../redux/reducers/utilsSlice";
import {
  Heading2Centerw,
  ShiftFromTop15,
  SideRightSpacing20,
  SideSpacing10,
} from "@styles/typography";
import { bgcolorWhite2, secondaryBtnColor } from "@styles/style";
import VectorImage from "react-native-vector-image";
import {
  activityLogo,
  adviceLogo,
  toolsLogo,
  bebboLogoShapeNew,
} from "../instance";
const flavor = process.env.FLAVOR || "bebbo";
const BebboLogoShapeNew = require(`../instance/${flavor}/assets/images/logo/bebbo_logo_shape1.svg`);
const BebboLogoShapeMB = require(`../instance/${flavor}/assets/images/logo/bebbo_logo_shape.svg`);
import FeatureTCView from "@components/shared/FeaturesTCView";
import { TERMS_ACCEPTED } from "@assets/data/firebaseEvents";
import { logEvent } from "../services/EventSyncService";
import useNetInfoHook from "../customHooks/useNetInfoHook";

type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChildSetup"
>;

type Props = {
  navigation: TermsNavigationProp;
};
const item = {
  image: flavor == "merhabaBebek" ? BebboLogoShapeMB : BebboLogoShapeNew,
  advice: adviceLogo,
  tools: toolsLogo,
  activity: activityLogo,
};
const styles = StyleSheet.create({
  checkboxStyle: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },

  containerView: {
    backgroundColor: bgcolorWhite2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 25,
    flex: 1,
  },
  containerView2: {
    marginVertical: 25,
    paddingHorizontal: 25,
  },
  privacyText: {
    color: secondaryBtnColor,
    fontWeight: "700",
  },
  scrollViewStyle: {
    padding: 0,
  },
  vectorImageView: {
    marginTop: 20,
  },
  contentDataView: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
  },
});
const Terms = ({ navigation }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const isButtonDisabled = toggleCheckBox == false;
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const netInfo = useNetInfoHook();

  const goToPrivacyPolicy = (): any => {
    navigation.navigate("PrivacyPolicy");
  };
  const goToTerms = (): any => {
    navigation.navigate("TermsPage");
  };

  const dispatch = useAppDispatch();

  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );

  const taxonomyAllData = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData)
      : []
  );
  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
    }, [languageCode])
  );
  useEffect(() => {
    if (taxonomyAllData?.relationship_to_parent) {
      dispatch(setTaxonomyIds(taxonomyAllData));
    }
  }, []);

  console.log(flavor);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch((state: any) => {
          // Remove the home route from the stack
          const routes = state.routes.filter(
            (r: any) => r.name !== "LoadingScreen"
          );

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 500);
    }, [])
  );
  const acceptTermsFlag = useAppSelector(
    (state: any) => state.utilsData.acceptTerms
  );
  const apiJsonData = [
    {
      apiEndpoint: appConfig.apiConfig.taxonomies,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.videoArticles,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.dailyMessages,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.activities,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.surveys,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.milestones,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.childDevelopmentData,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.vaccinations,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.healthCheckupData,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.standardDeviation,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.faqs,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.articles,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    // survey,child dev,vaccine,healthcheckup,growth,activities,
    // pinned for all 4 tools
  ];
  const acceptTerms = async (): Promise<any> => {
    if (acceptTermsFlag == false) {
      dispatch(setAcceptTerms(true));
      const eventData = { name: TERMS_ACCEPTED };
      logEvent(eventData, netInfo.isConnected);
    }
    navigation.navigate("LoadingScreen", {
      apiJsonData: apiJsonData,
      prevPage: "Terms",
    });
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={styles.containerView}>
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <OverlayLoadingComponent loading={loading} />
          <View style={{ marginTop: 30 }}>
            <View style={styles.vectorImageView}>
              {item.image && <VectorImage source={item.image} />}
            </View>
          </View>
          <ShiftFromTop15>
            <Heading2Centerw>{t("walkthroughTextssubtitle0")}</Heading2Centerw>
          </ShiftFromTop15>
          <View style={styles.containerView2}>
            <FeatureTCView
              title={t("walkthroughTextstitle3").toString()}
              subTitle={t("walkthroughTextssubtitle3").toString()}
              iconname={item.advice}
            />
            <FeatureTCView
              title={t("walkthroughTextstitle2").toString()}
              subTitle={t("walkthroughTextssubtitle2").toString()}
              iconname={item.tools}
            />
            <FeatureTCView
              title={t("walkthroughTextstitle1").toString()}
              subTitle={t("walkthroughTextssubtitle1").toString()}
              iconname={item.activity}
            />
          </View>
          <View>
            <SideSpacing10>
              <ButtonTermsRow>
                <FormOuterTermsCheckbox
                  onPress={(): any => {
                    setToggleCheckBox(!toggleCheckBox);
                  }}
                >
                  <CheckboxItem>
                    <View>
                      {toggleCheckBox ? (
                        <CheckboxActive>
                          <Icon name="ic_tick" size={12} color="#fff" />
                        </CheckboxActive>
                      ) : (
                        <Checkbox></Checkbox>
                      )}
                    </View>
                  </CheckboxItem>
                  <SideRightSpacing20>
                    <LabelTextTerms>
                      {t("tNccheckbox2")}{" "}
                      <LabelTextTerms
                        onPress={goToPrivacyPolicy}
                        style={styles.privacyText}
                      >
                        {t("tNcprivacyPolicyTitle")}{" "}
                      </LabelTextTerms>
                      {t("childInfoAndText")}{" "}
                      <LabelTextTerms
                        onPress={goToTerms}
                        style={styles.privacyText}
                      >
                        {t("tNcheader")}
                      </LabelTextTerms>
                      .
                    </LabelTextTerms>
                  </SideRightSpacing20>
                </FormOuterTermsCheckbox>
                <ButtonPrimary
                  disabled={isButtonDisabled}
                  onPress={() => {
                    acceptTerms();
                  }}
                >
                  <ButtonUpperCaseText numberOfLines={2}>
                    {t("continueCountryLang")}
                  </ButtonUpperCaseText>
                </ButtonPrimary>
              </ButtonTermsRow>
            </SideSpacing10>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Terms;
