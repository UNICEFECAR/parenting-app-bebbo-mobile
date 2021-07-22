import Icon from '@components/shared/Icon';
import { useFocusEffect } from '@react-navigation/native';
import { Heading4 } from '@styles/typography';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppSelector } from '../../App';
import AgeSliderContainer, { AgeSliderBox, AgeSliderNav } from './shared/AgeSliderContainer';

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
  const childAge = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );
    //  console.log(childAge.length);
  // const activeChildId = useAppSelector((state: any) =>
  //   state.childData.childDataSet.activeChild != ''
  //     ? JSON.parse(state.childData.childDataSet.activeChild).taxonomyData.id
  //     : [],
  // );
  // console.log("activeChild-",activeChildId);
  // const [currentSelectedChildId,setCurrentSelectedChildId] = useState();
  // let currentSelectedChildId: any;
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const firstChildDevData = childAge.filter((x:any)=> x.id == activeChildId);
  //     console.log("firstChildDevData---",firstChildDevData);
  //     goToSelectedAgeBrac(firstChildDevData[0]);
  //   },[])
  // );
  // const goToSelectedAgeBrac = (item: any) => {
  //   currentSelectedChildId = item.id;
  //   props.showSelectedBracketData(item);
  // }
  let scrollRef = useRef<ScrollView>();
  const renderDailyReadItem = (item: any, index: any, itemColor: any, activatedItemColor: any) => {
    return (
      <Pressable onPress={() => { props.showSelectedBracketData(item)}} key={item.id}>
        <AgeSliderBox style={{backgroundColor:item.id == props.currentSelectedChildId ? activatedItemColor : itemColor}}>
          <Heading4>{item.name}</Heading4>
        </AgeSliderBox>
      </Pressable>
    );
    // <Item title={item.title} key={index} itemColor={itemColor} activatedItemColor={activatedItemColor}/>
  };
  const handleScroll = (event) => {
    // console.log('currentXOffset =', event.nativeEvent.contentOffset.x);
    const newXOffset = event.nativeEvent.contentOffset.x;
    setCurrentXOffset(newXOffset);
  };

  const leftArrow = () => {
    const eachItemOffset = scrollViewWidth / (childAge.length-1); // Divide by 10 because I have 10 <View> items
    const _currentXOffset = currentXOffset - eachItemOffset;
    // console.log(scrollRef);
    scrollRef.current?.scrollTo({x: _currentXOffset, y: 0, animated: true});
  };

  const rightArrow = () => {
    const eachItemOffset = scrollViewWidth / (childAge.length-1); // Divide by 10 because I have 10 <View> items
    const _currentXOffset = currentXOffset + eachItemOffset;
    scrollRef.current?.scrollTo({x: _currentXOffset, y: 0, animated: true});
  };
  return (
    <>
    <AgeSliderContainer>
        <AgeSliderNav>
          <TouchableOpacity onPress={() => leftArrow()}>
            <Icon name="ic_angle_left" size={20} color="#000" />
          </TouchableOpacity>
        </AgeSliderNav>
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
          {childAge.map((item: any, index: any) => {
            return renderDailyReadItem(
              item,
              index,
              props.itemColor,
              props.activatedItemColor,
            );
          })}
        </ScrollView>
        <AgeSliderNav>
          <TouchableOpacity
            onPress={() => {
              rightArrow();
            }}>
            <Icon name="ic_angle_right" size={20} color="#000" />
          </TouchableOpacity>
        </AgeSliderNav>
        </AgeSliderContainer>
    </>
  );
};
export default AgeBrackets;

const styles = StyleSheet.create({
  // item: {
  //   // backgroundColor: itemColor,
  //   padding: 10,

  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   margin: 10,
  //   borderWidth: 1,
  //   borderRadius: 1,
  //   borderColor: 'black',
  // },
  title: {
    fontSize: 12,
  },
});
