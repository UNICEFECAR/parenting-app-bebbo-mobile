import { both_child_gender, destinationFolder, maxRelatedArticleSize, videoArticleMandatory } from '@assets/translations/appOfflineData/apiConstants';
import VideoPlayer from '@components/VideoPlayer';
import { useFocusEffect } from '@react-navigation/native';
import { Heading2, Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View,Text, ActivityIndicator  } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../../database/schema/VideoArticleSchema';
import downloadImages from '../../downloadImages/ImageStorage';
import LoadableImage from '../../services/LoadableImage';
import { randomArrayShuffle } from '../../services/Utils';
import { ArticleHeading, ArticleListContent, RelatedArticleContainer, RelatedArticleContainer2 } from './ArticlesStyle';
import ShareFavButtons from './ShareFavButtons';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  /* padding: 15px; */
  margin-top: 10px;
`;
export type RelatedVideoArticlesProps = {
  related_articles?:any,
  related_video_articles?:any,
  category?:any,
  currentId?:any,
  headerColor?:any,
  backgroundColor?:any,
  listCategoryArray?:any,
  navigation?:any,
  fromScreen?:any,
  currentSelectedChildId?:any
}
const RelatedVideoArticles = (props: RelatedVideoArticlesProps) => {
  // console.log(props);
  const { related_articles, category, currentId, fromScreen, headerColor, backgroundColor, listCategoryArray, navigation, currentSelectedChildId } = props;
  // console.log(typeof related_articles);
  // console.log(JSON.parse(JSON.stringify(related_articles)),"---related_articles");
  const { t } = useTranslation();
  let relartlength = related_articles ? related_articles.length : 0;
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const articleData = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const VideoArticlesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  const videoarticleDataold = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
  const videoarticleData = randomArrayShuffle(videoarticleDataold);
  console.log(videoarticleData);
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices
  );
  const renderIndicator = (progress:any, indeterminate:any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
 
  // let relatedArticleData: any[] = [];
  const [relatedArticleData, setrelatedArticleData] = useState<any>([]);
  useFocusEffect(
    React.useCallback(() => {
      // console.log(categoryData,"--in relatedarticle focuseffect",relartlength);
      setrelatedArticleData([]);
      async function fetchData() {
        console.log("related_articles on start--",related_articles);
        if (relartlength > 0) {
          let relatedData: any = [];
          if (fromScreen == "ChildgrowthTab") {
            const filterQuery = JSON.parse(JSON.stringify(related_articles)).map((x: any) => `id = '${x}'`).join(' OR ');
            relatedData = await dataRealmCommon.getFilteredData<VideoArticleEntity>(VideoArticleEntitySchema, filterQuery);
          } else {
            relatedData = videoarticleData.filter((x: any) => JSON.parse(JSON.stringify(related_articles)).includes(x.id));
          }
          // console.log("relatedData--",relatedData.length);
          relartlength = relatedData.length;
          // console.log(relartlength,"relartlength--",maxRelatedArticleSize);
          if (relartlength < maxRelatedArticleSize && fromScreen != "ChildgrowthTab") {
            const catartlength = maxRelatedArticleSize - relartlength;
            // console.log("catartlength--",catartlength);
            // console.log("relatedArticleData--",relatedArticleData);
            const filteredArtData = videoarticleData.filter((x: any) => {
              const i = relatedData.findIndex((_item: any) => _item.id === x.id);
              return x.category == category && x.id !== currentId && i == -1
            }).slice(0, catartlength);
            // console.log(filteredArtData);
            setrelatedArticleData((relatedArticleData: any) => [...relatedData, ...filteredArtData]);
          } else {
            setrelatedArticleData(relatedData);
          }
        }
        // if(category!=5){
        // go not calclualte for growth screen
        else if (relartlength < maxRelatedArticleSize && fromScreen != "ChildgrowthTab") {
          // console.log(relartlength,"relartlength--",maxRelatedArticleSize);
          let relatedData: any = [];
          const catartlength = maxRelatedArticleSize - relartlength;
          // console.log("relatedArticleData--",relatedArticleData);
          const filteredArtData = videoarticleData.filter((x: any) => {
            const i = relatedData.findIndex((_item: any) => _item.id === x.id);
            return x.category == category && x.id !== currentId && i == -1
          }).slice(0, catartlength);
          // console.log(filteredArtData);
          setrelatedArticleData((relatedArticleData: any) => [...filteredArtData]);
        }
        // }
      }
      fetchData()
    }, [currentId,related_articles])
  );
  
  const goToArticleDetail = (item: any) => {
    //console.log(item, fromScreen, headerColor, backgroundColor, listCategoryArray);
    navigation.push('DetailsScreen',
      {
        // fromScreen:fromScreen ? ((fromScreen == "ChildgrowthTab") ? 'ChildgrowthTab2' : (fromScreen == "MileStone" || fromScreen == "MileStoneActivity" ? "ChildDevelopment" : fromScreen)) :"Articles",
        fromScreen: fromScreen ? ((fromScreen == "ChildgrowthTab") ? 'ChildgrowthTab2' : fromScreen) : "Articles",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: listCategoryArray ? listCategoryArray : [],
        currentSelectedChildId: currentSelectedChildId ? currentSelectedChildId : 0
        // setFilteredArticleData: setFilteredArticleData
      });
  };
  const RenderRelatedArticleItem =({item, index}) => {
   // console.log("RenderRelatedArticleItem article",item.id);
    return (
      <Pressable onPress={() => { goToArticleDetail(item) }} key={index}
        style={{ flexDirection: 'row' }}
      >
      <RelatedArticleContainer2 style={{ backgroundColor: '#fff' }} key={index}>    
        {/* <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/> */}
        <View>
          <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer>
        </View>
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <View style={{ minHeight: 80, }}>
                <ArticleListContent>
                  <ShiftFromTopBottom5>
                    {/* <Heading6Bold>Nutrition and BreastFeeding</Heading6Bold> */}
                    <Heading6Bold>{categoryData.filter((x: any) => x.id == item.category)[0].name}</Heading6Bold>
                  </ShiftFromTopBottom5>
                  {/* <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold> */}
                  <Heading3 numberOfLines={2}>{item.title}</Heading3>
                </ArticleListContent>
              </View>
              <ShareFavButtons backgroundColor={'#FFF'} item={item} isFavourite = {((favoriteadvices.findIndex((x:any)=>x == item?.id)) > -1) ? true : false} isAdvice={true}/>

            </View>
        </RelatedArticleContainer2>
      </Pressable>
    )
  };

  const memoizedValue = useMemo(() => RenderRelatedArticleItem, [RenderRelatedArticleItem,relatedArticleData]);

  return (
    <>
      {relatedArticleData.length > 0 ?
        <ContainerView key={currentId}>
          <ArticleHeading>
            <Heading2>{t('relatedVideoArticle')}</Heading2>
          </ArticleHeading>
          <View style={{ paddingLeft: 10, }}>
            <FlatList
              data={relatedArticleData}
              horizontal
              // renderItem={({ item, index }) => renderDailyReadItem(item, index)}
              removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              // renderItem={({item, index}) => <RenderRelatedArticleItem item={item} index={index} />  }
              renderItem={memoizedValue}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ContainerView>
        : null
      }
    </>
  );
};

export default RelatedVideoArticles;

const styles = StyleSheet.create({
  // item: {

  //  width: 300,

  // },
  // btn: {
  //   width: 150,
  //   padding: 5,
  // },
  // btntxt: {
  //   color: '#000',
  // },
  // title: {
  //   padding: 5,
  // },
  // header: {
  //   fontSize: 10,
  //   fontWeight: 'bold',
  //   paddingHorizontal: 5,
  //   paddingTop: 5,
  //   color: '#000',
  // },
  cardImage: {
    width: '100%',
    height: 120,
    flex: 1,
    // position: 'relative',
    top: 0,
    left: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    // backgroundColor: 'red'
  },
});
