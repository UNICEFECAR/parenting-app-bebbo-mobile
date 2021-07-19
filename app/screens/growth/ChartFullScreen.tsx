import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import GrowthChart, { chartTypes } from '@components/growth/GrowthChart';
import Icon from '@components/shared/Icon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Pressable, ScrollView, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';

export const ChartFullScreen = ({route}) => {
  const {activeChild, chartType, obj, standardDeviation} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  console.log(activeChild, chartType, obj, standardDeviation);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const chartHeading = chartType == chartTypes.weightForHeight ?  {title: t('growthScreenweightForHeight')} : {title: t('growthScreenheightForAge')};

  useFocusEffect(
    React.useCallback(() => {
      Orientation.lockToLandscape();

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
    }, []),
  );
  const closeFullScreen = () => {
    Orientation.lockToPortrait();
    navigation.goBack();
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            padding: 15
          }}>
          <ScrollView>
            <View
              style={{
                backgroundColor: 'white',
                marginBottom: 20,
                flexDirection: 'column',
                // paddingLeft: 20,
                paddingTop: 20,
              }}>
              <View style={{flexDirection: 'row'}}>
                  <Heading2>{chartHeading.title}</Heading2>
                <Pressable onPress={() => closeFullScreen()}>
                  <Icon name="ic_close" />
                </Pressable>
              </View>
              <GrowthChart
                activeChild={activeChild}
                chartType={chartTypes.weightForHeight}
                bgObj={obj}
                standardDeviation={standardDeviation}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};
