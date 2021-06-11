import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Button, View, Pressable } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';
import { ButtonText, Container } from '../../styles/style';

type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};

const SettingScreen = (props: any) => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <>
      <Container>
        <Text>Settings screen</Text>
        <View style={{ flex: 1 }}>
       
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

          <Pressable
            style={{ padding: 10 }}
            onPress={() => {
              //reset navigation to localization
              props.navigation.navigate('Localization', { screen: 'CountrySelection' });
              
              // props.navigation.navigate('CountrySelection')
              }}>
            <ButtonText>{t('editCountryLang')}</ButtonText>
          </Pressable>

          <VectorImage source={require('@assets/svg/ic_gdrive.svg')} />
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
