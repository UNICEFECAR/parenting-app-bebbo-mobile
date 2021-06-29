import { Heading2, Heading3 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
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

const RelatedArticles = () => {
  const {t} = useTranslation();
  const renderDailyReadItem = (item: typeof DATA[0], index: number) => {
    return (
      <View style={styles.item} key={index}>
        <Image source={item.imagePath} style={styles.cardImage}></Image>
        <View
          style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFF'}}>
          <Text style={styles.header}>Nutrition and BreastFeeding</Text>
          <Heading3 style={styles.title}>{item.title}</Heading3>
        </View>
       
         <ShareFavButtons  isFavourite={false} backgroundColor={'#FFF'}/>
       
      </View>
    );
  };

  return (
    <>
      <ContainerView>
        <Heading2>{t('growthScreenrelatedArticle')}</Heading2>
        <FlatList
          data={DATA}
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
  item: {
    // backgroundColor: '#FFF',
    // padding: 20,
    marginVertical: 8,
    marginRight: 16,
    // marginHorizontal: 16,
    width: 300,
    borderRadius: 5,
  },
  btn: {
    width: 150,
    padding: 5,
  },
  btntxt: {
    color: '#000',
  },
  title: {
    padding: 5,
  },
  header: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingTop: 5,
    color: '#000',
  },
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
