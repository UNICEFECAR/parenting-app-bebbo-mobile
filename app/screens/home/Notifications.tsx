import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Notifications = ({navigation}: Props) => {
  return (
    <View>
      <Text>NotificationsScreen screen</Text>
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
Notifications.navigationOptions = () => ({
  title: 'Notifications',
});
export default Notifications;
