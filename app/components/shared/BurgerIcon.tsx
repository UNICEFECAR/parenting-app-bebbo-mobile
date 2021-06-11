

import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import Container from './Container';
import Icon from '@components/shared/Icon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
const TextInput = styled.TextInput`
  width: 100%;
  height: 160px;
  font-size: 24px;
  flex: 1;
  color: #010101;
  /* margin-left: 10px; */
  background-color: #FFF;
`;
const BurgerIcon = () => {
    const navigation = useNavigation();
  return (
    <View style={{ flex: 1,padding:10}} >
          <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Icon name="ic_navmenu" size={20} color="#FFF" />
          </Pressable>
        </View>
  );
};
export default BurgerIcon;