import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import GrowthChart, { chartTypes } from '@components/growth/GrowthChart';
import { MainContainer } from '@components/shared/Container';
import { FlexCol, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import { Heading2 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Platform,
  Pressable,
  ScrollView
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';


export const ChartFullScreen = ({ route, navigation }: Props) => {
  const {activeChild, chartType, obj, standardDeviation} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  // console.log(activeChild, chartType, obj, standardDeviation);
  // const navigation = useNavigation();
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
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //    Orientation.unlockAllOrientations();
  //     Orientation.lockToLandscapeLeft();
     
  //   }, []),
  // );
  const closeFullScreen = () => {
    //Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    navigation.goBack();
  };
  // const [deviceOrientation, setDeviceOrientation] = useState(
  //   Dimensions.get('window').width < Dimensions.get('window').height
  //     ? 'portrait'
  //     : 'landscape',
  // );
  // let windowWidth = Dimensions.get('window').width;
  // let windowHeight = Dimensions.get('window').height;
  // useEffect(() => {
  //   const deviceOrientation = () => {
  //     if (Dimensions.get('window').width < Dimensions.get('window').height) {
  //       setDeviceOrientation('portrait');
  //     } else {
  //       setDeviceOrientation('landscape');
  //     }
  //   };
  //   Dimensions.addEventListener('change', deviceOrientation);
  //   return () => {
  //     //cleanup work
  //     Dimensions.removeEventListener('change', deviceOrientation);
  //   };
  // }, [deviceOrientation]);
  let windowWidth = Dimensions.get('window').width;
  let windowHeight = Dimensions.get('window').height;
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
                    windowWidth={Platform.OS === 'ios'? windowWidth : windowHeight}
                    windowHeight={Platform.OS === 'ios' ? windowHeight : windowWidth}
                  />
                ) : (
                  <ActivityIndicator size="large" color={headerColor} />
                )}
                {/* // standardDeviation={standardDeviation} */}
              </FlexCol>
            </MainContainer>
          </FlexCol>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
