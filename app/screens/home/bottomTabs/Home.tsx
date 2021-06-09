import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Text, View, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import AdviceAndArticles from '@components/homeScreen/AdviceAndArticles';
import ChildInfo from '@components/homeScreen/ChildInfo';
import ChildMilestones from '@components/homeScreen/ChildMilestones';
import DailyReads from '@components/homeScreen/DailyReads';
import PlayingTogether from '@components/homeScreen/PlayingTogether';
import Tools from '@components/homeScreen/Tools';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
import { Container, Header3Text } from '../../../styles/style';
import { ThemeContext } from 'styled-components';
type HomeNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HomeNavigationProp;
};

const Home = () => {
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
  return (
    <>
     <SafeAreaView style={{flex:1}}>
     <FocusAwareStatusBar
        animated={true}
        // barStyle="dark-content"
        backgroundColor={headerColor}
       />
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="ParentBuddy" headerColor={headerColor}/>
        <ScrollView style={{ flex: 4,backgroundColor:'#FFF' }}>
          <ChildInfo/>
          <DailyReads/>
          <ChildMilestones/>
          <PlayingTogether/>
          <AdviceAndArticles/>
          <Tools/>
          <View style={{padding:10}}>
            <Text>How is your Parenting Experience</Text>
            <Button
              title="Take a Survey"
              onPress={() => { }} />
          </View>
          <Container style={{padding:10}}>
            <Header3Text>A loving relationship with the parent is the foundation of every baby's healthy growth and development</Header3Text>
          </Container>
        </ScrollView>
      </View>
      </SafeAreaView>
    </>
  );
};
export default Home;
