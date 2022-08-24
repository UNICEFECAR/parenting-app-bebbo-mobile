import { ADVICE_SHARED, GAME_SHARED } from '@assets/data/firebaseEvents';
import { articleCategoryArray, shareTextButton } from '@assets/translations/appOfflineData/apiConstants';
import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import { DailyAction, DailyArtTitle, DailyBox, DailyTag, DailyTagText, OverlayFaded } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading3w, Heading4, ShiftFromTopBottom10 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setDailyArticleGamesCategory, setShowedDailyDataCategory } from '../../redux/reducers/articlesSlice';
import LoadableImage from '../../services/LoadableImage';
import analytics from '@react-native-firebase/analytics';

const styles = StyleSheet.create({
  cardImage: {
    flex: 1,
    height: 160,
    position: 'relative',
    width: '100%'
  },
  flatlistOuterView:{ marginLeft: -7, marginRight: -7 },
  linearGradient: {
    flex: 1,
  }
});
const DailyReads = ():any => {
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
  const ActivitiesData = ActivitiesDataall.filter((x: any) => x.child_age.includes(activityTaxonomyId))
  const activityCategoryArray = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const dailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.dailyDataCategory,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const showedDailyDataCategoryall = useAppSelector(
    (state: any) => state.articlesData.showedDailyDataCategory,
  );
  const [dataToShowInList, setDataToShowInList] = useState([]);
  const goToArticleDetail = (item:any):any => {
    console.log(Object.prototype.hasOwnProperty.call(item,'activity_category'),"..ds")
    navigation.navigate('DetailsScreen', {
      fromScreen:  Object.prototype.hasOwnProperty.call(item,'activity_category') ? 'HomeAct' : 'HomeArt',
      headerColor: Object.prototype.hasOwnProperty.call(item,'activity_category') ? actHeaderColor : artHeaderColor,
      backgroundColor: Object.prototype.hasOwnProperty.call(item,'activity_category') ? actBackgroundColor : artBackgroundColor,
      detailData: item,
      selectedChildActivitiesData: ActivitiesData
    });
  }
  const onShare = async (item: any):Promise<any> => {
    const isAdvice = Object.prototype.hasOwnProperty.call(item,'activity_category') ? false : true;
    const suburl = isAdvice ? "/article/" : "/activity/";
    const mainUrl = shareTextButton + languageCode + suburl + item.id;
    try {
      const result = await Share.share({
        message: item.title + '\n' + t('appShareText') + '\n' + mainUrl
      });
      if (result.action === Share.sharedAction) {
        if (isAdvice) {
          analytics().logEvent(ADVICE_SHARED, { advise_id: item?.id });
        } else {
          analytics().logEvent(GAME_SHARED, { game_id: item?.id });
        }

      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(t('generalError'));
    }
  };
  const RenderDailyReadItem = React.memo(({ item, index }: any) => {
    return (
      <View>
        <Pressable onPress={():any => { goToArticleDetail(item) }} key={index}>
          <DailyBox>
            <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}>
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
              <Pressable onPress={():any => { onShare(item) }}>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_sb_shareapp" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>
                  <Heading4>{t('homeScreenshareText')}</Heading4>
                </FDirRow>
              </Pressable>
              <Pressable onPress={():any => { goToArticleDetail(item) }}>
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

    let dailyDataCategory: any, showedDailyDataCategory: any;
    if (dailyDataCategoryall[activeChild.uuid] === undefined) {
      dailyDataCategory = { advice: 0, games: 0, currentadviceid: 0, currentgamesid: 0, currentDate: '', taxonomyid: activeChild.taxonomyData.id, prematureTaxonomyId: activityTaxonomyId };
    } else {
      let advid = dailyDataCategoryall[activeChild.uuid].advice;
      let currentadviceid = dailyDataCategoryall[activeChild.uuid].currentadviceid;
      let gamid = dailyDataCategoryall[activeChild.uuid].games;
      let currentgamesid = dailyDataCategoryall[activeChild.uuid].currentgamesid;
      if (dailyDataCategoryall[activeChild.uuid].taxonomyid != activeChild.taxonomyData.id) {
        advid = 0;
        currentadviceid = 0;
      }
      if (dailyDataCategoryall[activeChild.uuid].prematureTaxonomyId != activityTaxonomyId) {
        gamid = 0;
        currentgamesid = 0;
      }
      const newcurrentdate = gamid == 0 || advid == 0 ? '' : dailyDataCategoryall[activeChild.uuid].currentDate;
      dailyDataCategory = { advice: advid, games: gamid, currentadviceid: currentadviceid, currentgamesid: currentgamesid, currentDate: newcurrentdate, taxonomyid: activeChild.taxonomyData.id, prematureTaxonomyId: activityTaxonomyId };
    }
    if (showedDailyDataCategoryall[activeChild.uuid] === undefined) {
      showedDailyDataCategory = { advice: [], games: [] };
    } else {
      let advicearr = showedDailyDataCategoryall[activeChild.uuid].advice;
      let gamesarr = showedDailyDataCategoryall[activeChild.uuid].games;
      if (dailyDataCategoryall[activeChild.uuid].taxonomyid != activeChild.taxonomyData.id) {
        advicearr = [];
      }
      if (dailyDataCategoryall[activeChild.uuid].prematureTaxonomyId != activityTaxonomyId) {
        gamesarr = [];
      }
      showedDailyDataCategory = { advice: advicearr, games: gamesarr };
    }
    const nowDate = DateTime.now().toISODate();
    if (dailyDataCategory && (dailyDataCategory.currentDate == '' || dailyDataCategory.currentDate < nowDate)) {
      const articleCategoryArrayNew = articleCategoryArray.filter((i: any) => articleData.find((f: any) => f.category === i))
      const activityCategoryArrayNew = activityCategoryArray.filter((i: any) => ActivitiesData.find((f: any) => f.activity_category === i.id))
      const currentIndex = articleCategoryArrayNew.findIndex((_item: any) => _item === dailyDataCategory.advice);
      const nextIndex = (currentIndex + 1) % articleCategoryArrayNew.length;
      let categoryArticleData = articleData.filter((x: any) => x.category == articleCategoryArrayNew[nextIndex]);
      const obj1 = categoryArticleData.filter((i: any) => !showedDailyDataCategory.advice.find((f: any) => f === i.id));
      let advicearray: any = [];
      if (obj1.length == 0) {
        const abc = showedDailyDataCategory.advice.filter((i: any) => !categoryArticleData.find((f: any) => f.id === i));
        advicearray = [...abc]
      } else {
        advicearray = [...showedDailyDataCategory.advice]
      }
      categoryArticleData = categoryArticleData.filter((i: any) => !advicearray.find((f: any) => f === i.id));
      const articleDataToShow = categoryArticleData[Math.floor(Math.random() * categoryArticleData.length)];
      const currentIndex2 = activityCategoryArrayNew.findIndex((_item: any) => _item.id === dailyDataCategory.games);
      const nextIndex2 = (currentIndex2 + 1) % activityCategoryArrayNew.length;
      let categoryActivityData = ActivitiesData.filter((x: any) => x.activity_category == activityCategoryArrayNew[nextIndex2].id);
      const obj2 = categoryActivityData.filter((i: any) => !showedDailyDataCategory.games.find((f: any) => f === i.id));
      let gamesarray: any = [];
      if (obj2.length == 0) {
        const abc = showedDailyDataCategory.games.filter((i: any) => !categoryActivityData.find((f: any) => f.id === i));
        gamesarray = [...abc]
      } else {
        gamesarray = [...showedDailyDataCategory.games]
      }
      categoryActivityData = categoryActivityData.filter((i: any) => !gamesarray.find((f: any) => f === i.id));
      const activityDataToShow = categoryActivityData[Math.floor(Math.random() * categoryActivityData.length)];
      const data: any = [];
      if (articleDataToShow != null && articleDataToShow != undefined) {
        advicearray.push(articleDataToShow?.id);
        data.push(articleDataToShow);
      }
      if (activityDataToShow != null && activityDataToShow != undefined) {
        gamesarray.push(activityDataToShow?.id);
        data.push(activityDataToShow);
      }
      setDataToShowInList(data);
      const dailyDataCategorytoDispatch: any = { ...dailyDataCategoryall };
      const showedDailyDataCategorytoDispatch: any = { ...showedDailyDataCategoryall };
      dailyDataCategorytoDispatch[activeChild.uuid] = {
        advice: articleDataToShow && articleDataToShow != null ? articleCategoryArrayNew[nextIndex] : 0,
        games: activityDataToShow && activityDataToShow != null ? activityCategoryArrayNew[nextIndex2]?.id : 0,
        currentadviceid: articleDataToShow && articleDataToShow != null ? articleDataToShow?.id : 0,
        currentgamesid: activityDataToShow && activityDataToShow != null ? activityDataToShow?.id : 0,
        currentDate: DateTime.now().toISODate(),
        taxonomyid: activeChild.taxonomyData.id,
        prematureTaxonomyId: activityTaxonomyId
      };
      showedDailyDataCategorytoDispatch[activeChild.uuid] = { advice: advicearray, games: gamesarray }
      dispatch(setDailyArticleGamesCategory(dailyDataCategorytoDispatch));
      dispatch(setShowedDailyDataCategory(showedDailyDataCategorytoDispatch));
    } else {
      const data: any = [];
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
      setDataToShowInList(data);
    }
  }, [activeChild.uuid, activityTaxonomyId]);
  return (
    <>
      <BgSecondaryTint>
        <MainContainer>
          <ShiftFromTopBottom10>
            <Heading2>{t('homeScreendailyReadsTitle')}</Heading2>
          </ShiftFromTopBottom10>
          <View style={styles.flatlistOuterView}>
            <FlatList
              data={dataToShowInList}
              horizontal
              renderItem={({ item, index }:any):any => <RenderDailyReadItem item={item} index={index} />}
              keyExtractor={(item:any):any => item?.id}
            />
          </View>
        </MainContainer>
      </BgSecondaryTint>
    </>
  );
};

export default DailyReads;
