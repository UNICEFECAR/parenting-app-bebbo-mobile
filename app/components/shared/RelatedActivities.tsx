import { destinationFolder, maxRelatedArticleSize } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect } from '@react-navigation/native';
import { RelatedArticlesProps } from '@screens/home/DetailsScreen';
import { Heading2, Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View,Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import downloadImages from '../../downloadImages/ImageStorage';
import LoadableImage from '../../services/LoadableImage';
import { ArticleHeading, ArticleListContent, RelatedArticleContainer } from './ArticlesStyle';
import ShareFavButtons from './ShareFavButtons';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  /* padding: 15px; */
  margin-top: 10px;
`;
type RelatedActivityProps = {
  selectedChildActivitiesData?:any,
  currentId?:any,
  headerColor?:any,
  backgroundColor?:any,
  listCategoryArray?:any,
  navigation?:any,
  fromScreen?:any,
  currentSelectedChildId?:any
}
const RelatedActivities = (props:RelatedActivityProps) => {
  // console.log(props);
  const { selectedChildActivitiesData, currentId,fromScreen,headerColor,backgroundColor,listCategoryArray, navigation,currentSelectedChildId } = props;
  // console.log("in related article ---",selectedChildActivitiesData);
  // console.log(JSON.parse(JSON.stringify(related_articles)),"---related_articles");
  const ActivitiesData = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames
  );
  const {t} = useTranslation();
  const renderIndicator = (progress:any, indeterminate:any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
 
  // let relatedArticleData: any[] = [];
  const [relatedArticleData,setrelatedArticleData] = useState<any>([]);
  useEffect(() => {
      // console.log(categoryData,"--in relatedarticle focuseffect",relartlength);
      setrelatedArticleData([]);
      async function fetchData() {
        // console.log("relartlength on start--",relartlength);
        let actualselectedChildActivitiesData;
        if(typeof selectedChildActivitiesData == "number")
        {
          actualselectedChildActivitiesData = ActivitiesData.filter((x: any) => x.child_age.includes(selectedChildActivitiesData));
        }else if(typeof selectedChildActivitiesData == "object")
        {
          actualselectedChildActivitiesData = selectedChildActivitiesData;
        }
        // if(category!=5){
      // go not calclualte for growth screen
        // else if(relartlength < maxRelatedArticleSize && fromScreen!="ChildgrowthTab") {
          // console.log(relartlength,"relartlength--",maxRelatedArticleSize);
          const catartlength = maxRelatedArticleSize;
          // console.log(relatedArticleData.length,"--selectedChildActivitiesData--",selectedChildActivitiesData);
          if(currentId && currentId!="" && actualselectedChildActivitiesData)
          {
            const filteredArtData = actualselectedChildActivitiesData.filter((x: any)=> {
              const i = relatedArticleData.findIndex((_item: any) => _item.id === x.id);
              return x.id !==currentId && i == -1
            }).slice(0,catartlength);
            // console.log(filteredArtData);
            setrelatedArticleData((relatedArticleData: any) => [...relatedArticleData , ...filteredArtData]);
          }
        // }
      // }
      }
      fetchData()
    }, [currentId]
  );
  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log("details usefocuseffect")
  //     // filterArray.length = 0;
  //     const fetchData = async () => { 
  //       console.log("relatedArticleData lebgth--",relatedArticleData.length);
  //       let imageArraynew:any= [];
  //       if(relatedArticleData?.length>0){
  //         relatedArticleData.map(async (item: any, index: number) => {
  //           if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
  //             if (await RNFS.exists(destinationFolder + '/' + item['cover_image']?.url.split('/').pop())) {
  //             }
  //             else{
  //          let imageArraynew:any= [];
  //           imageArraynew.push({
  //             srcUrl: item['cover_image'].url, 
  //             destFolder: destinationFolder, 
  //             destFilename: item['cover_image'].url.split('/').pop()
  //         })
  //         const imagesDownloadResult = await downloadImages(imageArraynew);
  //       }
  //         }
  //         });
  //         // console.log(imageArraynew,"..imageArray..");
         
  //         // console.log(imagesDownloadResult,"..imagesDownloadResult..");
  //     }
  //     }
  //     fetchData();
     
  //   },[relatedArticleData])
  // );
  //console.log("relatedArticleData---",relatedArticleData);
  const goToArticleDetail = (item:typeof relatedArticleData[0]) => {
    navigation.push('DetailsScreen',
    {
      fromScreen:fromScreen ? ((fromScreen == "ChildgrowthTab") ? 'ChildgrowthTab2' : fromScreen) :"Articles",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: listCategoryArray ? listCategoryArray: null,
      selectedChildActivitiesData: selectedChildActivitiesData,
      currentSelectedChildId: currentSelectedChildId ? currentSelectedChildId : 0
      // setFilteredArticleData: setFilteredArticleData
    });
  };
  const RenderActivityItem = React.memo(({item, index}) => {
   //console.log("RenderActivityItem",item.id);
    return(
      <Pressable onPress={() => { goToArticleDetail(item)}} key={index}
      style={{flexDirection:'row'}}
      >
        <RelatedArticleContainer style={{backgroundColor:'#fff'}}  key={index}>
        
          <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal}/>
          <View style={{minHeight:90,}}>
          <ArticleListContent>
          <ShiftFromTopBottom5>
          {/* <Heading6Bold>Nutrition and BreastFeeding</Heading6Bold> */}
          <Heading6Bold>{ activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name }</Heading6Bold>
          </ShiftFromTopBottom5>
          {/* <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold> */}
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          </View>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} isFavourite = {((favoritegames.findIndex((x:any)=>x == item?.id)) > -1) ? true : false} isAdvice={false}/>
        </RelatedArticleContainer>
      </Pressable>  
   ) 
  });

  return (
    <>
    { relatedArticleData.length > 0 ?
        <ContainerView key={currentId}>
          <ArticleHeading>
          <Heading2>{t('developScreenrelatedAct')}</Heading2>
          </ArticleHeading>
          <View style={{paddingLeft:10,}}>
          <FlatList
            data={relatedArticleData}
            horizontal
            // renderItem={({item, index}) => renderDailyReadItem(item, index)}
            removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
            renderItem={({item, index}) => <RenderActivityItem item={item} index={index} />  }
            keyExtractor={(item) => item.id}
          />
          </View>
        </ContainerView>
        : null 
    }
    </>
  );
};

export default RelatedActivities;

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
