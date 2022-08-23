import { articleCategoryArray, both_child_gender, maxArticleSize, videoArticleMandatory } from '@assets/translations/appOfflineData/apiConstants';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ArticleListContainer, ArticleListContent, SearchBox, SearchInput } from '@components/shared/ArticlesStyle';
import { DividerArt } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import Icon, { IconClearPress, OuterIconRow } from '@components/shared/Icon';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';
import { randomArrayShuffle } from '../../../services/Utils';

type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
  route: any
};
export type ArticleCategoriesProps = {
  borderColor?: any,
  filterOnCategory?: any,
  filterArray?: any,
  fromPage?: any,
  onFilterArrayChange?: any
}
const Articles = ({ route, navigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, searchQueryText] = useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const flatListRef = useRef(null);
  const setIsModalOpened = async (varkey: any) => {
    if (modalVisible == true) {
      let obj = { key: varkey, value: false };
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
  const netInfoval = useNetInfoHook();
  
  const mergearr = (articlearrold: any[],videoartarrold: any[]) => {
    let combinedarr: any[] = [];
    let i = 0;
    let j = 0;
    let articlearr = randomArrayShuffle(articlearrold)
    let videoartarr = randomArrayShuffle(videoartarrold)
    if(articlearr.length == 0) {
      combinedarr = [...videoartarr];
    }
    articlearr.map((x: any, index: number) => {
      if (i < maxArticleSize) {
        combinedarr.push(x);
        i++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            let dd = videoartarr.splice(j);
            dd.map((y:any) => combinedarr.push(y));
          }
        }
      } else {
        i = 1;
        if (videoartarr[j]) { combinedarr.push(videoartarr[j]) };
        combinedarr.push(x);
        j++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            let dd = videoartarr.splice(j);
            dd.map((y:any) => combinedarr.push(y));
          }
        }
      }
    });
    
    return combinedarr;
  }
  useFocusEffect(() => {
    setModalVisible(articleModalOpened);
  })
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const goToArticleDetail = (item: typeof filteredData[0]) => {
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "Articles",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: filterArray
      });
  };
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
  let articleDataOld = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));

  const VideoArticlesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  let videoarticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));

  let articleData = mergearr(articleDataOld,videoarticleData);
  const [filteredData, setfilteredData] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const videoIsFocused = useIsFocused();
  const RenderArticleItem = ({ item, index }) => {
    return (
    <ArticleListContainer>
      <Pressable onPress={() => { goToArticleDetail(item) }} key={index}>
        {(netInfoval.isConnected == true && item && item.cover_video && item.cover_video.url!="" && item.cover_video.url!=undefined) ? 
           videoIsFocused==true?<VideoPlayer selectedPinnedArticleData={item}></VideoPlayer>:null
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
  const memoizedValue = useMemo(() => RenderArticleItem, [RenderArticleItem,filteredData]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
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
    }, [route.params?.categoryArray, activeChild?.uuid, languageCode])
  );
  useFocusEffect(
    React.useCallback(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });
      return () => {
        {
          navigation.setParams({ categoryArray: [] })
          showSubscription.remove();
          hideSubscription.remove();
          // route.params?.currentSelectedChildId = 0;
        }
      }
    }, [])
  );
  
  const toTop = () => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: Platform.OS == "android" ? true : false, offset: 0 })
  }
  const setFilteredArticleData = (itemId: any) => {
    
    if (articleData != '' && articleData != null && articleData != undefined && articleData.length > 0) {
      setLoadingArticle(true);
      if (itemId.length > 0) {
        let newArticleData = articleDataOld.filter((x: any) => itemId.includes(x.category));
        let newvideoArticleData = videoarticleData.filter((x: any) => itemId.includes(x.category));
        if (queryText != "" && queryText != undefined && queryText != null) {
          newArticleData = newArticleData.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          newvideoArticleData = newvideoArticleData.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
        }
        let combinedartarr = mergearr(newArticleData,newvideoArticleData);

        setfilteredData(combinedartarr);
        
        setLoadingArticle(false);
        toTop();
      } else {
        let newArticleData = articleData != '' ? articleData : [];
        let videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
        let newvideoArticleData = videoarticleData != '' ? videoarticleData : [];
        let combinedartarr = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          newArticleData = articleDataall.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          newvideoArticleData = videoarticleDataAllCategory.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          combinedartarr = mergearr(newArticleData,newvideoArticleData);
          setfilteredData(combinedartarr);
        }else {
          setfilteredData(newArticleData);
        }

        setLoadingArticle(false);
        toTop();
      }
    } else {
      setLoadingArticle(false);
      setfilteredData([]);
    }
  }

  const onFilterArrayChange = (newFilterArray: any) => {
   
    setFilterArray(newFilterArray)
  }
  //code for getting article dynamic data ends here.
  const searchList = async (queryText: any) => {
    setLoadingArticle(true);
    
    let artData: any;
    let newvideoArticleData: any;
    let combinedartarr = [];
    let videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));

    if (queryText != "" && queryText != undefined && queryText != null) {
      artData = articleDataall.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      newvideoArticleData = videoarticleDataAllCategory.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      combinedartarr = mergearr(artData,newvideoArticleData);
    }
    else {
      artData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));
      newvideoArticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
      combinedartarr = mergearr(artData,newvideoArticleData);
      // mergearr
    }
    
    articleData = [...combinedartarr];
    
    setFilteredArticleData(filterArray);
  }
  return (
    <>
      <OverlayLoadingComponent loading={loadingArticle} />
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={(Platform.OS === 'android') ? -200 : 0}
          style={{ flex: 1 }}
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
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                onChangeText={(queryText: any) => {
                  if (queryText.replace(/\s/g, "") == "") {
                    searchQueryText(queryText.replace(/\s/g, ''));
                  } else {
                    searchQueryText(queryText);
                  }
                }}
                value={queryText}
                onSubmitEditing={async (event) => {
                  const data = await searchList(queryText);
                }}
                multiline={false}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                placeholderTextColor={"gray"}
                style={{

                }}
                allowFontScaling={false}
              />
              {
                Platform.OS == 'android' && queryText.replace(/\s/g, "") != "" &&
                <OuterIconRow>

                  <IconClearPress onPress={() => {
                    searchQueryText('');
                  }}>
                    <Icon
                      name="ic_close"
                      size={10}
                      color="#fff"
                    />
                  </IconClearPress>

                </OuterIconRow>
              }
              <OuterIconRow>

                <Pressable style={{ padding: 13 }} onPress={async (e) => {
                  e.preventDefault();
                  const data = await searchList(queryText);
                  Keyboard.dismiss();

                }}>
                  <Icon
                    name="ic_search"
                    size={20}
                    color="#000"

                  />
                </Pressable>

              </OuterIconRow>


            </SearchBox>
            <DividerArt></DividerArt>
            <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange} />
            <DividerArt></DividerArt>
            {filteredData.length > 0 ?
              <FlatList
                ref={flatListRef}
                data={filteredData}
                onScroll={(e) => {
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
                keyExtractor={(item) => item.id.toString()}
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
const styles = StyleSheet.create({

  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',

  },
});