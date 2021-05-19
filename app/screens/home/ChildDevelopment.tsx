import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';

type ChildDevelopmentNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  return (
    <View>
      <Text>ChildDevelopmentScreen screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </View>
  );
};

export default ChildDevelopment;
