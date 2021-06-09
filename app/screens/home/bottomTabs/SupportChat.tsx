import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
import { ThemeContext } from 'styled-components';
type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};
const SupportChat = ({ navigation }: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
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
