import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';

type HealthCheckupsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  return (
    <View>
      <Text>HealthCheckupsScreen screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </View>
  );
};

export default HealthCheckups;
