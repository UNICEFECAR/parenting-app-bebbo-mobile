import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button } from 'react-native';
import TabScreenHeader from '../../../components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '../../../navigation/types';
type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
};
const Articles = ({ navigation }: Props) => {
  return (
    <>
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        <TabScreenHeader title="Articles"/>
        <View>
          <Text>Articles screen</Text>
        </View>
      </View>
    </>
  );
};

export default Articles;
