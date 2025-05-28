import { appConfig } from "../../instances";
import {
  FlexCol,
  FlexColChart,
  FlexRowEnd,
} from "@components/shared/FlexBoxStyle";
import Icon from "@components/shared/Icon";
import RelatedArticles from "@components/shared/RelatedArticles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Heading3Regular,
  Heading4,
  ShiftFromTopBottom15,
} from "@styles/typography";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../../App";
import { formatHeightData } from "../../services/growthService";
import { getInterpretationHeightForAge } from "../../services/interpretationService";
import GrowthChart, { chartTypes } from "./GrowthChart";
import { standardDevDataForChart } from "../../instances/index";
export const standardDevDataLoad = standardDevDataForChart;
const styles = StyleSheet.create({
  fullScreenPressable: {
    marginTop: 5,
    padding: 7,
  },
  loadingContainer: {
    marginTop: 50,
  },
});
const ChartHeightForAge = (props: any): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext?.colors.CHILDGROWTH_TINTCOLOR;
  const navigation = useNavigation<any>();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const fullScreenChart = (chartType: any, obj: any): any => {
    navigation.navigate("ChartFullScreen", {
      activeChild,
      chartType,
      obj,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  //const standardDevData: any[] = require('../../assets/translations/appOfflineData/standardDeviation.json');
  const standardDevData = standardDevDataLoad;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  let obj: any;
  let standardDeviation: any;
  // if (activeChild?.gender == '526' || activeChild?.gender == '') {
  if (
    activeChild?.gender == taxonomyIds?.boyChildGender ||
    activeChild?.gender == "" ||
    activeChild?.gender == appConfig.boyChildGender
  ) {
    //boy or no gender added
    const genderBoyData = standardDevData?.filter(
      (item) =>
        item.growth_type == appConfig.heightForAge &&
        (item.child_gender == taxonomyIds?.boyChildGender ||
          item.child_gender == appConfig.boyChildGender)
    );
    standardDeviation = genderBoyData;
    obj = formatHeightData(genderBoyData, "height");
  } else {
    //girl
    const genderGirlData = standardDevData?.filter(
      (item) =>
        (item.growth_type == appConfig.heightForAge &&
          item.child_gender == taxonomyIds?.girlChildGender) ||
        item.child_gender == appConfig.girlChildGender
    );
    standardDeviation = genderGirlData;
    obj = formatHeightData(genderGirlData, "height");
  }

  const childBirthDate = activeChild.birthDate;
  const childTaxonomyData = activeChild.taxonomyData;
  const sortedMeasurements = activeChild.measures.sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate
  );
  const lastMeasurements = sortedMeasurements[sortedMeasurements.length - 1];
  const item: any = getInterpretationHeightForAge(
    standardDeviation,
    activeChild?.taxonomyData.prematureTaxonomyId != null &&
      activeChild?.taxonomyData.prematureTaxonomyId != "" &&
      activeChild?.taxonomyData.prematureTaxonomyId != undefined
      ? activeChild.plannedTermDate
      : childBirthDate,
    childTaxonomyData,
    lastMeasurements
  );
  const [isChartVisible, setIsChartVisible] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        setIsChartVisible(true);
      }, 2000);
    }, [])
  );

  const [deviceOrientation, setDeviceOrientation] = useState(
    Dimensions.get("window").width < Dimensions.get("window").height
      ? "portrait"
      : "landscape"
  );
  useEffect(() => {
    const deviceOrientation = (): any => {
      if (Dimensions.get("window").width < Dimensions.get("window").height) {
        setDeviceOrientation("portrait");
      } else {
        setDeviceOrientation("landscape");
      }
    };
    const listener = Dimensions.addEventListener("change", deviceOrientation);
    return (): any => {
      //cleanup work
      listener.remove();
    };
  }, []);
  return (
    <FlexCol>
      <FlexCol>
        <FlexRowEnd>
          <Pressable
            style={styles.fullScreenPressable}
            onPress={(): any => fullScreenChart(chartTypes.HeightForAge, obj)}
          >
            <Icon name="ic_fullscreen" size={16} />
          </Pressable>
        </FlexRowEnd>
      </FlexCol>
      <FlexCol>
        {isChartVisible && deviceOrientation == "portrait" ? (
          <GrowthChart
            activeChild={activeChild}
            chartType={chartTypes.HeightForAge}
            bgObj={obj}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={headerColor} />
          </View>
        )}

        <ShiftFromTopBottom15>
          {item && props.days >= activeChild.taxonomyData.days_from ? (
            <>
              <Heading4> {item?.interpretationText?.name}</Heading4>
              {item?.interpretationText?.text ? (
                <Heading3Regular>
                  {item?.interpretationText?.text}
                </Heading3Regular>
              ) : null}
            </>
          ) : null}
        </ShiftFromTopBottom15>
      </FlexCol>
      {props.days >= activeChild.taxonomyData.days_from ? (
        <FlexColChart>
          <RelatedArticles
            fromScreen={"ChildgrowthTab"}
            relatedArticles={item?.interpretationText?.articleID}
            category={5}
            currentId={chartTypes.HeightForAge}
            headerColor={headerColor}
            backgroundColor={backgroundColor}
            navigation={navigation}
          />
        </FlexColChart>
      ) : null}
    </FlexCol>
  );
};
export default ChartHeightForAge;
