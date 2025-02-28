import {
  FormOuterCheckbox,
  LabelText,
} from "@components/shared/ChildSetupStyle";
import { VacItemContainer } from "@components/shared/Container";
import { Flex1, FlexDirRow } from "@components/shared/FlexBoxStyle";
import Icon, { OuterIconRight, OuterIconRow } from "@components/shared/Icon";
import { ToolsHeadView } from "@components/shared/ToolsStyle";
import { useNavigation } from "@react-navigation/native";
import { Heading4Regular } from "../../instances/bebbo/styles/typography";
import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import Checkbox, {
  CheckboxActive,
  CheckboxItem,
} from "../shared/CheckboxStyle";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
const styles = StyleSheet.create({
  checkboxStyle: { borderWidth: 1 },
});

const VaccineItem = (props: any): any => {
  const { item, onToggleVaccine, fromScreen, backgroundActiveColor } = props;
  const themeContext = useContext(ThemeContext);
  const navigation = useNavigation<any>();
  const netInfo = useNetInfoHook();
  const headerColor = themeContext?.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = (pinnedArticleId: any): any => {
    if (pinnedArticleId != 0) {
      navigation.navigate("DetailsScreen", {
        fromScreen: fromScreen,
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: pinnedArticleId,
        netInfo: netInfo,
      });
    }
  };

  const { title, uuid, isMeasured, pinned_article, old_calendar } = item;
  const [toggleCheckBox, setToggleCheckBox] = useState(isMeasured);
  return (
    <>
      <VacItemContainer>
        <ToolsHeadView>
          <FlexDirRow>
            <FormOuterCheckbox
              onPress={(): any => {
                setToggleCheckBox(!toggleCheckBox);
                onToggleVaccine(uuid, !toggleCheckBox);
              }}
            >
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxActive
                      style={{ backgroundColor: backgroundActiveColor }}
                    >
                      <Icon name="ic_tick" size={12} color="#000" />
                    </CheckboxActive>
                  ) : (
                    <Checkbox style={styles.checkboxStyle}></Checkbox>
                  )}
                </View>
              </CheckboxItem>
              <Flex1>
                <LabelText>
                  <Heading4Regular>{title}</Heading4Regular>
                </LabelText>
              </Flex1>
            </FormOuterCheckbox>
          </FlexDirRow>
          {pinned_article ? (
            <Pressable
              onPress={(): any => {
                gotoArticle(pinned_article);
              }}
            >
              <OuterIconRow>
                <OuterIconRight>
                  <Icon name="ic_info" size={15} color="#000" />
                </OuterIconRight>
              </OuterIconRow>
            </Pressable>
          ) : null}
        </ToolsHeadView>
      </VacItemContainer>
    </>
  );
};
export default VaccineItem;
