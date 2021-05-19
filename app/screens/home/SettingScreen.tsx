import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, Button} from 'react-native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import {Container} from '../../styles/style';

type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};
const SettingScreen = (props: any) => {
  return (
    <>
      <Container>
        <Text>Settings screen</Text>
        <Button
          title="Toggle"
          onPress={() =>
            props.navigation.dispatch(DrawerActions.toggleDrawer())
          }
        />
      </Container>
    </>
  );
};

export default SettingScreen;
