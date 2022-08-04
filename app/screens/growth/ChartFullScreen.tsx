import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import GrowthChart, { chartTypes } from '@components/growth/GrowthChart';
import { MainContainer } from '@components/shared/Container';
import { FlexCol, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { ThemeContext } from 'styled-components/native';

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route:any;
};
export const ChartFullScreen = ({ route, navigation }: Props) => {
  const {activeChild, chartType, obj, standardDeviation} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const [windowWidth,setWindowWidth] = React.useState(Dimensions.get('window').width);
  const [windowHeight,setWindowHeight] = React.useState(Dimensions.get('window').height);
  const {t} = useTranslation();
  const chartHeading =
    chartType == chartTypes.weightForHeight
      ? {title: t('growthScreenweightForHeight')}
      : {title: t('growthScreenheightForAge')};
  const [isChartVisible, setIsChartVisible] = React.useState(false);



  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
      setWindowHeight(Dimensions.get('window').width);
      setWindowWidth(Dimensions.get('window').height);
      setTimeout(() => {
        setIsChartVisible(true);
      }, 2000);
      BackHandler.addEventListener('hardwareBackPress', function () {        
        closeFullScreen();
        /**
         * When true is returned the event will not be bubbled up
         * & no other back action will execute
         */
        /**
         * Returning false will let the event to bubble up & let other event listeners
         * or the system's default back action to be executed.
         */
        return true;
      });
      navigation.addListener('gestureEnd',  function () {
        setTimeout(()=>{
          // Orientation.unlockAllOrientations();
          Orientation.lockToPortrait();
        },Platform.OS=='ios' ? 400:400)
        
        /**
         * When true is returned the event will not be bubbled up
         * & no other back action will execute
         */
        /**
         * Returning false will let the event to bubble up & let other event listeners
         * or the system's default back action to be executed.
         */
        return true;
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const closeFullScreen = () => {
    navigation.goBack();
    setTimeout(()=>{
      Orientation.lockToPortrait();
    },Platform.OS=='ios' ? 500:0)
   
  };
  
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <ScrollView>
          <FlexCol>
            <MainContainer
              style={{
                backgroundColor: 'white',
                flexDirection: 'column',
              }}>
              <FlexFDirRowSpace>
                <Heading2>{chartHeading.title}</Heading2>
                <Pressable
                  style={{padding: 12}}
                  onPress={() => closeFullScreen()}>
                  <Icon name="ic_close" size={20} />
                </Pressable>
              </FlexFDirRowSpace>

              <FlexCol>
                {isChartVisible ? (
                  <GrowthChart
                    activeChild={activeChild}
                    chartType={chartType}
                    bgObj={obj}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                  />
                ) : (
                  <ActivityIndicator size="large" color={headerColor} />
                )}
              </FlexCol>
            </MainContainer>
          </FlexCol>
        </ScrollView>
      </View>
    </>
  );
};
