import Icon from '@components/shared/Icon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';
import { HeaderIconView } from './HeaderContainerStyle';
const BurgerIcon = (props:any) => {
  const navigation = useNavigation();
  return (
    <HeaderIconView>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Icon name="ic_navmenu" size={15} color={props.color || '#FFF'} />
      </Pressable>
    </HeaderIconView>
  );
};
export default BurgerIcon;
