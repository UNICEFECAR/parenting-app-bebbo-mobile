import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { FlexCol } from "@components/shared/FlexBoxStyle";
import WalkthroughContainer, {
  Slide,
  WalkthroughContentArea,
  WalkthroughImagebox,
  WalkthroughImageContainer,
  WalkthroughSubtext,
  WalkthroughTitle,
} from "@components/shared/WalkthroughStyle";
import TabScreenHeader from "@components/TabScreenHeader";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import LinearGradient from "react-native-linear-gradient";
import VectorImage from "react-native-vector-image";
import { ThemeContext } from "styled-components/native";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  bgcolorWhite,
  bgcolorWhite2,
  buttonBg,
} from "../../instances/bebbo/styles/style";
type DashboardNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: DashboardNavigationProp;
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: buttonBg,
    borderRadius: 24,
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
  },

  buttonText: {
    color: bgcolorWhite,
    fontWeight: "600",
    textAlign: "center",
  },
  dot: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 4,
    width: 10,
  },
  flex1: { flex: 1 },
  paginationContainer: {
    bottom: 16,
    left: 16,
    position: "absolute",
    right: 16,
  },
  paginationDots: {
    alignItems: "center",
    flexDirection: "row",
    height: 16,
    justifyContent: "center",
    margin: 16,
  },
  title: {
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  titleText: {
    color: bgcolorWhite2,
    fontFamily: "roboto-bold",
    fontSize: 48,
    marginBottom: 20,
    textAlign: "center",
  },
  vectorImage: { height: 130, width: 130 },
});

const UserGuide = (): any => {
  const { t } = useTranslation();
  const data = [
    {
      title: t("walkthroughTextstitle1"),
      image: require("@images/ic_activity_color.svg"),
      colors: ["#0FD87E", "#CFF7E5"],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle1"),
    },
    {
      title: t("walkthroughTextstitle2"),
      image: require("@images/ic_tools_color.svg"),
      colors: ["#00AEEF", "#50C7F3", "#97DEF8", "#B3E7FA"],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle2"),
    },
    {
      title: t("walkthroughTextstitle3"),
      image: require("@images/ic_article_color.svg"),
      colors: ["#FF8D6B", "#FFD2C4"],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle3"),
    },
  ];
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const headerTextColor = themeContext?.colors.PRIMARY_BLUE_TEXTCOLOR;
  const [profileLoading, setProfileLoading] = React.useState(false);
  type Item = (typeof data)[0];
  const keyExtractor = (item: Item): any => item.title;
  const [isDotsRequired, setIsDotsRequired] = useState(true);
  const getDotStyle = (colorString: string): any => {
    return isDotsRequired
      ? { backgroundColor: colorString }
      : { backgroundColor: "transparent" };
  };
  const renderItem = (item: (typeof data)[0], index: number): any => {
    return (
      <>
        <WalkthroughContainer>
          <LinearGradient
            style={styles.flex1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={item.colors}
          >
            <Slide>
              <WalkthroughImageContainer>
                {index == 0 ? (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={styles.vectorImage}
                    />
                  </WalkthroughImagebox>
                ) : index == 1 ? (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={styles.vectorImage}
                    />
                  </WalkthroughImagebox>
                ) : (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={styles.vectorImage}
                    />
                  </WalkthroughImagebox>
                )}
              </WalkthroughImageContainer>
              <WalkthroughContentArea>
                <WalkthroughTitle
                  style={[styles.titleText, { color: item.textcolor }]}
                >
                  {item.title}
                </WalkthroughTitle>
                <WalkthroughSubtext
                  style={[styles.title, { color: item.textcolor }]}
                >
                  {item.subtitle}
                </WalkthroughSubtext>
              </WalkthroughContentArea>
            </Slide>
          </LinearGradient>
        </WalkthroughContainer>
      </>
    );
  };
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <TabScreenHeader
          title={t("userGuideheaderTitle")}
          headerColor={headerColor}
          textColor={headerTextColor}
          setProfileLoading={setProfileLoading}
        />

        <FlexCol>
          <AppIntroSlider
            keyExtractor={keyExtractor}
            // renderItem={renderItem}
            renderItem={({ item, index }: any): any => renderItem(item, index)}
            // bottomButton
            dotClickEnabled
            showDoneButton={false}
            activeDotStyle={getDotStyle("black")}
            dotStyle={getDotStyle("white")}
            showSkipButton={false}
            showPrevButton={false}
            showNextButton={false}
            data={data}
          />
        </FlexCol>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default UserGuide;
