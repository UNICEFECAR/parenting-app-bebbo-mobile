import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableHighlight, Dimensions, ScrollView } from 'react-native';

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
];

const ChildMilestones = ({ navigation }: Props) => {
  const renderDailyReadItem = (item, index) => (
    <Item title={item.title} key={index} />
  );
  return (
    <>
      <View style={{backgroundColor:'#DDD'}}>
        <Text>{'Child Milestones'}</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ width: `${100 * 3}%` }}
          showsHorizontalScrollIndicator={true}
          scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled
        >
          {DATA.map((item, index) => {
            return renderDailyReadItem(item, index)
          })}
        </ScrollView>
      </View>

      {/* <FlatList
          data={DATA}
          horizontal
          renderItem={renderDailyReadItem}
          keyExtractor={item => item.id}
        /> */}

    </>
  );
};

export default ChildMilestones;
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