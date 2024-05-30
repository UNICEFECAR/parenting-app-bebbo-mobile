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
import { articleColor, articlesTintcolor, bgColor1, bgcolorWhite2, greyCode } from '@styles/style';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromBottom10, ShiftFromTopBottom5, SideRightSpacing20, SideSpacing10 } from '@styles/typography';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, SectionList, StyleSheet, Text, View
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
import MiniSearch from 'minisearch'
import { ADVICE_AGEGROUP_SELECTED, ARTICLE_SEARCHED } from '@assets/data/firebaseEvents';
import AgeBrackets from '@components/AgeBrackets';
import OutsidePressHandler from 'react-native-outside-press';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  ageBracketView: {
    backgroundColor: bgcolorWhite2
  },
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
    position: 'absolute',
    paddingBottom: 10,
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
  let sectionListRef: any;
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, searchQueryText] = useState('');
  const [isSerachedQueryText, setIsSearchedQueryText] = useState(false);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [suggestedArticles, setsuggestedArticles] = useState([]);
  const dispatch = useAppDispatch();
  const flatListRef = useRef<any>(null);
  const windowWidthStyle = Dimensions.get('window').width;
  const windowHeightStyle = Dimensions.get('window').height;
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
  const mergearr = (articlearrold: any[], videoartarrold: any[], isSuffle: boolean) => {
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
      const unsynchronizedEvents: any = realm.objects('SearchHistory').sorted('createdAt', true).slice(0, 5).map(entry => entry.keyword);
      setSearchHistory(unsynchronizedEvents);
    }
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
  const headerColorBlack = themeContext?.colors.PRIMARY_TEXTCOLOR;
  const backgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const { t } = useTranslation();
  //code for getting article dynamic data starts here.
  // let filterArray: string[] = [];
  const fromPage = 'Articles';
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
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
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
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
  const [showNoData, setshowNoData] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [isCurrentChildSelected, setCurrentChildSelected] = useState(true);
  const [selectedChildActivitiesData, setSelectedChildActivitiesData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>([]);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const [searchIndexData, setSearchIndexedData] = useState<any>();
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
        selectedChildActivitiesData: selectedChildActivitiesData,
        currentSelectedChildId: currentSelectedChildId,
        queryText: keywords
      });
  };

  const showSelectedBracketData = async (item: any): Promise<any> => {
    console.log('Child id is',item.id)
    if (item && item?.id !== null) {
      const eventData = { 'name': ADVICE_AGEGROUP_SELECTED, 'params': { age_id: item.id } }
      logEvent(eventData, netInfo.isConnected)
      setCurrentSelectedChildId(item.id);
      setIsSearchedQueryText(true)
      const filteredData = articleData.filter((x: any) => x.child_age.includes(item.id));
      setSelectedChildActivitiesData(filteredData);
      setCurrentChildSelected(false)
    }

  }
  useEffect(() => {
    setsuggestedArticles(filteredData);
  }, [filteredData])

  // useEffect(() => {
  //   const miniSearchArticles = MiniSearch.loadJSON(searchResultIndexedData, {
  //     processTerm: (term) => suffixes(term, 3),
  //     extractField: (document, fieldName): any => {
  //       const arrFields = fieldName.split(".");
  //       if (arrFields.length === 2) {
  //         return (document[arrFields[0]] || [])
  //           .map((arrField: any) => arrField[arrFields[1]] || "")
  //           .join(" ");
  //       } else if (arrFields.length === 3) {
  //         const tmparr = (document[arrFields[0]] || []).flatMap(
  //           (arrField: any) => arrField[arrFields[1]] || []
  //         );
  //         return tmparr.map((s: any) => s[arrFields[2]] || "").join(" ");
  //       }
  //       return fieldName
  //         .split(".")
  //         .reduce((doc, key) => doc && doc[key], document);
  //     },
  //     fields: ['title', 'summary', 'body'],
  //     searchOptions: {
  //       boost: { title: 2, summary: 1.5, body: 1 },
  //       bm25: { k: 1.0, b: 0.7, d: 0.5 },
  //       fuzzy: true,
  //       // prefix true means it will contain "foo" then search for "foobar"
  //       prefix: true,
  //       weights: {
  //         fuzzy: 0.6,
  //         prefix: 0.6
  //       }
  //     }
  //   });
  //   setSearchIndex(miniSearchArticles);
  //   console.log('miniSearchArticles deserialise data', miniSearchArticles);
  //   // const miniSearchArticles = new MiniSearch({
  //   //   fields: ['title', 'summary', 'body'],
  //   // });
  // }, [searchResultIndexedData])

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
  const DATA = [
    {
      id: 1,
      title: t('actScreensugacttxt'),
      data: suggestedArticles
    }
  ];
  const memoizedValue = useMemo(() => RenderArticleItem, [RenderArticleItem, DATA]);
  const toTop = (): any => {
    // use current
    if (flatListRef && flatListRef.current) {
      flatListRef?.current?.scrollToOffset({ animated: Platform.OS == "android" ? true : false, offset: 0 })
    }
  }
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const fetchData = async (): Promise<any> => {
  //       const filterQuery = 'uuid == "' + activeChild?.uuid + '"';
  //       //const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
  //       // setchildMilestonedata(childData[0].checkedMilestones)
  //     }
  //     fetchData()
  //     return (): any => {
  //       console.log("unmount activity", route.params);

  //       navigation.setParams({ backClicked: 'no' })

  //       navigation.setParams({ currentSelectedChildId: 0 })

  //       navigation.setParams({ categoryArray: [] })

  //     };
  //   }, [])
  // );

  // useEffect(() => {
  //   async function initializeSearchIndex() {
  //     try {
  //       console.log('articleDataData all datas', selectedChildActivitiesData?.length)
  //       const processedActivities = preprocessArticles(selectedChildActivitiesData);
  //       console.log('processedActivities all datas', processedActivities);
  //       const searchActivittiesData = new MiniSearch({
  //         // processTerm: (term) => suffixes(term, 3),
  //         // extractField: (document, fieldName): any => {
  //         //   const arrFields = fieldName.split(".");
  //         //   if (arrFields.length === 2) {
  //         //     return (document[arrFields[0]] || [])
  //         //       .map((arrField: any) => arrField[arrFields[1]] || "")
  //         //       .join(" ");
  //         //   } else if (arrFields.length === 3) {
  //         //     const tmparr = (document[arrFields[0]] || []).flatMap(
  //         //       (arrField: any) => arrField[arrFields[1]] || []
  //         //     );
  //         //     return tmparr.map((s: any) => s[arrFields[2]] || "").join(" ");
  //         //   }
  //         //   return fieldName
  //         //     .split(".")
  //         //     .reduce((doc, key) => doc && doc[key], document);
  //         // },
  //         searchOptions: {
  //           boost: { title: 2, summary: 1.5, body: 1 },
  //           bm25: { k: 1.0, b: 0.7, d: 0.5 },
  //           fuzzy: true,
  //           // prefix true means it will contain "foo" then search for "foobar"
  //           prefix: true,
  //           weights: {
  //             fuzzy: 0.6,
  //             prefix: 0.6
  //           }
  //         },
  //         fields: ['title', 'summary', 'body'],
  //         storeFields: ['id', 'type', 'title', 'created_at', 'updated_at', 'summary', 'body', 'category', 'child_age', 'child_gender', 'parent_gender', 'keywords', 'related_articles', 'related_video_articles', 'licensed', 'premature', 'mandatory', 'cover_image', 'embedded_images']
  //       });
  //       processedActivities.forEach((item: any) => searchActivittiesData.add(item));
  //       setSearchIndex(searchActivittiesData);
  //       console.log('search index dta is', searchActivittiesData)
  //     } catch (error) {
  //       console.log("Error: Retrieve minisearch data", error)
  //     }
  //   }
  //   initializeSearchIndex();
  // }, [currentSelectedChildId])

  const setFilteredArticleData = async (itemId: any): Promise<any> => {
    setHistoryVisible(false);
    if (selectedChildActivitiesData && selectedChildActivitiesData.length > 0 && selectedChildActivitiesData.length != 0) {
      if (itemId.length > 0) {
        let newArticleData: any = selectedChildActivitiesData.filter((x: any) => itemId.includes(x.category));
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.search(keyword);
              return results;
            });
            const resultsArrays = await Promise.all(resultsPromises);
            const aggregatedResults = resultsArrays.flat();
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId) && itemId.includes(x.category));
            } else {
              filteredResults = aggregatedResults.filter((x: any) => itemId.includes(x.category));
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false)
            setIsSearchedQueryText(false)
            toTop()
          } else {
            const results = searchIndex.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              setSelectedCategoryId(itemId);
              const categoryFilteredData = results.filter((x: any) => itemId.includes(x.category));
              filteredResults = categoryFilteredData.filter((x: any) => x.child_age.includes(currentSelectedChildId));
            } else {
              filteredResults = results.filter((x: any) => itemId.includes(x.category));
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false)
            setIsSearchedQueryText(false)
            toTop()
          }
        } else {
          setfilteredData(newArticleData);
        }

        setLoadingArticle(false);
        setIsSearchedQueryText(false)
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      } else {
        let newArticleData: any = selectedChildActivitiesData.length > 0 ? selectedChildActivitiesData : [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
          if (keywords.length > 1) {
            const resultsPromises = keywords.map(async (keyword: any) => {
              const results = searchIndex.search(keyword);
              return results;
            });
            const resultsArrays = await Promise.all(resultsPromises);
            const aggregatedResults = resultsArrays.flat();
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId));
            } else {
              filteredResults = aggregatedResults;
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false)
            setIsSearchedQueryText(false)
            toTop()
          } else {
            const results = searchIndex.search(queryText);
            let filteredResults: any = null;
            if (currentSelectedChildId != 0) {
              filteredResults = results.filter((x: any) => x.child_age.includes(currentSelectedChildId));
            } else {
              filteredResults = results;
            }
            setfilteredData(filteredResults);
            setLoadingArticle(false)
            setIsSearchedQueryText(false)
            toTop()
          }

        } else {
          setfilteredData(newArticleData);
        }
        setLoadingArticle(false);
        setIsSearchedQueryText(false)
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      }
    }
    else {
      setfilteredData([]);
      setLoadingArticle(false);
      setIsSearchedQueryText(false)
      setTimeout(() => {
        setshowNoData(true);
      }, 200);
    }
    toTop();
  }
  useFocusEffect(
    React.useCallback(() => {
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

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.backClicked != 'yes') {
        setshowNoData(false);
        if (route.params?.currentSelectedChildId && route.params?.currentSelectedChildId != 0) {
          console.log("if route params 0", route.params);
          const firstChildDevData = childAge.filter((x: any) => x.id == route.params?.currentSelectedChildId);
          showSelectedBracketData(firstChildDevData[0]);

        }
        else {
          console.log("else if route params 0", route.params, activityTaxonomyId);

          const firstChildDevData = childAge.filter((x: any) => x.id == activityTaxonomyId);
          showSelectedBracketData(firstChildDevData[0]);
        }
      } else {
        setLoadingArticle(false);
        if (route.params?.backClicked == 'yes') {
          navigation.setParams({ backClicked: 'no' })
        }
      }

    }, [activeChild?.uuid, languageCode, route.params?.currentSelectedChildId, activityTaxonomyId])
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async (): Promise<any> => {
        const filterQuery = 'uuid == "' + activeChild?.uuid + '"';
      }
      fetchData()
      return (): any => {
        console.log("unmount activity", route.params);

        navigation.setParams({ backClicked: 'no' })

        navigation.setParams({ currentSelectedChildId: 0 })

        navigation.setParams({ categoryArray: [] })

      };
    }, [])
  );
  useEffect(() => {
    async function initializeSearchIndex() {

      try {
        let videoArticleDataAllCategory: any;
        if (activeChild != null && activeChild.taxonomyData != null && activeChild?.gender != null) {
          videoArticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
        }
        const combineDartArr = mergearr(articleDataall, videoArticleDataAllCategory, false);
        articleData = [...combineDartArr];
        const processedArticles = preprocessArticles((combineDartArr));
        console.log('processedArticles data length', processedArticles?.length)
        const searchIndexData = new MiniSearch({
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

       // processedArticles.forEach((item: any) => searchIndex.add(item));
        console.log('processedArticles is', processedArticles?.length);
        searchIndexData.addAllAsync(processedArticles);
        setSearchIndex(searchIndexData);
      } catch (error) {
        console.log("Error: Retrieve minisearch data", error)
      }
    }
    initializeSearchIndex();
  }, []);
  const onFilterArrayChange = (newFilterArray: any): any => {
    setFilterArray(newFilterArray)
  }

  useFocusEffect(
    React.useCallback(() => {
      if (isSerachedQueryText || queryText == '') {
        //setLoadingArticle(true);
        async function fetchData(): Promise<any> {
          if (route.params?.categoryArray) {
            setFilterArray(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray);
          }
          else {
            setFilterArray([]);
            setFilteredArticleData([]);
          }
        }
        setIsSearchedQueryText(false)
        if (route.params?.backClicked != 'yes') {
          fetchData()
        } else {
          setLoadingArticle(false);
        }
      }
    }, [selectedChildActivitiesData, route.params?.categoryArray, languageCode, queryText, isSerachedQueryText]))

  const [searchIndex, setSearchIndex] = useState<any>(null);
  const suffixes = (term: any, minLength: any): any => {
    if (term == null) { return []; }
    const tokens = [];
    for (let i = 0; i <= term.length - minLength; i++) {
      tokens.push(term.slice(i));
    }
    return tokens;
  }


  const searchList = async (queryText: any): Promise<any> => {
    setHistoryVisible(false)
    setLoadingArticle(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    Keyboard.dismiss();
    if (queryText != "" && queryText != undefined && queryText != null) {
      const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
      if (keywords.length > 1) {
        const resultsPromises = keywords.map(async (keyword: any) => {
          const results = searchIndex.search(keyword);
          return results;
        });
        const resultsArrays = await Promise.all(resultsPromises);
        const aggregatedResults = resultsArrays.flat();
        let filteredResults: any = null;
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = aggregatedResults.filter((x: any) => selectedCategoryId.includes(x.category));
          filteredResults = categoryFilteredData.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        } else {
          filteredResults = aggregatedResults.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        }
        setfilteredData(filteredResults);
        setLoadingArticle(false)
        setIsSearchedQueryText(false)
        toTop()
      } else {
        const results = searchIndex.search(queryText);
        let filteredResults: any = null;
        console.log('selectedchild id is',currentSelectedChildId)
        if (selectedCategoryId.length > 0) {
          const categoryFilteredData = results.filter((x: any) => selectedCategoryId.includes(x.category));
          filteredResults = categoryFilteredData.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        } else {
          filteredResults = results.filter((x: any) => x.child_age.includes(currentSelectedChildId));
        }
        setfilteredData(filteredResults);
        setLoadingArticle(false)
        setIsSearchedQueryText(false)
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
      setFilteredArticleData(filterArray);
      setLoadingArticle(false);
      setIsSearchedQueryText(false)
    }
  }

  const renderSearchHistoryItem = ({ item }: { item: string }): any => (
    <Pressable
      onPress={async (): Promise<any> => {
        Keyboard.dismiss();
        searchQueryText(item);
        setIsSearchedQueryText(true);
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
            <OutsidePressHandler
              onOutsidePress={() => {
                console.log('Pressed outside the box!');
                setHistoryVisible(false)
              }}
            >
              <View style={[styles.ageBracketView]}>
                <SearchBox>
                  <OuterIconRow>

                    <Pressable style={styles.pressablePadding} onPress={async (e): Promise<any> => {
                      e.preventDefault();
                      Keyboard.dismiss();
                      setIsSearchedQueryText(true);
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
                    onChangeText={(queryText: any): any => {
                      if (queryText.replace(/\s/g, "") == "") {
                        searchQueryText(queryText.replace(/\s/g, ''));
                        setHistoryVisible(true);
                      } else {
                        searchQueryText(queryText);
                        setHistoryVisible(true);
                      }
                    }}
                    value={queryText}

                    onSubmitEditing={async (event: any): Promise<any> => {
                      setHistoryVisible(false)
                      Keyboard.dismiss();
                      setIsSearchedQueryText(true)
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
                    <SideSpacing10>
                      <OuterIconRow>
                        <IconClearPress onPress={async (): Promise<any> => {
                          Keyboard.dismiss();
                          searchQueryText('');
                        }}>
                          <Icon
                            name="ic_close"
                            size={12}
                            color="#fff"
                          />
                        </IconClearPress>
                      </OuterIconRow>
                    </SideSpacing10>
                  }
                </SearchBox>
                <DividerArt></DividerArt>
                <AgeBrackets
                  itemColor={headerColorBlack}
                  activatedItemColor={headerColor}
                  currentSelectedChildId={currentSelectedChildId}
                  showSelectedBracketData={showSelectedBracketData}
                  ItemTintColor={backgroundColor}
                />
                {searchHistory.length !== 0 && historyVisible &&
                  <View style={styles.historyList}>
                    <FlatList
                      data={searchHistory}
                      keyboardShouldPersistTaps="handled"
                      renderItem={renderSearchHistoryItem}
                      contentContainerStyle={{ flex: 1 }}
                      keyExtractor={(item, index): any => index.toString()}
                    />
                  </View>
                }
                <View style={{ backgroundColor: articlesTintcolor }}>
                  <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange} />
                  <DividerArt></DividerArt>
                </View>
              </View>
            </OutsidePressHandler>
            {showNoData == true && suggestedArticles?.length == 0 ?
              <Heading4Center>{t('noDataTxt')}</Heading4Center>
              : null}
            <FlatList
              ref={flatListRef}
              data={filteredData}
              onScroll={(e): any => {
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
          </FlexCol>
          <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
          <OverlayLoadingComponent loading={profileLoading} />
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default Articles;

