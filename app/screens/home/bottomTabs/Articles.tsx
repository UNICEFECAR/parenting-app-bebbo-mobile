import { appConfig } from "../../../instances";
import ArticleCategories from "@components/ArticleCategories";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ArticleListBox,
  ArticleListContent,
  SearchBox,
  SearchInput,
} from "@components/shared/ArticlesStyle";
import { DividerArt } from "@components/shared/Divider";
import FirstTimeModal from "@components/shared/FirstTimeModal";
import { FlexCol } from "@components/shared/FlexBoxStyle";
import Icon, { IconClearPress, OuterIconRow } from "@components/shared/Icon";
import ShareFavButtons from "@components/shared/ShareFavButtons";
import Realm from "realm";
import TabScreenHeader from "@components/TabScreenHeader";
import VideoPlayer from "@components/VideoPlayer";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { articlesTintcolor, bgcolorWhite2, greyCode } from "@styles/style";
import {
  cleanAndOptimizeHtmlText,
  miniSearchConfig,
} from "../../../services/Utils";
import {
  Heading3,
  Heading4Center,
  Heading6Bold,
  ShiftFromTopBottom5,
  SideSpacing10,
} from "@styles/typography";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../../App";
import useNetInfoHook from "../../../customHooks/useNetInfoHook";
import { setInfoModalOpened } from "../../../redux/reducers/utilsSlice";
import LoadableImage from "../../../services/LoadableImage";
import { randomArrayShuffle } from "../../../services/Utils";
import {
  logEvent,
  synchronizeEvents,
} from "../../../services/EventSyncService";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { HistoryEntity } from "../../../database/schema/SearchHistorySchema";
import VectorImage from "react-native-vector-image";
import MiniSearch from "minisearch";
import {
  ADVICE_AGEGROUP_SELECTED,
  ARTICLE_SEARCHED,
} from "@assets/data/firebaseEvents";
import AgeBrackets from "@components/AgeBrackets";
import OutsidePressHandler from "react-native-outside-press";
import {
  resetSearchIndex,
  setArticleSearchIndex,
} from "../../../redux/reducers/articlesSlice";
const { convert } = require("html-to-text");
type ArticlesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
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
    backgroundColor: articlesTintcolor,
    flex: 1,
  },
  flex1View: {
    flex: 1,
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
    position: "absolute",
    paddingBottom: 10,
    right: 0,
    top: 51,
    zIndex: 1,
  },
  historyText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15,
  },
});
export type ArticleCategoriesProps = {
  borderColor?: any;
  filterOnCategory?: any;
  filterArray?: any;
  fromPage?: any;
  onFilterArrayChange?: any;
  iconColor?: string;
  isSelectedPregnancy?: any;
};
const Articles = ({ route, navigation }: any): any => {
  const articleModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsArticleModalOpened
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, searchQueryText] = useState("");
  let searchIndex = useRef(null);
  const [isSerachedQueryText, setIsSearchedQueryText] = useState(false);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [loadingSection, setLoadingSection] = useState<boolean>(true);
  const [suggestedArticles, setsuggestedArticles] = useState([]);
  const dispatch = useAppDispatch();
  const flatListRef = useRef<any>(null);
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    setModalVisible(false);
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };

  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );
  const favoriteadvices = useAppSelector(
    (state: any) => state.childData.childDataSet.favoriteadvices
  );
  const modalScreenKey = "IsArticleModalOpened";
  const modalScreenText = "articleModalText";
  const netInfo = useNetInfoHook();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  //merge array
  const mergearr = (
    articleArrOld: any[],
    videoArtArrOld: any[],
    isShuffle: boolean
  ): any[] => {
    const articleArr = isShuffle
      ? randomArrayShuffle(articleArrOld)
      : articleArrOld;
    const videoArr = isShuffle
      ? randomArrayShuffle(videoArtArrOld)
      : videoArtArrOld;

    if (articleArr.length === 0) return [...videoArr];

    const combinedArr: any[] = [];
    let videoIndex = 0;

    for (let i = 0; i < articleArr.length; i++) {
      combinedArr.push(articleArr[i]);

      // After every `maxArticleSize` articles, insert a video article
      if (
        (i + 1) % appConfig.maxArticleSize === 0 &&
        videoIndex < videoArr.length
      ) {
        combinedArr.push(videoArr[videoIndex]);
        videoIndex++;
      }
    }

    // Push remaining video articles if any left
    while (videoIndex < videoArr.length) {
      combinedArr.push(videoArr[videoIndex]);
      videoIndex++;
    }

    return combinedArr;
  };

  const getSearchedKeywords = async (): Promise<any> => {
    const realm = await dataRealmCommon.openRealm();
    if (realm != null) {
      const unsynchronizedEvents: any = realm
        .objects("SearchHistory")
        .sorted("createdAt", true)
        .slice(0, 5)
        .map((entry) => entry.keyword);
      setSearchHistory(unsynchronizedEvents);
    }
  };

  //store previous searched keyword
  const storeSearchKeyword = async (realm: any, keyword: any): Promise<any> => {
    realm.write(() => {
      const storeKeyword = realm.create(
        "SearchHistory",
        {
          keyword: keyword,
          createdAt: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // const task = InteractionManager.runAfterInteractions(() => {
      if (netInfo.isConnected) {
        synchronizeEvents(netInfo.isConnected);
      }
      getSearchedKeywords();
      setModalVisible(articleModalOpened);
      // });

      return () => {
        // task.cancel(); // clean up on unfocus
      };
    }, [articleModalOpened, netInfo.isConnected])
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.ARTICLES_COLOR;
  const headerTextColor = themeContext?.colors.ARTICLES_TEXTCOLOR;
  const headerColorBlack = themeContext?.colors.ARTICLES_TEXTCOLOR;
  const backgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const backgroundColorList = themeContext?.colors.ARTICLES_LIST_BACKGROUND;
  const { t } = useTranslation();
  //code for getting article dynamic data starts here.
  // let filterArray: string[] = [];
  const fromPage = "Articles";
  const childAge = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : []
  );
  const categoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category
  );
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );

  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const activityTaxonomyId =
    activeChild?.taxonomyData?.prematureTaxonomyId ??
    activeChild?.taxonomyData.id;
  const articleDataall = useAppSelector((state: any) =>
    state.articlesData.article.articles != ""
      ? JSON.parse(state.articlesData.article.articles)
      : state.articlesData.article.articles
  );
  // const isSearchIndex = useAppSelector(
  //   (state: any) => state.articlesData.article.isSearchIndex
  // );
  const articleSearchIndex = useAppSelector(
    (state: any) => state.articlesData.article.searchIndex
  );
  const articleDataOld = articleDataall.filter((x: any) =>
    taxonomyIds.articleCategoryArray.includes(x.category)
  );
  const VideoArticlesDataall = useAppSelector((state: any) =>
    state.utilsData.VideoArticlesData != ""
      ? JSON.parse(state.utilsData.VideoArticlesData)
      : []
  );
  const videoarticleData = VideoArticlesDataall.filter(
    (x: any) =>
      x.mandatory == appConfig.videoArticleMandatory &&
      x.child_age.includes(activeChild.taxonomyData.id) &&
      taxonomyIds?.articleCategoryArray?.includes(x.category)
  );

  let articleData: any = mergearr(articleDataOld, videoarticleData, true);
  const [filteredData, setfilteredData] = useState<any>([]);
  const [showNoData, setshowNoData] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildActivitiesData, setSelectedChildActivitiesData] =
    useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>([]);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const videoIsFocused = useIsFocused();
  const goToArticleDetail = (item: any, queryText: string): any => {
    const keywords = queryText
      .trim()
      .toLowerCase()
      .split(" ")
      .filter((word: any) => word.trim() !== "");
    navigation.navigate("DetailsScreen", {
      fromScreen: "Articles",
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

  const showSelectedBracketData = async (item: any): Promise<any> => {
    // Check if switching from Pregnancy to Other OR from Other to Pregnancy
    if (
      (currentSelectedChildId == appConfig.pregnancyId &&
        item.id !== appConfig.pregnancyId) ||
      (currentSelectedChildId !== appConfig.pregnancyId &&
        item.id == appConfig.pregnancyId)
    ) {
      // Reset category filters
      navigation.setParams({ categoryArray: [] });
      setFilterArray([]);
      onFilterArrayChange([]);
      setFilteredArticleData([]);
    }
    if (item && item?.id !== null) {
      const eventData = {
        name: ADVICE_AGEGROUP_SELECTED,
        params: { age_id: item.id },
      };
      logEvent(eventData, netInfo.isConnected);
      setCurrentSelectedChildId(item.id);
      setIsSearchedQueryText(true);
      const filteredData = articleData.filter((x: any) =>
        x.child_age.includes(item.id)
      );
      setSelectedChildActivitiesData(filteredData);
    } else {
      setCurrentSelectedChildId(0);
      setIsSearchedQueryText(true);
      setSelectedChildActivitiesData(articleData);
    }
  };

  useEffect(() => {
    setsuggestedArticles(filteredData);
  }, [filteredData]);

  const RenderArticleItem = ({ item, index }: any): any => {
    return (
      <ArticleListBox>
        <Pressable
          onPress={(): any => {
            goToArticleDetail(item, queryText);
          }}
          style={{
            backgroundColor: backgroundColorList,
            shadowColor: "red",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 2,
          }}
          key={index}
        >
          {netInfo.isConnected == true &&
            item &&
            item.cover_video &&
            item.cover_video.url != "" &&
            item.cover_video.url != undefined ? (
            videoIsFocused == true ? (
              <View
                style={{
                  padding: 15,
                  overflow: "hidden",
                }}
              >
                <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer>
              </View>
            ) : null
          ) : (
            <LoadableImage
              style={styles.cardImage}
              item={item}
              toggleSwitchVal={toggleSwitchVal}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>
                {categoryData.filter((x: any) => x.id == item.category)[0].name}
              </Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons
            backgroundColor={"#FFF"}
            item={item}
            isFavourite={
              favoriteadvices.findIndex((x: any) => x == item?.id) > -1
                ? true
                : false
            }
            isAdvice={true}
          />
        </Pressable>
      </ArticleListBox>
    );
  };
  const DATA = [
    {
      id: 1,
      title: t("actScreensugacttxt"),
      data: suggestedArticles,
    },
  ];
  const memoizedValue = useMemo(
    () => RenderArticleItem,
    [RenderArticleItem, DATA]
  );
  const toTop = (): any => {
    // use current
    if (flatListRef && flatListRef.current) {
      flatListRef?.current?.scrollToOffset({
        animated: Platform.OS == "android" ? true : false,
        offset: 0,
      });
    }
  };

  const setFilteredArticleData = async (itemId: any): Promise<any> => {
    setHistoryVisible(false);
    if (
      selectedChildActivitiesData &&
      selectedChildActivitiesData.length > 0 &&
      selectedChildActivitiesData.length != 0
    ) {
      if (itemId.length > 0) {
        let newArticleData: any = selectedChildActivitiesData.filter((x: any) =>
          itemId.includes(x.category)
        );
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText
            .trim()
            .toLowerCase()
            .split(" ")
            .filter((word: any) => word.trim() !== "");
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.current.search(keyword);
              return results;
            });
            const resultsArrays = await Promise.all(resultsPromises);
            const aggregatedResults = resultsArrays.flat();
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = aggregatedResults.filter(
                (x: any) =>
                  x.child_age.includes(currentSelectedChildId) &&
                  itemId.includes(x.category)
              );
            } else {
              filteredResults = aggregatedResults.filter((x: any) =>
                itemId.includes(x.category)
              );
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false);
            setIsSearchedQueryText(false);
            toTop();
          } else {
            const results = searchIndex.current.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              const categoryFilteredData = results.filter((x: any) =>
                itemId.includes(x.category)
              );
              filteredResults = categoryFilteredData.filter((x: any) =>
                x.child_age.includes(currentSelectedChildId)
              );
            } else {
              filteredResults = results.filter((x: any) =>
                itemId.includes(x.category)
              );
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false);
            setIsSearchedQueryText(false);
            toTop();
          }
        } else {
          setfilteredData(newArticleData);
        }
        setSelectedCategoryId(itemId);
        setLoadingArticle(false);
        setIsSearchedQueryText(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      } else {
        let newArticleData: any =
          selectedChildActivitiesData.length > 0
            ? selectedChildActivitiesData
            : [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText
            .trim()
            .toLowerCase()
            .split(" ")
            .filter((word: any) => word.trim() !== "");
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.current.search(keyword);
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
            setfilteredData(filteredResults);
            setLoadingArticle(false);
            setIsSearchedQueryText(false);
            toTop();
          } else {
            const results = searchIndex.current.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = results.filter((x: any) =>
                x.child_age.includes(currentSelectedChildId)
              );
            } else {
              filteredResults = results;
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false);
            setIsSearchedQueryText(false);
            toTop();
          }
        } else {
          setfilteredData(newArticleData);
        }
        setLoadingArticle(false);
        setIsSearchedQueryText(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      }
    } else {
      setfilteredData([]);
      setLoadingArticle(false);
      setIsSearchedQueryText(false);
      setTimeout(() => {
        setshowNoData(true);
      }, 200);
    }
    toTop();
  };

  useFocusEffect(
    React.useCallback(() => {
      // const task = InteractionManager.runAfterInteractions(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });

      return () => {
        navigation.setParams({ categoryArray: [] });
        showSubscription.remove();
        hideSubscription.remove();
      };
      // });

      return () => {
        // task.cancel();
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      // const task = InteractionManager.runAfterInteractions(() => {
      if (route.params?.backClicked !== "yes") {
        setshowNoData(false);

        const selectedId = route.params?.currentSelectedChildId;
        const validId =
          selectedId && selectedId !== 0 ? selectedId : activityTaxonomyId;

        const firstChildDevData = childAge.find((x: any) => x.id === validId);
        if (firstChildDevData) {
          showSelectedBracketData(firstChildDevData);
        }
      } else {
        setLoadingArticle(false);
        if (route.params?.backClicked === "yes") {
          navigation.setParams({ backClicked: "no" });
        }
      }
      // });

      return () => {
        // task.cancel();
      };
    }, [
      activeChild?.uuid,
      languageCode,
      route.params?.currentSelectedChildId,
      activityTaxonomyId,
    ])
  );

  useFocusEffect(
    React.useCallback(() => {
      // const task = InteractionManager.runAfterInteractions(() => {
      const fetchData = async (): Promise<void> => {
        const filterQuery = `uuid == "${activeChild?.uuid}"`;
        // await callYourAPI(filterQuery); // if needed
      };
      fetchData();

      return () => {
        navigation.setParams({ backClicked: "no" });
        navigation.setParams({ currentSelectedChildId: 0 });
        navigation.setParams({ categoryArray: [] });
      };
      // });

      return () => {
        // task.cancel();
      };
    }, [activeChild?.uuid])
  );
  const preprocessArticles = (articles: any[]): any[] => {
    return articles.map((article: any) => {
      return {
        ...article,
        normalizedTitle: article.title,
        normalizedSummary: article.summary,
        normalizedBody: cleanAndOptimizeHtmlText(article.body),
      };
    });
  };

  useEffect(() => {
    async function initializeSearchIndex() {
      let videoArticleDataAllCategory: any;
      try {
        if (
          activeChild != null &&
          activeChild.taxonomyData != null &&
          activeChild?.gender != null
        ) {
          videoArticleDataAllCategory = VideoArticlesDataall.filter(
            (x: any) => x.mandatory == appConfig.videoArticleMandatory
          );
        }
        const combineDartArr = mergearr(
          articleDataall,
          videoArticleDataAllCategory,
          false
        );
        articleData = [...combineDartArr];
        const processedArticles = preprocessArticles(combineDartArr);
        const searchIndexData = new MiniSearch(miniSearchConfig);
        // setSearchIndex(searchIndexData);
        searchIndexData.addAllAsync(processedArticles);
        searchIndex.current = searchIndexData;
        setTimeout(() => {
          setLoadingSection(false)
        }, 1000)
        // dispatch(resetSearchIndex(false));
      } catch (error) {
        console.log("Error: Retrieve minisearch data", error);
      }
    }
    // const task = InteractionManager.runAfterInteractions(() => {
    initializeSearchIndex();
    // });
    // return () => task.cancel();
  }, []);
  const onFilterArrayChange = (newFilterArray: any): any => {
    setFilterArray(newFilterArray);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isSerachedQueryText || queryText == "") {
        //setLoadingArticle(true);
        async function fetchData(): Promise<any> {
          if (route.params?.categoryArray) {
            setFilterArray(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray);
          } else {
            setFilterArray([]);
            setFilteredArticleData([]);
          }
        }
        setIsSearchedQueryText(false);
        if (route.params?.backClicked != "yes") {
          fetchData();
        } else {
          setLoadingArticle(false);
        }
      }
    }, [
      selectedChildActivitiesData,
      route.params?.categoryArray,
      languageCode,
      queryText,
      isSerachedQueryText,
    ])
  );

  const searchList = async (queryText: any): Promise<any> => {
    setHistoryVisible(false);
    setLoadingArticle(true);
    // await new Promise((resolve) => setTimeout(resolve, 0));
    Keyboard.dismiss();
    if (
      queryText != "" &&
      queryText != undefined &&
      queryText != null &&
      queryText.length >= 3
    ) {
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
        const results = searchIndex.current.search(queryText);

        const aggregatedResults = results.flat();
        let filteredResults: any = null;
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = aggregatedResults.filter((x: any) =>
            selectedCategoryId.includes(x.category)
          );
          filteredResults = categoryFilteredData.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        } else {
          filteredResults = aggregatedResults.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        }
        setfilteredData(filteredResults);
        setLoadingArticle(false);
        setIsSearchedQueryText(false);
        toTop();
      } else {
        const results = searchIndex.current.search(queryText);

        let filteredResults: any = null;
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = results.filter((x: any) =>
            selectedCategoryId.includes(x.category)
          );
          filteredResults = categoryFilteredData.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        } else {
          filteredResults = results.filter((x: any) =>
            x.child_age.includes(currentSelectedChildId)
          );
        }
        setfilteredData(filteredResults);
        setLoadingArticle(false);
        setIsSearchedQueryText(false);
        toTop();
      }
      const eventData = {
        name: ARTICLE_SEARCHED,
        params: { article_searched: queryText },
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
        ?.objects<HistoryEntity>("SearchHistory")
        .sorted("createdAt", true)
        .slice(0, 5)
        .map((entry) => entry.keyword);
      if (olderEntries != undefined && olderEntries?.length > 5) {
        realm?.write(() => {
          realm.delete(olderEntries);
        });
      }
    } else {
      setFilteredArticleData(filterArray);
      setLoadingArticle(false);
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

  const optimizedFilteredData = useMemo(() => {
    if (filterArray.length === 1 && filterArray[0] == appConfig.weekByWeekId) {
      return [...filteredData].sort((a, b) => a.id - b.id); // ✨ non-mutating sort
    }
    return filteredData;
  }, [filteredData, filterArray]);

  const containerView = (color: any) => ({
    ...styles.containerView,
    backgroundColor: color,
  });
  console.log(searchIndex, "[para]", optimizedFilteredData);
  return (
    <>
      {loadingArticle && <OverlayLoadingComponent loading={loadingArticle} />}
      <View style={containerView(backgroundColorList)}>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
          style={styles.flex1View}
        >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <TabScreenHeader
            title={t("articleScreenheaderTitle")}
            headerColor={headerColor}
            textColor={headerTextColor}
            setProfileLoading={setProfileLoading}
          />
          <FlexCol>
            <OutsidePressHandler
              onOutsidePress={() => {
                console.log("Pressed outside the box!");
                setHistoryVisible(false);
              }}
            >
              <View style={[styles.ageBracketView]}>
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
                <DividerArt></DividerArt>
                <AgeBrackets
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
                <View style={{ backgroundColor: articlesTintcolor }}>
                  <ArticleCategories
                    borderColor={headerColor}
                    iconColor={headerColorBlack}
                    isSelectedPregnancy={
                      currentSelectedChildId == appConfig.pregnancyId
                    }
                    filterOnCategory={setFilteredArticleData}
                    fromPage={fromPage}
                    filterArray={filterArray}
                    onFilterArrayChange={onFilterArrayChange}
                  />
                  {/* <DividerArt></DividerArt> */}
                </View>
              </View>
            </OutsidePressHandler>
            {showNoData == true && suggestedArticles?.length == 0 ? (
              <Heading4Center>{t("noDataTxt")}</Heading4Center>
            ) : null}
            {loadingSection ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#000" style={{}} />
              </View>
            ) :
              <FlatList
                ref={flatListRef}
                data={optimizedFilteredData}
                extraData={[filteredData, optimizedFilteredData]}
                onScroll={(e): any => {
                  if (keyboardStatus == true) {
                    Keyboard.dismiss();
                  }
                }}
                contentContainerStyle={{ backgroundColor: backgroundColorList }}
                nestedScrollEnabled={true}
                // keyboardDismissMode={"on-drag"}
                // keyboardShouldPersistTaps='always'
                removeClippedSubviews={true} // Unmount components when outside of window
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={4} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
                // renderItem={({ item, index }) => <RenderArticleItem item={item} index={index} />}
                renderItem={memoizedValue}
                keyExtractor={(item): any => item.id.toString()}
              />
            }
          </FlexCol>
          <FirstTimeModal
            modalVisible={modalVisible}
            setIsModalOpened={setIsModalOpened}
            modalScreenKey={modalScreenKey}
            modalScreenText={modalScreenText}
          ></FirstTimeModal>
          <OverlayLoadingComponent loading={profileLoading} />
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default React.memo(Articles);
