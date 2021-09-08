import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonArticles,
  ButtonArticlesTint,
  ButtonColTwo,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import WalkthroughContainer, {
  ButtonTertiary1,
  ButtonTertiary2,
  Slide,
  WalkBtn,
  WalkthroughButton,
  WalkthroughContentArea,
  WalkthroughImagebox,
  WalkthroughImageContainer,
  WalkthroughSubtext,
  WalkthroughTitle
} from '@components/shared/WalkthroughStyle';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};


const Walkthrough = ({navigation}: Props) => {
  const {t} = useTranslation();
  let slider = useRef<any>(null);
  const data = [
    {
      title: t('walkthroughTextstitle0'),
      image: require('@assets/svg/bebbo_logo_shape.svg'),
      colors: ['#2B2F84', '#1F50A0',  '#00AEEF'],
      textcolor: '#FFF',
      subtitle: t('walkthroughTextssubtitle0'),
    },
    {
      title: t('walkthroughTextstitle1'),
      image: require('@assets/svg/ic_activity_color.svg'),
      colors: ['#0FD87E', '#CFF7E5'],
      textcolor: '#000',
      subtitle: t('walkthroughTextssubtitle1'),
    },
    {
      title: t('walkthroughTextstitle2'),
      image: require('@assets/svg/ic_tools_color.svg'),
      colors: ['#00AEEF', '#50C7F3', '#97DEF8', '#B3E7FA'],
      textcolor: '#000',
      subtitle: t('walkthroughTextssubtitle2'),
    },
    {
      title: t('walkthroughTextstitle3'),
      image: require('@assets/svg/ic_article_color.svg'),
      colors: ['#FF8D6B', '#FFD2C4'],
      textcolor: '#000',
      subtitle: t('walkthroughTextssubtitle3'),
    },
  ];
  type Item = typeof data[0];
  const renderItem = (item: typeof data[0], index: number) => {
    return (
      <>
        <WalkthroughContainer>
          <LinearGradient
            style={{flex: 1}}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={item.colors}>
            <Slide>
              <WalkthroughImageContainer>
                {index == 0 ? (
                  <VectorImage source={item.image} />
                ) : index == 1 ? (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={{width: 130, height: 130}}
                    />
                  </WalkthroughImagebox>
                ) : index == 2 ? (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={{width: 130, height: 130}}
                    />
                  </WalkthroughImagebox>
                ) : (
                  <WalkthroughImagebox>
                    <VectorImage
                      source={item.image}
                      style={{width: 130, height: 130}}
                    />
                  </WalkthroughImagebox>
                )}
              </WalkthroughImageContainer>
              <WalkthroughContentArea>
                <WalkthroughTitle
                  style={[styles.titleText, {color: item.textcolor}]}>
                  {item.title}
                </WalkthroughTitle>
                <WalkthroughSubtext
                  style={[styles.title, {color: item.textcolor}]}>
                  {item.subtitle}
                </WalkthroughSubtext>

                {/* {index == 3 ? (
                  <WalkBtn style={{flex:1,flexDirection:'column',justifyContent:'flex-end'}}>
                  <ButtonContainerTwo>
                    <ButtonColTwo>
                      <ButtonArticlesTint onPress={goBackSlide}>
                        <ButtonText>{t('walkthroughButtonBack')}</ButtonText>
                      </ButtonArticlesTint>
                    </ButtonColTwo>

                    <ButtonColTwo>
                      <ButtonTertiary onPress={onDone}>
                        <ButtonText>{t('walkthroughButtonNext')}</ButtonText>
                      </ButtonTertiary>
                    </ButtonColTwo>
                  </ButtonContainerTwo>
                  </WalkBtn>
                ) : null} */}
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
          <ButtonText numberOfLines={2}>{t('walkthroughButtonNext')}</ButtonText>
        </ButtonTertiary1>
      </WalkthroughButton>
    );
  };
  const renderPrevButton = () => {
    return (
      <WalkthroughButton>
        <ButtonTertiary2>
          <ButtonText numberOfLines={2}>{t('walkthroughButtonBack')}</ButtonText>
        </ButtonTertiary2>
      </WalkthroughButton>
    );
  };
  const getDotStyle = (colorString: string) => {
    return isDotsRequired
      ? {backgroundColor: colorString}
      : {backgroundColor: 'transparent'};
  };
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  const [showPrevbtn, setShowPrevbtn] = useState(false);
  const [isDotsRequired, setIsDotsRequired] = useState(true);
  const [statubarColor, setstatubarColor] = useState(headerColor);
  
  const onSlideChange = (index: number) => {
    // console.log(index," --index----",lastIndex);
    index == 3 ? setShowPrevbtn(true) : setShowPrevbtn(false);
    index == 3 ? setIsDotsRequired(false) : setIsDotsRequired(true);
    index == 0
      ? setstatubarColor('#00AEEF')
      : index == 1
      ? setstatubarColor('#0FD87E')
      : index == 2
      ? setstatubarColor('#00AEEF')
      : index == 3
      ? setstatubarColor('#FF8D6B')
      : setstatubarColor(headerColor);
  };
useFocusEffect(
  React.useCallback(() => {
    navigation.dispatch(state => {
      // Remove the home route from the stack
      const routes = state.routes.filter(r => r.name !== 'LoadingScreen');
    
      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  },[])
);
  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    navigation.navigate('Terms');
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: 'Terms'}],
    // });
  };
const goBackSlide = ()=>{
  slider?.goToSlide(2, true);
}
const _renderPagination = (activeIndex: number) => {
  return (
    <View style={styles.paginationContainer}>
      <SafeAreaView>
      {activeIndex != 3 ? (
        <View style={styles.paginationDots}>
          {data.length > 1 &&
            data.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? getDotStyle('black')
                    :getDotStyle('white'),
                ]}
                onPress={() => slider?.goToSlide(i, true)}
              />
            ))}
        </View>):null}
        {activeIndex == 3 ? (
                  <WalkBtn style={{flex:1,flexDirection:'column',justifyContent:'flex-end'}}>
                  <ButtonContainerTwo>
                    <ButtonColTwo>
                      <ButtonArticlesTint onPress={goBackSlide}>
                        <ButtonText numberOfLines={2}>{t('walkthroughButtonBack')}</ButtonText>
                      </ButtonArticlesTint>
                    </ButtonColTwo>

                    <ButtonColTwo>
                      <ButtonTertiary onPress={onDone}>
                        <ButtonText numberOfLines={2}>{t('walkthroughButtonNext')}</ButtonText>
                      </ButtonTertiary>
                    </ButtonColTwo>
                  </ButtonContainerTwo>
                  </WalkBtn>
                ) : null}
      </SafeAreaView>
    </View>
  );
};
  const keyExtractor = (item: Item) => item.title;
  
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={statubarColor} />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={({item, index}) => renderItem(item, index)}
        dotClickEnabled
        activeDotStyle={getDotStyle('black')}
        dotStyle={getDotStyle('white')}
        showSkipButton={false}
        showPrevButton={false}
        showNextButton={false}
        showDoneButton={false}
        data={data}
        onDone={onDone}
        onSlideChange={onSlideChange}
        renderPagination={_renderPagination}
        ref={(ref) => (slider = ref!)}
        // renderDoneButton={renderDoneButton}
        // renderPrevButton={renderPrevButton}
      />
    </>
  );
};

export default Walkthrough;
const styles = StyleSheet.create({
  titleText: {
    color: '#fff',
    fontSize: 42,
    textAlign: 'center',
    fontFamily: 'roboto-bold',
    marginBottom: 20,
    lineHeight:45,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title1: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    padding: 5,
    // width: 100,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});
