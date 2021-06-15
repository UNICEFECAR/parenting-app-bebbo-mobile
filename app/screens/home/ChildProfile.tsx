import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, SafeAreaView, Button, Pressable } from 'react-native';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';
import BurgerIcon from '@components/shared/BurgerIcon';

type NotificationsNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const headerColor = 'blue';
const ChildProfile = ({ navigation }: Props) => {
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
                backgroundColor: headerColor,
                maxHeight: 50,
              }}>
              <View style={{ flex: 1, }} >
                <BurgerIcon/>
              </View>
              <View style={{ flex: 3 }} >
                <Text> {'Child and ParentProfile'}</Text>
              </View>
            </View>
          </View>
          <View>
            <View>
              <Pressable onPress={()=>{}}><Text>Edit Profile</Text></Pressable>
            </View>
          <Button
            title="Add sister or brother"
            onPress={() => navigation.navigate('AddSiblingProfile')}
          />
          <Button
            title="Add Expecting Child"
            onPress={() => navigation.navigate('AddExpectingChildProfile')}
          />
            
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
// Notifications.navigationOptions = screenProps => ({
//   title: 'Home',
// });
ChildProfile.navigationOptions = () => ({
  title: 'ChildProfile',
});
export default ChildProfile;
