import { articledata } from '@assets/translations/appOfflineData/article';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import RNFS from 'react-native-fs';
import { ArticleListContainer, ArticleListContent,SearchBox, SearchInput } from '@components/shared/ArticlesStyle';
import { ButtonContainer, ButtonModal, ButtonPrimary, ButtonRow, ButtonSpacing, ButtonText } from '@components/shared/ButtonGlobal';
import Divider,{DividerArt} from '@components/shared/Divider';
import { FDirRow, FlexCol } from '@components/shared/FlexBoxStyle';

import Icon, { OuterIconLeft15, OuterIconRight15, OuterIconRow } from '@components/shared/Icon';
import InfiniteScrollList from '@components/shared/InfiniteScrollList';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4Center, Heading4Centerr, Heading6Bold, ShiftFromTop10, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,View,
   KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, ActivityIndicator
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import { destinationFolder, articleCategoryArray } from '@assets/translations/appOfflineData/apiConstants';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import LoadableImage from '../../../services/LoadableImage';
import { ArticleEntity, ArticleEntitySchema } from '../../../database/schema/ArticleSchema';
import { setAllArticleData } from '../../../redux/reducers/articlesSlice';
import {getDataToStore} from '@assets/translations/appOfflineData/getDataToStore';
import { getIdByUniqueName } from '../../../services/Utils';
// import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
  route:any
};
export type ArticleCategoriesProps = {
  borderColor?:any,
  filterOnCategory?:Function,
  filterArray?:any,
  fromPage?:any,
  onFilterArrayChange?:Function
}
const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ARTICLES_TINTCOLOR};
`;
const Articles = ({route, navigation}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText,searchQueryText] = useState('');
  const dispatch = useAppDispatch();
  const renderIndicator = (progress:any, indeterminate:any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
  const flatListRef = useRef(null);
  const setIsModalOpened = async (varkey: any) => {
    if(modalVisible == true)
    {
      let obj = {key: varkey, value: false};
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  const articleModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsArticleModalOpened),
    );
  const modalScreenKey = 'IsArticleModalOpened';
  const modalScreenText = 'articleModalText';
  // const renderArticleItem = (item: typeof filteredData[0], index: number) => (
  const RenderArticleItem = React.memo(({item, index}) => {
    console.log("renderArticleItem-",index)
    return(
      <Pressable onPress={() => { goToArticleDetail(item)}} key={index}>
        <ArticleListContainer>
          <LoadableImage style={styles.cardImage} item={item}/> 
           <ArticleListContent>
             <ShiftFromTopBottom5>
           <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold>
           </ShiftFromTopBottom5>
           <Heading3>{item.title}</Heading3>
           </ArticleListContent>
           <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'} item={item} isAdvice={true}/>
         </ArticleListContainer>
       </Pressable>

  ) 
});

useFocusEffect(() => {
  console.log("in article focuseffect without callback",articleModalOpened);
  setModalVisible(articleModalOpened);
})
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const goToArticleDetail = (item:typeof filteredData[0]) => {
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"Articles",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: filterArray
      // setFilteredArticleData: setFilteredArticleData
    });
  };
  const {t} = useTranslation();
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
  let newCategoryArray=getIdByUniqueName(categoryData,articleCategoryArray);
  console.log(newCategoryArray,"..newCategoryArray")
  
  //let newCategoryArray=getIdByUniqueName(articleCategoryArray,)
  let articleData = articleDataall.filter((x:any)=>newCategoryArray.includes(x.category))
  console.log("articleData---",articleData);
  //getIdByUniqueName(articleDataall,)
  const [filteredData,setfilteredData] = useState([]);
  const [filterArray,setFilterArray] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log(filteredData,"routes changed--",route);
      async function fetchData() {
        let Entity:any;
          if(route.params?.categoryArray && route.params?.categoryArray.length > 0)
          {
            // console.log(route.params?.categoryArray);
            setFilterArray(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray);
          }
          else {
            setFilterArray([]);
            setFilteredArticleData([]);
          }
      }
      if(route.params?.backClicked != 'yes')
      {
        fetchData()
      }else {
        setLoadingArticle(false);
        if(route.params?.backClicked == 'yes')
        {
          navigation.setParams({backClicked:'no'})
        }
      }
    },[route.params?.categoryArray,activeChild?.uuid,languageCode])
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log("article useFocusEffect called--",articleModalOpened);
      //setLoading(true);
      
      // fetchData()
      return () => {
        console.log("in article unmount");
        {
          navigation.setParams({categoryArray:[]})
          // route.params?.currentSelectedChildId = 0;
        }
      }
    },[])
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
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
}
  const setFilteredArticleData = (itemId:any) => {
    console.log(itemId,"articleData in filtered ",articleData);
    // if(route.params?.backClicked == 'yes')
    // {
    //   navigation.setParams({backClicked:'no'})
    // }
    if(articleData != '' && articleData != null && articleData != undefined)
    {
      setLoadingArticle(true);
      if(itemId.length>0)
      {
        const newArticleData = articleData.filter((x:any)=> itemId.includes(x.category));
        setfilteredData(newArticleData);
        // if(newArticleData.length == 0)
        // {
        //   setLoadingArticle(false);
        // }
        setLoadingArticle(false);
        toTop();
        // setTimeout(function(){setLoading(false)}, 700);
      }else {
        const newArticleData = articleData != '' ? articleData : [];
        setfilteredData(newArticleData);
        
        // if(newArticleData.length == 0)
        // {
        //   setLoadingArticle(false);
        // }

        setLoadingArticle(false);
        toTop();
        // setTimeout(function(){setLoading(false)}, 700);
      }
    }else {
      setLoadingArticle(false);
    }
  }
  
  console.log(filteredData.length,"---length");
  const onFilterArrayChange = (newFilterArray: any) => {
    // console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];
    
    setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  const receivedLoadingArticle = (value) => {
    console.log("receivedLoadingArticle--",value);
    setLoadingArticle(value);
  }
  //code for getting article dynamic data ends here.
const searchList=async (queryText:any)=>{
  console.log(queryText,"..queryText")
  setLoadingArticle(true);
  const currentChildData = {
    "gender":activeChild.gender,
    "parent_gender":activeChild.parent_gender,
    "taxonomyData":activeChild.taxonomyData
  }
  console.log(currentChildData,"..currentChildData..");
  // console.log(route.params?.categoryArray,"..route.params?.categoryArray..")
  let Entity:any;
  const artData:any = await getDataToStore(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,"",currentChildData,queryText);
  artData.map((item)=>{
    console.log(item,"..search item")
  });
  articleData = artData;
  console.log(articleData,"1111..articleData..",filterArray);
  //setLoadingArticle(false);
  // const articleData = articleDataall.filter((x:any)=> articleCategoryArray.includes(x.category))
  setFilteredArticleData(filterArray);
}
  return (
    <>
      <OverlayLoadingComponent loading={loadingArticle} />
      <ContainerView>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <TabScreenHeader
            title={t('articleScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <FlexCol>
          <SearchBox>
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                onChangeText={async (queryText:any)=>{
                  searchQueryText(queryText);
                }}
                value={queryText}
                onSubmitEditing = {async (event) =>{
                  console.log("11")
                  const data=await searchList(queryText)
                }}
                multiline={false}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                style={{
                  
                }}
                allowFontScaling={false} 
              />
                    <OuterIconRow>
                
                <Pressable style={{padding:13}} onPress={async () => {
                 const data=await searchList(queryText)
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
              <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
              <DividerArt></DividerArt>
              {/* </FlexCol> */}
              {filteredData.length> 0 ? 
                // <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
                <FlatList
                  ref={flatListRef}
                  data={filteredData}
                  removeClippedSubviews={true} // Unmount components when outside of window 
                  initialNumToRender={4} // Reduce initial render amount
                  maxToRenderPerBatch={4} // Reduce number in each render batch
                  updateCellsBatchingPeriod={100} // Increase time between renders
                  windowSize={7} // Reduce the window size
                  renderItem={({item, index}) => <RenderArticleItem item={item} index={index} />  }
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
        </KeyboardAvoidingView>
      </ContainerView>
              
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