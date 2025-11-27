import FavActivities from "@components/FavActivities";
import FavArticles from "@components/FavArticles";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import TabScreenHeader from "@components/TabScreenHeader";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading4Center,
  ShiftFromBottom5,
} from "../../instances/bebbo/styles/typography";
import React, { useContext, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "styled-components/native";
import { TabBarContainer, TabBarDefault } from "@components/shared/TabBarStyle";
import { Flex1 } from "@components/shared/FlexBoxStyle";
import { useFocusEffect } from "@react-navigation/native";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import { secondaryColor } from "@styles/style";
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  flex1: { flex: 1 },
});
const Favourites = ({ navigation, route }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const backgroundBlue = secondaryColor;
  const backgroundBlueTint = themeContext?.colors.SECONDARY_TINTCOLOR;
  const headerTextColor = themeContext?.colors.PRIMARY_BLUE_TEXTCOLOR;

  const [profileLoading, setProfileLoading] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState<number>();
  const data = [
    { title: t("articleScreenheaderTitle") },
    { title: t("actScreenheaderTitle") },
  ];
  useLayoutEffect(() => {
    navigation.closeDrawer();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.backClicked != "yes") {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(route.params?.tabIndex);
        if (route.params?.backClicked == "yes") {
          navigation.setParams({ backClicked: "no" });
        }
      }
    }, [route.params?.tabIndex])
  );
  const renderItem = (index: number): any => {
    if (index === 0) {
      return (
        <>
          <FavArticles />
        </>
      );
    } else if (index === 1) {
      return (
        <>
          <FavActivities />
        </>
      );
    }
  };
  return (
    <>
      <View style={styles.flex1}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <TabScreenHeader
          title={t("favScreenHeader")}
          headerColor={headerColor}
          textColor={headerTextColor}
          setProfileLoading={setProfileLoading}
        />

        <TabBarContainer style={{ backgroundColor: headerColor }}>
          {data.map((item, itemindex) => {
            return (
              <Pressable
                key={itemindex}
                style={styles.flex1}
                onPress={(): any => {
                  setSelectedIndex(itemindex);
                }}
              >
                <ShiftFromBottom5>
                  <TabBarDefault
                    style={[
                      {
                        backgroundColor:
                          itemindex == selectedIndex
                            ? backgroundBlue
                            : backgroundBlueTint,
                      },
                    ]}
                  >
                    <Heading4Center numberOfLines={2}>
                      {item.title}
                    </Heading4Center>
                  </TabBarDefault>
                </ShiftFromBottom5>
              </Pressable>
            );
          })}
        </TabBarContainer>

        <Flex1>{renderItem(Number(selectedIndex))}</Flex1>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};
export default Favourites;
