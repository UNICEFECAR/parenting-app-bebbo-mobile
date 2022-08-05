import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
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
  const ActivitiesData = ActivitiesDataall.filter((x: any) => x.child_age.includes(activityTaxonomyId));
  const goToActivityDetail = (item: any) => {
    navigation.navigate('DetailsScreen',
      {
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
      async function fetchData() {
        if(favoritegames.length > 0){
          const filterQuery = favoritegames.map((x: any) => `id = '${x}'`).join(' OR ');
          let favData = await dataRealmCommon.getFilteredData<ActivitiesEntity>(ActivitiesEntitySchema, filterQuery);
          if(favData.length == 0){
            favData = ActivitiesDataall.filter((x: any) => (favoritegames.findIndex((y:any)=>y == x.id)) > -1);
          }
          setfavGamesToShow(favData);
        }else {
          setfavGamesToShow([]);
        }
      }
      fetchData()
    },[favoritegames])
  );
  const SuggestedActivities = React.memo(({ item, index }:any) => {
     return (
        <ArticleListContainer>
           <Pressable onPress={() => { goToActivityDetail(item) }} key={index}>
          <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
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
                 <FlatList
                  ref={flatListRef}
                  data={favGamesToShow}
                  onScroll={(e:any)=>{
                  
                  }}
                  nestedScrollEnabled={true}
                  removeClippedSubviews={true} // Unmount components when outside of window 
                  initialNumToRender={4} // Reduce initial render amount
                  maxToRenderPerBatch={4} // Reduce number in each render batch
                  updateCellsBatchingPeriod={100} // Increase time between renders
                  windowSize={7} // Reduce the window size
                  renderItem={({item, index}) => <SuggestedActivities item={item} index={index} /> }
                  keyExtractor={(item:any) => item.id.toString()}
                  />
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}

          </FlexCol>
        </View>
    </>
  );
};
export default FavActivities;

const styles = StyleSheet.create({
  cardImage: {
    height: 200,
    width: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
