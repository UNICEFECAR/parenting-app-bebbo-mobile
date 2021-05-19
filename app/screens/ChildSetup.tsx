import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from '../navigation/types';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
const ChildSetup = ({navigation}: Props) => {
  return (
    <View>
      <Text>ChildSetup</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('HomeDrawerNavigator')}
      />
    </View>
  );
};

export default ChildSetup;
