import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import TabScreenHeader from '../../../components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';

type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};
const SupportChat = ({ navigation }: Props) => {
  return (
    <>
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="SupportChat"/>
        <View>
          <Text>SupportChat screen</Text>
        </View>
      </View>
    </>
  );
};

export default SupportChat;
