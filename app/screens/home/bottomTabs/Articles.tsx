import { articledata } from '@assets/translations/appOfflineData/article';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ArticleListContainer, ArticleListContent,SearchBox } from '@components/shared/ArticlesStyle';
import { ButtonContainer, ButtonModal, ButtonPrimary, ButtonRow, ButtonSpacing, ButtonText } from '@components/shared/ButtonGlobal';

import { FDirRow, FlexDirCol } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft15, OuterIconRow } from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4Centerr, Heading6Bold, ShiftFromTop10, ShiftFromTopBottom10,ShiftFromTopBottom5 } from '@styles/typography';
import { destinationFolder } from '@types/apiConstants';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { getChildArticleData } from '../../../database/dbquery/getChildArticles';
import { ArticleEntity, ArticleEntitySchema } from '../../../database/schema/ArticleSchema';
import { setAllArticleData } from '../../../redux/reducers/articlesSlice';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
// import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
  route:any
};
export type ArticleCategoriesProps = {
  borderColor?:any,
  filterOnCategory?:Function,
  filterArray?:any
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
   useFocusEffect(()=>{
    //  console.log('weightModalOpened',weightModalOpened);
      // pass true to make modal visible every time & reload
    setModalVisible(articleModalOpened)
   });
  const renderArticleItem = (item: typeof filteredData[0], index: number) => (
      <Pressable onPress={() => { goToArticleDetail(item)}} key={index}>
        {/* <Text>{{item.cover_image}}</Text> */}
        <ArticleListContainer>
          <Image
            style={styles.cardImage}
            // source={item.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(item.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
            source={require('@assets/trash/defaultArticleImage.png')}
            resizeMode={'cover'}
          />
          <ArticleListContent>
            <ShiftFromTopBottom5>
          <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'}/>
        </ArticleListContainer>
      </Pressable>

  );

 
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
      // setFilteredArticleData: setFilteredArticleData
    });
  };
  const {t} = useTranslation();
  //code for getting article dynamic data starts here.
  let filterArray: string[] = [];
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
console.log(activeChild,"..activeChild..");
// const allConfigData = useAppSelector((state: any) =>
// state.variableData?.variableData != ''
//   ? JSON.parse(state.variableData?.variableData)
//   : state.variableData?.variableData,
// );
// const userParentalRoleData =
// allConfigData?.length > 0
//   ? allConfigData.filter((item) => item.key === 'userParentalRole')
//   : [];
 // console.log(userParentalRoleData,"..userParentalRoleData..")
// const userNameData =
// allConfigData?.length > 0
//   ? allConfigData.filter((item) => item.key === 'userName')
//   : [];
// const relationshipData = useAppSelector(
//     (state: any) =>
//       JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
//   );
//let relationshipValue = relationshipData.length>0 && userParentalRoleData.length>0 ? relationshipData.find((o:any) => o.id === userParentalRoleData[0].value):'';
 
  const currentChildData = {
    "gender":activeChild.gender,
    "parent_gender":"all",
    "taxonomyData":{
      "id": "43",
      "name": "1st month",
      "days_from": "0",
      "days_to": "30",
      "buffers_days": null,
      "age_bracket": null,
      "weeks_from": null,
      "weeks_to": null
    }
  }
  const [loading, setLoading] = useState(false);
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  // console.log("categoryData--",categoryData);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );

  const articleData = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const [filteredData,setfilteredData] = useState(articleData);
  
  // useEffect(() => {
  //   async function fetchData() {
  //     let Entity:any;
  //     // Entity = Entity as TaxonomyEntity
  //     const artData = await getChildArticleData(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,currentChildData);
  //     console.log(stateArticleData,"artData--",artData.length);
      
  //     setLoading(false);
  //   }
  //   fetchData()
  // },[languageCode]);
  
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setModalVisible(true);
      async function fetchData() {
        let Entity:any;
        // Entity = Entity as TaxonomyEntity
        const artData = await getChildArticleData(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,currentChildData);
        // setArticleData(stateArticleData)
        // setfilteredData(articleData);
        // console.log(filteredData,"artData--",artData.length);
        // if(filteredData != [])
        // {
          if(route.params?.categoryArray)
          {
            // console.log(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray);
          }
          else {
            setFilteredArticleData([]);
          }
        // }
      }
      fetchData()
    },[languageCode,route.params?.categoryArray])
  );
  
  const setFilteredArticleData = (itemId:any) => {
    // console.log(itemId,"articleData in filtered ",articleData);
    if(articleData != '')
    {
      if(itemId.length>0)
      {
        const newArticleData = articleData.filter((x:any)=> itemId.includes(x.category));
        setfilteredData(newArticleData);
        setLoading(false);
      }else {
        const newArticleData = articleData != '' ? articleData : [];
        setfilteredData(newArticleData);
        setLoading(false);
      }
    }
    // if(articleData != '')
    // {
    //   console.log("in if filterdata");
    //   setfilteredData(articleData);
    // }
  }
  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setArticleData(stateArticleData)
  //     console.log("stateArticleData",stateArticleData);
  //   },[stateArticleData])
  // );

  // const filterOnCategory = (itemId: any) => {
  //   console.log(itemId,"articleData---");
  //   if(itemId.length>0)
  //   {
  //     const newArticleData = articleData.filter((x:any)=> itemId.includes(x.category));
  //   }else {
  //     const newArticleData = [...articleData];
  //   }
  //   // console.log("newArticleData--",newArticleData);
  //   // setArticleData(newArticleData)
  // }
  //code for getting article dynamic data ends here.
  return (
    <>
      <OverlayLoadingComponent loading={loading} />
      <ContainerView>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <ScrollView nestedScrollEnabled={true}>
          <TabScreenHeader
            title={t('articleScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />

          <FlexDirCol>
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
           
              <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} filterArray={filterArray}/>
              {filteredData.length> 0 ? filteredData.map((item: any, index: number) => {
                return renderArticleItem(item, index);
              }) : setFilteredArticleData([])}
              
          </FlexDirCol>
          </ScrollView>
          <Modal
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
                  setModalVisible(!modalVisible);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>

            
              <Heading4Centerr>
                {t('articleModalText')}
              </Heading4Centerr>
              <ShiftFromTop10><Text></Text></ShiftFromTop10>
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
      </Modal>
        </KeyboardAvoidingView>
      </ContainerView>
    </>
  );
};

export default Articles;
const styles = StyleSheet.create({
  // item: {
  //   backgroundColor: '#FFF',
  //   // padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   borderRadius: 5,
  //   flex: 1,
  //   overflow:'hidden',
  // },
  // title: {
  //   fontSize: 16,
  //   padding: 10,
  //   flex: 1,
  // },
  // label: {
  //   fontSize: 12,
  //   paddingLeft: 10,
  //   flex: 1,
  // },
  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    
  },
});
