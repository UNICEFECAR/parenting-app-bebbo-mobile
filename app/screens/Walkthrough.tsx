
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonText } from '@components/shared/ButtonGlobal';
import WalkthroughContainer, { ButtonTertiary1, ButtonTertiary2, Slide, WalkthroughButton, WalkthroughContentArea, WalkthroughImagebox, WalkthroughImageContainer, WalkthroughSubtext, WalkthroughTitle } from '@components/shared/WalkthroughStyle';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components';
type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};


const Walkthrough = ({ navigation }: Props) => {
  const {t} = useTranslation();
  const data = [
    {
      title: t('walkthroughTextstitle0'),
      image: require('@assets/svg/bebbo_logo_shape.svg'),
      colors: ['#2B2F84', '#00AEEF', '#B3E7FA'],
      textcolor:'#FFF',
      subtitle: t('walkthroughTextssubtitle0'),
    },
    {
      title: t('walkthroughTextstitle1'),
      image: require('@assets/svg/ic_activity_color.svg'),
      colors: ['#0FD87E', '#CFF7E5'],
      textcolor:'#000',
      subtitle: t('walkthroughTextssubtitle1'),
    },
    {
      title: t('walkthroughTextstitle2'),
      image: require('@assets/svg/ic_tools_color.svg'),
      colors: ['#00AEEF', '#50C7F3', '#97DEF8', '#B3E7FA'],
      textcolor:'#000',
      subtitle: t('walkthroughTextssubtitle2'),
    },
    {
      title: t('walkthroughTextstitle3'),
      image: require('@assets/svg/ic_article_color.svg'),
      colors: ['#FF8D6B', '#FFD2C4'],
      textcolor:'#000',
      subtitle:t('walkthroughTextssubtitle3'),
    },
  ];
  type Item = typeof data[0];
  const renderItem = (item: typeof data[0], index: number) => {
    return (
      <>
      <WalkthroughContainer>
        <LinearGradient style={{flex:1}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={item.colors} >
          <Slide>
            <WalkthroughImageContainer>
            {(index ==0) ?
            (<VectorImage source={item.image} />)
            : (index ==1) ? (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 130,height: 130,}} />
              </WalkthroughImagebox>): (index ==2) ? (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 130,height: 130,}} />
              </WalkthroughImagebox>): (<WalkthroughImagebox>
              <VectorImage source={item.image} style={{width: 130,height: 130,}} />
              </WalkthroughImagebox>)}
              </WalkthroughImageContainer>
              <WalkthroughContentArea>
                <WalkthroughTitle style={[styles.titleText,{color:item.textcolor}]}>{item.title}</WalkthroughTitle>
                <WalkthroughSubtext style={[styles.title,{color:item.textcolor}]}>{item.subtitle}</WalkthroughSubtext>
              </WalkthroughContentArea>
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
        <ButtonText>{t('walkthroughButtonNext')}</ButtonText>
      </ButtonTertiary1>
      </WalkthroughButton>
    );
  }
  const renderPrevButton = () => {

    return (
      <WalkthroughButton>
      <ButtonTertiary2>
        <ButtonText>{t('walkthroughButtonBack')}</ButtonText>
        </ButtonTertiary2>
        </WalkthroughButton>
    );
  }
  const getDotStyle = (colorString:string)=>{
    return isDotsRequired ? {backgroundColor:colorString}: {backgroundColor:'transparent'}
  }
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  const [showPrevbtn, setShowPrevbtn] = useState(false);
  const [isDotsRequired, setIsDotsRequired] = useState(true);
  const [statubarColor, setstatubarColor] = useState(headerColor);
  const onSlideChange = (index: number) => {
    // console.log(index," --index----",lastIndex);
    (index == 3) ? setShowPrevbtn(true) : setShowPrevbtn(false);
    (index == 3) ? setIsDotsRequired(false) : setIsDotsRequired(true);
    (index ==0) ?setstatubarColor('#00AEEF') : (index ==1) ?setstatubarColor('#0FD87E') : (index ==2) ?setstatubarColor('#00AEEF') : (index ==3) ?setstatubarColor('#FF8D6B') :setstatubarColor(headerColor)

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
    <FocusAwareStatusBar animated={true} backgroundColor={statubarColor} />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => renderItem(item, index)}
        dotClickEnabled
        activeDotStyle={getDotStyle('black')}
        dotStyle={getDotStyle('white')}
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
  
  titleText:
  {color: '#fff',
  fontSize:50,
  textAlign: 'center',
  fontFamily:'roboto-bold',
  marginBottom:20,
},

  title: {
    
    padding: 5,
    // width: 100,
    fontWeight: 'bold',
    textAlign: 'center'
  },

});