import React from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView } from "react-native"
const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: '0-1 Month',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: '1-3 Month',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '3-5 Month',
    },
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bb',
        title: '5-9 Month',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f64',
        title: '9-13 Month',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d73',
        title: '13-55 Month',
      },
  ];

const AgeBrackets = () => {
    const renderDailyReadItem = (item, index) => (
        <Item title={item.title} key={index}/>
      );
    return (
        <>
        <View style={{padding:10, flex: 1,minHeight:80}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled
        >
          {DATA.map((item, index) => {
            return renderDailyReadItem(item, index)
          })}
        </ScrollView>
        {/* <FlatList
              data={DATA}
              horizontal
              renderItem={renderDailyReadItem}
              keyExtractor={item => item.id}
            /> */}
        </View>
        </>
    );
};
export default AgeBrackets;
const styles = StyleSheet.create({
    item: {
      backgroundColor: '#f9c2ff',
      padding: 10,
      marginVertical: 10,
      marginHorizontal: 10,
    },
    title: {
      fontSize: 12,
    },
  });