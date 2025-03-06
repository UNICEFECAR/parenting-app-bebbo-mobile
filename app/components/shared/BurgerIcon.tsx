import Icon from '@components/shared/Icon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { HeaderIconView, HeaderBurgerPress } from './HeaderContainerStyle';
const BurgerIcon = (props: any): any => {
  const navigation = useNavigation<any>();
  const [keyboardStatus, setKeyboardStatus] = useState<any>();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return (): any => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <HeaderIconView>
      <HeaderBurgerPress
        onPress={(): any => {
          if (keyboardStatus == true) {
            Keyboard.dismiss();
          }
          navigation.dispatch(
            DrawerActions.toggleDrawer()
          )
        }}>
        <Icon name="ic_navmenu" size={15} color={props.color || '#FFF'} />
      </HeaderBurgerPress>
    </HeaderIconView>
  );
};
export default BurgerIcon;
