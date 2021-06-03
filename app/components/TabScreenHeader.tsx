import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Button,Text, StyleSheet, Pressable} from 'react-native';
const TabScreenHeader = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#fff',
        maxHeight:50,
      }}>
      <View style={{flex: 1, backgroundColor: 'red'}} >
        <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Text>Menu</Text>
        </Pressable>
        </View>
      <View style={{flex: 3, backgroundColor: '#FFF'}} >
        <Text> ParentBuddy</Text>
        </View>
      <View style={{flex: 1, backgroundColor: 'yellow'}} />
      <View style={{flex: 1, backgroundColor: 'purple'}} />
    </View>
  );
};
export default TabScreenHeader;
