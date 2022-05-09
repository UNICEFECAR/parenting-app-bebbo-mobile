import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView,HeaderIconPress } from '@components/shared/HeaderContainerStyle';
import Icon, { IconML } from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3Regular, Heading6Bold, ShiftFromBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View,ActivityIndicator,Text, BackHandler, Dimensions, Image  } from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import downloadImages from '../../downloadImages/ImageStorage';
import RelatedActivities from '@components/shared/RelatedActivities';
import table, { IGNORED_TAGS, cssRulesFromSpecs, defaultTableStylesSpecs } from '@native-html/table-plugin';
import WebView from "react-native-webview";
import LoadableImage from '../../services/LoadableImage';
import { DefaultImage } from '@components/shared/Image';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { ADVICE_CATEGORY_SELECTED, ADVICE_DETAILS_OPENED, GAME_CATEGORY_SELECTED, GAME_DETAILS_OPENED } from '@assets/data/firebaseEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addSpaceToHtml } from '../../services/Utils';
import RenderImage from '../../services/RenderImage';
import FastImage from 'react-native-fast-image';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../../database/schema/ActivitiesSchema';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../../database/schema/VideoArticleSchema';
import iframe from '@native-html/iframe-plugin';

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
  currentSelectedChildId?:any
}
// const headerColor = 'red';
const DetailsScreen = ({route, navigation}: any) => {
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

  // console.log(typeof detailData,"--typeof");
  // console.log("detailData--",JSON.stringify(detailData));
  // console.log("fromScreen--",fromScreen);
  const [detailDataToUse,setDetailDataToUse] = useState({});
  // let detailDataToUse: any;
  // detailDataToUse = detailData;
  // setDetailDataToUse(detailData);
  // fromScreen === 'Activities'
  const adviceval = fromScreen === 'Activities' || fromScreen === 'MileStoneActivity' || fromScreen === 'HomeAct' || fromScreen === 'FavActivities' ?false:true;
  useEffect(() => {
    const backAction = () => {
      //console.log("dwferfef")
      onHeaderBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
      
  
    return () => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  useEffect(() => {
      const functionOnLoad = async () => {
        if(fromScreen == "VaccinationTab" || fromScreen == "HealthCheckupsTab" || fromScreen == "AddChildHealthCheckup" || fromScreen == "AddChildVaccination" || fromScreen == "MileStone" || fromScreen == "HomeArt" || fromScreen == "FavArticles" || fromScreen == "SupportChat")
        {
          console.log(detailData,"..detailData..")
          // const articleData = useAppSelector(
          //   (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
          // );
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
                      { text: t('detailScreenNoDataOkBtn'), onPress: () => onHeaderBack() }
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
          // detailDataToUse = articleData[0]
          // detailDataToUse = articleData.filter((x:any)=>x.id == detailData) ? articleData.filter((x:any)=>x.id == detailData)[0] : [];
          // console.log(detailData,"detailData",detailDataToUse);
        }else {
          // console.log(detailData,"fromScreen--",fromScreen);
          // detailDataToUse = detailData;
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
                { text: t('detailScreenNoDataOkBtn'), onPress: () => onHeaderBack() }
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
  const toggleSwitchVal = useAppSelector((state: any) =>
  state.bandWidthData?.lowbandWidth
    ? state.bandWidthData.lowbandWidth
    : false,
);
  const [isImgLoaded, setIsImageLoaded] = useState(false);
  const [cover_image,setCoverImage]=useState();
  const [filterArray,setFilterArray] = useState([]);
  const [showImageLoader,setImageLoader] = useState(false);
  const renderIndicator = (progress:any, indeterminate:any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
  let fromPage = 'Details';
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log("details usefocuseffect")
  //     // filterArray.length = 0;
  //     const fetchData = async () => {
  //       console.log("322Image already exists","file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop());
  //       console.log(await RNFS.exists(destinationFolder + '/' + detailDataToUse?.cover_image?.url.split('/').pop()));
  //        if (await RNFS.exists(destinationFolder + '/' + detailDataToUse?.cover_image?.url.split('/').pop())) {
  //         console.log("Image already exists11");
  //         console.log("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop())
  //         //setCoverImage(encodeURI("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop()));
  //         setImageLoader(false);
  //       }else {
  //          console.log("11Image already exists");
  //       // 
  //       //  console.log(imageArray,"..imageArray..");
  //       let imageArray= [];
  //       imageArray.push({
  //          srcUrl: detailDataToUse?.cover_image?.url, 
  //          destFolder: destinationFolder, 
  //          destFilename: detailDataToUse?.cover_image?.url.split('/').pop()
  //      })
  //        const imagesDownloadResult = await downloadImages(imageArray);
  //       //  console.log(imagesDownloadResult,"..imagesDownloadResult..");
  //        //setCoverImage(encodeURI("file://" + destinationFolder + detailDataToUse?.cover_image?.url.split('/').pop()));
  //        setImageLoader(false);
  //       }
  //     }
  //     if (detailDataToUse?.cover_image != "" && detailDataToUse?.cover_image!= null && detailDataToUse?.cover_image != undefined && detailDataToUse?.cover_image?.url != "" && detailDataToUse?.cover_image?.url != null && detailDataToUse?.cover_image?.url != undefined) {
  //       console.log(detailDataToUse)
  //       fetchData();
  //     }
     
  //   },[detailDataToUse?.cover_image?.url])
  // );
    
  const setNewFilteredArticleData = (itemId:any) => {
    navigation.navigate({
      name: fromScreen,
      params: {categoryArray:itemId,backClicked:'no'},
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
  // const bodydata = "<table>\n<tbody>\n<tr>\n<td style='text-align:left'>\n<p>Planned daily activities for a child should be adjusted to his/her age but also to individual needs. In addition to nutrition, one must think about time for play and physical activity, sleep and periods when the child is sitting but engaged in activities such as: talking to family members, listening to stories, sitting in front of a screen, riding in a car, eating.</p>\n<p><strong>Children aged three and over </strong></p>\n<ul>\n<li>In this age a child should also spend at least 180 minutes throughout the day in a variety of types of physical activities, of which at least <strong><em>60 minutes is moderate to vigorous intensity</em></strong> physical activity.</li>\n<li>The position of relative rest is not recommended to last longer than 1 hour. Use this time for conversation, sightseeing, reading, storytelling. One hour is also the longest screen time for a child with your mandatory supervision of the content watched.</li>\n<li>Sleep time required goes from 10 to 13 hours including both daytime and night time sleep, and periods of night wake-up times. You should not shorten the child`s sleep time because it may be associated with disorders: growth disorder, obesity, emotional regulation disorder, etc.</li>\n</ul>\n<p><strong><em>Light-intensity physical activity </em></strong>includes activities with energy cost 1.5 to 4.0 times the energy expenditure at rest for the child: bathing, slow walking, or other incidental activities; they do not result in the child getting hot.</p>\n<p><strong><em>Moderate- to vigorous-intensity physical activity </em></strong>includes activities 4–7 times energy expenditure at rest for the child: brisk walking, cycling, running and playing ball games, jumping, swimming, dancing etc. during which the child gets hot and breathless.</p>\n</td>\n</tr>\n</tbody>\n</table>\n";
  // const ref = React.useRef(null);
  // useScrollToTop(ref);
  // console.log("bodydata--",bodydata);
  const cssRules =
  cssRulesFromSpecs({
    ...defaultTableStylesSpecs,
    thOddBackground: 'transparent',
    thEvenBackground: 'transparent',
    trOddBackground: 'transparent',
    trEvenBackground: 'transparent',
    // fontFamily: '"Open Sans"' // beware to quote font family name!
  });

  const htmlProps = {
    WebView,
    renderers: {
      table
    },
    ignoredTags: IGNORED_TAGS,
    renderersProps: {
      table: {
        cssRules
        // Put the table config here (previously,
        // the first argument of makeTableRenderer)
      }
    }
  };
  const onHeaderBack =()=>{
    console.log("onHeaderBack called");
    if(fromScreen == "ChildDevelopment")
    {
      // console.log("detail screen----",currentSelectedChildId);
      navigation.navigate({
        name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
        params: {currentSelectedChildId:currentSelectedChildId},
        merge: true,
      });
    }
    else if(fromScreen == "MileStone" || fromScreen == "MileStoneActivity")
    {
      // console.log("detail screen----",currentSelectedChildId);
      navigation.navigate({
        name: "ChildDevelopment",
        params: {currentSelectedChildId:currentSelectedChildId},
        merge: true,
      });
    }
    else if(fromScreen == "Activities")
    {
      //console.log("detail screen----",currentSelectedChildId);
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
      // navigation.goBack();
      navigation.navigate({
        name: fromScreen == "ChildgrowthTab2" ? "ChildgrowthTab" : fromScreen,
        params: {categoryArray:listCategoryArray,backClicked:'yes'},
        merge: true,
      });
    }
  }
  
  return (
    <>
    {detailDataToUse ?
         <View style={{flex:1,backgroundColor:newHeaderColor}}>
          <FocusAwareStatusBar animated={true} backgroundColor={newHeaderColor} />
          <FlexDirRow
            style={{
              backgroundColor: newHeaderColor,
              maxHeight: 50,
            }}>
            <HeaderIconView>
              <HeaderIconPress
                onPress={onHeaderBack}>
                <IconML name={'ic_back'} color="#000" size={15} />
              </HeaderIconPress>
              {/* <HeaderIconPress
                onPress={()=>{
                  crashlytics().crash();
                }}>
                <IconML name={'ic_back'} color="#000" size={15} />
              </HeaderIconPress> */}
            </HeaderIconView>
            <HeaderTitleView>
            <Heading2 numberOfLines={1}>{detailDataToUse?.title}</Heading2>
            </HeaderTitleView>
          </FlexDirRow>

          <ScrollView style={{flex: 4,backgroundColor:"#FFF"}}>
            <View>
              {
              fromScreen ==="ChildDevelopment" || fromScreen === "Home" || (detailDataToUse && detailDataToUse.cover_video && detailDataToUse.cover_video.url!="" && detailDataToUse.cover_video.url!=undefined) ?
              <VideoPlayer selectedPinnedArticleData={detailDataToUse}></VideoPlayer>
              :
              detailDataToUse && detailDataToUse.cover_image && detailDataToUse.cover_image.url!="" && detailDataToUse.cover_image.url!=undefined?
              (<LoadableImage style={{width: '100%', height: 200}} item={detailDataToUse} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>):
              <DefaultImage
              style={{width: '100%', height: 200}} 
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
            <Heading2 style={{marginBottom:10}}>{detailDataToUse?.title}</Heading2>
            {detailDataToUse && detailDataToUse?.summary ?
            <Heading3Regular style={{marginBottom:10}}>{detailDataToUse.summary}</Heading3Regular> 
            : null }
            {detailDataToUse && detailDataToUse.body ?
              // <HTML
              //   source={{html: addSpaceToHtml(detailDataToUse.body)}} {...htmlProps}
              //   // source={{html: bodydata}} {...htmlProps}
              //   baseFontStyle={{fontSize: 16, color: '#000000',margin:0,padding:0}}
              //   ignoredStyles={['color', 'font-size', 'font-family']}
              //   tagsStyles={{
              //     img: {maxWidth:Dimensions.get('window').width},
              //     p:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     h1:{marginBottom:0,marginTop:10,textAlign:'left'},
              //     h2:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     h3:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     h4:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     h5:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     h6:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     span:{marginBottom:15,marginTop:0,textAlign:'left'},
              //     li:{textAlign:'left'},
              //     br:{height:0},
              //   }}
              // />
              <HTML
              source={{html: addSpaceToHtml(detailDataToUse.body)}} key={detailDataToUse.id} 
                // source={{html: bodydata}} {...htmlProps}
                baseFontStyle={{fontSize: 16, color: '#000000',margin:0,padding:0}}
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
            img:(attribs:any) => {
              const imagePath:any = attribs.src;
              console.log(imagePath,"..imagePath");
              if(imagePath!="" && imagePath!=null && imagePath!=undefined){
              let itemnew:any={
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
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
                  
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
                  
                  {/* <RelatedArticles related_articles={[6781]} category={detailDataToUse.category} currentId={detailDataToUse.id} /> */}
                    <RelatedArticles related_articles={detailDataToUse?.related_articles} category={detailDataToUse?.category} fromScreen={fromScreen} currentId={detailDataToUse?.id} headerColor={newHeaderColor} backgroundColor={newBackgroundColor} listCategoryArray={listCategoryArray} navigation={navigation} currentSelectedChildId={currentSelectedChildId}/>
                  
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
              {/* <BgActivityTint>
                <ArticleHeading>
                  <Heading2>{t('detailScreenActivityHeader')}</Heading2>
                </ArticleHeading>
                <ActivitiesCategories
                  borderColor={newHeaderColor} filterOnCategory={setNewFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}
                />
                </BgActivityTint> */}
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