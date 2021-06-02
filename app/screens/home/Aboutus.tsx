import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Aboutus = ({navigation}: Props) => {
  return (
    <View>
      <Text>Aboutus screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </View>
  );
};
// Notifications.navigationOptions = screenProps => ({
//   title: 'Home',
// });
Aboutus.navigationOptions = () => ({
  title: 'Aboutus',
});
export default Aboutus;
