import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
type TourNavigationProp = StackNavigationProp<RootStackParamList, 'ChildSetup'>;

type Props = {
  navigation: TourNavigationProp;
};
const Tour = ({navigation}: Props):any => {
  return (
    <View>
      <Text>Tour</Text>
      <Button
        title="Go to Details"
        onPress={():any => navigation.navigate('ChildSetup')}
      />
    </View>
  );
};

export default Tour;
