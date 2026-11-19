import {useLandscapeChart} from "../../customHooks/useLandscapeChart";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import GrowthChart, { chartTypes } from "@components/growth/GrowthChart";
import { MainContainer } from "@components/shared/Container";
import { FlexCol, FlexFDirRowSpace } from "@components/shared/FlexBoxStyle";
import Icon from "@components/shared/Icon";
import { RootStackParamList } from "@navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  bgcolorWhite,
  bgcolorWhite2,
} from "@styles/style";
import { Heading2 } from "@styles/typography";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemeContext } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: bgcolorWhite,
    flexDirection: "column",
  },
  mainView: { backgroundColor: bgcolorWhite2, flex: 1 },
  padding12: { padding: 12 },
});
export const ChartFullScreen = ({ route, navigation }: Props): any => {
  const { activeChild, chartType, obj } = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const {windowWidth, windowHeight, isChartVisible, closeFullScreen} = useLandscapeChart(navigation);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const chartHeading =
    chartType == chartTypes.WeightForHeight
      ? { title: t("growthScreenweightForHeight") }
      : { title: t("growthScreenheightForAge") };

  return (
    <>
      <View style={[styles.mainView, { paddingBottom: insets.bottom }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <ScrollView>
          <FlexCol>
            <MainContainer style={styles.mainContainer}>
              <FlexFDirRowSpace>
                <Heading2>{chartHeading.title}</Heading2>
                <Pressable
                  style={styles.padding12}
                  onPress={(): any => closeFullScreen()}
                >
                  <Icon name="ic_close" size={20} />
                </Pressable>
              </FlexFDirRowSpace>

              <FlexCol>
                {isChartVisible ? (
                  <GrowthChart
                    activeChild={activeChild}
                    chartType={chartType}
                    bgObj={obj}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                  />
                ) : (
                  <ActivityIndicator size="large" color={headerColor} />
                )}
              </FlexCol>
            </MainContainer>
          </FlexCol>
        </ScrollView>
      </View>
    </>
  );
};
