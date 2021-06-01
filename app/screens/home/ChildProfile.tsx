import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const ChildProfile = ({navigation}: Props) => {
  return (
    <View>
      <Text>ChildProfile screen</Text>
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
ChildProfile.navigationOptions = () => ({
  title: 'ChildProfile',
});
export default ChildProfile;
