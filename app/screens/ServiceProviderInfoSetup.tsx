import { ONBOARDING_CHILD_COUNT } from "@assets/data/firebaseEvents";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonPrimary,
  ButtonText,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import {
  ChildCenterView,
  ChildColArea1,
  ChildColArea2,
  ChildListAction,
  ChildListingBox,
  ChildListTitle,
} from "@components/shared/ChildSetupStyle";
import Icon from "@components/shared/Icon";
import OnboardingContainer from "@components/shared/OnboardingContainer";
import OnboardingHeading from "@components/shared/OnboardingHeading";
import { RootStackParamList } from "@navigation/types";
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  bgcolorWhite2,
  primaryColor,
  secondaryBtnColor,
} from "../instances/bebbo/styles/style";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { ChildEntity } from "../database/schema/ChildDataSchema";
import {
  apiJsonDataGet,
  deleteChild,
  getAge,
  getAllChildren,
  getAllConfigData,
  isFutureDate,
} from "../services/childCRUD";
import { formatDate, notiPermissionUtil } from "../services/Utils";
import {
  Heading1Centerw,
  Heading3Centerw,
  Heading5,
  ShiftFromTop30,
} from "../instances/bebbo/styles/typography";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import { logEvent } from "../services/EventSyncService";
import { FlexCol } from "@components/shared/FlexBoxStyle";
import { selectChildAge, selectChildList } from "../services/selectors";
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddSiblingDataScreen"
>;
type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  autoHeight: { height: "auto" },
  containerView: {
    backgroundColor: primaryColor,
    flex: 1,
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "normal",
  },
  touchableLeft: {
    marginLeft: 2,
    padding: 8,
  },
  touchableRight: {
    marginRight: 2,
    padding: 8,
  },
  listBgColor: {
    backgroundColor: "red",
  },
  babyImageContainer: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    borderColor: secondaryBtnColor,
    borderWidth: 2,
    marginVertical: 30,
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    backgroundColor: bgcolorWhite2,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
});
const ServiceProviderInfoSetup = ({ navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [parentViewHeight, setParentViewheight] = useState(0);
  const isFocused = useIsFocused();
  const childAge = useAppSelector(selectChildAge);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const childList = useAppSelector(selectChildList);
  const onLayout = (event: any): any => {
    setParentViewheight(event.nativeEvent.layout.height);
  };
  useEffect(() => {
    if (isFocused) {
      getAllChildren(dispatch, childAge, 0);
      getAllConfigData(dispatch);
      notiPermissionUtil();
      setTimeout(() => {
        navigation.dispatch((state) => {
          // Remove the home route from the stack
          const routes = state.routes.filter((r) => r.name !== "LoadingScreen");

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 100);
    }
  }, [isFocused]);
  useFocusEffect(
    React.useCallback(() => {
      const backAction = (): any => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      navigation.addListener("gestureEnd", backAction);
      return (): any => {
        navigation.removeListener("gestureEnd", backAction);
        backHandler.remove();
      };
    }, [])
  );

  const childSetup = async (): Promise<any> => {
    // const Ages = await getAge(childList, childAge);
    // let apiJsonData;
    // if (Ages?.length > 0) {
    //   apiJsonData = apiJsonDataGet(String(Ages), "all")
    // }
    // else {
    //   apiJsonData = apiJsonDataGet("all", "all")
    // }
    const apiJsonData = apiJsonDataGet("all");
    const eventData = {
      name: ONBOARDING_CHILD_COUNT,
      params: { child_count: childList?.length },
    };
    logEvent(eventData, netInfo.isConnected);

    navigation.reset({
      index: 0,
      routes: [
        {
          name: "LoadingScreen",
          params: { apiJsonData: apiJsonData, prevPage: "ChildSetup" },
        },
      ],
    });
  };

  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer>
          <OverlayLoadingComponent loading={loading} />
          <OnboardingHeading>
            <ChildCenterView>
              <Heading1Centerw>
                {t("serviceProviderHeaderInfoText")}
              </Heading1Centerw>
              <ShiftFromTop30>
                <Heading3Centerw>
                  {t("serviceProviderHeaderSubInfoText")}
                </Heading3Centerw>
              </ShiftFromTop30>
            </ChildCenterView>
          </OnboardingHeading>
          <FlexCol>
            <View style={styles.babyImageContainer}>
              <Icon name="ic_baby_girl" size={90} color="#000" />
            </View>
            <View onLayout={onLayout} style={{ flexDirection: "column" }}>
              <ButtonPrimary
                onPress={(e: any): any => {
                  e.stopPropagation();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    childSetup();
                  }, 0);
                }}
              >
                <ButtonUpperCaseText numberOfLines={2}>
                  {t("letGetStartedText")}
                </ButtonUpperCaseText>
              </ButtonPrimary>
            </View>
          </FlexCol>
        </OnboardingContainer>
      </View>
    </>
  );
};

export default ServiceProviderInfoSetup;
