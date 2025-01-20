import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../database/schema/VideoArticleSchema';
import LoadableImage from '../services/LoadableImage';
import { ArticleListContainer, ArticleListContent } from './shared/ArticlesStyle';
import { FlexCol } from './shared/FlexBoxStyle';
import ShareFavButtons from './shared/ShareFavButtons';
import VideoPlayer from './VideoPlayer';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${(props: any): string => props.theme.colors.ARTICLES_TINTCOLOR};
`;

const styles = StyleSheet.create({

  cardImage: {
    alignSelf: 'center',
    flex: 1,
    height: 200,
    width: '100%',
  },
});

const FavArticles = (): any => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);

  const artHeaderColor = themeContext?.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const flatListRef = useRef(null);
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData?.childDataSet?.favoriteadvices
  );
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const [favAdvicesToShow, setfavAdvicesToShow] = useState([]);
  const netInfo = useNetInfoHook();
  const goToArticleDetail = (item: any): any => {
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "FavArticles",
        headerColor: artHeaderColor,
        backgroundColor: artBackgroundColor,
        detailData: item,
        netInfo: netInfo
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData(): Promise<any> {
        if (favoriteadvices.length > 0) {
          const filterQuery = favoriteadvices.map((x: any) => `id = '${x}'`).join(' OR ');
          const favData1 = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema, filterQuery);
          const favData2 = await dataRealmCommon.getFilteredData<VideoArticleEntity>(VideoArticleEntitySchema, filterQuery);
          let favData: any = [...new Set([...favData1, ...favData2])];
          if (favData.length == 0) {
            favData = articleDataall.filter((x: any) => (favoriteadvices.findIndex((y: any) => y == x.id)) > -1);
          }
          setfavAdvicesToShow(favData);
        } else {
          setfavAdvicesToShow([]);
        }
      }
      fetchData()
    }, [favoriteadvices])
  );
  const RenderArticleItem = React.memo(({ item, index }: any) => {
    return (
      <ArticleListContainer>
        <Pressable onPress={(): any => { goToArticleDetail(item) }} key={index}>
          {(netInfo.isConnected == true && item && item.cover_video && item.cover_video.url != "" && item.cover_video.url != undefined) ?
            <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer>
            : <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} />
          }
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{categoryData.filter((x: any) => x.id == item.category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} fromScreen={'Favourites'} isFavourite={((favoriteadvices.findIndex((x: any) => x == item?.id)) > -1) ? true : false} isAdvice={true} />
        </Pressable>
      </ArticleListContainer>


    )
  });
  return (
    <>
      <ContainerView>
        <FlexCol>
          {favAdvicesToShow.length > 0 ?
            <FlatList
              ref={flatListRef}
              data={favAdvicesToShow}
              nestedScrollEnabled={true}
              removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              renderItem={({ item, index }: any): any => <RenderArticleItem item={item} index={index} />}
              keyExtractor={(item: any): any => item.id.toString()}
            />
            : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
        </FlexCol>
      </ContainerView>
    </>
  );
};
export default FavArticles;
