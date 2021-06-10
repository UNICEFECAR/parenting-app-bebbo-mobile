
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, Pressable, ScrollView } from 'react-native';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { RootStackParamList } from '../../../navigation/types';
import styled, { ThemeContext } from 'styled-components/native';
import Icon from '@components/shared/Icon';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'

type ArticlesNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
};


const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.ARTICLES_TINTCOLOR};
`;

const DATA = [
  {
    id: '1',
    imagePath: require('../../../assets/trash/card1.jpeg'),
    title: 'General recommendations for overweight and obese infants'
  },
  {
    id: '2',
    imagePath: require('../../../assets/trash/card2.jpeg'),
    title: 'General recommendations for overweight and obese infants'
  },
  {
    id: '3',
    imagePath: require('../../../assets/trash/card3.jpeg'),
    title: 'General recommendations for overweight and obese infants'
  },
  {
    id: '4',
    imagePath: require('../../../assets/trash/card4.jpeg'),
    title: 'General recommendations for overweight and obese infants'
  },
  {
    id: '5',
    imagePath: require('../../../assets/trash/card5.jpeg'),
    title: 'General recommendations for overweight and obese infants'
  },
  {
    id: '6',
    imagePath: require('../../../assets/trash/card6.jpeg'),
    title: 'Picking stuff around'
  },
];
const Articles = ({ navigation }: Props) => {
  const renderArticleItem = (item: typeof DATA[0], index: number) => (
    <>
      <Pressable onPress={onPress}>
        <View style={styles.item} key={index}>
          <Image style={styles.cardImage}
            source={item.imagePath} resizeMode={'cover'} />
          <Text style={styles.label}>Play and learning</Text>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View style={{ flex: 1, }} >
              <Pressable onPress={() => { }} style={{ flexDirection: "row", }}>
                <Icon name="ic_sb_shareapp" size={20} color="#000" /><Text>Share</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1, }} >
              <Pressable onPress={() => { }} style={{ flexDirection: "row", }}>
                <Icon name="ic_sb_shareapp" size={20} color="#000" /><Text>Add to favourites</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </>
  );

  const onPress = () => {
    navigation.navigate('ArticleDetails');
  }
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  return (
    <>
      <ContainerView>
        
      <KeyboardAwareView animated useNativeDriver={true}>

          <FocusAwareStatusBar
            animated={true}
            backgroundColor={headerColor}
          />
          <TabScreenHeader title="Articles" headerColor={headerColor} textColor='#000'/>
        
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', }}>
              <Icon name="ic_search" size={20} color="#000" style={{ paddingHorizontal: 20, paddingVertical: 16 }} />
              <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                clearButtonMode="always"
                value={''}
                // onChangeText={queryText => handleSearch(queryText)}
                placeholder="Search for Keywords"
                style={{ backgroundColor: '#fff', width: '100%', textAlign: 'left', paddingHorizontal: 20 }}
              />
            </View>
            <ArticleCategories borderColor={headerColor} />
            <FlatList
              data={DATA}
              renderItem={({ item, index }) => renderArticleItem(item, index)}
              keyExtractor={item => item.id}
              
            />
          </View>
      
      </KeyboardAwareView>
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
    flex: 1
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
  }
});