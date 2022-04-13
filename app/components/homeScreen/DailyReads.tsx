import { ADVICE_SHARED, GAME_SHARED } from '@assets/data/firebaseEvents';
import { articleCategoryArray, shareTextButton } from '@assets/translations/appOfflineData/apiConstants';
import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import { DailyAction, DailyArtTitle, DailyBox, DailyTag, DailyTagText, OverlayFaded } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2, Heading3w, Heading4, ShiftFromTopBottom10 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, ImageBackground, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setDailyArticleGamesCategory, setShowedDailyDataCategory } from '../../redux/reducers/articlesSlice';
import LoadableImage from '../../services/LoadableImage';
import analytics from '@react-native-firebase/analytics';

const DailyReads = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );

  const articleData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category))
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const ActivitiesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
  // console.log(activityTaxonomyId, "..activityTaxonomyId..");
  const ActivitiesData = ActivitiesDataall.filter((x: any) => x.child_age.includes(activityTaxonomyId))
  const activityCategoryArray = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const dailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.dailyDataCategory,
  );
  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  const showedDailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.showedDailyDataCategory,
  );
  // console.log(dailyDataCategoryall,"--dailyDataCategory--",showedDailyDataCategoryall);
  // console.log("activeChild uuid---",activeChild.uuid);

  const [dataToShowInList, setDataToShowInList] = useState([]);
  const goToArticleDetail = (item: any) => {
    navigation.navigate('DetailsScreen', {
      fromScreen: item.hasOwnProperty('activity_category') ? 'HomeAct' : 'HomeArt',
      headerColor: item.hasOwnProperty('activity_category') ? actHeaderColor : artHeaderColor,
      backgroundColor: item.hasOwnProperty('activity_category') ? actBackgroundColor : artBackgroundColor,
      detailData: item,
      selectedChildActivitiesData: ActivitiesData
    });
  }
  const onShare = async (item:any) => {
    const isAdvice=item.hasOwnProperty('activity_category')?false:true;
    console.log(isAdvice,"dfd",item)
    console.log('locale',locale);
    const suburl=isAdvice?"/article/":"/activity/";
    const mainUrl=shareTextButton+locale+suburl+item.id;
    console.log(mainUrl,"..mainUrl");
   // const spacekeyData=Platform.OS=="android"?'\n':'\r\n';
     try {
       const result = await Share.share({
        message:item.title+'\n'+t('appShareText')+'\n'+mainUrl
       });
       if (result.action === Share.sharedAction) {
         // await analytics().logEvent(APP_SHARE); //{advise_id:item?.id}
         if(isAdvice){
            analytics().logEvent(ADVICE_SHARED, {advise_id:item?.id});
         }else{
            analytics().logEvent(GAME_SHARED, {game_id:item?.id});
         }
         if (result.activityType) {
           // shared with activity type of result.activityType
         } else {
           // shared
         }
       } else if (result.action === Share.dismissedAction) {
         // dismissed
       }
     } catch (error: any) {
       // Alert.alert(error.message);
       Alert.alert(t('generalError'));
     }
   };
  const RenderDailyReadItem = React.memo(({ item, index }) => {
    return (
      <View>
        <Pressable onPress={() => { goToArticleDetail(item) }} key={index}>
          <DailyBox>
            <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}>
              {/* <ImageBackground source={{
              uri: item.cover_image.url,
            }} style={styles.cardImage}> */}

            </LoadableImage>
            <View>
              <DailyArtTitle>
                <Heading3w numberOfLines={1}>{item?.title}</Heading3w>
              </DailyArtTitle>
              <OverlayFaded>
                <LinearGradient colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']} style={styles.linearGradient}>
                  <Text >
                  </Text>
                </LinearGradient>
              </OverlayFaded>
            </View>
            {/* </ImageBackground> */}
            {/*Tag*/}
            <DailyTag>
              <DailyTagText>{item?.hasOwnProperty('activity_category') ? t('homeScreentodaygame') : t('homeScreentodayarticle')}</DailyTagText>
            </DailyTag>
            {/*Parent Share , View Details*/}
            <DailyAction>
            <Pressable onPress={() => { onShare(item)}}>
              <FDirRow>
                <OuterIconRow>
                    <OuterIconLeft>
                    <Icon name="ic_sb_shareapp" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>
                <Heading4>{t('homeScreenshareText')}</Heading4>
              </FDirRow>
              </Pressable>
              <Pressable onPress={() => { goToArticleDetail(item) }}>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_view" size={13} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>
                  <Heading4>{t('homeScreenviewDetailsText')}</Heading4>
                </FDirRow>
              </Pressable>
            </DailyAction>
          </DailyBox>
        </Pressable>
      </View>
    );
  });

  useEffect(() => {
    //console.log(newCategoryArray,"..newCategoryArray11")
    // console.log(ActivitiesData,"--ActivitiesData--",ActivitiesDataall);
    let dailyDataCategory: any, showedDailyDataCategory: any;
   //  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
  //console.log(activityTaxonomyId, "..activityTaxonomyId..");
 
    //  activeChild?.taxonomyData.prematureTaxonomyId!=null? activeChild.plannedTermDate:childBirthDate,
    //console.log(activeChild.uuid,"activeChild.uuid--");
    // console.log(dailyDataCategoryall,"--dailyDataCategoryall 4--",showedDailyDataCategoryall);
    //console.log(dailyDataCategory,"--showedDailyDataCategory 3--",showedDailyDataCategory);
    if (dailyDataCategoryall[activeChild.uuid] === undefined) {
      dailyDataCategory = { advice: 0, games: 0, currentadviceid: 0, currentgamesid: 0, currentDate: '', taxonomyid: activeChild.taxonomyData.id,prematureTaxonomyId:activityTaxonomyId };
      // console.log(dailyDataCategory,"..dailyDataCategory")
    } else {
      // if(dailyDataCategoryall[activeChild.uuid].taxonomyid == activeChild.taxonomyData.id)
      // {
      //   dailyDataCategory = dailyDataCategoryall[activeChild.uuid];
      // }else {
      //   dailyDataCategory  = {advice: 0 , games: 0, currentadviceid:0,currentgamesid:0,currentDate:'',taxonomyid:activeChild.taxonomyData.id};
      // }
      let advid = dailyDataCategoryall[activeChild.uuid].advice;
      let currentadviceid = dailyDataCategoryall[activeChild.uuid].currentadviceid;
      let gamid = dailyDataCategoryall[activeChild.uuid].games;
      let currentgamesid = dailyDataCategoryall[activeChild.uuid].currentgamesid;
      if (dailyDataCategoryall[activeChild.uuid].taxonomyid != activeChild.taxonomyData.id) {
        advid = 0;
        currentadviceid = 0;
        // dailyDataCategory = dailyDataCategoryall[activeChild.uuid];
      }
      if (dailyDataCategoryall[activeChild.uuid].prematureTaxonomyId != activityTaxonomyId) {
        gamid = 0;
        currentgamesid = 0;
      }
      let newcurrentdate = gamid == 0 || advid == 0 ? '' : dailyDataCategoryall[activeChild.uuid].currentDate;
      dailyDataCategory = { advice: advid, games: gamid, currentadviceid: currentadviceid, currentgamesid: currentgamesid, currentDate: newcurrentdate, taxonomyid: activeChild.taxonomyData.id, prematureTaxonomyId: activityTaxonomyId };
    }
    if (showedDailyDataCategoryall[activeChild.uuid] === undefined) {
      // console.log("in ifff");
      showedDailyDataCategory = { advice: [], games: [] };
    } else {
      // console.log("in elseee");
      // if (dailyDataCategoryall[activeChild.uuid].taxonomyid == activeChild.taxonomyData.id) {
      //   showedDailyDataCategory = showedDailyDataCategoryall[activeChild.uuid]
      // } else {
      //   showedDailyDataCategory = { advice: [], games: [] };
      // }
      let advicearr = showedDailyDataCategoryall[activeChild.uuid].advice;
      let gamesarr = showedDailyDataCategoryall[activeChild.uuid].games;
      if(dailyDataCategoryall[activeChild.uuid].taxonomyid != activeChild.taxonomyData.id)
      {
      advicearr = [];
      }
      if(dailyDataCategoryall[activeChild.uuid].prematureTaxonomyId != activityTaxonomyId) {
      gamesarr = [];
      }
      showedDailyDataCategory = {advice: advicearr , games: gamesarr};  
    }
    const nowDate = DateTime.now().toISODate();
    console.log(dailyDataCategory.currentDate,'..hellolog',dailyDataCategory);
    // Alert.alert(nowDate+'Modal has been closed.'+dailyDataCategory.currentDate);
    if (dailyDataCategory && (dailyDataCategory.currentDate == '' || dailyDataCategory.currentDate < nowDate)) {
      const articleCategoryArrayNew = articleCategoryArray.filter((i: any) => articleData.find((f: any) => f.category === i))
      const activityCategoryArrayNew = activityCategoryArray.filter((i: any) => ActivitiesData.find((f: any) => f.activity_category === i.id))
      //console.log(activityCategoryArray,"activityCategoryArray");
      //console.log(ActivitiesData,"ActivitiesData");
      const currentIndex = articleCategoryArrayNew.findIndex((_item: any) => _item === dailyDataCategory.advice);
      // Alert.alert(JSON.stringify(articleCategoryArrayNew)+" - "+JSON.stringify(activityCategoryArrayNew));
      // const currentIndex = articleCategoryArrayNew.findIndex((_item: any) => _item === 1);
      const nextIndex = (currentIndex + 1) % articleCategoryArrayNew.length;
      let categoryArticleData = articleData.filter((x: any) => x.category == articleCategoryArrayNew[nextIndex]);
      // let obj1 = categoryArticleData.filter( ( el:any ) => !showedDailyDataCategory.advice.includes( el.id ) );
      let obj1 = categoryArticleData.filter((i: any) => !showedDailyDataCategory.advice.find((f: any) => f === i.id));
      let advicearray: any = [];
      //console.log(obj1,"--hello");
      // advicearray = [...showedDailyDataCategory.advice];
      if (obj1.length == 0) {
        // advicearray = showedDailyDataCategory.advice.filter( ( el:any ) => !categoryArticleData.includes( el.id ) );
        let abc = showedDailyDataCategory.advice.filter((i: any) => !categoryArticleData.find((f: any) => f.id === i));
        advicearray = [...abc]
      } else {
        advicearray = [...showedDailyDataCategory.advice]
      }
      //console.log("advicearray---",advicearray);
      categoryArticleData = categoryArticleData.filter((i: any) => !advicearray.find((f: any) => f === i.id));
      //console.log(categoryArticleData,"--arr1--",articleCategoryArrayNew[nextIndex]);
      const articleDataToShow = categoryArticleData[Math.floor(Math.random() * categoryArticleData.length)];
      // Alert.alert(JSON.stringify(articleDataToShow)+"--articleDataToShow---"+articleDataToShow);

      const currentIndex2 = activityCategoryArrayNew.findIndex((_item: any) => _item.id === dailyDataCategory.games);
      const nextIndex2 = (currentIndex2 + 1) % activityCategoryArrayNew.length;
      let categoryActivityData = ActivitiesData.filter((x: any) => x.activity_category == activityCategoryArrayNew[nextIndex2].id);
      let obj2 = categoryActivityData.filter((i: any) => !showedDailyDataCategory.games.find((f: any) => f === i.id));
      let gamesarray: any = [];
      if (obj2.length == 0) {
        let abc = showedDailyDataCategory.games.filter((i: any) => !categoryActivityData.find((f: any) => f.id === i));
        gamesarray = [...abc]
      } else {
        gamesarray = [...showedDailyDataCategory.games]
      }
      // console.log("gamesarray---",gamesarray);
      categoryActivityData = categoryActivityData.filter((i: any) => !gamesarray.find((f: any) => f === i.id));
      //console.log(categoryActivityData,"--arr--",activityCategoryArrayNew[nextIndex2]);
      const activityDataToShow = categoryActivityData[Math.floor(Math.random() * categoryActivityData.length)];
      // console.log("activityDataToShow---",activityDataToShow);
      var data: any = [];
      if (articleDataToShow != null && articleDataToShow != undefined) {
        advicearray.push(articleDataToShow?.id);
        data.push(articleDataToShow);
      }
      if (activityDataToShow != null && activityDataToShow != undefined) {
        gamesarray.push(activityDataToShow?.id);
        data.push(activityDataToShow);
      }
      //console.log(gamesarray,"--updatedAdviceArr--",advicearray);
      // Alert.alert(data.length+"data-"+activityDataToShow);
      setDataToShowInList(data);
      // const i = dailyDataCategoryall.findIndex((_item: any) => Object.keys(_item)[0] === activeChild.uuid);
      let dailyDataCategorytoDispatch: any = { ...dailyDataCategoryall };
      let showedDailyDataCategorytoDispatch: any = { ...showedDailyDataCategoryall };
      //console.log("before dailyDataCategorytoDispatch--",dailyDataCategorytoDispatch);
      dailyDataCategorytoDispatch[activeChild.uuid] = {
        advice: articleDataToShow && articleDataToShow != null ? articleCategoryArrayNew[nextIndex] : 0,
        games: activityDataToShow && activityDataToShow != null ? activityCategoryArrayNew[nextIndex2]?.id : 0,
        currentadviceid: articleDataToShow && articleDataToShow != null ? articleDataToShow?.id : 0,
        currentgamesid: activityDataToShow && activityDataToShow != null ? activityDataToShow?.id : 0,
        currentDate: DateTime.now().toISODate(),
        taxonomyid: activeChild.taxonomyData.id,
        prematureTaxonomyId:activityTaxonomyId
      };
      showedDailyDataCategorytoDispatch[activeChild.uuid] = { advice: advicearray, games: gamesarray }

      //console.log(showedDailyDataCategorytoDispatch,"after dailyDataCategorytoDispatch--",dailyDataCategorytoDispatch);
      dispatch(setDailyArticleGamesCategory(dailyDataCategorytoDispatch));
      dispatch(setShowedDailyDataCategory(showedDailyDataCategorytoDispatch));
      //console.log(dataToShowInList);
    } else {
      var data: any = [];
      const articleDataToShow = articleData.filter((x: any) => x.id == dailyDataCategory.currentadviceid).length > 0 ?
        articleData.filter((x: any) => x.id == dailyDataCategory.currentadviceid)[0] : null;
      const activityDataToShow = ActivitiesData.filter((x: any) => x.id == dailyDataCategory.currentgamesid).length > 0 ?
        ActivitiesData.filter((x: any) => x.id == dailyDataCategory.currentgamesid)[0] : null;
      if (articleDataToShow == null && activityDataToShow == null) {
        dispatch(setDailyArticleGamesCategory({}));
        dispatch(setShowedDailyDataCategory({}));
      }
      if (articleDataToShow != null) {
        data.push(articleDataToShow);
      }
      if (activityDataToShow != null) {
        data.push(activityDataToShow);
      }
      // console.log("articleData--",articleData.filter((x:any)=>x.id == dailyDataCategory.currentadviceid));
      //console.log(articleDataToShow,activityDataToShow,"activityDataToShow data---",data);
      setDataToShowInList(data);
    }
  }, [activeChild.uuid,activityTaxonomyId]);
  return (
    <>
      <BgSecondaryTint>
        <MainContainer>
          <ShiftFromTopBottom10>
            <Heading2>{t('homeScreendailyReadsTitle')}</Heading2>
          </ShiftFromTopBottom10>
          <View style={{ marginLeft: -7, marginRight: -7 }}>
            <FlatList
              data={dataToShowInList}
              horizontal
              renderItem={({ item, index }) => <RenderDailyReadItem item={item} index={index} />}
              // renderItem={({item, index}) => renderDailyReadItem(item, index)}
              keyExtractor={(item) => item?.id}
            />
          </View>
        </MainContainer>
      </BgSecondaryTint>
    </>
  );
};

export default DailyReads;

const styles = StyleSheet.create({


  linearGradient: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 160,
    flex: 1,
    position: 'relative',
    // backgroundColor: 'red'
  },



});