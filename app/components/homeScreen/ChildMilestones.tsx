import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableHighlight, Dimensions, ScrollView } from 'react-native';
const circleWidth=100;
const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);
const MilestoneCircle = () => (
  <View style={{width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth / 2,
    backgroundColor:'purple'}}>
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
const boxWidth= 200;
const contentContainerStyleWidth = (boxWidth * DATA.length-1)+circleWidth;
const ChildMilestones = ({ navigation }: Props) => {
  const renderDailyReadItem = (item: typeof DATA[0], index: number) => {
    if (index === 0) {
     return (<MilestoneCircle key={index}  />)
    } else {
     return (<Item title={item.title} key={index} />)
    }
  }

  return (
    <>
      <View style={{ backgroundColor: '#DDD' }}>
        <Text>{'Child Milestones'}</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{ width: `${contentContainerStyleWidth}%` }}
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
    width: boxWidth,
  },
  title: {
    fontSize: 32,
  },
});