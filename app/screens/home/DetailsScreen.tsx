import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { MainContainer, SafeAreaContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ProgressiveImage from '@components/shared/ProgressiveImage';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading6Bold, ShiftFromBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import RNFS from 'react-native-fs';
import HTML from 'react-native-render-html';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import downloadImages from '../../downloadImages/ImageStorage';
import { useScrollToTop } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

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
  let newHeaderColor,newBackgroundColor;
  if(fromScreen === 'Activities')
  {
    newHeaderColor = headerColor;
    newBackgroundColor = backgroundColor;
  }else{
    const themeContext = useContext(ThemeContext);
    newHeaderColor = themeContext.colors.ARTICLES_COLOR;
    newBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  }
  // console.log("detailData--",JSON.stringify(detailData));
  console.log("fromScreen--",fromScreen);
  const [detailDataToUse,setDetailDataToUse] = useState();
  // let detailDataToUse: any;
  // detailDataToUse = detailData;
  // setDetailDataToUse(detailData);
  // fromScreen === 'Activities'
  useEffect(() => {
      const functionOnLoad = async () => {
        if(fromScreen == "VaccinationTab")
        {
          // const articleData = useAppSelector(
          //   (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
          // );
          const articleData = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema,'id == "'+detailData+'"');
          setDetailDataToUse(articleData[0]);
          // detailDataToUse = articleData[0]
          // detailDataToUse = articleData.filter((x:any)=>x.id == detailData) ? articleData.filter((x:any)=>x.id == detailData)[0] : [];
          console.log(detailData,"detailData",detailDataToUse);
        }else {
          // console.log(detailData,"fromScreen--",fromScreen);
          // detailDataToUse = detailData;
          
          setDetailDataToUse(detailData);
          console.log("detailData--",(detailDataToUse));
        }
      }
      functionOnLoad();
  }, [detailData]);
  
  
  const {t} = useTranslation();
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const [cover_image,setCoverImage]=useState('');
  const [filterArray,setFilterArray] = useState([]);
  let fromPage = 'Details';
  useFocusEffect(
    React.useCallback(() => {
      // console.log("details usefocuseffect")
      // filterArray.length = 0;
      const fetchData = async () => {
        let imageArray= [];
        imageArray.push({
           srcUrl: detailDataToUse?.cover_image?.url, 
           destFolder: destinationFolder, 
           destFilename: detailDataToUse?.cover_image?.url.split('/').pop()
       })
         if (await RNFS.exists(destinationFolder + '/' + detailDataToUse?.cover_image?.url.split('/').pop())) {
          console.log("Image already exists");
          setCoverImage("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop());
        }else {
         console.log("Image already exists");
         console.log(imageArray,"..imageArray..");
         const imagesDownloadResult = await downloadImages(imageArray);
         console.log(imagesDownloadResult,"..imagesDownloadResult..");
         setCoverImage("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop());
        }
      }
      fetchData();
     
    },[cover_image])
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
  const ref = React.useRef(null);
  useScrollToTop(ref);
  return (
    <>
    {detailDataToUse ?
        <SafeAreaContainer>
          <FocusAwareStatusBar animated={true} backgroundColor={newHeaderColor} />
          <FlexDirRow
            style={{
              backgroundColor: newHeaderColor,
              maxHeight: 50,
            }}>
            <HeaderIconView>
              <Pressable
                onPress={() => {
                  // navigation.goBack();
                  navigation.navigate({
                    name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
                    params: {categoryArray:listCategoryArray},
                    merge: true,
                  });
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </HeaderIconView>
            <HeaderTitleView>
              <Heading2>{detailDataToUse?.title}</Heading2>
            </HeaderTitleView>
          </FlexDirRow>

          <ScrollView ref={ref} style={{flex: 4}}>
            <View>
              {fromScreen ==="ChildDevelopment" || fromScreen === "Home" ?
                <VideoPlayer selectedPinnedArticleData={detailDataToUse}></VideoPlayer>
              : 
                // <Image
                //   resizeMode="cover"
                //   resizeMethod="scale"
                //   style={{width: '100%', height: 200}}
                //   // source={detailDataToUse.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(detailDataToUse.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
                //   source={require('@assets/trash/defaultArticleImage.png')}
                // />
            
                <ProgressiveImage
                thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
                source={cover_image ? {uri : cover_image}:require('@assets/trash/defaultArticleImage.png')}
                style={{width: '100%', height: 200}}
                resizeMode="cover"
              />
              }
            </View>
            <ShareFavButtons  isFavourite={false} backgroundColor={newHeaderColor} />
            <ArticleDetailsContainer>
              <ShiftFromBottom5>
            {detailDataToUse && detailDataToUse?.category && detailDataToUse?.category!= 0 ?    
              <Heading6Bold>{ categoryData.filter((x: any) => x.id==detailDataToUse.category)[0].name }</Heading6Bold>
              : null }
            </ShiftFromBottom5>
            <Heading2>{detailDataToUse?.title}</Heading2>
            {detailDataToUse && detailDataToUse?.body ?
              <HTML
                source={{html: detailDataToUse?.body}}
                baseFontStyle={{fontSize: 16, color: '#000000'}}
              />
              : null 
            }
            </ArticleDetailsContainer>
            {fromScreen === 'Articles' ? (
              <>
                <View style={{backgroundColor: newBackgroundColor}}>
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                  
                  <ArticleHeading>
                    <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                  </ArticleHeading>
                  <ArticleCategories borderColor={newHeaderColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
                </View>
              </>
            ) : null}
            {fromScreen === 'ChildgrowthTab' || fromScreen === 'ChildgrowthTab2' || fromScreen == "VaccinationTab" ? (
              <>
                <View style={{backgroundColor: newBackgroundColor}}>
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                  
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
                  borderColor={newHeaderColor}
                  backgroundColor={newBackgroundColor}
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
        : null 
      }
    </>
  );
};

export default DetailsScreen;
