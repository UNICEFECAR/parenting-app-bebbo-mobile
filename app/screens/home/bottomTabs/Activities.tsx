import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
type ActivitiesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ActivitiesNavigationProp;
};
const headerColor="green";
const Activities = ({ navigation }: Props) => {
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
        <TabScreenHeader title="Activities" headerColor={headerColor}/>
        <View>
          <AgeBrackets/>
          <Text>Activities screen</Text>
          {/* <Wallet/> */}
        </View>
      </View>
      </SafeAreaView>
      </>
  );
};

export default Activities;
