import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import GrowthChart, { chartTypes } from '@components/growth/GrowthChart';
import { MainContainer } from '@components/shared/Container';
import { FlexCol, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Pressable, ScrollView } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';

export const ChartFullScreen = ({route}) => {
  const {activeChild, chartType, obj, standardDeviation} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  // console.log(activeChild, chartType, obj, standardDeviation);
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
    navigation.goBack();
    Orientation.lockToPortrait();
  };
  return (
    <>
      <SafeAreaView style={{flex: 1,backgroundColor:'#fff'}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        
          <ScrollView>
          <FlexCol>
            <MainContainer
              style={{
                backgroundColor: 'white',
                
                flexDirection: 'column',
                // paddingLeft: 20,
                
              }}>
              
              <ShiftFromTopBottom10>
              <FlexFDirRowSpace>
                  <Heading2>{chartHeading.title}</Heading2>
                <Pressable onPress={() => closeFullScreen()}>
                  <Icon name="ic_close" />
                </Pressable>
                </FlexFDirRowSpace>
                </ShiftFromTopBottom10>
              
              <GrowthChart
                activeChild={activeChild}
                chartType={chartTypes.weightForHeight}
                bgObj={obj}
                standardDeviation={standardDeviation}
              />
            </MainContainer>
            </FlexCol>
          </ScrollView>
       
      </SafeAreaView>
    </>
  );
};
