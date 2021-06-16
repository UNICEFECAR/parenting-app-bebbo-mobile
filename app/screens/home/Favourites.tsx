import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const Favourites = ({ navigation }: Props) => {
  return (
    <>

      <View style={{
        flexDirection: "column",
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
              <Text> {'Favourites'}</Text>
            </View>
          </View>
        </View>
      </View>


    </>
  );
};
// Notifications.navigationOptions = screenProps => ({
//   title: 'Home',
// });
// Aboutus.navigationOptions = () => ({
//   title: 'Aboutus',
// });
export default Favourites;
