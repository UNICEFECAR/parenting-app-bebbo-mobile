import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import TabScreenHeader from '../../../components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
type ActivitiesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ActivitiesNavigationProp;
};
const Activities = ({ navigation }: Props) => {
  return (
    <>
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="Activities"/>
        <View>
          <Text>Activities screen</Text>
        </View>
      </View></>
  );
};

export default Activities;
