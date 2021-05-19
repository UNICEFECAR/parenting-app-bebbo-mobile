import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import {HomeNavigatorStackParamList} from '../../navigation/types';

type DashboardNavigationProp = StackNavigationProp<HomeNavigatorStackParamList>;
type Props = {
  navigation: DashboardNavigationProp;
};
const Dashboard = ({navigation}: Props) => {
  return (
    <View>
      <Text>Dashboard screen</Text>
    </View>
  );
};

export default Dashboard;
