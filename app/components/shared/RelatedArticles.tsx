import { useFocusEffect } from '@react-navigation/native';
import { RelatedArticlesProps } from '@screens/home/DetailsScreen';
import { Heading2, Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import { maxRelatedArticleSize } from '@types/apiConstants';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { ArticleEntity, ArticleEntitySchema } from '../../database/schema/ArticleSchema';
import { ArticleHeading, RelatedArticleContainer, ArticleListContent,} from './ArticlesStyle';
import { MainContainer } from './Container';
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

const RelatedArticles = (props : RelatedArticlesProps) => {
  console.log(props);
  const { related_articles, category, currentId } = props;
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
      console.log(categoryData,"--in relatedarticle focuseffect",relartlength);
      async function fetchData() {
        if(relartlength > 0)
        {
          // const filterQuery = 'id Contains "'+currentChildData.parent_gender+'" AND child_age Contains "'+currentChildData.taxonomyData.id+'"';
          const filterQuery = related_articles.map((x: any) => `id = '${x}'`).join(' OR ');
          const databaseData = await dataRealmCommon.getFilteredData<ArticleEntity>(ArticleEntitySchema,filterQuery);
          // console.log(databaseData.length);
        //  databaseData.map(user => user
          setrelatedArticleData(databaseData);
        }
        if(relartlength < maxRelatedArticleSize) {
          const catartlength = maxRelatedArticleSize - relartlength;
          // console.log(articleData)
          // console.log(relatedArticleData,"--relatedArticleData");
          const filteredArtData = articleData.filter((x: any)=> {
            const i = relatedArticleData.findIndex((_item: any) => _item.id === x.id);
            return x.category==category && x.id !==currentId && i == -1
          }).slice(0,catartlength);
          // console.log(filteredArtData);
          setrelatedArticleData((relatedArticleData: any) => [...relatedArticleData , ...filteredArtData]);
          // console.log(relatedArticleData);
          // setrelatedArticleData(relatedArticleData.push(...filteredArtData));
        }
      }
      fetchData()
    },[])
  );
  console.log("relatedArticleData---",relatedArticleData);

  const renderDailyReadItem = (item: any, index: number) => {
    return (
      <RelatedArticleContainer key={index}>
        <Image 
        // source={item.imagePath} 
        // source={item.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(item.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
        source={require('@assets/trash/defaultArticleImage.png')}
        style={styles.cardImage}></Image>
        <ArticleListContent>
        <ShiftFromTopBottom5>
        <Heading6Bold>Nutrition and BreastFeeding</Heading6Bold>
        </ShiftFromTopBottom5>
        {/* <Heading6Bold>{ categoryData.filter((x: any) => x.id==item.category)[0].name }</Heading6Bold> */}
        <Heading3>{item.title}</Heading3>
        </ArticleListContent>
         <ShareFavButtons  isFavourite={false} backgroundColor={'#FFF'}/>
       
      </RelatedArticleContainer>
    );
  };

  return (
    <>
      <ContainerView>
        <ArticleHeading>
        <Heading2>{t('growthScreenrelatedArticle')}</Heading2>
        </ArticleHeading>
        <FlatList
          data={relatedArticleData}
          horizontal
          renderItem={({item, index}) => renderDailyReadItem(item, index)}
          keyExtractor={(item) => item.id}
        />
      </ContainerView>
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
