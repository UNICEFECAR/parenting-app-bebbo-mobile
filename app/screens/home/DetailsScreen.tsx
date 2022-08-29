import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView,HeaderIconPress } from '@components/shared/HeaderContainerStyle';
import { IconML } from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3Regular, Heading6Bold, ShiftFromBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View, BackHandler, Dimensions, StyleSheet  } from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import RelatedActivities from '@components/shared/RelatedActivities';
import table, { IGNORED_TAGS, cssRulesFromSpecs, defaultTableStylesSpecs } from '@native-html/table-plugin';
import WebView from "react-native-webview";
import LoadableImage from '../../services/LoadableImage';
import { DefaultImage } from '@components/shared/Image';
import analytics from '@react-native-firebase/analytics';
import { ADVICE_CATEGORY_SELECTED, ADVICE_DETAILS_OPENED, GAME_CATEGORY_SELECTED, GAME_DETAILS_OPENED } from '@assets/data/firebaseEvents';
import { addSpaceToHtml } from '../../services/Utils';
import RenderImage from '../../services/RenderImage';
import FastImage from 'react-native-fast-image';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../../database/schema/ActivitiesSchema';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../../database/schema/VideoArticleSchema';
import iframe from '@native-html/iframe-plugin';
import RelatedVideoArticles from '@components/shared/RelatedVideoArticles';
import { useIsFocused } from '@react-navigation/native';
import { bgcolorBlack2, bgcolorWhite2 } from '@styles/style';
type DetailsScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};
const styles = StyleSheet.create({
  defaultImage:{height: 200, width: '100%'},
  flex1:{flex: 1},
  htmlCode:{color: bgcolorBlack2, fontSize: 16,margin:0,padding:0},
  marginBottom10:{marginBottom:10},
  maxHeight50:{maxHeight:50},
  scrollView:{backgroundColor:bgcolorWhite2,flex: 4}
});
export type RelatedArticlesProps = {
  related_articles?:any;
  category?:any;
  currentId?:any;
  headerColor?:any;
  backgroundColor?:any;
  listCategoryArray?:any;
  navigation?:any;
  fromScreen?:any;
  currentSelectedChildId?:any;
}
const DetailsScreen = ({route, navigation}: any):any => {
  const {headerColor, fromScreen, backgroundColor,detailData, listCategoryArray, selectedChildActivitiesData, currentSelectedChildId} = route.params;
  console.log(detailData,"..detailData...",fromScreen,"...fromScreen..");
  let newHeaderColor,newBackgroundColor;
  if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
  {
    newHeaderColor = headerColor;
    newBackgroundColor = backgroundColor;
  }else{
    const themeContext = useContext(ThemeContext);
    newHeaderColor = themeContext.colors.ARTICLES_COLOR;
    newBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  }
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices
  );
  const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames
  );
  const {t} = useTranslation();
 
  const [detailDataToUse,setDetailDataToUse] = useState<any>({});
  
  const adviceval = fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities' ?false:true;
  const onHeaderBack =():any=>{
    console.log("onHeaderBack called");
    if(fromScreen == "ChildDevelopment")
    {
      navigation.navigate({
        name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
        params: {currentSelectedChildId:currentSelectedChildId},
        merge: true,
      });
    }
    else if(fromScreen == "MileStone" || fromScreen == "MileStoneActivity")
    {
      navigation.navigate({
        name: "ChildDevelopment",
        params: {currentSelectedChildId:currentSelectedChildId},
        merge: true,
      });
    }
    else if(fromScreen == "Activities")
    {
      navigation.navigate({
        name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
        params: {categoryArray:listCategoryArray,currentSelectedChildId:currentSelectedChildId,backClicked:'yes'},
        merge: true,
      });
    }
    else if(fromScreen == "HomeAct" || fromScreen == "HomeArt")
    {
      navigation.navigate({
        name: fromScreen == "HomeAct" || fromScreen == "HomeArt" ? "Home" : fromScreen,
        params: {categoryArray:listCategoryArray,backClicked:'yes'},
        merge: true,
      });
    }
    else if(fromScreen == "FavActivities" || fromScreen == "FavArticles")
    {
      navigation.navigate({
        name: fromScreen == "FavActivities" || fromScreen == "FavArticles" ? "Favourites" : fromScreen,
        params: {tabIndex:fromScreen == "FavArticles" ? 0 : 1,backClicked:'yes'},
        merge: true,
      });
    }
    else {
      navigation.navigate({
        name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
        params: {categoryArray:listCategoryArray,backClicked:'yes'},
        merge: true,
      });
    }
  }
  useEffect(() => {
    const backAction = ():any => {
      //console.log("dwferfef")
      onHeaderBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
      
  
    return ():any => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  
  useEffect(() => {
      const functionOnLoad = async ():Promise<any> => {
        if(fromScreen == "VaccinationTab" || fromScreen == "HealthCheckupsTab" || fromScreen == "AddChildHealthCheckup" || fromScreen == "AddChildVaccination" || fromScreen == "MileStone" || fromScreen == "HomeArt" || fromScreen == "FavArticles" || fromScreen == "SupportChat")
        {
          console.log(detailData,"..detailData..")
          
          if(typeof detailData == "number")
          {
            const articleData = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema,'id == "'+detailData+'"');
            if(articleData && articleData.length > 0)
            {
              setDetailDataToUse(articleData[0]);
              if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
              {
                 analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+articleData[0]?.activity_category);
                 analytics().logEvent(GAME_DETAILS_OPENED,{game_id: articleData[0]?.id,game_category_id:articleData[0]?.activity_category});    
              }else{
                 analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+articleData[0]?.category);
                 analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:  articleData[0]?.id,advice_catergory_id:articleData[0]?.category});
              }
            }else {
              const videoarticleData = await dataRealmCommon.getFilteredData<VideoArticleEntity>(VideoArticleEntitySchema,'id == "'+detailData+'"');
                if(videoarticleData && videoarticleData.length > 0) {
                  setDetailDataToUse(videoarticleData[0]);
                  if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
                  {
                    analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+videoarticleData[0]?.activity_category);
                    analytics().logEvent(GAME_DETAILS_OPENED,{game_id: videoarticleData[0]?.id,game_category_id:videoarticleData[0]?.activity_category});    
                  }else{
                    analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+videoarticleData[0]?.category);
                    analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:  videoarticleData[0]?.id,advice_catergory_id:videoarticleData[0]?.category});
                  }
                }else {
                    //show alert and back function
                    Alert.alert(t('detailScreenNoDataPopupTitle'), t('newdetailScreenNoDataPopupText'),
                    [
                      { text: t('detailScreenNoDataOkBtn'), onPress: ():any => onHeaderBack() }
                    ]
                  );
                }
            }
          }else if(typeof detailData == "object")
          {
            setDetailDataToUse(detailData);
            if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
            {
               analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+detailData?.activity_category);
               analytics().logEvent(GAME_DETAILS_OPENED,{game_id:detailData?.id,game_category_id:detailData?.activity_category});    
            }else{
               analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+detailData?.category);
               analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:  detailData?.id,advice_catergory_id:detailData?.category});
            }
          }
          
        }else {
        if(fromScreen == "HomeAct"){
          if(typeof detailData == "number")
          {
            const activityData = await dataRealmCommon.getFilteredData<ActivitiesEntity>(ActivitiesEntitySchema,'id == "'+detailData+'"');
            if(activityData && activityData.length > 0)
            {
              setDetailDataToUse(activityData[0]);
              if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
                {
                   analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+activityData[0]?.activity_category);
                   analytics().logEvent(GAME_DETAILS_OPENED,{game_id:activityData[0]?.id,game_category_id:activityData[0]?.activity_category});    
                }else{
                   analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+activityData[0]?.category);
                   analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:activityData[0]?.id,advice_catergory_id:activityData[0]?.category});
                }
            }
            else {
              //show alert and back function
              Alert.alert(t('detailScreenNoDataPopupTitle'), t('newdetailScreenNoDataPopupText'),
              [
                { text: t('detailScreenNoDataOkBtn'), onPress: ():any => onHeaderBack() }
              ]
            );
            }
          }
          else{
            setDetailDataToUse(detailData);
            if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
              {
                 analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+detailData?.activity_category);
                 analytics().logEvent(GAME_DETAILS_OPENED,{game_id:detailData?.id,game_category_id:detailData?.activity_category});    
              }else{
                 analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+detailData?.category);
                 analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:  detailData?.id,advice_catergory_id:detailData?.category});
              }
          }
        }
        else{
          setDetailDataToUse(detailData);
          if(fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities')
            {
               analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+detailData?.activity_category);
               analytics().logEvent(GAME_DETAILS_OPENED,{game_id:detailData?.id,game_category_id:detailData?.activity_category});    
            }else{
               analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+detailData?.category);
               analytics().logEvent(ADVICE_DETAILS_OPENED,{advise_id:  detailData?.id,advice_catergory_id:detailData?.category});
            }
        }
        }
      }
      functionOnLoad();
      return ():any => {
        console.log("in return")
      }

  }, [detailData]);
  
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
  state.bandWidthData?.lowbandWidth
    ? state.bandWidthData.lowbandWidth
    : false,
);
const videoIsFocused = useIsFocused();
console.log(videoIsFocused,"..videoIsFocused");
  const [filterArray,setFilterArray] = useState([]);
  const fromPage = 'Details';
  const setNewFilteredArticleData = (itemId:any):any => {
    navigation.navigate({
      name: fromScreen,
      params: {categoryArray:itemId,backClicked:'no'},
      merge: true,
    });
  }
  
  const onFilterArrayChange = (newFilterArray: any):any => {
    setFilterArray(newFilterArray)
  }
  const cssRules =
  cssRulesFromSpecs({
    ...defaultTableStylesSpecs,
    thOddBackground: 'transparent',
    thEvenBackground: 'transparent',
    trOddBackground: 'transparent',
    trEvenBackground: 'transparent',
    // fontFamily: '"Open Sans"' // beware to quote font family name!
  });
 
  return (
    <>
    {detailDataToUse ?
         <View style={[styles.flex1,{backgroundColor:newHeaderColor}]}>
          <FocusAwareStatusBar animated={true} backgroundColor={newHeaderColor} />
          <FlexDirRow
            style={[styles.maxHeight50,{
              backgroundColor: newHeaderColor
             
            }]}>
            <HeaderIconView>
              <HeaderIconPress
                onPress={onHeaderBack}>
                <IconML name={'ic_back'} color="#000" size={15} />
              </HeaderIconPress>
            </HeaderIconView>
            <HeaderTitleView>
            <Heading2 numberOfLines={1}>{detailDataToUse?.title}</Heading2>
            </HeaderTitleView>
          </FlexDirRow>

          <ScrollView overScrollMode="never" style={styles.scrollView}>
            <View>
              {
              fromScreen ==="ChildDevelopment" || fromScreen === "Home" || (detailDataToUse && detailDataToUse.cover_video && detailDataToUse.cover_video.url!="" && detailDataToUse.cover_video.url!=undefined) ?
              videoIsFocused==true?<VideoPlayer selectedPinnedArticleData={detailDataToUse}></VideoPlayer>:null
              :
              detailDataToUse && detailDataToUse.cover_image && detailDataToUse.cover_image.url!="" && detailDataToUse.cover_image.url!=undefined?
              (<LoadableImage style={styles.defaultImage}  item={detailDataToUse} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>):
              <DefaultImage
              style={styles.defaultImage} 
              source={require('@assets/trash/defaultArticleImage.png')}/>   
              }
            </View>
            {adviceval == true ?
              <ShareFavButtons backgroundColor={newHeaderColor} item={detailDataToUse} isFavourite = {((favoriteadvices.findIndex((x:any)=>x == detailDataToUse?.id)) > -1) ? true : false} isAdvice={adviceval}/>
            : <ShareFavButtons backgroundColor={newHeaderColor} item={detailDataToUse} isFavourite = {((favoritegames.findIndex((x:any)=>x == detailDataToUse?.id)) > -1) ? true : false} isAdvice={adviceval}/> }
            <ArticleDetailsContainer>
              <ShiftFromBottom5>
            {detailDataToUse && detailDataToUse?.category && detailDataToUse?.category!= 0 ?    
              <Heading6Bold>{ categoryData.filter((x: any) => x.id==detailDataToUse.category)[0].name }</Heading6Bold>
              : null }
            </ShiftFromBottom5>
            <Heading2 style={styles.marginBottom10}>{detailDataToUse?.title}</Heading2>
            {detailDataToUse && detailDataToUse?.summary ?
            <Heading3Regular style={styles.marginBottom10}>{detailDataToUse.summary}</Heading3Regular> 
            : null }
            {detailDataToUse && detailDataToUse.body ?
              <HTML
              source={{html: addSpaceToHtml(detailDataToUse.body)}} key={detailDataToUse.id} 
                // source={{html: bodydata}} {...htmlProps}
                baseFontStyle={styles.htmlCode}
                ignoredStyles={['color', 'font-size', 'font-family']}
                tagsStyles={{
                  img: {maxWidth:Dimensions.get('window').width},
                  p:{marginBottom:15,marginTop:0,textAlign:'left'},
                  h1:{marginBottom:0,marginTop:10,textAlign:'left'},
                  h2:{marginBottom:15,marginTop:0,textAlign:'left'},
                  h3:{marginBottom:15,marginTop:0,textAlign:'left'},
                  h4:{marginBottom:15,marginTop:0,textAlign:'left'},
                  h5:{marginBottom:15,marginTop:0,textAlign:'left'},
                  h6:{marginBottom:15,marginTop:0,textAlign:'left'},
                  span:{marginBottom:15,marginTop:0,textAlign:'left'},
                  li:{textAlign:'left'},
                  br:{height:0},
                  iframe:{maxWidth:'100%',height:200}
                }}
           renderers={{
            table,
            iframe,
            img:(attribs:any):any => {
              const imagePath:any = attribs.src;
              console.log(imagePath,"..imagePath");
              if(imagePath!="" && imagePath!=null && imagePath!=undefined){
              const itemnew:any={
                cover_image:{
                  url:imagePath
                }
              };
              console.log(itemnew,"..itemnew")
                return (
                   <RenderImage key={imagePath+"/"+Math.random()} uri={imagePath} itemnew={itemnew} toggleSwitchVal={toggleSwitchVal} />
                );
              }
            },
          }}
          WebView={WebView}
          ignoredTags= {IGNORED_TAGS}
          renderersProps={{
            table: {
              cssRules
              // Put the table config here (previously,
              // the first argument of makeTableRenderer)
            },
            iframe: { webViewProps: { allowsFullscreenVideo: true } }
          }}
        />
               : null 
            } 
            </ArticleDetailsContainer>
            {fromScreen === 'Articles' ? (
              <>
                <FlexCol style={{backgroundColor: newBackgroundColor}}>
                  
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>

                        <RelatedVideoArticles related_articles={detailDataToUse?.related_video_articles ? detailDataToUse?.related_video_articles : []} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
                    
                  <ArticleHeading>
                    <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                  </ArticleHeading>
                  <ArticleCategories borderColor={newHeaderColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
                </FlexCol>
              </>
            ) : null}
            {fromScreen === 'ChildgrowthTab' || fromScreen === 'ChildgrowthTab2' || fromScreen == "VaccinationTab" || fromScreen == "HealthCheckupsTab" || fromScreen == "AddChildVaccination" || fromScreen == "AddChildHealthCheckup" || fromScreen == "MileStone" || fromScreen === 'HomeArt' || fromScreen === 'FavArticles' || fromScreen === 'SupportChat' ? (
              <>
                <FlexCol style={{backgroundColor: newBackgroundColor}}>
                  
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>

                      <RelatedVideoArticles related_articles={detailDataToUse?.related_video_articles ? detailDataToUse?.related_video_articles : []} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
                </FlexCol>
              </>
            ) : null}
            
            {fromScreen === 'Activities' ? (
              <>
              
              <TrackMilestoneView currentSelectedChildId={currentSelectedChildId}/>
              <View style={{backgroundColor: newBackgroundColor}}>
                <RelatedActivities selectedChildActivitiesData={selectedChildActivitiesData} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
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
            {fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities' ? (
              <>
              <TrackMilestoneView currentSelectedChildId={currentSelectedChildId}/>
              <View style={{backgroundColor: newBackgroundColor}}>
                <RelatedActivities selectedChildActivitiesData={selectedChildActivitiesData} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
              </View>
              </>
            ) : null}
            {
              fromScreen ==="ChildDevelopment" || fromScreen === "Home" ?
              <>
              <TrackMilestoneView currentSelectedChildId={currentSelectedChildId}/>
              </>:null
            }
          </ScrollView>
        </View>
        : null 
      }
    </>
  );
};

export default DetailsScreen;