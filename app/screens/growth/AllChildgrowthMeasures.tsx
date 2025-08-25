import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ActiveChildMeasureTimeline from "@components/growth/ActiveChildMeasureTimeline";
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText,
} from "@components/shared/ButtonGlobal";
import { FlexCol } from "@components/shared/FlexBoxStyle";
import {
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView,
} from "@components/shared/HeaderContainerStyle";
import { IconML } from "@components/shared/Icon";
import {
  Heading2,
  ShiftFromTop10,
} from "../../instances/bebbo/styles/typography";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../../App";
import { isFutureDate } from "../../services/childCRUD";
import { selectActiveChild } from "../../services/selectors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flexCol: { padding: 20, paddingLeft: 5, maxHeight: "100%", flex: 9 },
  maxHeight: { maxHeight: 50 },
  overflowHidden: { overflow: "hidden" },
});
const AllChildgrowthMeasures = ({ navigation }: any): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext?.colors.CHILDGROWTH_TINTCOLOR;
  const { t } = useTranslation();
  const activeChild = useAppSelector(selectActiveChild);
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor, paddingBottom: insets.bottom }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={[
            styles.maxHeight,
            {
              backgroundColor: headerColor,
            },
          ]}
        >
          <HeaderIconView>
            <HeaderIconPress
              onPress={(): any => {
                navigation.goBack();
              }}
            >
              <IconML name={"ic_back"} color="#000" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2> {t("growthScreenallMeasureHeader")}</Heading2>
          </HeaderTitleView>
        </HeaderRowView>
        <FlexCol>
          <View
            style={[
              styles.flexCol,
              {
                backgroundColor: backgroundColor,
              },
            ]}
          >
            <ActiveChildMeasureTimeline activeChild={activeChild} />
          </View>
          <ButtonContainer style={{ backgroundColor: backgroundColor }}>
            <ShiftFromTop10>
              <ButtonPrimary
                disabled={isFutureDate(activeChild?.birthDate)}
                style={{ backgroundColor: headerColor }}
                onPress={(): any => {
                  navigation.navigate("AddNewChildgrowth", {
                    headerTitle: t("growthScreenaddNewBtntxt"),
                  });
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("growthScreenaddNewBtntxt")}
                </ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </ButtonContainer>
        </FlexCol>
      </View>
    </>
  );
};

export default AllChildgrowthMeasures;
