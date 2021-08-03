import { articledata } from '@assets/translations/appOfflineData/article';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';

import { ArticleListContainer, ArticleListContent,SearchBox } from '@components/shared/ArticlesStyle';
import { ButtonContainer, ButtonModal, ButtonPrimary, ButtonRow, ButtonSpacing, ButtonText } from '@components/shared/ButtonGlobal';
import Divider,{DividerArt} from '@components/shared/Divider';
import { FDirRow, FlexCol } from '@components/shared/FlexBoxStyle';

import Icon, { OuterIconLeft15, OuterIconRow } from '@components/shared/Icon';
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
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,View,
   KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, ActivityIndicator, Image
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import { destinationFolder, articleCategoryArray } from '@assets/translations/appOfflineData/apiConstants';
import ProgressiveImage from '@components/shared/ProgressiveImage';
import FirstTimeModal from '@components/shared/FirstTimeModal';
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
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
    setModalVisible(!modalVisible);
  };
  const articleModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsArticleModalOpened),
    );
  const modalScreenKey = 'IsArticleModalOpened';
  const modalScreenText = 'articleModalText';
  // const renderArticleItem = (item: typeof filteredData[0], index: number) => (
  const renderArticleItem = ({item, index}) => {
    // console.log("renderArticleItem-",index)
    return(
      <Pressable onPress={() => { goToArticleDetail(item)}} key={index}>
        {/* <Text>{{item.cover_image}}</Text> */}
        <ArticleListContainer>
        <ProgressiveImage
          thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
          source={item.cover_image ? {uri : "file://" + destinationFolder + item.cover_image.url.split('/').pop()}:require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}
          resizeMode="cover"
        />
          {/* <Image
            style={styles.cardImage}
           source={item.cover_image ? {uri : "file://" + destinationFolder + item.cover_image.url.split('/').pop()}:require('@assets/trash/defaultArticleImage.png')}
            resizeMode={'cover'}
          /> */}
           {/* <Image
           source={item.cover_image ? {uri : "file://" + destinationFolder + (item.cover_image.url.split('/').pop())}:require('@assets/trash/defaultArticleImage.png')}
           style={styles.cardImage}
  PlaceholderContent={<ActivityIndicator />}
/>  */}
          <ArticleListContent>
            <ShiftFromTopBottom5>
          <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'}/>
        </ArticleListContainer>
      </Pressable>

  ) 
};

 
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
  const [filterArray,setFilterArray] = useState([]);
  const fromPage = 'Articles';

  const [loadingArticle, setLoadingArticle] = useState(true);
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
  const articleData = articleDataall.filter((x:any)=> articleCategoryArray.includes(x.category))
  console.log("articleData---",articleData);
  const [filteredData,setfilteredData] = useState(articleData);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log("article useFocusEffect called");
      //setLoading(true);
      setModalVisible(articleModalOpened);
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
      fetchData()
      return () => {
        console.log("in article unmount");
        // setModalVisible(false);
        // setLoading(false);
        // setfilteredData([]);
        // setFilterArray([]);
        // if(route.params?.categoryArray)
        {
          navigation.setParams({categoryArray:[]})
          // route.params?.currentSelectedChildId = 0;
        }
      }
    },[activeChild?.uuid,languageCode,route.params?.categoryArray])
  );
  
  const setFilteredArticleData = (itemId:any) => {
    console.log(itemId,"articleData in filtered ",articleData);
    if(articleData != '')
    {
      setLoadingArticle(true);
      if(itemId.length>0)
      {
        const newArticleData = articleData.filter((x:any)=> itemId.includes(x.category));
        setfilteredData(newArticleData);
        // setLoadingArticle(false);
        // setTimeout(function(){setLoading(false)}, 700);
      }else {
        const newArticleData = articleData != '' ? articleData : [];
        setfilteredData(newArticleData);
        // setLoadingArticle(false);
        // setTimeout(function(){setLoading(false)}, 700);
      }
    }
    // if(articleData != '')
    // {
    //   console.log("in if filterdata");
    //   setfilteredData(articleData);
    // }
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
              <OuterIconRow>
                <OuterIconLeft15>
                <Icon
                name="ic_search"
                size={20}
                color="#000"
                
              />
                </OuterIconLeft15>
              </OuterIconRow>
              
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={''}
                // onChangeText={queryText => handleSearch(queryText)}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                style={{
                  paddingHorizontal: 0,
                }}
              />
            </SearchBox>
            {/* <FlexCol> */}
                <DividerArt></DividerArt>
              <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange}/>
              <DividerArt></DividerArt>
              {/* </FlexCol> */}
              {filteredData.length> 0 ? 
                <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
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
                <ButtonText>{t('continueInModal')}</ButtonText>
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
