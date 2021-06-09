
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text, ScrollView,FlatList, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { RootStackParamList } from '../../../navigation/types';
import { ThemeContext } from 'styled-components';
type ArticlesNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp,
};

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bb',
    title: '4th Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f64',
    title: '5th Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d73',
    title: '6th Item',
  },
];
const Articles = ({ navigation }: Props) => {
  const renderDailyReadItem = ({ item }) => (
    <TouchableOpacity onPress={onPress} >
    <Item title={item.title} />
    </TouchableOpacity>
  );

  const onPress = ()=>{
    navigation.navigate('ArticleDetails');
  }
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.ARTICLES_COLOR;
  return (
    <>
     <SafeAreaView style={{flex:1}}>
      <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
      />
      <TabScreenHeader title="Articles" headerColor={headerColor} />
      <View style={{flex:1,flexDirection:'column'}}>
        <View style={{flex:1}}>
          <TextInput
           autoCapitalize='none'
           autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder="Search"
            style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
          />
        </View>
        <ArticleCategories />
        <View style={{flex:9}}>
        <FlatList
          data={DATA}
          renderItem={renderDailyReadItem}
          keyExtractor={item => item.id}
        />
        </View>
        </View>
       </SafeAreaView>
    </>
  );
};

export default Articles;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});