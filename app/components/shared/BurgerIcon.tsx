

import Icon from '@components/shared/Icon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';

const BurgerIcon = (props:any) => {
    const navigation = useNavigation();
  return (
    <View style={{ flex: 1,padding:15}} >
          <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Icon name="ic_navmenu" size={15} color={props.color || "#FFF"} />
          </Pressable>
        </View>
  );
};
export default BurgerIcon;