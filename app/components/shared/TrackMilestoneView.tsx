import { useNavigation } from "@react-navigation/native";
import {
  Heading3,
  ShiftFromBottom15,
} from "../../instances/bebbo/styles/typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { ButtonDevelopmentMd, ButtonTextMd } from "./ButtonGlobal";
import { BannerContainerMilestone, MainContainer } from "./Container";
import { Flex1, Flex3, FlexDirRowStart } from "./FlexBoxStyle";
import Icon, { IconBox, OuterIconLeft, OuterIconRow } from "./Icon";
import { StackNavigationProp } from "@react-navigation/stack";
const styles = StyleSheet.create({
  mainContainerFlex: {
    flex: 1,
  },
  milestonePressable: {
    flexDirection: "row",
  },
});
export type TracksRootStackParamList = {
  Home: { screen: string; params: any; merge: boolean } | undefined;
};
const TrackMilestoneView = (props: any): any => {
  const { currentSelectedChildId } = props;
  //const navigation = useNavigation<any>();
  const navigation =
    useNavigation<StackNavigationProp<TracksRootStackParamList>>();
  const { t } = useTranslation();
  return (
    <>
      <ShiftFromBottom15>
        <MainContainer style={styles.mainContainerFlex}>
          <BannerContainerMilestone>
            <FlexDirRowStart>
              <Flex1>
                <OuterIconRow>
                  <OuterIconLeft>
                    <IconBox>
                      <Icon name="ic_milestone" size={25} color="#000" />
                    </IconBox>
                  </OuterIconLeft>
                </OuterIconRow>
              </Flex1>
              <Flex3>
                <ShiftFromBottom15>
                  <Heading3>{t("trackMilestoneViewHeader")}</Heading3>
                </ShiftFromBottom15>
                <Pressable style={styles.milestonePressable}>
                  <ButtonDevelopmentMd
                    onPress={(): any =>
                      navigation.navigate("Home", {
                        screen: "ChildDevelopment",
                        params: {
                          currentSelectedChildId: currentSelectedChildId
                            ? currentSelectedChildId
                            : 0,
                        },
                        merge: true,
                      })
                    }
                  >
                    <ButtonTextMd numberOfLines={2}>
                      {t("trackMilestoneViewBtn")}
                    </ButtonTextMd>
                  </ButtonDevelopmentMd>
                </Pressable>
              </Flex3>
            </FlexDirRowStart>
          </BannerContainerMilestone>
        </MainContainer>
      </ShiftFromBottom15>
    </>
  );
};
export default TrackMilestoneView;
