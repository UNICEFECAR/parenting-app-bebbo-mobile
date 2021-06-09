import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Button, SafeAreaView, ImageBackground, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { RootStackParamList } from '../navigation/types';
import { StyleSheet } from 'react-native';
import VectorImage from 'react-native-vector-image';
import LinearGradient from 'react-native-linear-gradient';
type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};
const data = [
  {
    title: 'Welcome Parents!',
    image: require('../assets/svg/bebbo_logo_shape.svg'),
    colors: ['#2B2F84', '#00AEEF', '#B3E7FA'],
    subtitle: "Discover Bebbo - everything you need as a parent to support your child's development"
  },
  {
    title: 'Activities',
    image: require('../assets/svg/ic_activity_color.svg'),
    colors: ['#0FD87E', '#CFF7E5'],
    subtitle: "and games to stimulate your child everyday"
  },
  {
    title: 'Tools',
    image: require('../assets/svg/ic_tools_color.svg'),
    colors: ['#00AEEF', '#50C7F3', '#97DEF8', '#B3E7FA'],
    subtitle: "to track your child's development,growth,immunizations and health"
  },
  {
    title: 'Advice',
    image: require('../assets/svg/ic_article_color.svg'),
    colors: ['#FF8D6B', '#FFD2C4'],
    subtitle: 'tailored to your questions and the needs of your child'
  },
];
type Item = typeof data[0];
const Walkthrough = ({ navigation }: Props) => {
  const renderItem = (item: typeof data[0], index: number) => {
    return (
      <>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={item.colors} style={{
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
        }}>
          <View style={styles.slide} >

            {index ==0 ?
            (<VectorImage source={item.image} style={styles.imagetag} />)
            :  (<View style={styles.item} >
              <VectorImage source={item.image} style={styles.imagetag} />
              </View>)}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.title}>{item.subtitle}</Text>
          </View>
        </LinearGradient>
      </>
    );
  };
  const renderDoneButton = () => {
    return (
      <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, .2)', justifyContent: 'center', alignItems: 'center', }}>
        <Text style={{ color: '#000' }}>Next</Text>
      </View>

    );
  }
  const renderPrevButton = () => {
    return (
      <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, .2)', justifyContent: 'center', alignItems: 'center', }}>
        <Text style={{ color: '#000' }}>Back</Text>
      </View>

    );
  }
  const [showPrevbtn, setShowPrevbtn] = useState(false);
  const onSlideChange = (index: number) => {
    // console.log(index," --index----",lastIndex);
    (index == 3) ? setShowPrevbtn(true) : setShowPrevbtn(false);

  }
  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    // navigation.navigate('Terms');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Terms' }],
    })
  }
  const keyExtractor = (item: Item) => item.title;
  return (
    <>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        // renderItem={renderItem}
        renderItem={({ item, index }) => renderItem(item, index)}
        // bottomButton
        dotClickEnabled
        // showDoneButton={false}
        showSkipButton={false}
        showPrevButton={showPrevbtn}
        showNextButton={false}
        data={data}
        onDone={onDone}
        onSlideChange={onSlideChange}
        renderDoneButton={renderDoneButton}
        renderPrevButton={renderPrevButton}
      />
    </>
  );
};

export default Walkthrough;
const styles = StyleSheet.create({
  imagetag: {

  },
  slide: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%'
  },
  text: {
    color: '#333',
    marginTop: 475,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 3,
    padding: 10,
    // width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    padding: 5,
    // width: 100,
    fontWeight: 'bold',
    textAlign: 'center'
  },

});