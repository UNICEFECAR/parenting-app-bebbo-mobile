

import Icon from '@components/shared/Icon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import { HeaderIconView } from './HeaderContainerStyle';
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
    <HeaderIconView>
          <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Icon name="ic_navmenu" size={20} color="#FFF" />
          </Pressable>
        </HeaderIconView>
  );
};
export default BurgerIcon;