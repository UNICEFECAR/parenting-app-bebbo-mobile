import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../../navigation/types';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
};
const Articles = ({navigation}: Props) => {
  return (
    <View>
      <Text>Articles screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </View>
  );
};

export default Articles;
