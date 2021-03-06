import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
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

const FavArticles = (props: any) => {
  const DATA:any[] = [
    // {
    //   id: '1',
    //   imagePath: require('@assets/trash/card1.jpeg'),
    //   title: 'General recommendations for overweight and obese infants',
    // },
    // {
    //   id: '2',
    //   imagePath: require('@assets/trash/card2.jpeg'),
    //   title: 'General recommendations for overweight and obese infants',
    // },
    // {
    //   id: '3',
    //   imagePath: require('@assets/trash/card3.jpeg'),
    //   title: 'General recommendations for overweight and obese infants',
    // },
    // {
    //   id: '4',
    //   imagePath: require('@assets/trash/card4.jpeg'),
    //   title: 'General recommendations for overweight and obese infants',
    // },
    // {
    //   id: '5',
    //   imagePath: require('@assets/trash/card5.jpeg'),
    //   title: 'General recommendations for overweight and obese infants',
    // },
    // {
    //   id: '6',
    //   imagePath: require('@assets/trash/card6.jpeg'),
    //   title: 'Picking stuff around',
    // },
  ];
  const navigation = useNavigation();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);

  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
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
    state.childData.childDataSet.favoriteadvices
  );
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const [favAdvicesToShow,setfavAdvicesToShow] = useState([]);
  const netInfoval = useNetInfoHook();
  const goToArticleDetail = (item:any) => {
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"FavArticles",
      headerColor:artHeaderColor,
      backgroundColor:artBackgroundColor,
      detailData:item,
      // setFilteredArticleData: setFilteredArticleData
    });
  };
//   const renderActivityItem = (item: typeof DATA[0], index: number) => (
// <Pressable onPress={gotoArticle} key={index}>
//       <ArticleListContainer>
//       <Image
//          source={item.imagePath}
//           resizeMode={'cover'}
//          />
//         <ArticleListContent>
//             <ShiftFromTopBottom5>
//           <Heading6Bold>Cognitive</Heading6Bold>
//           </ShiftFromTopBottom5>
//           <Heading3>{item.title}</Heading3>
//           </ArticleListContent>
        
//           <ShareFavButtons backgroundColor={'#FFF'} item={item} isAdvice={true}/>
//       </ArticleListContainer>
//     </Pressable>


//   );
useFocusEffect(
  React.useCallback(() => {
    async function fetchData() {
      console.log("favoriteadvices----",favoriteadvices);
      if(favoriteadvices.length > 0){
        const filterQuery = favoriteadvices.map((x: any) => `id = '${x}'`).join(' OR ');
        console.log("filterQuery favarticles--",filterQuery);
        let favData1 = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema, filterQuery);
       let favData2 = await dataRealmCommon.getFilteredData<VideoArticleEntity>(VideoArticleEntitySchema, filterQuery);
       let favData = [...new Set([...favData1,...favData2])];
       console.log("favData---",favData);
        if(favData.length == 0){
          favData = articleDataall.filter((x: any) => (favoriteadvices.findIndex((y:any)=>y == x.id)) > -1);
          //console.log('offlinedata 2---',favData);
        }
        setfavAdvicesToShow(favData);
      }else {
        setfavAdvicesToShow([]);
      }
    }
    fetchData()
  },[favoriteadvices])
);
  const RenderArticleItem = React.memo(({item, index}) => {
    //console.log("renderArticleItem-",index)
    return(
        <ArticleListContainer>
          <Pressable onPress={() => { goToArticleDetail(item)}} key={index}>
          {(netInfoval.isConnected == true && item && item.cover_video && item.cover_video.url!="" && item.cover_video.url!=undefined) ? 
             <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer> 
            : <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} />
          }
          {/* <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>  */}
           <ArticleListContent>
             <ShiftFromTopBottom5>
           <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold>
           </ShiftFromTopBottom5>
           <Heading3>{item.title}</Heading3>
           </ArticleListContent>
           <ShareFavButtons  backgroundColor={'#FFF'} item={item} fromScreen={'Favourites'} isFavourite = {((favoriteadvices.findIndex((x:any)=>x == item?.id)) > -1) ? true : false} isAdvice={true}/>
           </Pressable>
         </ArticleListContainer>
      

  ) 
});
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: artBackgroundColor,
        }}>
        {/* <ScrollView> */}
          {/* {DATA.map((item, index) => {
            return renderActivityItem(item, index);
          })} */}
          <FlexCol>
          {favAdvicesToShow.length> 0 ? 
                // <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
                <FlatList
                  ref={flatListRef}
                  data={favAdvicesToShow}
                  onScroll={(e)=>{
                    // if(keyboardStatus==true){
                    //   Keyboard.dismiss();
                    // }
                  }}
                  nestedScrollEnabled={true}
                  // keyboardDismissMode={"on-drag"}
                  // keyboardShouldPersistTaps='always'
                  removeClippedSubviews={true} // Unmount components when outside of window 
                  initialNumToRender={4} // Reduce initial render amount
                  maxToRenderPerBatch={4} // Reduce number in each render batch
                  updateCellsBatchingPeriod={100} // Increase time between renders
                  windowSize={7} // Reduce the window size
                  renderItem={({item, index}) => <RenderArticleItem item={item} index={index} />  }
                  keyExtractor={(item) => item.id.toString()}
                  />
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
        {/* </ScrollView> */}
        </FlexCol>
      </View>
    </>
  );
};
export default FavArticles;

const styles = StyleSheet.create({
  
  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    
  },
});
