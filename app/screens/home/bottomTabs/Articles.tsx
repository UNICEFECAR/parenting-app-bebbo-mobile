import { articledata } from '@assets/translations/appOfflineData/article';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import Icon from '@components/shared/Icon';
import TabScreenHeader from '@components/TabScreenHeader';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { destinationFolder } from '@types/apiConstants';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image, KeyboardAvoidingView,
  Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { getChildArticleData } from '../../../database/dbquery/getChildArticles';
import { ArticleEntity, ArticleEntitySchema } from '../../../database/schema/ArticleSchema';
import { setAllArticleData } from '../../../redux/reducers/articlesSlice';
// import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

type ArticlesNavigationProp = StackNavigationProp<RootStackParamList>;

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

  const renderArticleItem = (item: typeof articleData[0], index: number) => (
      <Pressable onPress={onPress} key={index}>
        <View style={styles.item}>
          <Image
            style={styles.cardImage}
            source={{uri : "file://" + destinationFolder + ((item.cover_image.url).split('/').pop())}}
            // source={item.cover_image.url}
            resizeMode={'cover'}
          />
          <Text style={styles.label}>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{flex: 1}}>
              <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
                <Icon name="ic_sb_shareapp" size={20} color="#000" />
                <Text>{t('articleScreen.shareText')}</Text>
              </Pressable>
            </View>
            <View style={{flex: 1}}>
              <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
                <Icon name="ic_sb_favorites" size={20} color="#000" />
                <Text>{t('articleScreen.addtoFavText')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

  );

  const onPress = () => {
    navigation.navigate('ArticleDetails');
  };
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const {t} = useTranslation();
  //code for getting article dynamic data starts here.
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
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchData() {
      let Entity:any;
      // Entity = Entity as TaxonomyEntity
      const artData = await getChildArticleData(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,currentChildData);
      // console.log("artData--",artData);
      setLoading(false);
    }
    fetchData()
  },[languageCode]);
  
  const articleData = useAppSelector(
    (state: any) => state.articlesData.article.articles != '' ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  // console.log("articleData--",articleData);
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
            title={t('articleScreen.headerTitle')}
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
                placeholder={t('articleScreen.searchPlaceHolder')}
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  textAlign: 'left',
                  paddingHorizontal: 20,
                }}
              />
            </View>
           
              <ArticleCategories borderColor={headerColor} />
              {articleData != '' ? articleData.map((item, index) => {
                return renderArticleItem(item, index);
              }) : null}
              
          </View>
          </ScrollView>
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
