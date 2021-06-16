import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DashboardNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: DashboardNavigationProp;
};
const headerColor='blue';
const UserGuide = ({navigation}: Props) => {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <FocusAwareStatusBar
          animated={true}
          backgroundColor={headerColor}
        />
        <View style={{
          flexDirection: 'column',
          flex: 1,
        }}>
          <View style={{ flex: 1 }} >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                backgroundColor: 'green',
                maxHeight: 50,
              }}>
              <View style={{ flex: 1, }} >
              <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Text>Menu</Text>
              </Pressable>
              </View>
              <View style={{ flex: 3 }} >
                <Text> {'User Guide Screen'}</Text>
              </View>
            </View>
          </View>
          <View>


          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default UserGuide;
