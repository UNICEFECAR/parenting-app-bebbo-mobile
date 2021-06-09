import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Button, View, Pressable } from 'react-native';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';
import { ButtonText, Container } from '../../styles/style';

type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};

const SettingScreen = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Text>Settings screen</Text>
        <View style={{ flex: 1 }}>
          <Pressable
            style={{ padding: 10 }}
            onPress={() => {
              //reset navigation to localization
              props.navigation.navigate('Localization', { screen: 'CountrySelection' });
              
              // props.navigation.navigate('CountrySelection')
              }}>
            <ButtonText>{t('editCountryLang')}</ButtonText>
          </Pressable>
        </View>
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
