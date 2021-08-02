import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { MainContainer, SafeAreaContainer } from '@components/shared/Container';
import { FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ProgressiveImage from '@components/shared/ProgressiveImage';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading6Bold, ShiftFromBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import RNFS from 'react-native-fs';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import downloadImages from '../../downloadImages/ImageStorage';
import RelatedActivities from '@components/shared/RelatedActivities';

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
  const {headerColor, fromScreen, backgroundColor,detailData, listCategoryArray, selectedChildActivitiesData, currentSelectedChildId} = route.params;
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
  // console.log(typeof detailData,"--typeof");
  // console.log("detailData--",JSON.stringify(detailData));
  // console.log("fromScreen--",fromScreen);
  const [detailDataToUse,setDetailDataToUse] = useState({});
  // let detailDataToUse: any;
  // detailDataToUse = detailData;
  // setDetailDataToUse(detailData);
  // fromScreen === 'Activities'
  useEffect(() => {
      const functionOnLoad = async () => {
        if(fromScreen == "VaccinationTab" ||fromScreen == "HealthCheckupsTab" || fromScreen == "AddChildHealthCheckup" || fromScreen == "AddChildVaccination")
        {
          // const articleData = useAppSelector(
          //   (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
          // );
          if(typeof detailData == "number")
          {
            const articleData = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema,'id == "'+detailData+'"');
            setDetailDataToUse(articleData[0]);
          }else if(typeof detailData == "object")
          {
            setDetailDataToUse(detailData);
          }
          // detailDataToUse = articleData[0]
          // detailDataToUse = articleData.filter((x:any)=>x.id == detailData) ? articleData.filter((x:any)=>x.id == detailData)[0] : [];
          // console.log(detailData,"detailData",detailDataToUse);
        }else {
          // console.log(detailData,"fromScreen--",fromScreen);
          // detailDataToUse = detailData;
          
          setDetailDataToUse(detailData);
          // console.log("detailData--",(detailDataToUse));
        }
      }
      functionOnLoad();
      return () => {
        // setDetailDataToUse({});
        // setCoverImage('');
        // setFilterArray([]);
      }
  }, [detailData]);
  
  // console.log("detailDataToUse--",(detailDataToUse));
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
          // console.log("Image already exists");
          setCoverImage("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop());
        }else {
        //  console.log("Image already exists");
        //  console.log(imageArray,"..imageArray..");
         const imagesDownloadResult = await downloadImages(imageArray);
        //  console.log(imagesDownloadResult,"..imagesDownloadResult..");
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
  // const setNewFilteredActivityData = (itemId:any) => {
  //   navigation.navigate({
  //     name: fromScreen,
  //     params: {activityCategoryArray:itemId},
  //     merge: true,
  //   });
  // }
  const onFilterArrayChange = (newFilterArray: any) => {
    // console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];
    setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  const bodydata = "<p>Planned daily activities for a child should be adjusted to his/her age but also to individual needs. In addition to nutrition, one must think about time for play and physical activity, sleep and periods when the child is sitting but engaged in activities such as: talking to family members, listening to stories, sitting in front of a screen, riding in a car, eating.</p>\n<p><strong>Children aged three and over </strong></p>\n<ul>\n<li>In this age a child should also spend at least 180 minutes throughout the day in a variety of types of physical activities, of which at least <strong><em>60 minutes is moderate to vigorous intensity</em></strong> physical activity.</li>\n<li>The position of relative rest is not recommended to last longer than 1 hour. Use this time for conversation, sightseeing, reading, storytelling. One hour is also the longest screen time for a child with your mandatory supervision of the content watched.</li>\n<li>Sleep time required goes from 10 to 13 hours including both daytime and night time sleep, and periods of night wake-up times. You should not shorten the child`s sleep time because it may be associated with disorders: growth disorder, obesity, emotional regulation disorder, etc.</li>\n</ul>\n<p><strong><em>Light-intensity physical activity </em></strong>includes activities with energy cost 1.5 to 4.0 times the energy expenditure at rest for the child: bathing, slow walking, or other incidental activities; they do not result in the child getting hot.</p>\n<p><strong><em>Moderate- to vigorous-intensity physical activity </em></strong>includes activities 4–7 times energy expenditure at rest for the child: brisk walking, cycling, running and playing ball games, jumping, swimming, dancing etc. during which the child gets hot and breathless.</p>";
  // const ref = React.useRef(null);
  // useScrollToTop(ref);
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
                  if(fromScreen == "ChildDevelopment")
                  {
                    // console.log("detail screen----",currentSelectedChildId);
                    navigation.navigate({
                      name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
                      params: {currentSelectedChildId:currentSelectedChildId},
                      merge: true,
                    });
                  }
                  else if(fromScreen == "Activities")
                  {
                    // console.log("detail screen----",currentSelectedChildId);
                    navigation.navigate({
                      name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
                      params: {categoryArray:listCategoryArray,currentSelectedChildId:currentSelectedChildId},
                      merge: true,
                    });
                  }
                  else {
                    navigation.navigate({
                      name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
                      params: {categoryArray:listCategoryArray},
                      merge: true,
                    });
                  }
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </HeaderIconView>
            <HeaderTitleView>
              <Heading2>{detailDataToUse?.title}</Heading2>
            </HeaderTitleView>
          </FlexDirRow>

          <ScrollView style={{flex: 4}}>
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
            {detailDataToUse && detailDataToUse.body ?
              <HTML
                source={{html: detailDataToUse.body}}
                baseFontStyle={{fontSize: 16, color: '#000000'}}
              />
               : null 
            } 
            </ArticleDetailsContainer>
            {fromScreen === 'Articles' ? (
              <>
                <FlexCol style={{backgroundColor: newBackgroundColor}}>
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                  
                  <ArticleHeading>
                    <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                  </ArticleHeading>
                  <ArticleCategories borderColor={newHeaderColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
                </FlexCol>
              </>
            ) : null}
            {fromScreen === 'ChildgrowthTab' || fromScreen === 'ChildgrowthTab2' || fromScreen == "VaccinationTab" || fromScreen == "HealthCheckupsTab" || fromScreen == "AddChildVaccination" || fromScreen == "AddChildHealthCheckup"? (
              <>
                <FlexCol style={{backgroundColor: newBackgroundColor}}>
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
                  
                </FlexCol>
              </>
            ) : null}
            
            {fromScreen === 'Activities' ? (
              <>
              <MainContainer>
              <TrackMilestoneView/>
              </MainContainer>
              <View style={{backgroundColor: newBackgroundColor}}>
                <RelatedActivities selectedChildActivitiesData={selectedChildActivitiesData} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation}/>
              </View>
              <BgActivityTint>
                <ArticleHeading>
                  <Heading2>{t('detailScreenActivityHeader')}</Heading2>
                </ArticleHeading>
                <ActivitiesCategories
                  borderColor={newHeaderColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}
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
