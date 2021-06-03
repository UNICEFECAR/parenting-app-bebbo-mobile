import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View, Button, ScrollView, FlatList, StyleSheet } from 'react-native';
import AdviceAndArticles from '../../../components/homeScreen/AdviceAndArticles';
import ChildInfo from '../../../components/homeScreen/ChildInfo';
import ChildMilestones from '../../../components/homeScreen/ChildMilestones';
import DailyReads from '../../../components/homeScreen/DailyReads';
import PlayingTogether from '../../../components/homeScreen/PlayingTogether';
import Tools from '../../../components/homeScreen/Tools';
import TabScreenHeader from '../../../components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
import { Container, Header2Text, Header3Text } from '../../../styles/style';
type HomeNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HomeNavigationProp;
};


const Home = ({ navigation }: Props) => {
  
  return (
    <>
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="ParentBuddy" />
        <ScrollView style={{ flex: 4 }}>
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
    </>
  );
};
export default Home;
