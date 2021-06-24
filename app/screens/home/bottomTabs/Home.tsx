import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import AdviceAndArticles from '@components/homeScreen/AdviceAndArticles';
import ChildInfo from '@components/homeScreen/ChildInfo';
import ChildMilestones from '@components/homeScreen/ChildMilestones';
import DailyReads from '@components/homeScreen/DailyReads';
import PlayingTogether from '@components/homeScreen/PlayingTogether';
import Tools from '@components/homeScreen/Tools';
import { ButtonContainer, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Header3Text } from '@styles/style';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components';
type HomeNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HomeNavigationProp;
};

const Home = () => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
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
        <TabScreenHeader title={t('localization.homeScreenheaderTitle')} headerColor={headerColor} textColor='#FFF'/>
        <ScrollView style={{ flex: 4,backgroundColor:'#FFF' }}>
          <ChildInfo/>
          <DailyReads/>
          <ChildMilestones/>
          <PlayingTogether/>
          <AdviceAndArticles/>
          <Tools/>
          <View style={{padding:10}}>
            <Text>{t('localization.homeScreenexpText')}</Text>
            <ButtonContainer>
              <ButtonPrimary
                onPress={() => {}}>
                <ButtonText>{t('localization.homeScreenexpBtnText')}</ButtonText>
              </ButtonPrimary>
            </ButtonContainer>
          </View>
          <Container style={{padding:10}}>
            <Header3Text>{"A loving relationship with the parent is the foundation of every baby's healthy growth and development"}</Header3Text>
          </Container>
        </ScrollView>
      </View>
      </SafeAreaView>
    </>
  );
};
export default Home;
