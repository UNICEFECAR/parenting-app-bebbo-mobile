import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';

type HealthCheckupsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1}}>
              <BurgerIcon />
            </View>
            <View style={{flex: 3}}>
              <Text> {'Health Checkup'}</Text>
            </View>
          </View>
          <ScrollView style={{flex: 4, backgroundColor: backgroundColor}}>
            <View>
              <Text>HealthCheckupsScreen screen</Text>
              <Button
                title="Toggle"
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HealthCheckups;
