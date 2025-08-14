import { appConfig } from "../instances";
import { useNavigation } from "@react-navigation/native";
import {
  Heading4,
  Heading4Regular,
  ShiftFromBottom5,
  ShiftFromBottom10,
  ShiftFromTop5,
  ShiftFromTopBottom10,
} from "../instances/bebbo/styles/typography";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  useWindowDimensions,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../App";
import { ButtonTextSmLineL, ButtonTextMdLineL } from "./shared/ButtonGlobal";
import Checkbox, {
  CheckboxDevActive,
  CheckboxItem,
} from "./shared/CheckboxStyle";
import { MainContainer } from "./shared/Container";
import { DevelopmentBox } from "./shared/DevelopmentStyle";
import { DividerDev } from "./shared/Divider";
import { FDirRow, Flex5 } from "./shared/FlexBoxStyle";
import Icon from "./shared/Icon";
import VideoPlayer from "./VideoPlayer";
import RNFS from "react-native-fs";
import downloadImages from "../downloadImages/ImageStorage";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
import HTML from "react-native-render-html";
import { addSpaceToHtml, removeParams } from "../services/Utils";
import {
  PopupCloseContainerCD,
  PopupCloseVideoCD,
} from "@components/shared/ModalPopupStyle";
import { isFutureDate } from "../services/childCRUD";
import { bgColor1 } from "../instances/bebbo/styles/style";
import VectorImage from "react-native-vector-image";
import useDigitConverter from "../customHooks/useDigitConvert";
import { selectActiveChild, selectActiveChildUuid } from "../services/selectors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const styles = StyleSheet.create({
  alignItemsStart: { alignItems: "flex-start" },
  checkboxStyle: { borderWidth: 1 },
  close: {
    height: 22,
    left: "30%",
    position: "absolute",
    top: "30%",
    width: 22,
  },
  heading4Regular: { flex: 7, textAlignVertical: "center" },
  htmlFontSize: { fontSize: 14 },
  iconStyle: { alignSelf: "center", flex: 1, textAlign: "right" },
  imageStyle: {
    borderRadius: 5,
    flex: 1,
    height: 50,
    marginRight: 10,
    width: "100%",
  },
  innerPressable: { flex: 1, height: 50, marginRight: 10, width: "100%" },
  innerView: { flex: 1, flexDirection: "row" },
  outerView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  padding0: { padding: 0 },
  popupCloseContainer: {
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    zIndex: -1,
  },
  popupCloseVideo: {
    alignItems: "flex-start",
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
    padding: 17,
    width: Dimensions.get("window").width,
  },
  popupView: {
    alignItems: "center",
    backgroundColor: bgColor1,
    flexDirection: "row",
    height: Dimensions.get("window").height,
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  pressableView: { flexDirection: "row", flex: 1 },
});
const ChildDevelopmentCollapsibleItem = React.memo((props: any) => {
  const {
    item,
    VideoArticlesData,
    ActivitiesData,
    sendMileStoneDatatoParent,
    currentSelectedChildId,
  } = props;
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [isOPen, setIsOPen] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext?.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext?.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext?.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const activeChilduuid = useAppSelector(selectActiveChildUuid);
  const activeChild = useAppSelector(selectActiveChild);
  const { convertDigits } = useDigitConverter();
  const [selVideoArticleData, setselVideoArticleData] = useState<any>();
  const [selActivitiesData, setselActivitiesData] = useState<any>();
  const [selVideoImage, setselVideoImage] = useState("");
  const [selActivityImage, setselActivityImage] = useState("");
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (item?.toggleCheck == true) {
      setToggleCheckBox(true);
    } else {
      setToggleCheckBox(false);
    }
    const fetchData = async (): Promise<any> => {
      setselVideoImage("");
      setselActivityImage("");
      const currVideoArtData = VideoArticlesData.filter(
        (x: any) => x.id == item?.related_video_articles[0]
      )[0];
      setselVideoArticleData(currVideoArtData);
      const currActivityData = ActivitiesData.filter(
        (x: any) => x.id == item?.related_activities[0]
      )[0];
      setselActivitiesData(currActivityData);
      if (
        currActivityData &&
        currActivityData?.cover_image &&
        currActivityData?.cover_image?.url != ""
      ) {
        const imageName = removeParams(
          currActivityData?.cover_image?.url.split("/").pop()
        );
        const imageArray = [];
        imageArray.push({
          srcUrl: currActivityData?.cover_image?.url,
          destFolder: RNFS.DocumentDirectoryPath + "/content",
          destFilename: imageName,
        });
        await downloadImages(imageArray);
        if (await RNFS.exists(appConfig.destinationFolder + "/" + imageName)) {
          setselActivityImage(
            encodeURI("file://" + appConfig.destinationFolder + imageName)
          );
        } else {
          setselActivityImage("");
        }
      }
      if (
        currVideoArtData &&
        currVideoArtData?.cover_image &&
        currVideoArtData?.cover_image?.url != ""
      ) {
        const imageName = removeParams(
          currVideoArtData?.cover_image?.url.split("/").pop()
        );
        const imageArray = [];
        imageArray.push({
          srcUrl: currVideoArtData?.cover_image?.url,
          destFolder: RNFS.DocumentDirectoryPath + "/content",
          destFilename: imageName,
        });
        await downloadImages(imageArray);
        if (await RNFS.exists(appConfig.destinationFolder + "/" + imageName)) {
          setselVideoImage(
            encodeURI("file://" + appConfig.destinationFolder + imageName)
          );
        } else {
          setselVideoImage("");
        }
      }
    };
    fetchData();
  }, [item]);
  const milestoneCheckUncheck = async (): Promise<any> => {
    const filterQuery = 'uuid == "' + activeChilduuid + '"';
    setToggleCheckBox(!toggleCheckBox);
    sendMileStoneDatatoParent(item, !toggleCheckBox);
    await userRealmCommon.updateChildMilestones<ChildEntity>(
      ChildEntitySchema,
      item?.id,
      filterQuery
    );
  };
  const gotoArticle = (articleId: any[]): any => {
    navigation.navigate("DetailsScreen", {
      fromScreen: "MileStone",
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
      detailData: articleId[0],
      currentSelectedChildId: currentSelectedChildId,
    });
  };
  const gotoActivity = (activityData: any): any => {
    navigation.navigate("DetailsScreen", {
      fromScreen: "MileStoneActivity", //ChildDevelopment
      headerColor: actHeaderColor,
      backgroundColor: actBackgroundColor,
      detailData: activityData,
      selectedChildActivitiesData: currentSelectedChildId,
      currentSelectedChildId: currentSelectedChildId,
    });
  };
  const openVideo = (): any => {
    setModalVisible(!modalVisible);
  };
  return (
    <>
      <MainContainer key={item.id}>
        <DevelopmentBox>
          <View style={styles.innerView}>
            <View style={styles.outerView}>
              <Pressable
                disabled={isFutureDate(activeChild?.birthDate)}
                onPress={(): any => {
                  milestoneCheckUncheck();
                }}
              >
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxDevActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxDevActive>
                    ) : (
                      <Checkbox style={styles.checkboxStyle}></Checkbox>
                    )}
                  </View>
                </CheckboxItem>
              </Pressable>
            </View>
            <Pressable
              style={styles.pressableView}
              onPress={(): any => {
                setIsOPen(!isOPen);
              }}
            >
              <Heading4Regular style={styles.heading4Regular}>
                {convertDigits(item?.title)}
              </Heading4Regular>
              <Icon
                style={styles.iconStyle}
                name={isOPen ? "ic_angle_up" : "ic_angle_down"}
                size={10}
                color="#000"
              />
            </Pressable>
          </View>
          {isOPen ? (
            <>
              <ShiftFromTop5></ShiftFromTop5>
              <ShiftFromTopBottom10>
                <ShiftFromBottom10>
                  <Heading4>{t("developScreenmileStone")}</Heading4>
                </ShiftFromBottom10>
                <FDirRow style={styles.alignItemsStart}>
                  {selVideoArticleData &&
                    selVideoArticleData?.cover_video &&
                    selVideoArticleData?.cover_video?.url != "" ? (
                    <>
                      <Pressable
                        style={styles.innerPressable}
                        onPress={(): any => openVideo()}
                      >
                        <Image
                          source={
                            selVideoImage != ""
                              ? { uri: selVideoImage }
                              : require("@assets/trash/defaultArticleImage.png")
                          }
                          style={styles.imageStyle}
                          resizeMode={"cover"}
                        />
                        <VectorImage
                          style={styles.close}
                          source={require("@images/play_icon.svg")}
                        />
                      </Pressable>
                    </>
                  ) : null}
                  <Flex5>
                    <ShiftFromBottom5>
                      {item && item.body ? (
                        <HTML
                          contentWidth={width}
                          source={{ html: addSpaceToHtml(item.body) }}
                          baseStyle={styles.htmlFontSize}
                          ignoredStyles={["color", "fontSize", "fontFamily"]}
                          tagsStyles={{
                            p: { textAlign: "left", marginTop: 0 },
                            h1: { textAlign: "left" },
                            h2: { textAlign: "left" },
                            h3: { textAlign: "left" },
                            h4: { textAlign: "left" },
                            h5: { textAlign: "left" },
                            h6: { textAlign: "left" },
                            span: { textAlign: "left" },
                            li: { textAlign: "left" },
                          }}
                        />
                      ) : null}
                    </ShiftFromBottom5>
                    {/* uncomment this for related article */}
                    {item &&
                      item.related_articles &&
                      item.related_articles.length > 0 ? (
                      <Pressable
                        onPress={(): any => gotoArticle(item.related_articles)}
                      >
                        <ButtonTextSmLineL numberOfLines={2}>
                          {t("developScreenrelatedArticleText")}
                        </ButtonTextSmLineL>
                      </Pressable>
                    ) : null}
                  </Flex5>
                </FDirRow>
              </ShiftFromTopBottom10>
              {selActivitiesData ? (
                <>
                  <DividerDev></DividerDev>
                  <ShiftFromTopBottom10>
                    <ShiftFromBottom10>
                      <Heading4>{t("developScreenrelatedAct")}</Heading4>
                    </ShiftFromBottom10>
                    <FDirRow>
                      {selActivitiesData &&
                        selActivitiesData?.cover_image &&
                        selActivitiesData?.cover_image?.url != "" ? (
                        <>
                          <Image
                            source={
                              selActivityImage != ""
                                ? { uri: selActivityImage }
                                : require("@assets/trash/defaultArticleImage.png")
                            }
                            style={styles.imageStyle}
                            resizeMode={"cover"}
                          />
                        </>
                      ) : null}
                      <Flex5>
                        <ShiftFromBottom5>
                          <Heading4Regular>
                            {convertDigits(selActivitiesData?.title)}
                          </Heading4Regular>
                        </ShiftFromBottom5>
                        {selActivitiesData ? (
                          <Pressable
                            onPress={(): any => gotoActivity(selActivitiesData)}
                          >
                            <ButtonTextMdLineL numberOfLines={2}>
                              {t("developScreenviewDetails")}
                            </ButtonTextMdLineL>
                          </Pressable>
                        ) : null}
                      </Flex5>
                    </FDirRow>
                  </ShiftFromTopBottom10>
                </>
              ) : null}
            </>
          ) : null}
        </DevelopmentBox>
        <Modal
          style={styles.padding0}
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={(): any => {
            setModalVisible(!modalVisible);
          }}
          onDismiss={(): any => {
            console.log("dismissed");
          }}
        >
          <View style={styles.popupView}>
            <VideoPlayer
              selectedPinnedArticleData={selVideoArticleData}
            ></VideoPlayer>
            <PopupCloseContainerCD style={{ marginTop: insets.top + 15 }}>
              <PopupCloseVideoCD
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon name="ic_close" size={20} color="#fff" />
              </PopupCloseVideoCD>
            </PopupCloseContainerCD>
          </View>
        </Modal>
      </MainContainer>
    </>
  );
});
export default ChildDevelopmentCollapsibleItem;
