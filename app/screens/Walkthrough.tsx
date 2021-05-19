import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from '../navigation/types';

type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};
const Walkthrough = ({navigation}: Props) => {
  return (
    <View>
      <Text>Walkthrough screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate('ChildSetup');
        }}
      />
    </View>
  );
};

export default Walkthrough;
