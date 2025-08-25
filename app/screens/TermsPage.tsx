import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { ChildAddTop } from "@components/shared/ChildSetupStyle";
import Icon from "@components/shared/Icon";
import OnboardingContainer from "@components/shared/OnboardingContainer";
import OnboardingHeading from "@components/shared/OnboardingHeading";
import iframe from "@native-html/iframe-plugin";
import { RootStackParamList } from "@navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { bgcolorWhite2, primaryColor } from "../instances/bebbo/styles/style";
import { Heading1w, ShiftFromTop5 } from "../instances/bebbo/styles/typography";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../App";
import RenderImage from "../services/RenderImage";
import { addSpaceToHtml } from "../services/Utils";
type TermsPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChildSetup"
>;
type Props = {
  navigation: TermsPageNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: primaryColor,
    flex: 1,
  },
  htmlStyle: {
    color: bgcolorWhite2,
    fontSize: 16,
  },
  scrollViewStyle: {
    padding: 0,
  },
});
const TermsPage = ({ navigation }: Props): any => {
  const { t } = useTranslation();
  const termsdata = useAppSelector((state: any) => state.utilsData.terms.body);
  const { width } = useWindowDimensions();
  useFocusEffect(
    React.useCallback(() => {
      const backAction = (): any => {
        navigation.goBack();
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
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer style={styles.containerView}>
          <OnboardingHeading>
            <ChildAddTop>
              <Heading1w style={{ color: "#fff" }}>{t("tNcheader")}</Heading1w>
              <ShiftFromTop5>
                <Pressable
                  onPress={(): any => {
                    navigation.goBack();
                  }}
                >
                  <Icon name="ic_close" size={20} color="#FFF" />
                </Pressable>
              </ShiftFromTop5>
            </ChildAddTop>
          </OnboardingHeading>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            {termsdata != "" ? (
              <HTML
                contentWidth={width}
                source={{ html: addSpaceToHtml(termsdata) }}
                baseStyle={styles.htmlStyle}
                ignoredStyles={["color", "fontSize", "fontFamily"]}
                tagsStyles={{
                  p: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h1: { marginBottom: 0, marginTop: 10, textAlign: "left" },
                  h2: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h3: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h4: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h5: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h6: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  span: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  br: { height: 0 },
                  img: { maxWidth: Dimensions.get("window").width - 50 },
                  iframe: { maxWidth: "100%", height: 200 },
                }}
                renderers={{
                  iframe,
                  // img:(attribs:any):any => {
                  //   const imagePath:any = attribs.src;
                  //   console.log(imagePath,"..imagePath");
                  //   if(imagePath!="" && imagePath!=null && imagePath!=undefined){
                  //   const itemnew:any={
                  //     cover_image:{
                  //       url:imagePath
                  //     }
                  //   };
                  //     return (
                  //       <RenderImage key={imagePath+"/"+Math.random()} uri={imagePath} itemnew={itemnew} toggleSwitchVal={toggleSwitchVal} />

                  //    );
                  //   }
                  // },
                }}
                WebView={() => (
                  <WebView renderToHardwareTextureAndroid={true} />
                )}
                renderersProps={{
                  iframe: { webViewProps: { allowsFullscreenVideo: true } },
                }}
              />
            ) : null}
          </ScrollView>
        </OnboardingContainer>
      </View>
    </>
  );
};

export default TermsPage;
