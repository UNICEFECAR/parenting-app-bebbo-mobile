import AgeBrackets from "@components/AgeBrackets";
import VideoPlayer from "@components/VideoPlayer";
import ChildDevelopmentCollapsibleItem from "@components/ChildDevelopmentCollapsibleItem";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { ArticleHeading } from "@components/shared/ArticlesStyle";
import Container, {
  BannerContainer,
  MainContainer,
} from "@components/shared/Container";
import {
  DevelopmentContent,
  DevelopmentStatus,
} from "@components/shared/DevelopmentStyle";
import {
  FDirCol,
  FlexCol,
  FDirRow,
  Flex1,
  FlexDirRowSpace,
  FlexDirRowSpaceStart,
} from "@components/shared/FlexBoxStyle";
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  IconViewSuccess,
  IconViewAlert,
  IconAreaPress,
} from "@components/shared/Icon";
import { PrematureTagDevelopment } from "@components/shared/PrematureTag";
import TabScreenHeader from "@components/TabScreenHeader";
import {
  Heading2,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Center,
  Heading4Centerr,
  Heading5Bold,
  ShiftFromTop10,
  ShiftFromTop20,
  ShiftFromTop5,
} from "@styles/typography";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BackHandler,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HTML from "react-native-render-html";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../../App";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { userRealmCommon } from "../../../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../../../database/schema/ChildDataSchema";
import ProgressCircle from "react-native-progress-circle";
import { setInfoModalOpened } from "../../../redux/reducers/utilsSlice";
import FirstTimeModal from "@components/shared/FirstTimeModal";
import { addSpaceToHtml } from "../../../services/Utils";
import {
  CHILD_DEVELOPMENT_AGEGROUP_SELECTED,
  CHILD_MILESTONE_TRACKED,
} from "@assets/data/firebaseEvents";
import ModalPopupContainer, {
  PopupOverlay,
  PopupCloseContainer,
  PopupClose,
  ModalPopupContent,
} from "@components/shared/ModalPopupStyle";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import { bgcolorWhite2 } from "@styles/style";
import useNetInfoHook from "../../../customHooks/useNetInfoHook";
import {
  logEvent,
  synchronizeEvents,
} from "../../../services/EventSyncService";
import useDigitConverter from "../../../customHooks/useDigitConvert";
import { appConfig } from "../../../instance";
const styles = StyleSheet.create({
  bgWhite: { backgroundColor: bgcolorWhite2 },
  flex1: { flex: 1 },
  font14: { fontSize: 14 },
  font18: { fontSize: 18 },
  fullWidth: { width: "100%" },
  titleUnderline: { textDecorationLine: "underline" },
});
const ChildDevelopment = ({ route, navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter();
  const dispatch = useAppDispatch();
  const [profileLoading, setProfileLoading] = React.useState(false);
  const ChildDevData = useAppSelector((state: any) =>
    state.utilsData.ChildDevData != ""
      ? JSON.parse(state.utilsData.ChildDevData)
      : []
  );
  const PinnedChildDevData = useAppSelector((state: any) =>
    state.utilsData.VideoArticlesData != ""
      ? JSON.parse(state.utilsData.VideoArticlesData)
      : []
  );
  const MileStonesData = useAppSelector((state: any) =>
    state.utilsData.MileStonesData != ""
      ? JSON.parse(state.utilsData.MileStonesData)
      : []
  );
  const VideoArticlesData = useAppSelector((state: any) =>
    state.utilsData.VideoArticlesData != ""
      ? JSON.parse(state.utilsData.VideoArticlesData)
      : []
  );
  const ActivitiesData = useAppSelector((state: any) =>
    state.utilsData.ActivitiesData != ""
      ? JSON.parse(state.utilsData.ActivitiesData)
      : []
  );
  const childAge = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : []
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  console.log(childAge, "......", activeChild);
  const childDevModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsChildDevModalOpened
  );
  console.log("childDevModalOpened......", childDevModalOpened);
  const modalScreenKey = "IsChildDevModalOpened";
  const modalScreenText = "childDevModalText";
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildDevData, setSelectedChildDevData] = useState<any>();
  const [selectedChildMilestoneData, setselectedChildMilestoneData] =
    useState<any>();
  const [selectedPinnedArticleData, setSelectedPinnedArticleData] = useState();
  const [milestonePercent, setMilestonePercent] = useState(0);
  const [componentColors, setComponentColors] = useState<any>({});
  const [showNoData, setshowNoData] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const flatListRef = useRef<any>();
  const activityTaxonomyId =
    activeChild?.taxonomyData.prematureTaxonomyId != null &&
    activeChild?.taxonomyData.prematureTaxonomyId != undefined &&
    activeChild?.taxonomyData.prematureTaxonomyId != ""
      ? activeChild?.taxonomyData.prematureTaxonomyId
      : activeChild?.taxonomyData.id;

  const setIsModalOpened = (varkey: any): any => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  useEffect(() => {
    if (isFocused) {
      if (netInfo.isConnected) {
        synchronizeEvents(netInfo.isConnected);
      }
      setModalVisible(childDevModalOpened);
    }
  }, [isFocused]);
  // useFocusEffect(
  //   React.useCallback(()=>{
  //      if (netInfo.isConnected) {
  //        synchronizeEvents(netInfo.isConnected);
  //      }
  //      //setModalVisible(childDevModalOpened);
  //    },[])
  //  )
  useEffect(() => {
    setComponentColors({
      headerColor: themeContext?.colors.CHILDDEVELOPMENT_COLOR,
      backgroundColor: themeContext?.colors.CHILDDEVELOPMENT_TINTCOLOR,
      artHeaderColor: themeContext?.colors.ARTICLES_COLOR,
      artBackgroundColor: themeContext?.colors.ARTICLES_TINTCOLOR,
      headerColorBlack: themeContext?.colors.PRIMARY_TEXTCOLOR,
    });

    return (): any => {
      navigation.setParams({
        currentSelectedChildId: 0,
        fromActivitiesScreen: false,
      });
    };
  }, []);

  const onPressInfo = (): any => {
    navigation.navigate("DetailsScreen", {
      fromScreen: "ChildDevelopment",
      headerColor: componentColors?.artHeaderColor,
      backgroundColor: componentColors?.artBackgroundColor,
      detailData: selectedPinnedArticleData,
      currentSelectedChildId: currentSelectedChildId,
    });
  };
  const toTop = (): any => {
    // use current
    flatListRef?.current?.scrollToOffset({
      animated: Platform.OS == "android" ? true : false,
      offset: 0,
    });
  };
  const showSelectedBracketData = async (item: any): Promise<any> => {
    toTop();
    const eventData = {
      name: CHILD_DEVELOPMENT_AGEGROUP_SELECTED,
      params: { age_id: item.id },
    };
    logEvent(eventData, netInfo.isConnected);

    setCurrentSelectedChildId(item.id);
    let filteredData = ChildDevData.filter((x: any) =>
      x.child_age.includes(item.id)
    )[0];
    filteredData = { ...filteredData, name: item.name };
    setSelectedChildDevData(filteredData);
    const childData = await userRealmCommon.getFilteredData<ChildEntity>(
      ChildEntitySchema,
      'uuid == "' + activeChild.uuid + '"'
    );
    const filteredMilestoneData = await MileStonesData.filter((x: any) =>
      x.child_age.includes(item.id)
    );
    childData[0].checkedMilestones.filter((x: any) => {
      const i = filteredMilestoneData.findIndex((_item: any) => _item.id === x);
      if (i > -1) {
        filteredMilestoneData[i]["toggleCheck"] = true;
      }
    });
    setselectedChildMilestoneData(filteredMilestoneData);
    setTimeout(() => {
      setshowNoData(true);
    }, 500);
  };
  const onBackPress = (): any => {
    if (route.params?.fromNotificationScreen == true) {
      navigation.navigate("NotificationsScreen");
      return true;
    } else if (route.params?.fromActivitiesScreen == true) {
      navigation.navigate("Activities", {
        currentSelectedChildId: route.params?.currentSelectedChildId,
        backClicked: "yes",
      });
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };
  useEffect(() => {
    console.log("USe effect chilkd 2");
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    navigation.addListener("gestureEnd", onBackPress);
    return (): any => {
      navigation.removeListener("gestureEnd", onBackPress);
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    if (isFocused) {
      console.log("UseFouusEffect child development");
      setListLoading(true);
      return (): any => {
        setListLoading(false);
      };
    }
  }, [isFocused, listLoading]);

  const calculateMileStone = (): any => {
    const arrlength = selectedChildMilestoneData?.length;
    let abc = 0;
    if (arrlength > 0) {
      abc = selectedChildMilestoneData.filter(
        (x: any) => x.toggleCheck == true
      ).length;
    }
    const percent = Math.round((abc / arrlength) * 100);
    setMilestonePercent(percent);
  };
  useEffect(() => {
    console.log("USe effect chilkd 3");
    setshowNoData(false);
    if (
      route.params?.currentSelectedChildId &&
      route.params?.currentSelectedChildId != 0
    ) {
      const firstChildDevData = childAge.filter(
        (x: any) => x.id == route.params?.currentSelectedChildId
      );
      showSelectedBracketData(firstChildDevData[0]);
    } else {
      const firstChildDevData = childAge.filter(
        (x: any) => x.id == activityTaxonomyId
      );
      showSelectedBracketData(firstChildDevData[0]);
    }
  }, [
    activeChild?.uuid,
    route.params?.currentSelectedChildId,
    activityTaxonomyId,
  ]);
  useEffect(() => {
    if (isFocused) {
      if (
        activeChild?.gender == "" ||
        activeChild?.gender == 0 ||
        activeChild?.gender == appConfig.boyChildGender ||
        activeChild?.gender == appConfig.bothChildGender
      ) {
        //for boy,other and blank
        const filteredPinnedData = PinnedChildDevData.filter(
          (x: any) => x.id == selectedChildDevData?.boy_video_article
        )[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      } else if (activeChild?.gender == appConfig.girlChildGender) {
        //for girl
        const filteredPinnedData = PinnedChildDevData.filter(
          (x: any) => x.id == selectedChildDevData?.girl_video_article
        )[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      }
    }
  }, [isFocused, selectedChildDevData]);
  useEffect(() => {
    if (isFocused) {
      console.log("UseFouusEffect child development two");
      calculateMileStone();
    }
  }, [isFocused, selectedChildMilestoneData]);

  const sendMileStoneDatatoParent = (item: any, togglevalue: any): any => {
    if (togglevalue == true) {
      const eventData = {
        name: CHILD_MILESTONE_TRACKED,
        params: { age_id: currentSelectedChildId },
      };
      logEvent(eventData, netInfo.isConnected);
    }
    const i = selectedChildMilestoneData.findIndex(
      (_item: any) => _item.id === item.id
    );
    if (i > -1) {
      const abc = selectedChildMilestoneData[i];
      abc["toggleCheck"] = togglevalue;
      const newArray = [
        ...selectedChildMilestoneData.slice(0, i),
        abc,
        ...selectedChildMilestoneData.slice(i + 1),
      ];
      //const sortednewArray = newArray.sort((x, y) => { return x.toggleCheck === false ? -1 : y.toggleCheck === false ? 1 : 0; });

      setselectedChildMilestoneData([...newArray]);
    }
  };
  const ContentThatGoesBelowTheFlatList = (): any => {
    return (
      <>
        <ShiftFromTop20>
          <MainContainer>
            {selectedChildDevData && selectedChildDevData?.milestone ? (
              <BannerContainer>
                <Heading5Bold>{t("developScreentipsText")}</Heading5Bold>
                <ShiftFromTop10>
                  {selectedChildDevData?.milestone ? (
                    <HTML
                      source={{
                        html: addSpaceToHtml(selectedChildDevData?.milestone),
                      }}
                      baseStyle={styles.font14}
                      ignoredStyles={["color", "fontSize", "fontFamily"]}
                      tagsStyles={{
                        p: { textAlign: "left", marginBottom: 15 },
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
                </ShiftFromTop10>
              </BannerContainer>
            ) : null}
          </MainContainer>
        </ShiftFromTop20>
      </>
    );
  };
  const ContentThatGoesAboveTheFlatList = (): any => {
    return (
      <>
        {selectedChildDevData &&
        Object.keys(selectedChildDevData).length != 0 &&
        selectedChildDevData != "" ? (
          <Container>
            {Platform.OS == "ios" ? (
              listLoading == true ? (
                <VideoPlayer
                  style={styles.fullWidth}
                  selectedPinnedArticleData={selectedPinnedArticleData}
                ></VideoPlayer>
              ) : null
            ) : (
              <VideoPlayer
                style={styles.fullWidth}
                selectedPinnedArticleData={selectedPinnedArticleData}
              ></VideoPlayer>
            )}
          </Container>
        ) : null}
        <ArticleHeading>
          {selectedChildDevData &&
          selectedChildDevData != null &&
          selectedChildDevData != "" ? (
            <>
              <FlexDirRowSpace>
                <Heading3>{selectedChildDevData?.name} </Heading3>

                {activeChild.isPremature === "true" ? (
                  <Pressable onPress={(): any => setModalVisible1(true)}>
                    <PrematureTagDevelopment>
                      <Heading5Bold>
                        {t("developScreenprematureText")}
                      </Heading5Bold>
                    </PrematureTagDevelopment>
                  </Pressable>
                ) : null}
              </FlexDirRowSpace>
              <ShiftFromTop5>
                <FlexDirRowSpaceStart>
                  <Flex1>
                    <Pressable onPress={onPressInfo}>
                      <Heading2 style={styles.titleUnderline}>
                        {selectedChildDevData?.title}
                      </Heading2>
                    </Pressable>
                  </Flex1>
                  {selectedPinnedArticleData ? (
                    <IconAreaPress onPress={onPressInfo}>
                      <ShiftFromTop5>
                        <Icon name="ic_info" size={15} color="#000" />
                      </ShiftFromTop5>
                    </IconAreaPress>
                  ) : null}
                </FlexDirRowSpaceStart>
              </ShiftFromTop5>
            </>
          ) : null}
          {selectedChildMilestoneData &&
          selectedChildMilestoneData?.length > 0 ? (
            <FDirCol>
              <DevelopmentStatus>
                <FlexDirRowSpace>
                  <DevelopmentContent>
                    <FDirRow>
                      <OuterIconRow>
                        <OuterIconLeft>
                          {milestonePercent < 100 ? (
                            <IconViewAlert>
                              <Icon name="ic_incom" size={24} color="#FFF" />
                            </IconViewAlert>
                          ) : (
                            <IconViewSuccess>
                              <Icon name="ic_tick" size={16} color="#FFF" />
                            </IconViewSuccess>
                          )}
                        </OuterIconLeft>
                      </OuterIconRow>
                      {milestonePercent < 100 ? (
                        <Heading4>{t("developScreenchartLabel")}</Heading4>
                      ) : (
                        <Heading4>
                          {t("developScreenCompletechartLabel")}
                        </Heading4>
                      )}
                    </FDirRow>
                    <ShiftFromTop5>
                      {milestonePercent < 100 ? (
                        <Heading3>{t("developScreenchartText")}</Heading3>
                      ) : (
                        <Heading3>
                          {t("developScreenCompletechartText")}
                        </Heading3>
                      )}
                    </ShiftFromTop5>
                  </DevelopmentContent>

                  <ProgressCircle
                    percent={milestonePercent}
                    radius={35}
                    borderWidth={6}
                    color={componentColors?.headerColor}
                    shadowColor="#fff"
                    bgColor={componentColors?.backgroundColor}
                  >
                    <Text style={styles.font18}>
                      {convertDigits(milestonePercent?.toString())}
                      {"%"}
                    </Text>
                  </ProgressCircle>
                </FlexDirRowSpace>
              </DevelopmentStatus>
              <FDirRow>
                {milestonePercent < 100 ? (
                  <Heading3Regular>
                    {t("developScreenmileStoneQ")}
                  </Heading3Regular>
                ) : null}
              </FDirRow>
            </FDirCol>
          ) : null}
        </ArticleHeading>
      </>
    );
  };
  return (
    <>
      <View
        style={[
          styles.flex1,
          { backgroundColor: componentColors?.headerColor },
        ]}
      >
        <FocusAwareStatusBar
          animated={true}
          backgroundColor={componentColors?.headerColor}
        />
        <TabScreenHeader
          title={t("developScreenheaderTitle")}
          headerColor={componentColors?.headerColor}
          textColor="#000"
          setProfileLoading={setProfileLoading}
        />
        {currentSelectedChildId &&
        componentColors != null &&
        currentSelectedChildId != 0 ? (
          <View style={styles.bgWhite}>
            <AgeBrackets
              itemColor={componentColors?.headerColorBlack}
              activatedItemColor={componentColors?.headerColor}
              currentSelectedChildId={currentSelectedChildId}
              showSelectedBracketData={showSelectedBracketData}
              ItemTintColor={componentColors?.backgroundColor}
            />
          </View>
        ) : null}

        <FlexCol style={{ backgroundColor: componentColors?.backgroundColor }}>
          {showNoData == true &&
          (Object.keys(selectedChildDevData).length == 0 ||
            selectedChildDevData == undefined) &&
          selectedChildMilestoneData?.length == 0 ? (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          ) : null}
          <View>
            <FlatList
              ref={flatListRef}
              data={selectedChildMilestoneData}
              renderItem={({ item }: any): any => (
                <ChildDevelopmentCollapsibleItem
                  key={item.id}
                  activeChilduuidnew={activeChild.uuid}
                  item={item}
                  sendMileStoneDatatoParent={sendMileStoneDatatoParent}
                  VideoArticlesData={VideoArticlesData}
                  ActivitiesData={ActivitiesData}
                  subItemSaperatorColor={componentColors?.headerColor}
                  currentSelectedChildId={currentSelectedChildId}
                />
              )}
              keyExtractor={(item): any => item.id.toString()}
              nestedScrollEnabled={true}
              ListHeaderComponent={ContentThatGoesAboveTheFlatList}
              ListFooterComponent={ContentThatGoesBelowTheFlatList}
            />
          </View>
        </FlexCol>

        {/* <View>
          <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
        </View> */}

        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={(): any => {
              setModalVisible1(false);
            }}
            onDismiss={(): any => {
              setModalVisible1(false);
            }}
          >
            <PopupOverlay>
              <ModalPopupContainer>
                <PopupCloseContainer>
                  <PopupClose
                    onPress={(): any => {
                      setModalVisible1(false);
                    }}
                  >
                    <Icon name="ic_close" size={16} color="#000" />
                  </PopupClose>
                </PopupCloseContainer>
                <ModalPopupContent>
                  <Heading4Centerr>
                    {t("childSetupprematureMessageNext")}
                  </Heading4Centerr>
                </ModalPopupContent>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </View>

        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default ChildDevelopment;
