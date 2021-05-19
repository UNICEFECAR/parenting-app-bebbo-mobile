import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from '../navigation/types';
type TourNavigationProp = StackNavigationProp<RootStackParamList, 'ChildSetup'>;

type Props = {
  navigation: TourNavigationProp;
};
const Tour = ({navigation}: Props) => {
  return (
    <View>
      <Text>Tour</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('ChildSetup')}
      />
    </View>
  );
};

export default Tour;
