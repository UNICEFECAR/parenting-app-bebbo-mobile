import {
  ADVICE_SHARED,
  FAVOURITE_ADVICE_ADDED,
  FAVOURITE_GAME_ADDED,
  GAME_SHARED,
} from "@assets/data/firebaseEvents";
// import { articleCategoryArray,articleCategoryIdArray, shareTextButton } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from "../../instances";
import { MainContainer } from "@components/shared/Container";
import {
  DailyAction,
  DailyArtTitle,
  DailyBox,
  DailyTag,
  DailyTagText,
  OverlayFaded,
} from "@components/shared/HomeScreenStyle";
import { useNavigation } from "@react-navigation/native";
import {
  Heading2,
  Heading4,
  HeadingHome3w,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "styled-components/native";
import { RootState, useAppDispatch, useAppSelector } from "../../../App";
import {
  setDailyArticleGamesCategory,
  setShowedDailyDataCategory,
} from "../../redux/reducers/articlesSlice";
import LoadableImage from "../../services/LoadableImage";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { logEvent } from "../../services/EventSyncService";
import ShareFavButtons from "@components/shared/ShareFavButtons";
import { connect } from "react-redux";
import { FDirRow } from "@components/shared/FlexBoxStyle";
import Icon, {
  OuterIconLeft,
  OuterIconLeft1,
  OuterIconRow,
} from "@components/shared/Icon";
import styled from "styled-components/native";
import { userRealmCommon } from "../../database/dbquery/userRealmCommon";
import {
  setFavouriteAdvices,
  setFavouriteGames,
} from "../../redux/reducers/childSlice";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../../database/schema/ChildDataSchema";

const styles = StyleSheet.create({
  cardImage: {
    flex: 1,
    height: 160,
    position: "relative",
    width: "100%",
  },
  flatlistOuterView: { marginLeft: -7, marginRight: -7, marginTop: 10 },
  linearGradient: {
    flex: 1,
  },
  alignItemsFlexEnd: { alignItems: "flex-end" },
  flexShrink1: { flexShrink: 1 },
});
const DailyReads = (): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext?.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext?.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext?.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const articleDataall = useAppSelector((state: any) =>
    state.articlesData.article.articles != ""
      ? JSON.parse(state.articlesData.article.articles)
      : state.articlesData.article.articles
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );
  const articleData = articleDataall.filter((x: any) =>
    appConfig.articleCategoryIdArray.includes(x.category)
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const ActivitiesDataall = useAppSelector((state: any) =>
    state.utilsData.ActivitiesData != ""
      ? JSON.parse(state.utilsData.ActivitiesData)
      : []
  );
  const activityTaxonomyId =
    activeChild?.taxonomyData?.prematureTaxonomyId ??
    activeChild?.taxonomyData?.id;
  const ActivitiesData = ActivitiesDataall.filter((x: any) =>
    x.child_age.includes(activityTaxonomyId)
  );
  let ArticlesData = articleData.filter((x: any) =>
    x.child_age.includes(activityTaxonomyId)
  );
  const activityCategoryArray = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category
  );
  // console.log(ActivitiesData)
  const dailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.dailyDataCategory
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const showedDailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.showedDailyDataCategory
  );
  const favoriteAdvices = useAppSelector(
    (state: any) => state.childData.childDataSet.favoriteadvices
  );
  const favoriteGames = useAppSelector(
    (state: any) => state.childData.childDataSet.favoritegames
  );
  const [dataToShowInList, setDataToShowInList] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [activityDataToShowInList, setActivityDataToShowInList] = useState([]);
  const goToArticleDetail = (item: any): any => {
    console.log(
      Object.prototype.hasOwnProperty.call(item, "activity_category"),
      "..ds"
    );
    navigation.navigate("DetailsScreen", {
      fromScreen: Object.prototype.hasOwnProperty.call(
        item,
        "activity_category"
      )
        ? "HomeAct"
        : "HomeArt",
      headerColor: Object.prototype.hasOwnProperty.call(
        item,
        "activity_category"
      )
        ? actHeaderColor
        : artHeaderColor,
      backgroundColor: Object.prototype.hasOwnProperty.call(
        item,
        "activity_category"
      )
        ? actBackgroundColor
        : artBackgroundColor,
      detailData: item,
      selectedChildActivitiesData: ActivitiesData,
      fromAdditionalScreen: "DailyScreen",
      netInfo: netInfo,
    });
  };

  useEffect(() => {
    return () => setFetchAgain(false);
  }, []);

  const RenderDailyReadItem = React.memo(({ item, index, isAdvice }: any) => {
    return (
      <View key={`${index}-index`}>
        <Pressable
          onPress={(): any => {
            goToArticleDetail(item);
          }}
          key={index}
        >
          <DailyBox>
            <LoadableImage
              style={styles.cardImage}
              item={item}
              toggleSwitchVal={toggleSwitchVal}
              resizeMode={FastImage.resizeMode.cover}
            ></LoadableImage>
            <View>
              <DailyArtTitle>
                <HeadingHome3w numberOfLines={1}>{item?.title}</HeadingHome3w>
              </DailyArtTitle>
              <OverlayFaded>
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.0)",
                    "rgba(0,0,0,0.5)",
                    "rgba(0,0,0,0.8)",
                  ]}
                  style={styles.linearGradient}
                >
                  <Text></Text>
                </LinearGradient>
              </OverlayFaded>
            </View>
            {/* </ImageBackground> */}
            {/*Tag*/}
            <DailyTag>
              <DailyTagText>
                {item?.hasOwnProperty("activity_category")
                  ? t("homeScreentodaygame")
                  : t("homeScreentodayarticle")}
              </DailyTagText>
            </DailyTag>
            {/*Parent Share , View Details*/}
            {isAdvice ? (
              <ShareFavButtons
                backgroundColor={"#FFF"}
                item={item}
                isFavourite={
                  favoriteAdvices?.findIndex((x: any) => x == item?.id) > -1
                    ? true
                    : false
                }
                isAdvice={true}
              />
            ) : (
              <ShareFavButtons
                backgroundColor={"#FFF"}
                item={item}
                isFavourite={
                  favoriteGames?.findIndex((x: any) => x == item?.id) > -1
                    ? true
                    : false
                }
                isAdvice={false}
              />
            )}
          </DailyBox>
        </Pressable>
      </View>
    );
  });

  useEffect(() => {
    let dailyDataCategory: any, showedDailyDataCategory: any;
    if (dailyDataCategoryall[activeChild.uuid] === undefined) {
      dailyDataCategory = {
        advice: 0,
        games: 0,
        currentadviceid: 0,
        currentgamesid: 0,
        currentDate: "",
        taxonomyid: activeChild.taxonomyData.id,
        prematureTaxonomyId: activityTaxonomyId,
      };
    } else {
      let advid = dailyDataCategoryall[activeChild.uuid].advice;
      let currentadviceid =
        dailyDataCategoryall[activeChild.uuid].currentadviceid;
      let gamid = dailyDataCategoryall[activeChild.uuid].games;
      let currentgamesid =
        dailyDataCategoryall[activeChild.uuid].currentgamesid;
      if (
        dailyDataCategoryall[activeChild.uuid].taxonomyid !=
        activeChild.taxonomyData.id
      ) {
        advid = 0;
        currentadviceid = 0;
      }
      if (
        dailyDataCategoryall[activeChild.uuid]?.prematureTaxonomyId !=
        activityTaxonomyId
      ) {
        gamid = 0;
        currentgamesid = 0;
      }
      const newcurrentdate =
        gamid == 0 || advid == 0
          ? ""
          : dailyDataCategoryall[activeChild.uuid].currentDate;
      dailyDataCategory = {
        advice: advid,
        games: gamid,
        currentadviceid: currentadviceid,
        currentgamesid: currentgamesid,
        currentDate: newcurrentdate,
        taxonomyid: activeChild.taxonomyData.id,
        prematureTaxonomyId: activityTaxonomyId,
      };
    }
    if (showedDailyDataCategoryall[activeChild.uuid] === undefined) {
      showedDailyDataCategory = { advice: [], games: [] };
    } else {
      let advicearr = showedDailyDataCategoryall[activeChild.uuid].advice;
      let gamesarr = showedDailyDataCategoryall[activeChild.uuid].games;
      if (
        dailyDataCategoryall[activeChild.uuid].taxonomyid !=
        activeChild.taxonomyData.id
      ) {
        advicearr = [];
      }
      if (
        dailyDataCategoryall[activeChild.uuid]?.prematureTaxonomyId !=
        activityTaxonomyId
      ) {
        gamesarr = [];
      }
      showedDailyDataCategory = { advice: advicearr, games: gamesarr };
    }
    const nowDate = DateTime.now().toISODate();
    if (
      dailyDataCategory &&
      (dailyDataCategory.currentDate == "" ||
        dailyDataCategory.currentDate < nowDate)
    ) {
      let filteredArticles;

      // comment this code temporary due to premature taxonomy is not available in the data
      // if (activeChild.isPremature === 'true') {
      //   filteredArticles = ArticlesData.filter((article: any) => article.premature === 1).sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at));
      //   ArticlesData = filteredArticles;
      // }
      const articleListData: any = [];
      const activityListData: any = [];
      const articleCategoryArrayNew = appConfig.articleCategoryIdArray.filter(
        (i: any) => ArticlesData.find((f: any) => f.category === i)
      );
      const activityCategoryArrayNew = activityCategoryArray.filter((i: any) =>
        ActivitiesData.find((f: any) => f.activity_category === i.id)
      );
      console.log("[1]", articleCategoryArrayNew);
      const currentIndex = articleCategoryArrayNew.findIndex(
        (_item: any) => _item === dailyDataCategory.advice
      );
      const nextIndex = (currentIndex + 1) % articleCategoryArrayNew.length;
      let categoryArticleData = ArticlesData.filter(
        (x: any) => x.category == articleCategoryArrayNew[nextIndex]
      );
      const obj1 = categoryArticleData.filter(
        (i: any) => !showedDailyDataCategory.advice.find((f: any) => f === i.id)
      );
      let advicearray: any = [];

      if (obj1.length === 0) {
        const abc = showedDailyDataCategory.advice.filter(
          (i: any) => !categoryArticleData.find((f: any) => f.id === i)
        );
        advicearray = [...abc];
      } else {
        advicearray = [...showedDailyDataCategory.advice];
      }

      categoryArticleData = categoryArticleData.filter(
        (i: any) => !advicearray.find((f: any) => f === i.id)
      );

      // Select up to 2 items from categoryArticleData
      let articleDataToShow: any[] = [];
      const count = Math.min(2, categoryArticleData.length);

      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * categoryArticleData.length);
        articleDataToShow.push(categoryArticleData[index]);
        categoryArticleData.splice(index, 1);
      }

      if (articleDataToShow.length > 0) {
        articleDataToShow.forEach((article) => {
          advicearray.push(article.id);
          articleListData.push(article);
        });
      }
      const currentIndex2 = activityCategoryArrayNew.findIndex(
        (_item: any) => _item.id === dailyDataCategory.games
      );
      let nextIndex2 = (currentIndex2 + 1) % activityCategoryArrayNew.length;
      let categoryActivityData = ActivitiesData.filter(
        (x: any) =>
          x.activity_category == activityCategoryArrayNew[nextIndex2]?.id
      );
      if (categoryActivityData.length < 2) {
        const additionalItems = ActivitiesData.filter(
          (x: any) =>
            x.activity_category !== activityCategoryArrayNew[nextIndex2]?.id
        );
        categoryActivityData = categoryActivityData.concat(
          additionalItems.slice(0, 2 - categoryActivityData.length)
        );
      }
      const obj2 = categoryActivityData.filter(
        (i: any) => !showedDailyDataCategory.games.find((f: any) => f === i.id)
      );
      let gamesarray: any = [];
      if (obj2.length === 0) {
        const abc = showedDailyDataCategory.games.filter(
          (i: any) => !categoryActivityData.find((f: any) => f.id === i)
        );
        gamesarray = [...abc];
      } else {
        gamesarray = [...showedDailyDataCategory.games];
      }
      categoryActivityData = categoryActivityData.filter(
        (i: any) => !gamesarray.find((f: any) => f === i.id)
      );

      // Select up to 2 items from categoryActivityData
      let activityDataToShow: any[] = [];
      const count1 = Math.min(2, categoryActivityData.length);

      for (let i = 0; i < count1; i++) {
        const index = Math.floor(Math.random() * categoryActivityData.length);
        activityDataToShow.push(categoryActivityData[index]);
        categoryActivityData.splice(index, 1);
      }

      if (activityDataToShow.length > 0) {
        activityDataToShow.forEach((activity) => {
          gamesarray.push(activity.id);
          activityListData.push(activity);
        });
      }

      setDataToShowInList(articleListData);
      setActivityDataToShowInList(activityListData);
      const dailyDataCategorytoDispatch: any = { ...dailyDataCategoryall };
      const showedDailyDataCategorytoDispatch: any = {
        ...showedDailyDataCategoryall,
      };
      const selectedAdviceCategories = articleDataToShow?.map(
        (_article, index) => articleCategoryArrayNew[nextIndex + index] || 0
      );
      const selectedAdviceIds = articleDataToShow?.map(
        (article) => article?.id || 0
      );

      const selectedGameCategories = activityDataToShow.map(
        (_activity, index) =>
          activityCategoryArrayNew[nextIndex2 + index]?.id || 0
      );
      const selectedGameIds = activityDataToShow.map(
        (activity) => activity?.id || 0
      );

      dailyDataCategorytoDispatch[activeChild.uuid] = {
        advice: selectedAdviceCategories,
        games: selectedGameCategories,
        currentadviceid: selectedAdviceIds,
        currentgamesid: selectedGameIds,
        currentDate: DateTime.now().toISODate(),
        taxonomyid: activeChild?.taxonomyData?.id,
        prematureTaxonomyId: activityTaxonomyId,
      };
      showedDailyDataCategorytoDispatch[activeChild.uuid] = {
        advice: advicearray,
        games: gamesarray,
      };
      dispatch(setDailyArticleGamesCategory(dailyDataCategorytoDispatch));
      dispatch(setShowedDailyDataCategory(showedDailyDataCategorytoDispatch));
    } else {
      const articleDataList: any = [];
      const activityDataList: any = [];

      const articleDataToShow: any = [];
      let filteredArticles;
      // if (activeChild.isPremature === 'true') {
      //   filteredArticles = ArticlesData.filter((article: any) => article.premature === 1).sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at));
      //   ArticlesData = filteredArticles;
      // }
      dailyDataCategory?.currentadviceid?.forEach?.((id: any) => {
        const filteredArticle = ArticlesData.find((x: any) => x.id === id);
        if (filteredArticle) {
          articleDataToShow.push(filteredArticle);
        }
      });

      const activityDataToShow: any = [];
      dailyDataCategory?.currentgamesid?.forEach?.((id: any) => {
        const filteredActivity = ActivitiesData.find((x: any) => x.id === id);
        if (filteredActivity) {
          activityDataToShow.push(filteredActivity);
        }
      });

      if (articleDataToShow.length === 0 && activityDataToShow.length === 0) {
        dispatch(setDailyArticleGamesCategory({}));
        dispatch(setShowedDailyDataCategory({}));
      }

      articleDataToShow.forEach((article: any) => {
        articleDataList.push(article);
      });

      activityDataToShow.forEach((activity: any) => {
        activityDataList.push(activity);
      });

      setDataToShowInList(articleDataList);
      setActivityDataToShowInList(activityDataList);
    }
  }, [activeChild?.uuid, activityTaxonomyId, fetchAgain]);
  const keyExtractor = useCallback((item: any) => item?.id, []);

  const renderItem = useCallback(
    (item: any, index: any, isAdvice: boolean) => {
      return (
        <RenderDailyReadItem item={item} index={index} isAdvice={isAdvice} />
      );
    },
    [favoriteAdvices, favoriteGames]
  );

  const handleEmptyList = () => {
    if (dataToShowInList?.length === 0 && !fetchAgain) {
      setFetchAgain(true);
    }
    return null;
  };

  return (
    <>
      <MainContainer>
        <ShiftFromTopBottom10>
          <Heading2>{t("homeScreendailyReadsTitle")}</Heading2>
        </ShiftFromTopBottom10>
        <View style={styles.flatlistOuterView}>
          <FlatList
            data={dataToShowInList}
            horizontal
            renderItem={({ item, index }: any): any =>
              renderItem(item, index, true)
            }
            keyExtractor={(item: any): any => keyExtractor(item)}
            windowSize={5}
            initialNumToRender={10}
            ListEmptyComponent={() => handleEmptyList()}
          />
        </View>
        <View style={styles.flatlistOuterView}>
          <FlatList
            data={activityDataToShowInList}
            horizontal
            renderItem={({ item, index }: any): any =>
              renderItem(item, index, false)
            }
            keyExtractor={(item: any): any => keyExtractor(item)}
            windowSize={5}
            initialNumToRender={10}
          />
        </View>
      </MainContainer>
    </>
  );
};

export default DailyReads;
