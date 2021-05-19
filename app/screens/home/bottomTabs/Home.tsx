import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, Button, ScrollView} from 'react-native';
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
      </ScrollView>
    </>
  );
};
export default Home;
