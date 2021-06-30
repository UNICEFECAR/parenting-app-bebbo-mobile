import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import AdviceAndArticles from '@components/homeScreen/AdviceAndArticles';
import BabyNotification from '@components/homeScreen/BabyNotification';
import ChildInfo from '@components/homeScreen/ChildInfo';
import ChildMilestones from '@components/homeScreen/ChildMilestones';
import DailyReads from '@components/homeScreen/DailyReads';
import PlayingTogether from '@components/homeScreen/PlayingTogether';
import Tools from '@components/homeScreen/Tools';
import { BgPrimary } from '@components/shared/BackgroundColors';
import { ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Flex1, FlexDirRow, FlexDirRowStart } from '@components/shared/FlexBoxStyle';
import { HomeSurveyBox } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3Regular, Heading3Regularw, ShiftFromTop20, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components';
import { useAppDispatch } from '../../../../App';
type HomeNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HomeNavigationProp;
};

const Home = () => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
  const dispatch=useAppDispatch();
  
  return (
    <>
     <SafeAreaView style={{flex:1}}>
     <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
       />
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title={t('homeScreenheaderTitle')} headerColor={headerColor} textColor='#FFF'/>
        <ScrollView style={{ flex: 4,backgroundColor:'#FFF' }}>
        <BabyNotification/>
          <ChildInfo/>
          <DailyReads/>
          <ChildMilestones/>
          <PlayingTogether/>
          <AdviceAndArticles/>
          <Tools/>
          <MainContainer>
            <ShiftFromTopBottom10>
            
            <HomeSurveyBox>
              <FlexDirRow>
              <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_survey" size={24} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
            <Heading3Regular>{t('homeScreenexpText')}</Heading3Regular>
            </FlexDirRow>
            <ShiftFromTop20>
            <ButtonTertiary
              onPress={() => {}}>
              <ButtonText>{t('homeScreenexpBtnText')}</ButtonText>
            </ButtonTertiary>
            </ShiftFromTop20>
            </HomeSurveyBox>
            
            </ShiftFromTopBottom10>
            
          </MainContainer>
            
          <BgPrimary>
          <MainContainer>
            <ShiftFromTopBottom10>
            <FlexDirRowStart>
          <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_sb_loveapp" size={24} color="#fff" />
                </OuterIconLeft>
              </OuterIconRow>
              <Flex1>
                <Heading3Regularw>{"A loving relationship with the parent is the foundation of every baby's healthy growth and development"}</Heading3Regularw>
                </Flex1>
            
            </FlexDirRowStart>
            </ShiftFromTopBottom10>
          </MainContainer>
          </BgPrimary>
        </ScrollView>
      </View>
      </SafeAreaView>
    </>
  );
};
export default Home;
