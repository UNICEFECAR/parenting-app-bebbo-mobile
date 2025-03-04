import { appConfig } from "../../instances";
import { useFocusEffect } from "@react-navigation/native";
import { RelatedArticlesProps } from "@screens/home/DetailsScreen";
import {
  Heading2,
  Heading3,
  Heading6Bold,
  ShiftFromTopBottom5,
} from "../../instances/bebbo/styles/typography";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { useAppSelector } from "../../../App";
import { dataRealmCommon } from "../../database/dbquery/dataRealmCommon";
import {
  ArticleEntity,
  ArticleEntitySchema,
} from "../../database/schema/ArticleSchema";
import LoadableImage from "../../services/LoadableImage";
import { randomArrayShuffle } from "../../services/Utils";
import {
  ArticleHeading,
  ArticleListContent,
  RelatedArticleContainer,
} from "./ArticlesStyle";
import ShareFavButtons from "./ShareFavButtons";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
`;
const styles = StyleSheet.create({
  cardImage: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
    height: 120,
    left: 0,
    top: 0,
    width: "100%",
  },
  imageView: {
    minHeight: 80,
  },
  imageView1: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  itemPressable: {
    flexDirection: "row",
  },
  listParentView: {
    paddingLeft: 10,
  },
});
const RelatedArticles = (props: RelatedArticlesProps): any => {
  const {
    relatedArticles,
    category,
    currentId,
    fromScreen,
    headerColor,
    backgroundColor,
    listCategoryArray,
    navigation,
    currentSelectedChildId,
  } = props;
  const { t } = useTranslation();
  const netInfo = useNetInfoHook();
  let relartlength = relatedArticles ? relatedArticles.length : 0;
  const articleDataold = useAppSelector((state: any) =>
    state.articlesData.article.articles != ""
      ? JSON.parse(state.articlesData.article.articles)
      : state.articlesData.article.articles
  );
  const articleData = randomArrayShuffle(articleDataold);
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );
  const categoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category
  );
  const favoriteadvices = useAppSelector(
    (state: any) => state.childData.childDataSet.favoriteadvices
  );
  const [relatedArticleData, setrelatedArticleData] = useState<any>([]);
  useFocusEffect(
    React.useCallback(() => {
      setrelatedArticleData([]);
      async function fetchData(): Promise<any> {
        if (relartlength > 0) {
          let relatedData: any = [];
          console.log("From screen", fromScreen);
          console.log("Related articles is", relatedArticles);
          if (fromScreen == "ChildgrowthTab") {
            const filterQuery = JSON.parse(JSON.stringify(relatedArticles))
              .map((x: any) => `id = '${x}'`)
              .join(" OR ");
            relatedData = await dataRealmCommon.getFilteredData<ArticleEntity>(
              ArticleEntitySchema,
              filterQuery
            );
          } else {
            console.log(
              "In artcile data from database",
              articleData.length,
              articleDataold.length
            );
            relatedData = articleData.filter((x: any) =>
              JSON.parse(JSON.stringify(relatedArticles)).includes(x.id)
            );
            console.log("relatedData data from database", relatedData);
          }
          relartlength = relatedData.length;
          if (
            relartlength < appConfig.maxRelatedArticleSize &&
            fromScreen != "ChildgrowthTab"
          ) {
            const catartlength = appConfig.maxRelatedArticleSize - relartlength;
            const filteredArtData = articleData
              .filter((x: any) => {
                const i = relatedData.findIndex(
                  (_item: any) => _item.id === x.id
                );
                return x.category == category && x.id !== currentId && i == -1;
              })
              .slice(0, catartlength);
            setrelatedArticleData([...relatedData, ...filteredArtData]);
          } else {
            setrelatedArticleData(relatedData);
          }
        }
        // go not calclualte for growth screen
        else if (
          relartlength < appConfig.maxRelatedArticleSize &&
          fromScreen != "ChildgrowthTab"
        ) {
          const relatedData: any = [];
          const catartlength = appConfig.maxRelatedArticleSize - relartlength;
          const filteredArtData = articleData
            .filter((x: any) => {
              const i = relatedData.findIndex(
                (_item: any) => _item.id === x.id
              );
              return x.category == category && x.id !== currentId && i == -1;
            })
            .slice(0, catartlength);
          setrelatedArticleData([...filteredArtData]);
        }
      }
      fetchData();
    }, [currentId, relatedArticles])
  );
  const goToArticleDetail = (item: any): any => {
    navigation.push("DetailsScreen", {
      fromScreen: fromScreen
        ? fromScreen == "ChildgrowthTab"
          ? "ChildgrowthTab2"
          : fromScreen
        : "Articles",
      headerColor: headerColor,
      backgroundColor: backgroundColor,
      detailData: item,
      listCategoryArray: listCategoryArray ? listCategoryArray : [],
      currentSelectedChildId: currentSelectedChildId
        ? currentSelectedChildId
        : 0,
      fromCd:
        fromScreen == "ChildDevelopment" || fromScreen == "Home" ? true : false,
      netInfo: netInfo,
    });
  };
  const RenderRelatedArticleItem = ({ item, index }: any): any => {
    return (
      <Pressable
        onPress={(): any => {
          goToArticleDetail(item);
        }}
        key={index}
        style={styles.itemPressable}
      >
        <RelatedArticleContainer key={index}>
          <LoadableImage
            style={styles.cardImage}
            item={item}
            toggleSwitchVal={toggleSwitchVal}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.imageView1}>
            <View style={styles.imageView}>
              <ArticleListContent>
                <ShiftFromTopBottom5>
                  <Heading6Bold>
                    {
                      categoryData.filter((x: any) => x.id == item.category)[0]
                        .name
                    }
                  </Heading6Bold>
                </ShiftFromTopBottom5>
                <Heading3 numberOfLines={2}>{item.title}</Heading3>
              </ArticleListContent>
            </View>
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
          </View>
        </RelatedArticleContainer>
      </Pressable>
    );
  };
  const memoizedValue = useMemo(
    () => RenderRelatedArticleItem,
    [RenderRelatedArticleItem, relatedArticleData]
  );

  return (
    <>
      {relatedArticleData.length > 0 ? (
        <ContainerView key={currentId}>
          <ArticleHeading>
            <Heading2>{t("growthScreenrelatedArticle")}</Heading2>
          </ArticleHeading>
          <View style={styles.listParentView}>
            <FlatList
              data={relatedArticleData}
              horizontal
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              renderItem={memoizedValue}
              keyExtractor={(item): any => item.id}
            />
          </View>
        </ContainerView>
      ) : null}
    </>
  );
};

export default RelatedArticles;
