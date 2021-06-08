import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';

type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};
const headerColor="blue";
const SupportChat = ({ navigation }: Props) => {
  return (
    <>
     <SafeAreaView style={{flex:1}}>
     <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
       />
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="Support" headerColor={headerColor}/>
        <View style={{alignItems:'center',justifyContent: 'space-between'}}>
          <Text>Coming soon !</Text>
          <Text>Chat support not available at the moment</Text>
        </View>
      </View>
      </SafeAreaView>
    </>
  );
};

export default SupportChat;
