import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Heading3,
  Heading4Center,
  Heading6Bold,
  ShiftFromTopBottom5,
} from "../instances/bebbo/styles/typography";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import styled, { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../App";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import {
  ActivitiesEntity,
  ActivitiesEntitySchema,
} from "../database/schema/ActivitiesSchema";
import LoadableImage from "../services/LoadableImage";
import {
  ArticleListBox,
  ArticleListContainer,
  ArticleListContent,
} from "./shared/ArticlesStyle";
import { FlexCol } from "./shared/FlexBoxStyle";
import ShareFavButtons from "./shared/ShareFavButtons";
import BackgroundColors from "./shared/BackgroundColors";
import { selectActiveChild, selectActivitiesDataAll, selectActivityCategoryArray } from "../services/selectors";

const ContainerView = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${(props: any): string =>
    props.theme.colors.ACTIVITIES_TINTCOLOR};
`;

const styles = StyleSheet.create({
  cardImage: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 200,
    width: "100%",
  },
});

const FavActivities = (): any => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext?.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext?.colors.ACTIVITIES_TINTCOLOR;
  const backgroundColorList = themeContext?.colors.ARTICLES_LIST_BACKGROUND;
  const flatListRef = useRef(null);
  const activityCategoryData = useAppSelector(selectActivityCategoryArray);
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );
  const activeChild = useAppSelector(selectActiveChild);
  const ActivitiesDataall = useAppSelector(selectActivitiesDataAll);
  const favoritegames = useAppSelector(
    (state: any) => state.childData.childDataSet.favoritegames
  );
  const [favGamesToShow, setfavGamesToShow] = useState([]);
  const activityTaxonomyId =
    activeChild?.taxonomyData.prematureTaxonomyId ||
    activeChild?.taxonomyData.id;
  const ActivitiesData = ActivitiesDataall.filter((x: any) =>
    x.child_age.includes(activityTaxonomyId)
  );
  const goToActivityDetail = (item: any): any => {
    navigation.navigate("DetailsScreen", {
      fromScreen: "FavActivities",
      headerColor: actHeaderColor,
      backgroundColor: actBackgroundColor,
      detailData: item,
      listCategoryArray: [],
      selectedChildActivitiesData: ActivitiesData,
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData(): Promise<any> {
        if (favoritegames.length > 0) {
          const filterQuery = favoritegames
            .map((x: any) => `id = '${x}'`)
            .join(" OR ");
          let favData = await dataRealmCommon.getFilteredData<ActivitiesEntity>(
            ActivitiesEntitySchema,
            filterQuery
          );
          if (favData.length == 0) {
            favData = ActivitiesDataall.filter(
              (x: any) => favoritegames.findIndex((y: any) => y == x.id) > -1
            );
          }
          setfavGamesToShow(favData);
        } else {
          setfavGamesToShow([]);
        }
      }
      fetchData();
    }, [favoritegames])
  );
  const SuggestedActivities = React.memo(({ item, index }: any) => {
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
                  )[0].name
                }
              </Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons
            backgroundColor={"#FFF"}
            item={item}
            fromScreen={"Favourites"}
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
  });
  return (
    <>
      <ContainerView style={{ backgroundColor: backgroundColorList }}>
        <FlexCol>
          {favGamesToShow.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={favGamesToShow}
              nestedScrollEnabled={true}
              contentContainerStyle={{ backgroundColor: backgroundColorList }}
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              renderItem={({ item, index }: any): any => (
                <SuggestedActivities item={item} index={index} />
              )}
              keyExtractor={(item: any): any => item.id.toString()}
            />
          ) : (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          )}
        </FlexCol>
      </ContainerView>
    </>
  );
};
export default FavActivities;
