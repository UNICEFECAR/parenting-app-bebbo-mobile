import ActivitiesCategories from "@components/ActivitiesCategories";
import AgeBrackets from "@components/AgeBrackets";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ActivityBox,
  ArticleHeading,
  ArticleListContainer,
  ArticleListBox,
  ArticleListContent,
  MainActivityBox,
  SearchBox,
  SearchInput,
} from "@components/shared/ArticlesStyle";
import { ButtonTextSmLine } from "@components/shared/ButtonGlobal";
import { DividerAct } from "@components/shared/Divider";
import FirstTimeModal from "@components/shared/FirstTimeModal";
import { Flex2, Flex4, FlexCol } from "@components/shared/FlexBoxStyle";
import { PrematureTagActivity } from "@components/shared/PrematureTag";
import ShareFavButtons from "@components/shared/ShareFavButtons";
import TabScreenHeader from "@components/TabScreenHeader";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading3,
  Heading4,
  Heading4Center,
  Heading4Centerr,
  Heading5Bold,
  Heading6Bold,
  ShiftFromTop5,
  ShiftFromTopBottom5,
  SideSpacing10,
} from "@styles/typography";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../../App";
import { setInfoModalOpened } from "../../../redux/reducers/utilsSlice";
import LoadableImage from "../../../services/LoadableImage";
import {
  ACTIVITY_SEARCHED,
  GAME_AGEGROUP_SELECTED,
} from "@assets/data/firebaseEvents";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import Icon, { IconClearPress, OuterIconRow } from "@components/shared/Icon";
import ModalPopupContainer, {
  PopupOverlay,
  PopupCloseContainer,
  PopupClose,
  ModalPopupContent,
} from "@components/shared/ModalPopupStyle";
import { userRealmCommon } from "../../../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../../../database/schema/ChildDataSchema";
import FastImage from "react-native-fast-image";
import { isPregnancy, randomArrayShuffle } from "../../../services/Utils";
import { activitiesTintcolor, bgcolorWhite2, greyCode } from "@styles/style";
import useNetInfoHook from "../../../customHooks/useNetInfoHook";
import {
  logEvent,
  synchronizeEvents,
} from "../../../services/EventSyncService";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import MiniSearch from "minisearch";
import { ActivityHistoryEntity } from "../../../database/schema/ActivitySearchHistorySchema";
import VectorImage from "react-native-vector-image";
import OutsidePressHandler from "react-native-outside-press";
import { appConfig } from "../../../instances";
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route: any;
  navigation: ActivitiesNavigationProp;
};
const styles = StyleSheet.create({
  activityHeadingView: {
    flexDirection: "row",
  },
  ageBracketView: {
    backgroundColor: bgcolorWhite2,
  },
  cardImage: {
    alignSelf: "center",
    flex: 1,
    height: 200,
    width: "100%",
  },
  containerView: {
    backgroundColor: activitiesTintcolor,
    flex: 1,
  },
  flex1View: {
    flex: 1,
  },
  customHeading3: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  historyItem: {
    borderBottomColor: greyCode,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 10,
  },
  historyList: {
    backgroundColor: bgcolorWhite2,
    left: 0,
    paddingBottom: 10,
    position: "absolute",
    right: 0,
    top: 51,
    zIndex: 1,
  },
  historyItemClickList: {
    flex: 1,
    marginTop: 110,
  },
  historyText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  headingBoldStyle: {
    justifyContent: "center",
    paddingBottom: 15,
    paddingTop: 17,
  },
  pressableHeading: {
    flex: 1,
    maxWidth: "40%",
  },
  pressableMilestone: {
    paddingBottom: 15,
    paddingTop: 15,
  },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15,
  },
});
const Activities = ({ route, navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  let sectionListRef: any;
  const themeContext = useContext(ThemeContext);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const headerColor = themeContext?.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext?.colors.ACTIVITIES_TINTCOLOR;
  const headerColorBlack = themeContext?.colors.ACTIVITIES_TEXTCOLOR;
  const backgroundColorList = themeContext?.colors.ARTICLES_LIST_BACKGROUND;
  const fromPage = "Activities";
  const childAge = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : []
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const ActivitiesDataold = useAppSelector((state: any) =>
    state.utilsData.ActivitiesData != ""
      ? JSON.parse(state.utilsData.ActivitiesData)
      : []
  );
  // const miniSearchIndexedData = useAppSelector(
  //   (state: any) => state.searchIndex.searchActivityIndex
  // );
  const ActivitiesData = randomArrayShuffle(ActivitiesDataold);
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category
  );
  const MileStonesData = useAppSelector((state: any) =>
    state.utilsData.MileStonesData != ""
      ? JSON.parse(state.utilsData.MileStonesData)
      : []
  );
  const activityTaxonomyId =
    activeChild?.taxonomyData?.prematureTaxonomyId != null &&
    activeChild?.taxonomyData?.prematureTaxonomyId != undefined &&
    activeChild?.taxonomyData?.prematureTaxonomyId != ""
      ? activeChild?.taxonomyData?.prematureTaxonomyId
      : activeChild?.taxonomyData.id;
  const favoritegames = useAppSelector(
    (state: any) => state.childData.childDataSet.favoritegames
  );
  const activityModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsActivityModalOpened
  );
  const modalScreenKey = "IsActivityModalOpened";
  const modalScreenText = "activityModalText";
  const [modalVisible, setModalVisible] = useState(false);
  const [isSerachedQueryText, setIsSearchedQueryText] = useState(false);
  const [queryText, searchQueryText] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>([]);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildActivitiesData, setSelectedChildActivitiesData] =
    useState([]);
  const [suggestedGames, setsuggestedGames] = useState([]);
  const [otherGames, setotherGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setfilteredData] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const [showNoData, setshowNoData] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [childMilestonedata, setchildMilestonedata] = useState([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const setIsModalOpened = async (varkey: any): Promise<any> => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  const getSearchedKeywords = async (): Promise<any> => {
    const realm = await dataRealmCommon.openRealm();
    if (realm != null) {
      const unsynchronizedEvents: any = realm
        .objects("ActivitySearchHistory")
        .sorted("createdAt", true)
        .slice(0, 5)
        .map((entry) => entry.keyword);
      setSearchHistory(unsynchronizedEvents);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("is child premature", activeChild.isPremature);
      // whatever
      if (netInfo.isConnected) {
        synchronizeEvents(netInfo.isConnected);
      }
      getSearchedKeywords();
      setModalVisible(activityModalOpened);
    }, [activityModalOpened])
  );

  const toTop = (): any => {
    // use current
    // flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    if (sectionListRef) {
      sectionListRef.scrollToLocation({
        animated: Platform.OS == "android" ? true : false,
        sectionIndex: 0,
        itemIndex: 0,
      });
    }
  };

  const setFilteredActivityData = async (itemId: any): Promise<any> => {
    setHistoryVisible(false);
    if (
      selectedChildActivitiesData &&
      selectedChildActivitiesData?.length > 0 &&
      selectedChildActivitiesData?.length != 0
    ) {
      if (itemId.length > 0) {
        let newArticleData: any = selectedChildActivitiesData.filter((x: any) =>
          itemId.includes(x.activity_category)
        );
        let titleData = [];
        let bodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText
            .trim()
            .toLowerCase()
            .split(" ")
            .filter((word: any) => word.trim() !== "");
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.search(keyword);
              return results;
            });
            const resultsArrays = await Promise.all(resultsPromises);
            const aggregatedResults = resultsArrays.flat();
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = aggregatedResults.filter(
                (x: any) =>
                  x.child_age.includes(currentSelectedChildId) &&
                  itemId.includes(x.activity_category)
              );
            } else {
              filteredResults = aggregatedResults.filter((x: any) =>
                itemId.includes(x.activity_category)
              );
            }
            //const filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId) && itemId.includes(x.activity_category));
            setfilteredData(filteredResults);
            setLoading(false);
            setIsSearchedQueryText(false);
            toTop();
          } else {
            const results = searchIndex.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              setSelectedCategoryId(itemId);
              const categoryFilteredData = results.filter((x: any) =>
                itemId.includes(x.activity_category)
              );
              filteredResults = categoryFilteredData.filter((x: any) =>
                x.child_age.includes(currentSelectedChildId)
              );
            } else {
              filteredResults = results.filter((x: any) =>
                itemId.includes(x.activity_category)
              );
            }
            //const filteredResults = results.filter((x: any) => x.child_age.includes(currentSelectedChildId) && itemId.includes(x.activity_category));
            setfilteredData(filteredResults);
            setLoading(false);
            setIsSearchedQueryText(false);
            toTop();
          }
        } else {
          setfilteredData(newArticleData);
        }

        setLoading(false);
        setIsSearchedQueryText(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      } else {
        let newArticleData: any =
          selectedChildActivitiesData.length > 0
            ? selectedChildActivitiesData
            : [];
        let titleData = [];
        let bodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText
            .trim()
            .toLowerCase()
            .split(" ")
            .filter((word: any) => word.trim() !== "");
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.search(keyword);
              return results;
            });
            const resultsArrays = await Promise.all(resultsPromises);
            const aggregatedResults = resultsArrays.flat();
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = aggregatedResults.filter((x: any) =>
                x.child_age.includes(currentSelectedChildId)
              );
            } else {
              filteredResults = aggregatedResults;
            }
            //const filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId));
            setfilteredData(filteredResults);
            setLoading(false);
            setIsSearchedQueryText(false);
            toTop();
          } else {
            const results = searchIndex.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = results.filter((x: any) =>
                x.child_age.includes(currentSelectedChildId)
              );
            } else {
              filteredResults = results;
            }
            setfilteredData(filteredResults);
            setLoading(false);
            setIsSearchedQueryText(false);
            toTop();
          }
        } else {
          setfilteredData(newArticleData);
        }
        setLoading(false);
        setIsSearchedQueryText(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      }
    } else {
      setfilteredData([]);
      setLoading(false);
      setIsSearchedQueryText(false);
      setTimeout(() => {
        setshowNoData(true);
      }, 200);
    }
    toTop();
  };
  useFocusEffect(
    React.useCallback(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });
      return (): any => {
        {
          navigation.setParams({ categoryArray: [] });
          showSubscription.remove();
          hideSubscription.remove();
          // route.params?.currentSelectedChildId = 0;
        }
      };
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      if (isSerachedQueryText || queryText == "") {
        //setLoading(true);
        async function fetchData(): Promise<any> {
          console.log("route category data", route.params?.categoryArray);
          if (route.params?.categoryArray) {
            setFilterArray(route.params?.categoryArray);
            setFilteredActivityData(route.params?.categoryArray);
          } else {
            console.log("route category data in else");
            setFilterArray([]);
            setFilteredActivityData([]);
          }
        }
        setIsSearchedQueryText(false);
        if (route.params?.backClicked != "yes") {
          fetchData();
        } else {
          setLoading(false);
        }
      }
      //  }
    }, [
      selectedChildActivitiesData,
      route.params?.categoryArray,
      languageCode,
      queryText,
      isSerachedQueryText,
    ])
  );

  const showSelectedBracketData = (item: any): any => {
    if (item && item?.id !== null) {
      const eventData = {
        name: GAME_AGEGROUP_SELECTED,
        params: { age_id: item.id },
      };
      logEvent(eventData, netInfo.isConnected);
      setCurrentSelectedChildId(item.id);
      setIsSearchedQueryText(true);
      const filteredData = ActivitiesData.filter((x: any) =>
        x.child_age.includes(item.id)
      );
      setSelectedChildActivitiesData(filteredData);
    }
    //  else {
    //   setCurrentSelectedChildId(0);
    //   setIsSearchedQueryText(true)
    //   setSelectedChildActivitiesData(ActivitiesData);
    //   setCurrentChildSelected(true)
    // }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.backClicked != "yes") {
        setshowNoData(false);
        if (
          route.params?.currentSelectedChildId &&
          route.params?.currentSelectedChildId != 0
        ) {
          console.log("if route params 0", route.params);
          const firstChildDevData = childAge.filter(
            (x: any) => x.id == route.params?.currentSelectedChildId
          );
          showSelectedBracketData(firstChildDevData[0]);
        } else {
          console.log(
            "else if route params 0",
            route.params,
            activityTaxonomyId
          );

          const firstChildDevData = childAge.filter(
            (x: any) => x.id == activityTaxonomyId
          );
          showSelectedBracketData(firstChildDevData[0]);
        }
      } else {
        setLoading(false);
        if (route.params?.backClicked == "yes") {
          navigation.setParams({ backClicked: "no" });
        }
      }
    }, [
      activeChild?.uuid,
      languageCode,
      route.params?.currentSelectedChildId,
      activityTaxonomyId,
    ])
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async (): Promise<any> => {
        const filterQuery = 'uuid == "' + activeChild?.uuid + '"';
        const childData = await userRealmCommon.getFilteredData<ChildEntity>(
          ChildEntitySchema,
          filterQuery
        );
        setchildMilestonedata(childData[0].checkedMilestones);
      };
      fetchData();
      return (): any => {
        console.log("unmount activity", route.params);

        navigation.setParams({ backClicked: "no" });

        navigation.setParams({ currentSelectedChildId: 0 });

        navigation.setParams({ categoryArray: [] });
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      setsuggestedGames(
        filteredData.filter(
          (x: any) =>
            x.related_milestone.length > 0 &&
            childMilestonedata.findIndex(
              (y: any) => y == x.related_milestone[0]
            ) == -1
        )
      );
      setotherGames(
        filteredData.filter(
          (x: any) =>
            x.related_milestone.length == 0 ||
            (x.related_milestone.length > 0 &&
              childMilestonedata.findIndex(
                (y: any) => y == x.related_milestone[0]
              ) > -1)
        )
      );
    }, [filteredData, childMilestonedata])
  );

  const goToActivityDetail = (item: any): any => {
    const keywords = queryText
      .trim()
      .toLowerCase()
      .split(" ")
      .filter((word: any) => word.trim() !== "");
    navigation.navigate("DetailsScreen", {
      fromScreen: "Activities",
      headerColor: headerColor,
      backgroundColor: backgroundColor,
      detailData: item,
      listCategoryArray: filterArray,
      selectedChildActivitiesData: selectedChildActivitiesData,
      currentSelectedChildId: currentSelectedChildId,
      queryText: keywords,
      netInfo: netInfo,
    });
  };

  const onFilterArrayChange = (newFilterArray: any): any => {
    setFilterArray(newFilterArray);
  };
  const gotoMilestone = (): any => {
    navigation.navigate("ChildDevelopment", {
      currentSelectedChildId: currentSelectedChildId,
      fromActivitiesScreen: true,
    });
  };
  const SuggestedActivities = ({ item, section, index }: any): any => {
    let milestonedatadetail: any = [];
    if (section.id == 1) {
      const relatedmilestoneid =
        item.related_milestone.length > 0 ? item.related_milestone[0] : 0;
      milestonedatadetail = MileStonesData.filter(
        (x: any) => x.id == relatedmilestoneid
      );
    }
    return (
      <ArticleListBox>
        <Pressable
          onPress={(): any => {
            goToActivityDetail(item);
          }}
          key={index}
        >
          <LoadableImage
            style={styles.cardImage}
            item={item}
            toggleSwitchVal={toggleSwitchVal}
            resizeMode={FastImage.resizeMode.cover}
          />
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>
                {
                  activityCategoryData.filter(
                    (x: any) => x.id == item.activity_category
                  )[0]?.name
                }
              </Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
            {section.id == 1 &&
            milestonedatadetail.length > 0 &&
            childMilestonedata.findIndex(
              (x: any) => x == milestonedatadetail[0]?.id
            ) == -1 ? (
              <MainActivityBox>
                <ActivityBox>
                  <Flex4>
                    <Heading6Bold style={styles.headingBoldStyle}>
                      {t("actScreenpendingMilestone")}{" "}
                      {t("actScreenmilestones")}
                    </Heading6Bold>
                  </Flex4>
                  <Flex2>
                    <Pressable
                      onPress={(): any => gotoMilestone()}
                      style={styles.pressableMilestone}
                    >
                      <ButtonTextSmLine numberOfLines={2}>
                        {t("actScreentrack")} {t("actScreenmilestones")}
                      </ButtonTextSmLine>
                    </Pressable>
                  </Flex2>
                </ActivityBox>
                <ActivityBox>
                  <ShiftFromTop5>
                    <Heading4>{milestonedatadetail[0]?.title}</Heading4>
                  </ShiftFromTop5>
                </ActivityBox>
              </MainActivityBox>
            ) : null}
          </ArticleListContent>
          <ShareFavButtons
            backgroundColor={"#FFF"}
            item={item}
            isFavourite={
              favoritegames.findIndex((x: any) => x == item?.id) > -1
                ? true
                : false
            }
            isAdvice={false}
          />
        </Pressable>
      </ArticleListBox>
    );
  };

  const DATA = [
    {
      id: 1,
      title: t("actScreensugacttxt"),
      data: suggestedGames,
    },
    {
      id: 2,
      title: t("actScreenotheracttxt"),
      data: otherGames,
    },
  ];
  const memoizedValue = useMemo(
    () => SuggestedActivities,
    [SuggestedActivities, DATA]
  );

  const HeadingComponent = React.memo(({ section }: any) => {
    const maxWidthpercent =
      section?.id == 1 && activeChild.isPremature === "true" ? "60%" : "90%";
    return (
      <ArticleHeading>
        <View style={styles.activityHeadingView}>
          <Heading3
            numberOfLines={1}
            style={[styles.customHeading3, { maxWidth: maxWidthpercent }]}
          >
            {section.title}
          </Heading3>
          {section?.id == 1 && activeChild.isPremature === "true" ? (
            <Pressable
              style={styles.pressableHeading}
              onPress={(): any => setModalVisible1(true)}
            >
              <PrematureTagActivity>
                <Heading5Bold numberOfLines={1}>
                  {t("actScreenprematureText")}
                </Heading5Bold>
              </PrematureTagActivity>
            </Pressable>
          ) : null}
        </View>
      </ArticleHeading>
    );
  });
  const [searchIndex, setSearchIndex] = useState<any>(null);
  const suffixes = (term: any, minLength: any): any => {
    if (term === null) {
      return [];
    }
    const tokens = [];
    for (let i = 0; i <= term.length - minLength; i++) {
      tokens.push(term.slice(i));
    }
    return tokens;
  };
  const preprocessActivities = (activities: any): any => {
    return activities.map((activity: any) => ({
      ...activity,
      normalizedTitle: activity.title,
      normalizedSummary: activity.summary,
      normalizedBody: activity.body,
    }));
  };
  //add minisearch on active child article data
  useEffect(() => {
    async function initializeSearchIndex() {
      try {
        const processedActivities = preprocessActivities(ActivitiesData);
        const searchActivittiesData = new MiniSearch({
          processTerm: (term) => suffixes(term, appConfig.searchMinimumLength),
          // tokenize: (text) => {
          //   const words = text.toLowerCase().split(/\s+/);
          //   const ngrams = [];
          //   for (let i = 0; i < words.length - 1; i++) {
          //     ngrams.push(`${words[i]} ${words[i + 1]}`); // Create bigrams
          //   }
          //   return [...words, ...ngrams]; // Return both single words and bigrams
          // },
          extractField: (document, fieldName): any => {
            const arrFields = fieldName.split(".");
            if (arrFields.length === 2) {
              return (document[arrFields[0]] || [])
                .map((arrField: any) => arrField[arrFields[1]] || "")
                .join(" ");
            } else if (arrFields.length === 3) {
              const tmparr = (document[arrFields[0]] || []).flatMap(
                (arrField: any) => arrField[arrFields[1]] || []
              );
              return tmparr.map((s: any) => s[arrFields[2]] || "").join(" ");
            }
            return fieldName
              .split(".")
              .reduce((doc, key) => doc && doc[key], document);
          },
          searchOptions: {
            boost: { title: 2, summary: 1.5, body: 1 },
            bm25: { k: 1.0, b: 0.7, d: 0.5 },
            fuzzy: true,
            // prefix true means it will contain "foo" then search for "foobar"
            prefix: true,
            weights: {
              fuzzy: 0.6,
              prefix: 0.6,
            },
          },
          fields: ["title", "summary", "body"],
          storeFields: [
            "id",
            "type",
            "title",
            "created_at",
            "updated_at",
            "summary",
            "body",
            "activity_category",
            "equipment",
            "type_of_support",
            "child_age",
            "cover_image",
            "related_milestone",
            "mandatory",
            "embedded_images",
          ],
        });
        //processedActivities.forEach((item: any) => searchActivittiesData.add(item));
        searchActivittiesData.addAllAsync(processedActivities);
        setSearchIndex(searchActivittiesData);
      } catch (error) {
        console.log("Error: Retrieve minisearch data", error);
      }
    }
    initializeSearchIndex();
  }, []);
  // useEffect(() => {
  //   console.log('Minisearch is for geames', miniSearchIndexedData)
  // })

  //store previous searched keyword
  const storeSearchKeyword = async (realm: any, keyword: any): Promise<any> => {
    realm.write(() => {
      const storeKeyword = realm.create(
        "ActivitySearchHistory",
        {
          keyword: keyword,
          createdAt: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  };
  const searchList = async (queryText: any): Promise<any> => {
    setHistoryVisible(false);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    Keyboard.dismiss();
    if (queryText != "" && queryText != undefined && queryText != null) {
      const keywords = queryText
        .trim()
        .toLowerCase()
        .split(" ")
        .filter((word: any) => word.trim() !== "");
      if (keywords.length > 1) {
        // const resultsPromises = keywords.map(async (keyword: any) => {
        //   const results = searchIndex.search(keyword);
        //   return results;
        // });
        // const resultsArrays = await Promise.all(resultsPromises);
        const results = searchIndex.search(queryText);
        const aggregatedResults = results.flat();
        let filteredResults: any = null;
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = aggregatedResults.filter((x: any) =>
            selectedCategoryId.includes(x.activity_category)
          );
          filteredResults = categoryFilteredData.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        } else {
          filteredResults = aggregatedResults.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        }
        /// const filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        setfilteredData(filteredResults);
        setLoading(false);
        setIsSearchedQueryText(false);
        toTop();
      } else {
        const results = searchIndex.search(queryText);
        let filteredResults: any = null;
        console.log("selectedCategoryId length", selectedCategoryId);
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = results.filter((x: any) =>
            selectedCategoryId.includes(x.activity_category)
          );
          filteredResults = categoryFilteredData.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        } else {
          console.log("in else of search result", selectedCategoryId);
          filteredResults = results.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          ); //results;
        }
        //const filteredResults = results.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        setfilteredData(filteredResults);
        setLoading(false);
        setIsSearchedQueryText(false);
        toTop();
      }
      const eventData = {
        name: ACTIVITY_SEARCHED,
        params: { activity_searched: queryText },
      };
      logEvent(eventData, netInfo.isConnected);
      const realm = await dataRealmCommon.openRealm();
      storeSearchKeyword(realm, queryText);

      // Update search history state
      const updatedHistoryWithoutClickedItem = searchHistory.filter(
        (item) => item !== queryText
      );
      const updatedHistory = [
        queryText,
        ...updatedHistoryWithoutClickedItem.slice(0, 4),
      ];
      const filterredUpdatedHistory = [...new Set(updatedHistory)];
      setSearchHistory(filterredUpdatedHistory);

      // Delete older entries beyond the latest 5
      const olderEntries = realm
        ?.objects<ActivityHistoryEntity>("ActivitySearchHistory")
        .sorted("createdAt", true)
        .slice(0, 5)
        .map((entry) => entry.keyword);
      if (olderEntries != undefined && olderEntries?.length > 5) {
        realm?.write(() => {
          realm.delete(olderEntries);
        });
      }
    } else {
      setFilteredActivityData(filterArray);
      setLoading(false);
      setIsSearchedQueryText(false);
    }
  };
  const renderSearchHistoryItem = ({ item }: { item: string }): any => (
    <Pressable
      onPress={async (): Promise<any> => {
        Keyboard.dismiss();
        searchQueryText(item);
        setIsSearchedQueryText(true);
        await searchList(item);
      }}
    >
      <View style={styles.historyItem}>
        <View>
          <VectorImage source={require("@images/history.svg")} />
        </View>

        <Text style={styles.historyText}>{item}</Text>
      </View>
    </Pressable>
  );
  const containerView = (color: any) => ({
    ...styles.containerView,
    backgroundColor: color,
  });
  console.log(filteredData, "[DATA]", DATA, MileStonesData);
  return (
    <>
      <OverlayLoadingComponent loading={loading} />
      <View style={containerView(backgroundColorList)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
          style={styles.flex1View}
        >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          {/* <ScrollView nestedScrollEnabled={true}> */}
          <TabScreenHeader
            title={t("actScreenheaderTitle")}
            headerColor={headerColor}
            textColor={headerColorBlack}
            setProfileLoading={setProfileLoading}
          />
          <FlexCol>
            <OutsidePressHandler
              onOutsidePress={() => {
                setHistoryVisible(false);
              }}
            >
              <View style={styles.ageBracketView}>
                <SearchBox>
                  <OuterIconRow>
                    <Pressable
                      style={styles.pressablePadding}
                      onPress={async (e): Promise<any> => {
                        e.preventDefault();
                        Keyboard.dismiss();
                        setIsSearchedQueryText(true);
                        await searchList(queryText);
                      }}
                    >
                      <Icon name="ic_search" size={20} color="#000" />
                    </Pressable>
                  </OuterIconRow>
                  <SearchInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    onFocus={(): any => {
                      setHistoryVisible(true);
                    }}
                    onChangeText={(queryText: any): any => {
                      if (queryText.replace(/\s/g, "") == "") {
                        searchQueryText(queryText.replace(/\s/g, ""));
                        setHistoryVisible(true);
                      } else {
                        searchQueryText(queryText);
                        setHistoryVisible(true);
                      }
                    }}
                    value={queryText}
                    onSubmitEditing={async (event: any): Promise<any> => {
                      console.log("event-", queryText);
                      setHistoryVisible(false);
                      Keyboard.dismiss();
                      setIsSearchedQueryText(true);
                      await searchList(queryText);
                    }}
                    multiline={false}
                    // placeholder="Search for Keywords"
                    placeholder={t("articleScreensearchPlaceHolder")}
                    placeholderTextColor={"#777779"}
                    allowFontScaling={false}
                  />

                  {Platform.OS == "android" &&
                    queryText.replace(/\s/g, "") != "" && (
                      <SideSpacing10>
                        <OuterIconRow>
                          <IconClearPress
                            onPress={async (): Promise<any> => {
                              console.log("cleartext");
                              Keyboard.dismiss();
                              searchQueryText("");
                            }}
                          >
                            <Icon name="ic_close" size={12} color="#fff" />
                          </IconClearPress>
                        </OuterIconRow>
                      </SideSpacing10>
                    )}
                </SearchBox>
                <DividerAct></DividerAct>
                <AgeBrackets
                  isActivity
                  itemColor={headerColorBlack}
                  activatedItemColor={headerColor}
                  currentSelectedChildId={currentSelectedChildId}
                  showSelectedBracketData={showSelectedBracketData}
                  ItemTintColor={backgroundColor}
                />
                {searchHistory.length !== 0 && historyVisible && (
                  <View style={styles.historyList}>
                    <FlatList
                      data={searchHistory}
                      keyboardShouldPersistTaps="handled"
                      renderItem={renderSearchHistoryItem}
                      contentContainerStyle={{ flex: 1 }}
                      keyExtractor={(item, index): any => index.toString()}
                    />
                  </View>
                )}
                <View style={{ backgroundColor: activitiesTintcolor }}>
                  <ActivitiesCategories
                    borderColor={headerColor}
                    filterOnCategory={setFilteredActivityData}
                    fromPage={fromPage}
                    filterArray={filterArray}
                    iconColor={headerColorBlack}
                    onFilterArrayChange={onFilterArrayChange}
                  />
                  {/* <DividerAct></DividerAct> */}
                </View>
              </View>
            </OutsidePressHandler>

            <FlexCol>
              {showNoData == true &&
              suggestedGames?.length == 0 &&
              otherGames?.length == 0 ? (
                <Heading4Center>{t("noDataTxt")}</Heading4Center>
              ) : null}

              <SectionList
                sections={DATA}
                // ref={flatListRef}
                ref={(ref: any): any => (sectionListRef = ref)}
                keyExtractor={(item: any, index: any): any =>
                  String(item?.id) + String(index)
                }
                contentContainerStyle={{ backgroundColor: backgroundColorList }}
                stickySectionHeadersEnabled={false}
                onScroll={(e: any) => {
                  if (keyboardStatus == true) {
                    Keyboard.dismiss();
                  }
                }}
                // initialNumToRender={4}
                // renderItem={({ item, title }) => <Item item={item} title={title}/>}
                removeClippedSubviews={true} // Unmount components when outside of window
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={4} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
                // renderItem={({ item, section, index }) => <SuggestedActivities item={item} section={section.id} index={index} />}
                renderItem={memoizedValue}
                renderSectionHeader={({ section }): any =>
                  section.data.length > 0 ? (
                    <HeadingComponent section={section} />
                  ) : // <Text style={styles.header}>{section.title}</Text>
                  null
                }
              />
            </FlexCol>
          </FlexCol>
          <FirstTimeModal
            modalVisible={modalVisible}
            setIsModalOpened={setIsModalOpened}
            modalScreenKey={modalScreenKey}
            modalScreenText={modalScreenText}
          ></FirstTimeModal>
          <Modal
            animationType="none"
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
          <OverlayLoadingComponent loading={profileLoading} />
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default Activities;
