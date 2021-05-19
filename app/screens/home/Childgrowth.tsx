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
    </View>
  );
};

export default Childgrowth;
