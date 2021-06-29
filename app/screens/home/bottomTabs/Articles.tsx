import { articledata } from '@assets/translations/appOfflineData/article';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
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
import { Heading4Centerr } from '@styles/typography';
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
  navigation: ArticlesNavigationProp;
};

const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ARTICLES_TINTCOLOR};
`;

// const DATA = [
//   {
//     id: '1',
//     imagePath: require('@assets/trash/card1.jpeg'),
//     title: 'General recommendations for overweight and obese infants',
//   },
//   {
//     id: '2',
//     imagePath: require('@assets/trash/card2.jpeg'),
//     title: 'General recommendations for overweight and obese infants',
//   },
//   {
//     id: '3',
//     imagePath: require('@assets/trash/card3.jpeg'),
//     title: 'General recommendations for overweight and obese infants',
//   },
//   {
//     id: '4',
//     imagePath: require('@assets/trash/card4.jpeg'),
//     title: 'General recommendations for overweight and obese infants',
//   },
//   {
//     id: '5',
//     imagePath: require('@assets/trash/card5.jpeg'),
//     title: 'General recommendations for overweight and obese infants',
//   },
//   {
//     id: '6',
//     imagePath: require('@assets/trash/card6.jpeg'),
//     title: 'Picking stuff around',
//   },
// ];
const Articles = ({navigation}: Props) => {
  const [modalVisible, setModalVisible] = useState(true);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const articleModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsArticleModalOpened),
    );
   useFocusEffect(()=>{
    //  console.log('weightModalOpened',weightModalOpened);
      // pass true to make modal visible every time & reload
    setModalVisible(articleModalOpened)
   })
  const renderArticleItem = (item: any, index: number) => (
      <Pressable onPress={onPress} key={index}>
        <View style={styles.item}>
          <Image
            style={styles.cardImage}
            // source={{uri : "file://" + destinationFolder + ((item.cover_image.url).split('/').pop())}}
            source={require('@assets/trash/defaultArticleImage.png')}
            resizeMode={'cover'}
          />
          <Text style={styles.label}>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Text>
          <Text style={styles.title}>{item.title}</Text>
          <ShareFavButtons  isFavourite={false} backgroundColor={'#FFF'}/>
        </View>
      </Pressable>

  );

 
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const onPress = () => {
    navigation.navigate('DetailsScreen',{fromScreen:"Articles",headerColor:headerColor,backgroundColor:backgroundColor});
  };
  const {t} = useTranslation();
  //code for getting article dynamic data starts here.
  let filterArray: string[] = [];
  const currentChildData = {
    "gender":"40",
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
  const [loading, setLoading] = useState(true);
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
      async function fetchData() {
        let Entity:any;
        // Entity = Entity as TaxonomyEntity
        const artData = await getChildArticleData(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,currentChildData);
        // setArticleData(stateArticleData)
        // setfilteredData(articleData);
        console.log(filteredData,"artData--",artData.length);
        // if(filteredData != [])
        // {
          setFilteredArticleData([]);
        // }
      }
      fetchData()
    },[languageCode])
  );
  
  const setFilteredArticleData = (itemId:any) => {
    console.log(itemId,"articleData in filtered ",articleData);
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

          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', backgroundColor: '#fff'}}>
              <Icon
                name="ic_search"
                size={20}
                color="#000"
                style={{paddingHorizontal: 20, paddingVertical: 16}}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={''}
                // onChangeText={queryText => handleSearch(queryText)}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  textAlign: 'left',
                  paddingHorizontal: 20,
                }}
              />
            </View>
           
              <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} filterArray={filterArray}/>
              {filteredData.length> 0 ? filteredData.map((item: any, index: number) => {
                return renderArticleItem(item, index);
              }) : setFilteredArticleData([])}
              
          </View>
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

            <View>
              <Heading4Centerr>
                {t('articleModalText')}
              </Heading4Centerr>
              <ButtonPrimary
                onPress={() => {
                  setIsModalOpened('IsArticleModalOpened');
                }}>
                <ButtonText>{t('continueInModal')}</ButtonText>
              </ButtonPrimary>
            </View>
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
  item: {
    backgroundColor: '#FFF',
    // padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    padding: 10,
    flex: 1,
  },
  label: {
    fontSize: 12,
    paddingLeft: 10,
    flex: 1,
  },
  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
