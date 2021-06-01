import {StackNavigationProp} from '@react-navigation/stack';
import React, { useState } from 'react';
import {View, Text, Button, SafeAreaView, ImageBackground, Image} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {RootStackParamList} from '../navigation/types';
import { StyleSheet } from 'react-native';
type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};
const data = [
  {
    title: 'Monitor growth of your child',
    image: require('../assets/walkthrough/01.png'),
    bg: '#59b2ab',
  },
  {
    title: 'Advices tailored to your needs',
    image: require('../assets/walkthrough/02.png'),
    bg: '#febe29',
  },
  {
    title: 'Make records of important developmental milestones',
    image: require('../assets/walkthrough/03.png'),
    bg: '#22bcb5',
  },
  {
    title: 'Make records of health check-ups',
    image: require('../assets/walkthrough/04.png'),
    bg: '#22bcb5',
  },
];
type Item = typeof data[0];
const Walkthrough = ({navigation}: Props) => {
  const renderItem = ({item}: {item: Item}) => {
    return (
      <ImageBackground style={styles.slide} source={item.image}>
        <Text style={styles.text}>{item.title}</Text>
      </ImageBackground>
    );
  };
  const renderDoneButton = () =>{
    return (
      // <View style={{width: 40,height: 40,backgroundColor: 'rgba(0, 0, 0, .2)',borderRadius: 20,justifyContent: 'center',alignItems: 'center',}}>
      //   <Image style={{width:40,height:40}} source={ require( '../assets/round-tick.png') } />
      // </View>
      <Text style={{color:'#000'}}>Next</Text>
    );
  }
  const renderPrevButton = () =>{
    return (
      // <View style={{width: 40,height: 40,backgroundColor: 'rgba(0, 0, 0, .2)',borderRadius: 20,justifyContent: 'center',alignItems: 'center',}}>
      //   <Image style={{width:40,height:40}} source={ require( '../assets/round-tick.png') } />
      // </View>
      <Text style={{color:'#000'}}>Back</Text>
    );
  }
  const [showPrevbtn,setShowPrevbtn] = useState(false);
  const onSlideChange = (index,lastIndex) => {
    console.log(index," --index----",lastIndex);
    (index == 3) ? setShowPrevbtn(true) : setShowPrevbtn(false);
    
  }
  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    navigation.navigate('Terms');
  }
  const keyExtractor = (item: Item) => item.title;
  return (
    <>
      <AppIntroSlider
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          // bottomButton
          dotClickEnabled
          // showDoneButton={false}
          showSkipButton = {false}
          showPrevButton = {showPrevbtn}
          showNextButton = {false}
          data={data}
          onDone={onDone}
          onSlideChange={onSlideChange}
          renderDoneButton={renderDoneButton}
          renderPrevButton={renderPrevButton}
        />
      {/* <AppIntroSlider renderItem={renderItem} data={data} onDone={onDone}/> */}
      {/* <Text>Walkthrough screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate('ChildSetup');
        }}
      /> */}
   </>
  );
};

export default Walkthrough;
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    resizeMode: 'cover',
  },
  text: {
    color: '#333',
    marginTop: 475,
    textAlign: 'center',
  },
});