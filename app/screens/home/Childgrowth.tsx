import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';

type ChildgrowthNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ChildgrowthNavigationProp;
};
const Childgrowth = ({navigation}: Props) => {
  return (
    <View>
      <Text>ChildgrowthScreen screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      <Button
        title="go to ArtilcleDetails"
        onPress={() =>{
          navigation.navigate('ArticleDetails');
        }}
      />
      <Button
        title="go to ActivityDetails"
        onPress={() =>{
          navigation.navigate('ActivityDetails');
        }}
      />
    </View>
  );
};

export default Childgrowth;
