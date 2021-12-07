import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../database/schema/ActivitiesSchema';
import LoadableImage from '../services/LoadableImage';
import { ArticleListContainer, ArticleListContent } from './shared/ArticlesStyle';
import { FlexCol } from './shared/FlexBoxStyle';
import ShareFavButtons from './shared/ShareFavButtons';

const FavActivities = (props: any) => {
  const navigation = useNavigation()
  const DATA:any[] = [
    // {
    //   id: '1',
    //   imagePath: require('@assets/trash/card4.jpeg'),
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
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const flatListRef = useRef(null);
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
  state.bandWidthData?.lowbandWidth
    ? state.bandWidthData.lowbandWidth
    : false,
);
const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
const ActivitiesDataall = useAppSelector(
  (state: any) =>
    state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
);
const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames
  );
  const [favGamesToShow,setfavGamesToShow] = useState([]);
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
//const ActivitiesData = ActivitiesDataall.filter((x: any) => x.child_age.includes(activeChild?.taxonomyData.id))
const ActivitiesData = ActivitiesDataall.filter((x: any) => x.child_age.includes(activityTaxonomyId))
  
const goToActivityDetail = (item: any) => {
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "FavActivities",
        headerColor: actHeaderColor,
        backgroundColor: actBackgroundColor,
        detailData: item,
        listCategoryArray: [],
        selectedChildActivitiesData: ActivitiesData,
        // currentSelectedChildId: currentSelectedChildId
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        if(favoritegames.length > 0){
          const filterQuery = favoritegames.map((x: any) => `id = '${x}'`).join(' OR ');
          //console.log("filterQuery favgames--",filterQuery);
          let favData = await dataRealmCommon.getFilteredData<ActivitiesEntity>(ActivitiesEntitySchema, filterQuery);
          //console.log("favData---",favData);
          if(favData.length == 0){
            favData = ActivitiesDataall.filter((x: any) => (favoritegames.findIndex((y:any)=>y == x.id)) > -1);
            //console.log('offlinedata 2---',favData);
          }
          setfavGamesToShow(favData);
        }else {
          setfavGamesToShow([]);
        }
      }
      fetchData()
    },[favoritegames])
  );
  const SuggestedActivities = React.memo(({ item, index }) => {
   // console.log("SuggestedActivities", item.id);
    return (
        <ArticleListContainer>
           <Pressable onPress={() => { goToActivityDetail(item) }} key={index}>
          <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal}/>
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
            {/* keep below code ActivityBox for future use */}
            {/* {section == 1 ? 
            <ActivityBox>
            <View>
              <Heading6Bold>
                {t('actScreenpendingMilestone')} {t('actScreenmilestones')}
              </Heading6Bold>
              <ShiftFromTop5>
              <Heading4>{'Laugh at Human face'}</Heading4>
              </ShiftFromTop5>
            </View>
            <View>
              <ButtonTextSmLine>
                {t('actScreentrack')} {t('actScreenmilestones')}
              </ButtonTextSmLine>
            </View>
          </ActivityBox>
        : null
        } */}
          </ArticleListContent>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} fromScreen={'Favourites'} isFavourite = {((favoritegames.findIndex((x:any)=>x == item?.id)) > -1) ? true : false} isAdvice={false} />
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
          backgroundColor: actBackgroundColor,
        }}>
          <FlexCol>
       {favGamesToShow.length> 0 ? 
                // <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
                <FlatList
                  ref={flatListRef}
                  data={favGamesToShow}
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
                  renderItem={({item, index}) => <SuggestedActivities item={item} index={index} /> }
                  keyExtractor={(item) => item.id.toString()}
                  />
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}

          </FlexCol>
        </View>
    </>
  );
};
export default FavActivities;

const styles = StyleSheet.create({
  // item: {
  //   height: '100%',
  //   backgroundColor: '#FFF',
  //   // padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   borderRadius: 5,
  //   flex: 1,
  // },
  // title: {
  //   fontSize: 16,
  //   padding: 10,
  //   // flex: 1,
  //   color: '#000',
  // },
  // label: {
  //   fontSize: 12,
  //   paddingLeft: 10,
  //   // flex: 1,
  //   color: '#000',
  // },
  cardImage: {
    height: 200,
    width: '100%',
    // flex: 1,
    // alignSelf: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
