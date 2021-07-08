import { useNavigation } from '@react-navigation/native';
import { Heading3, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
import { ArticleListContainer, ArticleListContent } from './shared/ArticlesStyle';
import ShareFavButtons from './shared/ShareFavButtons';

const FavArticles = (props: any) => {
  const DATA = [
    {
      id: '1',
      imagePath: require('@assets/trash/card1.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '2',
      imagePath: require('@assets/trash/card2.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '3',
      imagePath: require('@assets/trash/card3.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '4',
      imagePath: require('@assets/trash/card4.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '5',
      imagePath: require('@assets/trash/card5.jpeg'),
      title: 'General recommendations for overweight and obese infants',
    },
    {
      id: '6',
      imagePath: require('@assets/trash/card6.jpeg'),
      title: 'Picking stuff around',
    },
  ];
  const navigation = useNavigation();

  const themeContext = useContext(ThemeContext);

  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'Articles',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  };
  const renderActivityItem = (item: typeof DATA[0], index: number) => (
<Pressable onPress={gotoArticle} key={index}>
      <ArticleListContainer>
      <Image
          style={styles.cardImage}
         source={item.imagePath}
          resizeMode={'cover'}
         />
        <ArticleListContent>
            <ShiftFromTopBottom5>
          <Heading6Bold>Cognitive</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
        
          <ShareFavButtons isFavourite={true} backgroundColor={'#FFF'} />
      </ArticleListContainer>
    </Pressable>


  );
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: artBackgroundColor,
        }}>
        <ScrollView>
          {DATA.map((item, index) => {
            return renderActivityItem(item, index);
          })}
        </ScrollView>
      </View>
    </>
  );
};
export default FavArticles;

const styles = StyleSheet.create({
  // item: {
  //   height: '100%',
  //   backgroundColor: '#FFF',
  //   // padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   borderRadius: 5,
  //   flex: 1,
  // },
  // title: {
  //   fontSize: 16,
  //   padding: 10,
  //   // flex: 1,
  //   color: '#000',
  // },
  // label: {
  //   fontSize: 12,
  //   paddingLeft: 10,
  //   // flex: 1,
  //   color: '#000',
  // },
  // cardImage: {
  //   height: 200,
  //   width: '100%',
  //   // flex: 1,
  //   // alignSelf: 'center',
  //   borderTopRightRadius: 5,
  //   borderTopLeftRadius: 5,
  // },
});
