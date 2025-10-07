import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ButtonArticlesTint,
  ButtonColTwo,
  ButtonContainerTwo,
  ButtonTertiary,
  ButtonText,
} from "@components/shared/ButtonGlobal";
import WalkthroughContainer, {
  Slide,
  WalkBtn,
  WalkthroughContentArea,
  WalkthroughImagebox,
  WalkthroughImageContainer,
  WalkthroughSubtext,
  WalkthroughTitle,
} from "@components/shared/WalkthroughStyle";
import { RootStackParamList } from "@navigation/types";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import LinearGradient from "react-native-linear-gradient";
import VectorImage from "react-native-vector-image";
import { ThemeContext } from "styled-components/native";
import { bebboLogoShape } from "@dynamicImportsClass/dynamicImports";
import { bgcolorWhite2, childListBgColor, secondaryColor } from "../instances/bebbo/styles/style";
type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChildSetup"
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};
const styles = StyleSheet.create({
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
    fontSize: 42,
    lineHeight: 45,
    marginBottom: 20,
    textAlign: "center",
  },
  vectorImage: { height: 130, width: 130 },
  walkButton: { flex: 1, flexDirection: "column", justifyContent: "flex-end" },
});

const Walkthrough = ({ navigation }: Props): any => {
  const { t } = useTranslation();
  let slider = useRef<any>(null);
  const data = [
    {
      title: t("walkthroughTextstitle0"),
      image: bebboLogoShape,
      colors: ["#2B2F84", "#1F50A0", secondaryColor],
      textcolor: "#FFF",
      subtitle: t("walkthroughTextssubtitle0"),
    },
    {
      title: t("walkthroughTextstitle1"),
      image: require("@assets/svg/ic_activity_color.svg"),
      colors: ["#0FD87E", "#CFF7E5"],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle1"),
    },
    {
      title: t("walkthroughTextstitle2"),
      image: require("@assets/svg/ic_tools_color.svg"),
      colors: ["#00AEEF", "#50C7F3", "#97DEF8", childListBgColor],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle2"),
    },
    {
      title: t("walkthroughTextstitle3"),
      image: require("@assets/svg/ic_article_color.svg"),
      colors: ["#FF8D6B", "#FFD2C4"],
      textcolor: "#000",
      subtitle: t("walkthroughTextssubtitle3"),
    },
  ];
  type Item = (typeof data)[0];
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
                  <VectorImage source={item.image} />
                ) : index == 1 ? (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={styles.vectorImage}
                    />
                  </WalkthroughImagebox>
                ) : index == 2 ? (
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

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.SECONDARY_COLOR;
  const [showPrevbtn, setShowPrevbtn] = useState(false);
  const [isDotsRequired, setIsDotsRequired] = useState(true);
  const [statubarColor, setstatubarColor] = useState(headerColor);
  const getDotStyle = (colorString: string): any => {
    return isDotsRequired
      ? { backgroundColor: colorString }
      : { backgroundColor: "transparent" };
  };
  const onSlideChange = (index: number): any => {
    index == 3 ? setShowPrevbtn(true) : setShowPrevbtn(false);
    index == 3 ? setIsDotsRequired(false) : setIsDotsRequired(true);
    index == 0
      ? setstatubarColor("#00AEEF")
      : index == 1
      ? setstatubarColor("#0FD87E")
      : index == 2
      ? setstatubarColor("#00AEEF")
      : index == 3
      ? setstatubarColor("#FF8D6B")
      : setstatubarColor(headerColor);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log("showPrevbtn--", showPrevbtn);
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
      }, 500);
    }, [])
  );
  const onDone = (): any => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    navigation.navigate("Terms");
  };
  const goBackSlide = (): any => {
    slider?.goToSlide(2, true);
  };
  const _renderPagination = (activeIndex: number): any => {
    return (
      <View style={styles.paginationContainer}>
        <View>
          {activeIndex != 3 ? (
            <View style={styles.paginationDots}>
              {data.length > 1 &&
                data.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex
                        ? getDotStyle("black")
                        : getDotStyle("white"),
                    ]}
                    onPress={(): any => slider?.goToSlide(i, true)}
                  />
                ))}
            </View>
          ) : null}
          {activeIndex == 3 ? (
            <WalkBtn style={styles.walkButton}>
              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonArticlesTint onPress={goBackSlide}>
                    <ButtonText numberOfLines={2}>
                      {t("walkthroughButtonBack")}
                    </ButtonText>
                  </ButtonArticlesTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonTertiary onPress={onDone}>
                    <ButtonText numberOfLines={2}>
                      {t("walkthroughButtonNext")}
                    </ButtonText>
                  </ButtonTertiary>
                </ButtonColTwo>
              </ButtonContainerTwo>
            </WalkBtn>
          ) : null}
        </View>
      </View>
    );
  };
  const keyExtractor = (item: Item): any => item.title;
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={statubarColor} />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={({ item, index }: any): any => renderItem(item, index)}
        dotClickEnabled
        activeDotStyle={getDotStyle("black")}
        dotStyle={getDotStyle("white")}
        showSkipButton={false}
        showPrevButton={false}
        showNextButton={false}
        showDoneButton={false}
        data={data}
        onDone={onDone}
        onSlideChange={onSlideChange}
        renderPagination={_renderPagination}
        ref={(ref): any => (slider = ref!)}
      />
    </>
  );
};

export default Walkthrough;
