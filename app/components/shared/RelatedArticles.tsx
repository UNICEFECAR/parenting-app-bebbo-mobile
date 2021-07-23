import { maxRelatedArticleSize } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect } from '@react-navigation/native';
import { RelatedArticlesProps } from '@screens/home/DetailsScreen';
import { Heading2, Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import { ArticleHeading, ArticleListContent, RelatedArticleContainer } from './ArticlesStyle';
import ShareFavButtons from './ShareFavButtons';

const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  /* padding: 15px; */
  margin-top: 10px;
`;

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your filgers',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'Picking stuff around',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'Gripping your filgers',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];

const RelatedArticles = (props:RelatedArticlesProps) => {
  console.log(props);
  const { related_articles, category, currentId,fromScreen,headerColor,backgroundColor,listCategoryArray, navigation } = props;
  // console.log(props);
  const {t} = useTranslation();
  const relartlength = related_articles.length;
  const articleData = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  // let relatedArticleData: any[] = [];
  const [relatedArticleData,setrelatedArticleData] = useState<any>([]);
  useFocusEffect(
    React.useCallback(() => {
      // console.log(categoryData,"--in relatedarticle focuseffect",relartlength);
      setrelatedArticleData([]);
      async function fetchData() {
        if(relartlength > 0)
        {
          // const filterQuery = 'id Contains "'+currentChildData.parent_gender+'" AND child_age Contains "'+currentChildData.taxonomyData.id+'"';
          const filterQuery = related_articles.map((x: any) => `id = '${x}'`).join(' OR ');
          const databaseData = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema,filterQuery);
          console.log(databaseData.length,"neha");
        //  databaseData.map(user => user
          setrelatedArticleData(databaseData);
        }
        if(category!=5){
      // go not calclualte for growth screen
        if(relartlength < maxRelatedArticleSize) {
          const catartlength = maxRelatedArticleSize - relartlength;
          // console.log(articleData)
          // console.log(relatedArticleData,"--relatedArticleData");
          const databaseData = await dataRealmCommon.getData<ArticleEntity>(ArticleEntitySchema);
          console.log(databaseData.length);
          // console.log(databaseData.filter((x:any)=> console.log(x) ));
          const filteredArtData = databaseData.filter((x: any)=> {
            const i = relatedArticleData.findIndex((_item: any) => _item.id === x.id);
            return x.category==category && x.id !==currentId && i == -1
          }).slice(0,catartlength);
          // const filteredArtData = articleData.filter((x: any)=> {
          //   const i = relatedArticleData.findIndex((_item: any) => _item.id === x.id);
          //   return x.category==category && x.id !==currentId && i == -1
          // }).slice(0,catartlength);
          // console.log(filteredArtData);
          setrelatedArticleData((relatedArticleData: any) => [...relatedArticleData , ...filteredArtData]);
          // console.log(relatedArticleData);
          // setrelatedArticleData(relatedArticleData.push(...filteredArtData));
        }
      }
      }
      fetchData()
    },[currentId])
  );
  //console.log("relatedArticleData---",relatedArticleData);
  const goToArticleDetail = (item:typeof relatedArticleData[0]) => {
    navigation.navigate('DetailsScreen',
    {
      fromScreen:fromScreen ? fromScreen :"Articles",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: listCategoryArray ? listCategoryArray: null
      // setFilteredArticleData: setFilteredArticleData
    });
  };
  const renderDailyReadItem = (item: any, index: number) => {
    return (
      <Pressable onPress={() => { goToArticleDetail(item)}} key={index}
      style={{flexDirection:'row'}}
      >
        <RelatedArticleContainer style={{backgroundColor:'#fff'}}  key={index}>
          <Image 
          // source={item.imagePath} 
          // source={item.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(item.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
          source={require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}></Image>
          <View style={{minHeight:90,}}>
          <ArticleListContent>
          <ShiftFromTopBottom5>
          {/* <Heading6Bold>Nutrition and BreastFeeding</Heading6Bold> */}
          <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold>
          </ShiftFromTopBottom5>
          {/* <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold> */}
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          </View>
          <ShareFavButtons  isFavourite={false} backgroundColor={'#FFF'}/>
        </RelatedArticleContainer>
      </Pressable>  
    );
  };

  return (
    <>
    { relatedArticleData.length > 0 ?
        <ContainerView key={currentId}>
          <ArticleHeading>
          <Heading2>{t('growthScreenrelatedArticle')}</Heading2>
          </ArticleHeading>
          <View style={{paddingLeft:10,}}>
          <FlatList
            data={relatedArticleData}
            horizontal
            renderItem={({item, index}) => renderDailyReadItem(item, index)}
            keyExtractor={(item) => item.id}
          />
          </View>
        </ContainerView>
        : null 
    }
    </>
  );
};

export default RelatedArticles;

const styles = StyleSheet.create({
  // item: {
 
  //  width: 300,
  
  // },
  // btn: {
  //   width: 150,
  //   padding: 5,
  // },
  // btntxt: {
  //   color: '#000',
  // },
  // title: {
  //   padding: 5,
  // },
  // header: {
  //   fontSize: 10,
  //   fontWeight: 'bold',
  //   paddingHorizontal: 5,
  //   paddingTop: 5,
  //   color: '#000',
  // },
  cardImage: {
    width: '100%',
    height: 120,
    flex: 1,
    // position: 'relative',
    top: 0,
    left: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    // backgroundColor: 'red'
  },
});
