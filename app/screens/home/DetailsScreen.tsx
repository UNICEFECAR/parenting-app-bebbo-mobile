import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { MainContainer, SafeAreaContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading6Bold, ShiftFromBottom5 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { useAppSelector } from '../../../App';

type DetailsScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};

export type RelatedArticlesProps = {
  related_articles?:any,
  category?:any,
  currentId?:any,
  headerColor?:any,
  backgroundColor?:any,
  listCategoryArray?:any,
  navigation?:any,
  fromScreen?:any,
}
// const headerColor = 'red';
const DetailsScreen = ({route, navigation}: any) => {
  const {headerColor, fromScreen, backgroundColor,detailData, listCategoryArray} = route.params;
  // const {headerColor, fromScreen, backgroundColor,detailData,setFilteredArticleData} = route.params;
  console.log(detailData,"detailData");
  const {t} = useTranslation();
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const [filterArray,setFilterArray] = useState([]);
  let fromPage = 'Details';
  useFocusEffect(
    React.useCallback(() => {
      // console.log("details usefocuseffect")
      // filterArray.length = 0;
    },[])
  );
    
  const setNewFilteredArticleData = (itemId:any) => {
    navigation.navigate({
      name: fromScreen,
      params: {categoryArray:itemId},
      merge: true,
    });
  }
  const onFilterArrayChange = (newFilterArray: any) => {
    // console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];
    setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexDirRow
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <Pressable
              onPress={() => {
                // navigation.goBack();
                navigation.navigate({
                  name: fromScreen,
                  params: {categoryArray:listCategoryArray},
                  merge: true,
                });
              }}>
              <Icon name={'ic_back'} color="#000" size={15} />
            </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2>{detailData?.title}</Heading2>
          </HeaderTitleView>
        </FlexDirRow>

        <ScrollView style={{flex: 4}}>
          <View>
            {fromScreen ==="ChildDevelopment" || fromScreen === "Home" ?
              <VideoPlayer selectedPinnedArticleData={detailData}></VideoPlayer>
            : 
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{width: '100%', height: 200}}
                // source={detailData.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(detailData.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
                source={require('@assets/trash/defaultArticleImage.png')}
              />
            }
          </View>
          <ShareFavButtons  isFavourite={false} backgroundColor={headerColor} />
          <ArticleDetailsContainer>
            <ShiftFromBottom5>
          {detailData && detailData?.category && detailData?.category!= 0 ?    
            <Heading6Bold>{ categoryData.filter((x: any) => x.id==detailData.category)[0].name }</Heading6Bold>
            : null }
          </ShiftFromBottom5>
          <Heading2>{detailData?.title}</Heading2>
          {detailData && detailData?.body ?
            <HTML
              source={{html: detailData?.body}}
              baseFontStyle={{fontSize: 16, color: '#000000'}}
            />
            : null 
          }
          </ArticleDetailsContainer>
          {fromScreen === 'Articles' ? (
            <>
              <View style={{backgroundColor: backgroundColor}}>
                
                 {/* <RelatedArticles related_articles={[6781]} category={detailData.category} currentId={detailData.id} /> */}
                   <RelatedArticles related_articles={detailData?.related_articles} category={detailData?.category} fromScreen={fromScreen} currentId={detailData?.id} headerColor={headerColor} backgroundColor={backgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                
                <ArticleHeading>
                  <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                </ArticleHeading>
                <ArticleCategories borderColor={headerColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
              </View>
            </>
          ) : null}
          {fromScreen === 'ChildgrowthTab' ? (
            <>
              <View style={{backgroundColor: backgroundColor}}>
                
                 {/* <RelatedArticles related_articles={[6781]} category={detailData.category} currentId={detailData.id} /> */}
                   <RelatedArticles related_articles={detailData?.related_articles} category={detailData?.category} fromScreen={fromScreen} currentId={detailData?.id} headerColor={headerColor} backgroundColor={backgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                
              </View>
            </>
          ) : null}
          
          {fromScreen === 'Activities' ? (
            <>
            <MainContainer>
            <TrackMilestoneView/>
            </MainContainer>
            <BgActivityTint>
              <ArticleHeading>
                <Heading2>{t('detailScreenActivityHeader')}</Heading2>
              </ArticleHeading>
              <ActivitiesCategories
                borderColor={headerColor}
                backgroundColor={backgroundColor}
              />
              </BgActivityTint>
            </>
          ) : null}
          {
            fromScreen ==="ChildDevelopment" || fromScreen === "Home" ?
            <>
            <TrackMilestoneView/>
            </>:null
          }
        </ScrollView>
      </SafeAreaContainer>
    </>
  );
};

export default DetailsScreen;
