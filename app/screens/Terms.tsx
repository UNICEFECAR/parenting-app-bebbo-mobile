import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from '../navigation/types';
type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const Terms = ({navigation}: Props) => {
  return (
    <View>
      <Text>Terms</Text>
      <Button
        title="Go to ChildSetup"
        onPress={() => navigation.navigate('ChildSetup')}
      />
    </View>
  );
};

export default Terms;
