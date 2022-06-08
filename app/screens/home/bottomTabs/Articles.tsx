import { articleCategoryArray, both_child_gender, maxArticleSize, videoArticleMandatory } from '@assets/translations/appOfflineData/apiConstants';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ArticleListContainer, ArticleListContent, SearchBox, SearchInput } from '@components/shared/ArticlesStyle';
import { DividerArt } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import Icon, { IconClearBox, IconClearPress, OuterIconRow } from '@components/shared/Icon';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';
import { randomArrayShuffle } from '../../../services/Utils';

// import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
  route: any
};
export type ArticleCategoriesProps = {
  borderColor?: any,
  filterOnCategory?: Function,
  filterArray?: any,
  fromPage?: any,
  onFilterArrayChange?: Function
}
const Articles = ({ route, navigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavouriteArticle, setisFavouriteArticle] = useState(false);
  const [queryText, searchQueryText] = useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const renderIndicator = (progress: any, indeterminate: any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
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
  // const renderArticleItem = (item: typeof filteredData[0], index: number) => (
  
  const mergearr = (articlearrold: any[],videoartarrold: any[]) => {
    let combinedarr: any[] = [];
    let i = 0;
    let j = 0;
    let articlearr = randomArrayShuffle(articlearrold)
    let videoartarr = randomArrayShuffle(videoartarrold)
    if(articlearr.length == 0) {
      combinedarr = [...videoartarr];
    }
    articlearr.map((x, index) => {
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
    
    // console.log(combinedarr.length,"--combinedarr---", combinedarr)
    return combinedarr;
  }
  useFocusEffect(() => {
    //console.log("in article focuseffect without callback",articleModalOpened);
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
        // setFilteredArticleData: setFilteredArticleData
      });
  };
  const { t } = useTranslation();
  //code for getting article dynamic data starts here.
  // let filterArray: string[] = [];
  const fromPage = 'Articles';

  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  // console.log("categoryData--",categoryData);
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
  //console.log(articleDataall,"..articleDataall..");
  let articleDataOld = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));

  const VideoArticlesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  let videoarticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
  // console.log(articleDataOld.length,"videoarticleData length----", videoarticleData.length);

  let articleData = mergearr(articleDataOld,videoarticleData);
  // console.log(articleData.length,"articleDatanew---");
  const [filteredData, setfilteredData] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const RenderArticleItem = ({ item, index }) => {
    return (
    <ArticleListContainer>
      <Pressable onPress={() => { goToArticleDetail(item) }} key={index}>
        {(netInfoval.isConnected == true && item && item.cover_video && item.cover_video.url!="" && item.cover_video.url!=undefined) ? 
           <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer> 
          : <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} />
        }
          {/* <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} /> */}
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
      //console.log(filteredData,"routes changed--",route);
      async function fetchData() {
        let Entity: any;
        if (route.params?.categoryArray && route.params?.categoryArray.length > 0) {
          // console.log(route.params?.categoryArray);
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
      // console.log("article useFocusEffect called--",articleModalOpened);
      //setLoading(true);
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });
      // fetchData()
      return () => {
        // console.log("in article unmount");
        {
          navigation.setParams({ categoryArray: [] })
          showSubscription.remove();
          hideSubscription.remove();
          // route.params?.currentSelectedChildId = 0;
        }
      }
    }, [])
  );
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log(categoryData,"--in relatedarticle focuseffect",relartlength);
  //     async function fetchData() {
  //     // if(filteredData?.length>0){
  //     // filteredData.map(async (item: any, index: number) => {
  //     //     if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
  //     //             if (await RNFS.exists(destinationFolder + '/' + item['cover_image']?.url.split('/').pop())) {
  //     //             }
  //     //             else{
  //     //     let imageArray:any=[];
  //     //     imageArray.push({
  //     //         srcUrl: item['cover_image'].url, 
  //     //         destFolder: destinationFolder, 
  //     //         destFilename: item['cover_image'].url.split('/').pop()
  //     //     })
  //     //     console.log(imageArray,"..imageArray..");
  //     //     const imagesDownloadResult = await downloadImages(imageArray);
  //     //     console.log(imagesDownloadResult,"..imagesDownloadResult..");
  //     //     }
  //     //     }
  //     //     });
  //     // }else {
  //     // }
  //   }
  //     fetchData()
  //   }, [filteredData])
  // );
  const toTop = () => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: Platform.OS == "android" ? true : false, offset: 0 })
  }
  const setFilteredArticleData = (itemId: any) => {
    //  console.log(itemId,"articleData in filtered 333",articleData.length,articleData);
    // if(route.params?.backClicked == 'yes')
    // {
    //   navigation.setParams({backClicked:'no'})
    // }
    if (articleData != '' && articleData != null && articleData != undefined && articleData.length > 0) {
      //  console.log("in inf")
      setLoadingArticle(true);
      if (itemId.length > 0) {
        let newArticleData = articleDataOld.filter((x: any) => itemId.includes(x.category));
        let newvideoArticleData = videoarticleData.filter((x: any) => itemId.includes(x.category));
        // console.log(newArticleData.length,"--newArticleData-- 1",newvideoArticleData.length);
        if (queryText != "" && queryText != undefined && queryText != null) {
          newArticleData = newArticleData.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          newvideoArticleData = newvideoArticleData.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
        }
        let combinedartarr = mergearr(newArticleData,newvideoArticleData);

        // console.log(combinedartarr.length,"combinedartarr length")
        setfilteredData(combinedartarr);
        // if(newArticleData.length == 0)
        // {
        //   setLoadingArticle(false);
        // }
        setLoadingArticle(false);
        toTop();
        // setTimeout(function(){setLoading(false)}, 700);
      } else {
        let newArticleData = articleData != '' ? articleData : [];
        let videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
        let newvideoArticleData = videoarticleData != '' ? videoarticleData : [];
        let combinedartarr = [];
        // console.log(newArticleData.length,"--newArticleData-- 2",newvideoArticleData.length);
        // console.log(newArticleData.length,"..in else");
        if (queryText != "" && queryText != undefined && queryText != null) {
          newArticleData = articleDataall.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          newvideoArticleData = videoarticleDataAllCategory.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          // console.log("newvideoArticleData in else---",newvideoArticleData);
          combinedartarr = mergearr(newArticleData,newvideoArticleData);
          // console.log(combinedartarr.length,"combinedartarr length 2 in if");
          setfilteredData(combinedartarr);
        }else {
          setfilteredData(newArticleData);
        }


        // if(newArticleData.length == 0)
        // {
        //   setLoadingArticle(false);
        // }

        setLoadingArticle(false);
        toTop();
        // setTimeout(function(){setLoading(false)}, 700);
      }
    } else {
      //console.log("in else")
      setLoadingArticle(false);
      setfilteredData([]);
    }
  }

  // console.log(filteredData.length,"---length");
  const onFilterArrayChange = (newFilterArray: any) => {
    // console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];

    setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  const receivedLoadingArticle = (value) => {
    // console.log("receivedLoadingArticle--",value);
    setLoadingArticle(value);
  }
  //code for getting article dynamic data ends here.
  const searchList = async (queryText: any) => {
    // console.log(queryText,"..queryText")
    setLoadingArticle(true);
    // const currentChildData = {
    //   "gender":activeChild.gender,
    //   "parent_gender":activeChild.parent_gender,
    //   "taxonomyData":activeChild.taxonomyData
    // }
    //console.log(currentChildData,"..currentChildData..");
    // console.log(route.params?.categoryArray,"..route.params?.categoryArray..")
    let Entity: any;
    let artData: any;
    let newvideoArticleData: any;
    let combinedartarr = [];
    let videoarticleDataspeccat = [];
    let videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));

    if (queryText != "" && queryText != undefined && queryText != null) {
      artData = articleDataall.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      newvideoArticleData = videoarticleDataAllCategory.filter((element:any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.title.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      combinedartarr = mergearr(artData,newvideoArticleData);
      // console.log(combinedartarr.length,"combinedartarr length 2 in if");
    }
    else {
      artData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));
      newvideoArticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == both_child_gender));
      combinedartarr = mergearr(artData,newvideoArticleData);
      // mergearr
    }
    // const artData:any = await getDataToStore(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,"",currentChildData,queryText);
    // artData.map((item)=>{
    //   console.log(item,"..search item")
    // });
    // console.log(artData.length,"..artData length")
    articleData = [...combinedartarr];
    //console.log(articleData.length,"after search..articleData..",filterArray);
    //setLoadingArticle(false);
    // const articleData = articleDataall.filter((x:any)=> articleCategoryArray.includes(x.category))
    // if(artData.length<=0){
    //   // setFilterArray([]);
    //   setFilteredArticleData([]);
    // }
    // else{

    // }
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
                    // console.log("..11value")
                    searchQueryText(queryText.replace(/\s/g, ''));
                  } else {
                    searchQueryText(queryText);
                  }
                }}
                value={queryText}
                onSubmitEditing={async (event) => {
                  // if (queryText != "" && queryText != null && queryText != undefined) {
                  const data = await searchList(queryText);
                  // }
                  // else{

                  // }
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
            {/* <FlexCol> */}
            <DividerArt></DividerArt>
            <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange} />
            <DividerArt></DividerArt>
            {/* </FlexCol> */}
            {filteredData.length > 0 ?
              // <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
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
            {/* {filteredData.length> 0 ? filteredData.map((item: any, index: number) => {
                return renderArticleItem(item, index);
              }) : setFilteredArticleData([])} */}
          </FlexCol>
          <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
          {/* <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          setModalVisible(!modalVisible);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  // setModalVisible(!modalVisible);
                  setIsModalOpened('IsArticleModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('articleModalText')}
              </Heading4Centerr>
              </ModalPopupContent>
              
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsArticleModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>

          </ModalPopupContainer>
        </PopupOverlay>
      </Modal> */}
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