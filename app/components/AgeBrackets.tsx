import React, { useLayoutEffect, useRef, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native"
import { TouchableOpacity } from 'react-native-gesture-handler';
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

const AgeBrackets = () => {
    const [currentXOffset, setCurrentXOffset] = React.useState(0);
    const [scrollViewWidth, setScrollViewWidth] = React.useState(0);

    let scrollRef = useRef<ScrollView>();
    const renderDailyReadItem = (item, index) => (
        <Item title={item.title} key={index} />
    );
    const handleScroll = (event) => {
        // console.log('currentXOffset =', event.nativeEvent.contentOffset.x);
        const newXOffset = event.nativeEvent.contentOffset.x
        setCurrentXOffset(newXOffset);
    }

    const leftArrow = () => {
        const eachItemOffset = scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
        const _currentXOffset = currentXOffset - eachItemOffset;
        // console.log(scrollRef);
        scrollRef.current?.scrollTo({ x: _currentXOffset, y: 0, animated: true })
    }

    const rightArrow = () => {
        const eachItemOffset = scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items 
        const _currentXOffset = currentXOffset + eachItemOffset;
        scrollRef.current?.scrollTo({ x: _currentXOffset, y: 0, animated: true })
    }
    return (
        <>
            <View style={{ padding: 10, flex: 1, minHeight: 80, flexDirection: "row" }}>
                <View style={{ padding: 10, paddingTop: 16 }} >
                    <TouchableOpacity onPress={() => leftArrow()}>
                        <Text>{'< Left'}</Text>
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
                    style={{ flex: 9 }}
                >
                    {DATA.map((item, index) => {
                        return renderDailyReadItem(item, index)
                    })}
                </ScrollView>
                <View style={{ padding: 10, paddingTop: 16 }}>
                    <TouchableOpacity onPress={() => { rightArrow() }}><Text>{'Right >'}</Text>
                    </TouchableOpacity></View>
            </View>
        </>
    );
};
export default AgeBrackets;
const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9c2ff',
        padding: 10,

        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 10,
        borderWidth: 1,
        borderRadius: 1,
        borderColor: 'black'
    },
    title: {
        fontSize: 12,
    },
});