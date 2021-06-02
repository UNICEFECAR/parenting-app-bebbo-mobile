import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text,View, Button, ScrollView} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../../navigation/types';
type HomeNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HomeNavigationProp;
};
const Home = ({navigation}: Props) => {
  return (
    <>
      <ScrollView>
        <Text>Home screen</Text>
        <Button
          title="Toggle"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <View>
          <Text>Your Child's Development</Text>
          <Button
          title="Read more"
          onPress={() => {}}
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
          onPress={() => {}}/>
        </View>
      </ScrollView>
    </>
  );
};
export default Home;
