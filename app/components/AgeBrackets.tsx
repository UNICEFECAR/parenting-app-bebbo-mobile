import Icon from '@components/shared/Icon';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    title: '13-25 Month',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d74',
    title: '25-30 Month',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bd',
    title: '30-39 Month',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f66',
    title: '39-45 Month',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d75',
    title: '45-52 Month',
  },
];

const AgeBrackets = (props: any) => {
  const [currentXOffset, setCurrentXOffset] = React.useState(0);
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);

  let scrollRef = useRef<ScrollView>();
  const renderDailyReadItem = (item, index, itemColor, activatedItemColor) => {
    return (
      <View key={index} style={[styles.item, {backgroundColor: itemColor}]}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
    // <Item title={item.title} key={index} itemColor={itemColor} activatedItemColor={activatedItemColor}/>
  };
  const handleScroll = (event) => {
    // console.log('currentXOffset =', event.nativeEvent.contentOffset.x);
    const newXOffset = event.nativeEvent.contentOffset.x;
    setCurrentXOffset(newXOffset);
  };

  const leftArrow = () => {
    const eachItemOffset = scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
    const _currentXOffset = currentXOffset - eachItemOffset;
    // console.log(scrollRef);
    scrollRef.current?.scrollTo({x: _currentXOffset, y: 0, animated: true});
  };

  const rightArrow = () => {
    const eachItemOffset = scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
    const _currentXOffset = currentXOffset + eachItemOffset;
    scrollRef.current?.scrollTo({x: _currentXOffset, y: 0, animated: true});
  };
  return (
    <>
      <View
        style={{
          padding: 10,
          flex: 1,
          minHeight: 80,
          flexDirection: 'row',
          backgroundColor: '#FFF',
        }}>
        <View style={{padding: 10, paddingTop: 16}}>
          <TouchableOpacity onPress={() => leftArrow()}>
            <Icon name="ic_angle_left" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollRef}
          // ref={node => { scrollRef = node; }}
          onContentSizeChange={(w, h) => setScrollViewWidth(w)}
          scrollEventThrottle={16}
          // scrollEnabled={false} // remove if you want user to swipe
          onScroll={handleScroll}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          // scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled
          style={{flex: 9}}>
          {DATA.map((item, index) => {
            return renderDailyReadItem(
              item,
              index,
              props.itemColor,
              props.activatedItemColor,
            );
          })}
        </ScrollView>
        <View style={{padding: 10, paddingTop: 16}}>
          <TouchableOpacity
            onPress={() => {
              rightArrow();
            }}>
            <Icon name="ic_angle_right" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default AgeBrackets;

const styles = StyleSheet.create({
  item: {
    // backgroundColor: itemColor,
    padding: 10,

    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: 'black',
  },
  title: {
    fontSize: 12,
  },
});
