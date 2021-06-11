import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { RootStackParamList } from '../navigation/types';
import { StyleSheet } from 'react-native';
import VectorImage from 'react-native-vector-image';
import LinearGradient from 'react-native-linear-gradient';
import WalkthroughContainer, { Slide,ButtonTertiary1,ButtonTertiary2,WalkthroughTitle,WalkthroughButton, WalkthroughSubtext,WalkthroughImagebox } from '@components/shared/WalkthroughStyle';
import { ButtonText } from '@components/shared/ButtonGlobal';
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
    subtitle: "Discover Bebbo - everything you need as a parent to support your child's development",
    textcolor:'#ffffff',
  },
  {
    title: 'Activities',
    image: require('../assets/svg/ic_activity_color.svg'),
    colors: ['#0FD87E', '#CFF7E5'],
    subtitle: "and games to stimulate your child everyday",
    textcolor:'#000000',
  },
  {
    title: 'Tools',
    image: require('../assets/svg/ic_tools_color.svg'),
    colors: ['#00AEEF', '#50C7F3', '#97DEF8', '#B3E7FA'],
    subtitle: "to track your child's development,growth,immunizations and health",
    textcolor:'#000000',
  },
  {
    title: 'Advice',
    image: require('../assets/svg/ic_article_color.svg'),
    colors: ['#FF8D6B', '#FFD2C4'],
    subtitle: 'tailored to your questions and the needs of your child',
    textcolor:'#000000',
  },
];
type Item = typeof data[0];
const Walkthrough = ({ navigation }: Props) => {
  const renderItem = (item: typeof data[0], index: number) => {
    return (
      <>
      <WalkthroughContainer>
        <LinearGradient style={{flex:1,}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={item.colors} >
          <Slide>

            {(index ==0) ?
            (<VectorImage source={item.image} />)
            : (index ==1) ? (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 130,height: 140,}} />
              </WalkthroughImagebox>): (index ==2) ? (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 123,height: 150,}} />
              </WalkthroughImagebox>): (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 160,height: 123,}} />
              </WalkthroughImagebox>)}
              <WalkthroughTitle style={[styles.titleText,{color:item.textcolor}]}>{item.title}</WalkthroughTitle>
            <WalkthroughSubtext style={[styles.title,{color:item.textcolor}]}>{item.subtitle}</WalkthroughSubtext>
          </Slide>
        </LinearGradient>
        </WalkthroughContainer>
      </>
    );
  };
  
  const renderDoneButton = () => {
    return (
      <WalkthroughButton>
      <ButtonTertiary1>
        <ButtonText>Next</ButtonText>
        </ButtonTertiary1>
        </WalkthroughButton>

    );
  }
  const renderPrevButton = () => {
    return (
      <WalkthroughButton>
      <ButtonTertiary2>
        {/* style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, .2)', justifyContent: 'center', alignItems: 'center', }} */}
        <ButtonText>Back</ButtonText>
      </ButtonTertiary2>
      </WalkthroughButton>
    );
  }


  const [showPrevbtn, setShowPrevbtn] = useState(false);
  const [isDotsRequired, setIsDotsRequired] = useState(true);
  const onSlideChange = (index: number) => {
    // console.log(index," --index----",lastIndex);
    (index == 3) ? setShowPrevbtn(true) : setShowPrevbtn(false);
    (index == 3) ? setIsDotsRequired(false) : setIsDotsRequired(true);

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
  const getDotStyle = (colorString:string)=>{
    return isDotsRequired ? {backgroundColor:colorString}: {backgroundColor:'transparent'}
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
        activeDotStyle={getDotStyle('black')}
        dotStyle={getDotStyle('white')}
        showSkipButton={false}
        showPrevButton={showPrevbtn}
        // dotsRequired={isDotsRequired}
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
  titleText:{
    color: '#fff',
    fontSize:50,
    textAlign: 'center',
    fontFamily:'roboto-bold',
    marginBottom:40,
  },
  title: {
    fontFamily:'roboto-regular',
    padding: 5,
    textAlign: 'center'
  },

});