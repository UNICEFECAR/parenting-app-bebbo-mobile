import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View, Button, ScrollView } from 'react-native';
import TabScreenHeader from '../../../components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
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
        <TabScreenHeader title="ParentBuddy"/>
        <ScrollView style={{ flex: 4 }}>    
          <View>
            <Text>Your Child's Development</Text>
            <Button
              title="Read more"
              onPress={() => { }}
            />
          </View>
          <View>
            <Text>Daily Reads</Text>
          </View>
          <View>
            <Text>Your Child Milestones</Text>
          </View>
          <View>
            <Text>Playing together</Text>
          </View>
          <View>
            <Text>Expert Advice And Articles</Text>
          </View>
          <View>
            <Text>Tools</Text>
          </View>
          <View>
            <Text>How is your Parenting Experience</Text>
            <Button
              title="Take a Survey"
              onPress={() => { }} />
          </View>
        </ScrollView>
      </View>
    </>
  );
};
export default Home;
