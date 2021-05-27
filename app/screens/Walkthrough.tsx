import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button, SafeAreaView, ImageBackground} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {RootStackParamList} from '../navigation/types';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
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
          showSkipButton
          showPrevButton
          data={data}
          onDone={onDone}
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