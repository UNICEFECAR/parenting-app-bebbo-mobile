import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../../navigation/types';

type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};
const SupportChat = ({navigation}: Props) => {
  return (
    <View>
      <Text>SupportChat screen</Text>
      <Button
        title="Toggle"
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </View>
  );
};

export default SupportChat;
