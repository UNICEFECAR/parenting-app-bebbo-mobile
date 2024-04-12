import { articleCategoryArray, bothChildGender, maxArticleSize, videoArticleMandatory } from '@assets/translations/appOfflineData/apiConstants';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ArticleListContainer, ArticleListContent, SearchBox, SearchInput } from '@components/shared/ArticlesStyle';
import { DividerArt } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import Icon, { IconClearPress, OuterIconRow } from '@components/shared/Icon';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import Realm from 'realm';
import TabScreenHeader from '@components/TabScreenHeader';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { articlesTintcolor, bgColor1, bgcolorWhite2, greyCode } from '@styles/style';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';
import { randomArrayShuffle } from '../../../services/Utils';
import { logEvent, synchronizeEvents } from '../../../services/EventSyncService';
import { dataRealmCommon } from '../../../database/dbquery/dataRealmCommon';
import { HistoryEntity, SearchHistorySchema } from '../../../database/schema/SearchHistorySchema';
import VectorImage from 'react-native-vector-image';
import unorm from 'unorm';
import Fuse from 'fuse.js';
import MiniSearch from 'minisearch'
import { ARTICLE_SEARCHED } from '@assets/data/firebaseEvents';
import Intl from 'intl';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  cardImage: {
    alignSelf: 'center',
    flex: 1,
    height: 200,
    width: '100%',

  },
  containerView: {
    backgroundColor: articlesTintcolor,
    flex: 1
  },
  flex1View: {
    flex: 1
  },
  historyItem: {
    borderBottomColor: greyCode,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 10,
  },
  historyList: {
    backgroundColor: bgcolorWhite2,
    left: 0,
    paddingBottom: 20,
    position: 'absolute',
    right: 0,
    top: 51,
    zIndex: 1,
  },
  historyText: {
    fontSize: 14,
    marginHorizontal: 5
  },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15
  },

});
export type ArticleCategoriesProps = {
  borderColor?: any;
  filterOnCategory?: any;
  filterArray?: any;
  fromPage?: any;
  onFilterArrayChange?: any;
}
const Articles = ({ route, navigation }: any): any => {
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, searchQueryText] = useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const dispatch = useAppDispatch();
  const flatListRef = useRef<any>(null);
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  const articleModalOpened = useAppSelector((state: any) =>
    (state.utilsData.IsArticleModalOpened),
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices
  );
  const modalScreenKey = 'IsArticleModalOpened';
  const modalScreenText = 'articleModalText';
  const netInfo = useNetInfoHook();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);


  //merge array 
  const mergearr = (articlearrold: any[], videoartarrold: any[], isSuffle: boolean): any => {
    let combinedarr: any[] = [];
    let i = 0;
    let j = 0;
    let articlearr: any[] = [];
    let videoartarr: any[] = [];

    if (isSuffle) {
      articlearr = randomArrayShuffle(articlearrold)
      videoartarr = randomArrayShuffle(videoartarrold)
    } else {
      articlearr = articlearrold
      videoartarr = videoartarrold
    }

    if (articlearr.length == 0) {
      combinedarr = [...videoartarr];
    }
    articlearr.map((x: any, index: number) => {
      if (i < maxArticleSize) {
        combinedarr.push(x);
        i++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            const dd = videoartarr.splice(j);
            dd.map((y: any) => combinedarr.push(y));
          }
        }
      } else {
        i = 1;
        if (videoartarr[j]) { combinedarr.push(videoartarr[j]) }
        combinedarr.push(x);
        j++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            const dd = videoartarr.splice(j);
            dd.map((y: any) => combinedarr.push(y));
          }
        }
      }
    });

    return combinedarr;
  }
  const preprocessArticles = (articles: any): any => {
    return articles.map((article: any) => ({
      ...article,
      normalizedTitle: article.title,
      normalizedSummary: article.summary,
      normalizedBody: article.body
    }));
  };

  const getSearchedKeywords = async (): Promise<any> => {
    const realm = await dataRealmCommon.openRealm();

    if (realm != null) {
      console.log('Seach History is...', realm?.objects('SearchHistory'))
      const unsynchronizedEvents: any = realm.objects('SearchHistory').sorted('createdAt', true).slice(0, 5).map(entry => entry.keyword);
      console.log('Seach History is', unsynchronizedEvents)
      setSearchHistory(unsynchronizedEvents);

    }
    console.log('search history.......', searchHistory);

  }

  //store previous searched keyword
  const storeSearchKeyword = async (realm: any, keyword: any): Promise<any> => {
    realm.write(() => {
      const storeKeyword = realm.create('SearchHistory', {
        keyword: keyword,
        createdAt: new Date(),
      }, Realm.UpdateMode.Modified);
    });
  }

  const saveToRealm = async (keyword: string): Promise<any> => {
    const historyData: any = {
      keyword: keyword,
      createdAt: new Date(),
    }
    await dataRealmCommon.create<HistoryEntity>(SearchHistorySchema, historyData);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (netInfo.isConnected) {
        synchronizeEvents(netInfo.isConnected);
      }
      getSearchedKeywords()
      setModalVisible(articleModalOpened);
    }, [articleModalOpened])//historyVisible
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const { t } = useTranslation();
  //code for getting article dynamic data starts here.
  // let filterArray: string[] = [];
  const fromPage = 'Articles';

  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const articleDataOld = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));

  const VideoArticlesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  const videoarticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));

  let articleData: any = mergearr(articleDataOld, videoarticleData, true);
  const [filteredData, setfilteredData] = useState<any>([]);
  const [filterArray, setFilterArray] = useState([]);

  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const videoIsFocused = useIsFocused();
  const goToArticleDetail = (item: any, queryText: string): any => {
    const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "Articles",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: filterArray,
        queryText: keywords
      });
  };
  const RenderArticleItem = ({ item, index }: any): any => {
    return (
      <ArticleListContainer>
        <Pressable onPress={(): any => { goToArticleDetail(item, queryText) }} key={index}>
          {(netInfo.isConnected == true && item && item.cover_video && item.cover_video.url != "" && item.cover_video.url != undefined) ?
            videoIsFocused == true ? <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer> : null
            : <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} />
          }
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{categoryData.filter((x: any) => x.id == item.category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} isFavourite={((favoriteadvices.findIndex((x: any) => x == item?.id)) > -1) ? true : false} isAdvice={true} />
        </Pressable>
      </ArticleListContainer>
    )
  };
  const memoizedValue = useMemo(() => RenderArticleItem, [RenderArticleItem, filteredData]);
  const toTop = (): any => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: Platform.OS == "android" ? true : false, offset: 0 })
  }
  const setFilteredArticleData = (itemId: any): any => {
    setHistoryVisible(false)
    if (articleData != null && articleData != undefined && articleData.length > 0) {
      setLoadingArticle(true);
      if (itemId.length > 0) {
        let newArticleData = articleDataOld.filter((x: any) => itemId.includes(x.category));
        let newvideoArticleData = videoarticleData.filter((x: any) => itemId.includes(x.category));
        let titleData = [];
        let bodyData = [];
        let videoTitleData = [];
        let videoBodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          // filter data with title first then after summary or body
          titleData = newArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          bodyData = newArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          // combine array for article
          const combineArticleData: any[] = titleData.concat(bodyData)
          newArticleData = [...new Set(combineArticleData)];

          // filter data with title first then after summary or body
          videoTitleData = newvideoArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          videoBodyData = newvideoArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          // combine array for video article
          const combineVideoArticleData: any[] = videoTitleData.concat(videoBodyData)
          newvideoArticleData = [...new Set(combineVideoArticleData)];
        }

        //combine-array
        const combineDartArr = mergearr(newArticleData, newvideoArticleData, false);

        setfilteredData(combineDartArr);

        setLoadingArticle(false);
        toTop();
      } else {
        let newArticleData = articleData != '' ? articleData : [];
        const videoArticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
        let newvideoArticleData = videoarticleData != '' ? videoarticleData : [];
        let combineDartArr = [];
        let titleData = [];
        let bodyData = [];
        let videoTitleData = [];
        let videoBodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          titleData = articleDataall.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          bodyData = articleDataall.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          const combineArticleData: any[] = titleData.concat(bodyData)
          newArticleData = [...new Set(combineArticleData)];

          videoTitleData = newvideoArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          videoBodyData = newvideoArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          const combineVideoArticleData: any[] = videoTitleData.concat(videoBodyData)
          newvideoArticleData = [...new Set(combineVideoArticleData)];

          combineDartArr = mergearr(newArticleData, newvideoArticleData, false);
          setfilteredData(combineDartArr);

        } else {
          setfilteredData(newArticleData);
        }

        setLoadingArticle(false);
        // setHistoryVisible(false);
        toTop();
      }
    } else {
      setLoadingArticle(false);
      setfilteredData([]);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('UseFocusEffect Articles two');
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });
      return (): any => {
        {
          navigation.setParams({ categoryArray: [] })
          showSubscription.remove();
          hideSubscription.remove();
          // route.params?.currentSelectedChildId = 0;
        }
      }
    }, [])
  );


  const onFilterArrayChange = (newFilterArray: any): any => {
    setFilterArray(newFilterArray)
  }
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('UseFocusEffect Articles one');
      if (queryText == '') {
        async function fetchData(): Promise<any> {
          if (route.params?.categoryArray && route.params?.categoryArray.length > 0) {
            setFilterArray(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray);
          }
          else {
            setFilterArray([]);
            setFilteredArticleData([]);
          }
        }
        if (route.params?.backClicked != 'yes') {
          fetchData()
        } else {
          setLoadingArticle(false);
          if (route.params?.backClicked == 'yes') {
            navigation.setParams({ backClicked: 'no' })
          }
        }
      }

    }, [route.params?.categoryArray, activeChild?.uuid, languageCode, queryText])
  );

  const [searchIndex, setSearchIndex] = useState<any>(null);
  const suffixes = (term: any, minLength: any): any => {
    if (term == null) { return []; }
    const tokens = [];
    for (let i = 0; i <= term.length - minLength; i++) {
      tokens.push(term.slice(i));
    }
    return tokens;
  }
  // add minisearch on active child article data 
  useEffect(() => {
    async function initializeSearchIndex() {
      let videoArticleDataAllCategory:any;
      if(activeChild!=null && activeChild.taxonomyData!=null && activeChild?.gender!=null){
         videoArticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
      }
      const combineDartArr = mergearr(articleDataall, videoArticleDataAllCategory, false);
      articleData = [...combineDartArr];
      const processedArticles = preprocessArticles(articleData);
      const searchIndex = new MiniSearch({
        processTerm: (term) => suffixes(term, 3),
        extractField: (document, fieldName): any => {
          const arrFields = fieldName.split(".");
          if (arrFields.length === 2) {
            return (document[arrFields[0]] || [])
              .map((arrField: any) => arrField[arrFields[1]] || "")
              .join(" ");
          } else if (arrFields.length === 3) {
            const tmparr = (document[arrFields[0]] || []).flatMap(
              (arrField: any) => arrField[arrFields[1]] || []
            );
            return tmparr.map((s: any) => s[arrFields[2]] || "").join(" ");
          }
          return fieldName
            .split(".")
            .reduce((doc, key) => doc && doc[key], document);
        },
        searchOptions: {
          boost: { title: 2, summary: 1.5, body: 1 },
          bm25: { k: 1.0, b: 0.7, d: 0.5 },
          fuzzy: true,
          // prefix true means it will contain "foo" then search for "foobar"
          prefix: true,
          weights: {
            fuzzy: 0.6,
            prefix: 0.6
          }
        },
        fields: ['title', 'summary', 'body'],
        storeFields: ['id', 'type', 'title', 'created_at', 'updated_at', 'summary', 'body', 'category', 'child_age', 'child_gender', 'parent_gender', 'keywords', 'related_articles', 'related_video_articles', 'licensed', 'premature', 'mandatory', 'cover_image', 'related_articles', 'embedded_images']
      });

      processedArticles.forEach((item: any) => searchIndex.add(item));
      setSearchIndex(searchIndex);

    }

    initializeSearchIndex();
  }, []);

  const searchList = async (queryText: any): Promise<any> => {
    setHistoryVisible(false)
    setLoadingArticle(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    Keyboard.dismiss();
    let artData: any;
    let combineDartArr: [];
    let newvideoArticleData;
    if (queryText != "" && queryText != undefined && queryText != null) {
      const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
      if (keywords.length > 1) {
        const resultsPromises = keywords.map(async (keyword: any) => {
          const results = searchIndex.search(keyword);
          return results;
        });
        const resultsArrays = await Promise.all(resultsPromises);
        const aggregatedResults = resultsArrays.flat();
        setfilteredData(aggregatedResults);
        setLoadingArticle(false)
        toTop()
      } else {
        const results = searchIndex.search(queryText);
        console.log('Results Data is', results)
        console.log('Results length is', results.length)
        setfilteredData(results);
        setLoadingArticle(false)
        toTop()
      }
      const eventData = { 'name': ARTICLE_SEARCHED, 'params': { article_searched: queryText } }
      logEvent(eventData, netInfo.isConnected)
      const realm = await dataRealmCommon.openRealm();
      storeSearchKeyword(realm, queryText)

      // Update search history state
      const updatedHistoryWithoutClickedItem = searchHistory.filter(item => item !== queryText);
      const updatedHistory = [queryText, ...updatedHistoryWithoutClickedItem.slice(0, 4)];
      const filterredUpdatedHistory = [...new Set(updatedHistory)];
      setSearchHistory(filterredUpdatedHistory);

      // Delete older entries beyond the latest 5
      const olderEntries = realm?.objects<HistoryEntity>('SearchHistory').sorted('createdAt', true).slice(0, 5).map(entry => entry.keyword);
      if (olderEntries != undefined && olderEntries?.length > 5) {
        realm?.write(() => {
          realm.delete(olderEntries);
        });
      }


    }
    else {
      artData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));
      newvideoArticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
      combineDartArr = mergearr(artData, newvideoArticleData, true);
      articleData = [...combineDartArr];
      setFilteredArticleData(filterArray);
      setLoadingArticle(false);
    }
  }
  const renderSearchHistoryItem = ({ item }: { item: string }): any => (
    <Pressable
      onPress={async (): Promise<any> => {
        Keyboard.dismiss();
        searchQueryText(item);
        await searchList(item);
      }}
    >

      <View style={styles.historyItem}>
        <View>
          <VectorImage source={require('@assets/svg/history.svg')} />
        </View>

        <Text style={styles.historyText}>{item}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      {loadingArticle && <OverlayLoadingComponent loading={loadingArticle} />}
      <View style={styles.containerView}>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={(Platform.OS === 'android') ? -200 : 0}
          style={styles.flex1View}
        >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <TabScreenHeader
            title={t('articleScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
            setProfileLoading={setProfileLoading}
          />
          <FlexCol>
            <SearchBox>
              <OuterIconRow>

                <Pressable style={styles.pressablePadding} onPress={async (e): Promise<any> => {
                  e.preventDefault();
                  Keyboard.dismiss();
                  await searchList(queryText);

                }}>
                  <Icon
                    name="ic_search"
                    size={20}
                    color="#000"

                  />
                </Pressable>

              </OuterIconRow>
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                onFocus={(): any => {
                  setHistoryVisible(true);
                }}
                onChangeText={async (queryText: any): Promise<any> => {
                  console.log('loghererer', queryText)
                  if (queryText.replace(/\s/g, "") == "") {
                    searchQueryText(queryText.replace(/\s/g, ''));
                    setHistoryVisible(true);
                    //  await searchList(queryText)
                  } else {
                    searchQueryText(queryText);
                    setHistoryVisible(true);
                  }
                }}
                value={queryText}

                onSubmitEditing={async (event: any): Promise<any> => {
                  console.log("event-", queryText);
                  setHistoryVisible(false)
                  Keyboard.dismiss();
                  await searchList(queryText);
                }}
                multiline={false}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                placeholderTextColor={"#777779"}
                allowFontScaling={false}
              />

              {
                Platform.OS == 'android' && queryText.replace(/\s/g, "") != "" &&
                <OuterIconRow>

                  <IconClearPress onPress={async (): Promise<any> => {
                    console.log('cleartext')
                    Keyboard.dismiss();
                    searchQueryText('');
                    setHistoryVisible(true);

                  }}>
                    <Icon
                      name="ic_close"
                      size={10}
                      color="#fff"
                    />
                  </IconClearPress>

                </OuterIconRow>
              }




            </SearchBox>
            {searchHistory.length !== 0 && historyVisible &&


              <FlatList
                data={searchHistory}
                renderItem={renderSearchHistoryItem}
                keyboardShouldPersistTaps='handled'
                keyExtractor={(item, index): any => index.toString()}
                style={styles.historyList}
              />

            }
            <DividerArt></DividerArt>
            <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange} />
            <DividerArt></DividerArt>
            {filteredData.length > 0 ?
              <FlatList
                ref={flatListRef}
                data={filteredData}
                onScroll={(e): any => {
                  console.log(e);
                  if (keyboardStatus == true) {
                    Keyboard.dismiss();
                  }
                }}
                nestedScrollEnabled={true}
                // keyboardDismissMode={"on-drag"}
                // keyboardShouldPersistTaps='always'
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={4} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
                // renderItem={({ item, index }) => <RenderArticleItem item={item} index={index} />}
                renderItem={memoizedValue}
                keyExtractor={(item): any => item.id.toString()}
              />
              : <Heading4Center>{t('noDataTxt')}</Heading4Center>}

          </FlexCol>
          <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
          <OverlayLoadingComponent loading={profileLoading} />
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default Articles;