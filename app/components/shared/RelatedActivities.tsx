import { maxRelatedArticleSize } from '@assets/translations/appOfflineData/apiConstants';
import { Heading2, Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { useAppSelector } from '../../../App';
import LoadableImage from '../../services/LoadableImage';
import { randomArrayShuffle } from '../../services/Utils';
import { ArticleHeading, ArticleListContent, RelatedArticleContainer } from './ArticlesStyle';
import ShareFavButtons from './ShareFavButtons';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
`;
type RelatedActivityProps = {
  selectedChildActivitiesData?:any;
  currentId?:any;
  headerColor?:any;
  backgroundColor?:any;
  listCategoryArray?:any;
  navigation?:any;
  fromScreen?:any;
  currentSelectedChildId?:any;
}
const styles = StyleSheet.create({
  cardImage: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
    height: 120,
    left: 0,
    top: 0,
    width: '100%'
  },
  imageView: {
    minHeight:90
  },
  itemPressable: {
    flexDirection:'row'
  },
  listParentView : {
    paddingLeft:10
  }
});
const RelatedActivities = (props:RelatedActivityProps):any => {
  const { selectedChildActivitiesData, currentId,fromScreen,headerColor,backgroundColor,listCategoryArray, navigation,currentSelectedChildId } = props;
  const ActivitiesDataold = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const ActivitiesData = randomArrayShuffle(ActivitiesDataold)
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
  const netInfo = useNetInfoHook();
  
  const [relatedArticleData,setrelatedArticleData] = useState<any>([]);
  useEffect(() => {    
      setrelatedArticleData([]);
      async function fetchData():Promise<any> {        
        let actualselectedChildActivitiesData;
        if(typeof selectedChildActivitiesData == "number")
        {
          actualselectedChildActivitiesData = ActivitiesData.filter((x: any) => x.child_age.includes(selectedChildActivitiesData));
        }else if(typeof selectedChildActivitiesData == "object")
        {
          const selectedChildActivitiesDatanew = [...selectedChildActivitiesData];
          actualselectedChildActivitiesData = randomArrayShuffle([...selectedChildActivitiesDatanew]);
        }
      // go not calclualte for growth screen
          const catartlength = maxRelatedArticleSize;
           if(currentId && currentId!="" && actualselectedChildActivitiesData)
          {
            const filteredArtData = actualselectedChildActivitiesData.filter((x: any)=> {
              const i = relatedArticleData.findIndex((_item: any) => _item.id === x.id);
              return x.id !==currentId && i == -1
            }).slice(0,catartlength);
            
            setrelatedArticleData((relatedArticleData: any) => [...relatedArticleData , ...filteredArtData]);
          }
        
      }
      fetchData()
    }, [currentId]
  );
  
  const goToArticleDetail = (item:typeof relatedArticleData[0]):any => {
    navigation.push('DetailsScreen',
    {
      fromScreen:fromScreen ? ((fromScreen == "ChildgrowthTab") ? 'ChildgrowthTab2' : fromScreen) :"Articles",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: listCategoryArray ? listCategoryArray: null,
      selectedChildActivitiesData: selectedChildActivitiesData,
      currentSelectedChildId: currentSelectedChildId ? currentSelectedChildId : 0,
      netInfo: netInfo
     });
  };
  const RenderActivityItem = React.memo(({item, index}:any) => {
   return(
      <Pressable onPress={():any => { goToArticleDetail(item)}} key={index}
      style={styles.itemPressable}
      >
        <RelatedArticleContainer key={index}>
          <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>
          <View style={styles.imageView}>
          <ArticleListContent>
          <ShiftFromTopBottom5>
          <Heading6Bold>{ activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name }</Heading6Bold>
          </ShiftFromTopBottom5>
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
          <View style={styles.listParentView}>
          <FlatList
            data={relatedArticleData}
            horizontal
             removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              renderItem={({item, index}:any):any => <RenderActivityItem item={item} index={index} />  }
              keyExtractor={(item:any):any => item.id}
          />
          </View>
        </ContainerView>
        : null 
    }
    </>
  );
};

export default RelatedActivities;


