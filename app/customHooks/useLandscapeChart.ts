import {useCallback, useRef, useState} from 'react';
import {BackHandler, Dimensions, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
type ChartNavigation = {
  goBack: () => void;
  addListener: (event: any, callback: any) => () => void;
};

/** Chart-only native listeners and delayed work must end when chart focus ends. */
export function useLandscapeChart(navigation: ChartNavigation) {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );
  const [isChartVisible, setIsChartVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const closeFullScreen = useCallback(() => {
    Orientation.lockToPortrait();
    if (closeTimer.current !== undefined) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(
      () => {
        closeTimer.current = undefined;
        navigation.goBack();
      },
      Platform.OS === 'ios' ? 200 : 0,
    );
  }, [navigation]);
  useFocusEffect(
    useCallback(() => {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
      setWindowHeight(Dimensions.get('window').width);
      setWindowWidth(Dimensions.get('window').height);
      const showTimer = setTimeout(() => setIsChartVisible(true), 2000);
      let portraitTimer: ReturnType<typeof setTimeout> | undefined;
      const hardware = BackHandler.addEventListener('hardwareBackPress', () => {
        closeFullScreen();
        return true;
      });
      const unsubscribe = navigation.addListener('gestureEnd', () => {
        if (portraitTimer !== undefined) clearTimeout(portraitTimer);
        portraitTimer = setTimeout(() => Orientation.lockToPortrait(), 400);
      });
      return () => {
        clearTimeout(showTimer);
        if (portraitTimer !== undefined) clearTimeout(portraitTimer);
        if (closeTimer.current !== undefined) clearTimeout(closeTimer.current);
        closeTimer.current = undefined;
        unsubscribe();
        hardware.remove();
        Orientation.lockToPortrait();
        setIsChartVisible(false);
      };
    }, [navigation, closeFullScreen]),
  );
  return {windowWidth, windowHeight, isChartVisible, closeFullScreen};
}
