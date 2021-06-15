import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';
import BurgerIcon from '@components/shared/BurgerIcon';
import {ThemeContext} from 'styled-components';
import Icon from '@components/shared/Icon';
import {ButtonPrimary, ButtonText} from '@components/shared/ButtonGlobal';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

const DATA = [
  {
    id: '1',
    childname: 'Harvey',
    gender: 'Boy',
    birthday: new Date(),
  },
  {
    id: '2',
    childname: 'Donna',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '3',
    childname: 'Michael',
    gender: 'Boy',
    birthday: new Date(),
  },
  {
    id: '4',
    childname: 'Rachel',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '5',
    childname: 'Louis',
    gender: 'Boy',
    birthday: new Date(),
  },
  {
    id: '6',
    childname: 'Jessica',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '7',
    childname: 'Samantha',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '8',
    childname: 'Katrina',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '9',
    childname: 'Sheila',
    gender: 'Girl',
    birthday: new Date(),
  },
  {
    id: '10',
    childname: 'Jeff',
    gender: 'Boy',
    birthday: new Date(),
  },
  {
    id: '11',
    childname: 'Alex',
    gender: 'Boy',
    birthday: new Date(),
  },
];
const ChildProfile = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const renderChildItem = (item: typeof DATA[0], index: number) => (
    <View key={index}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: secopndaryTintColor,
          padding: 10,
          borderBottomWidth: 1,
          borderColor: '#EEE',
        }}>
        <Icon name="ic_baby" size={25} color="#000" style={{padding: 10}} />
        <View style={{flexDirection: 'column'}}>
          <Text>
            {item.childname},{item.gender}
          </Text>
          <Text>Born on {item.birthday.toDateString()}</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('EditChildProfile');
            }}>
            <Text>Edit Profile</Text>
          </Pressable>
        </View>
        <View style={{backgroundColor: '#FFF', margin: 2}}>
          <Text>Activate Profile</Text>
        </View>
      </View>
    </View>
  );
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
              <Text> {'Child and ParentProfile'}</Text>
            </View>
          </View>
          <ScrollView style={{ flex: 4,backgroundColor:'#FFF' }}>
          <View style={{margin: 10}}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: secopndaryColor,
                  padding: 10,
                }}>
                <Icon
                  name="ic_baby"
                  size={25}
                  color="#000"
                  style={{padding: 10}}
                />
                <View style={{flexDirection: 'column'}}>
                  <Text>Jenny,Girl</Text>
                  <Text>Born on 8 july 2022</Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate('EditChildProfile');
                    }}>
                    <Text>Edit Profile</Text>
                  </Pressable>
                </View>
                <Text>Activated</Text>
              </View>
              <ScrollView style={{height: 550, marginTop: 10}} nestedScrollEnabled = {true}>
                {DATA.map((item, index) => {
                  return renderChildItem(item, index);
                })}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: secopndaryTintColor,
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  borderColor: '#EEE',
                }}>
                <Pressable
                  style={{padding: 10, flexDirection: 'row'}}
                  onPress={() => {
                    navigation.navigate('EditChildProfile');
                  }}>
                  <Icon
                    name="ic_plus"
                    size={25}
                    color="#000"
                    style={{padding: 10}}
                  />
                  <Text>Add sister or brother</Text>
                </Pressable>
                <Pressable
                  style={{padding: 10, flexDirection: 'row'}}
                  onPress={() => {
                    navigation.navigate('AddExpectingChildProfile');
                  }}>
                  <Icon
                    name="ic_plus"
                    size={25}
                    color="#000"
                    style={{padding: 10}}
                  />
                  <Text>Add Expecting Child</Text>
                </Pressable>
              </View>
            </View>
            <View style={{backgroundColor: secopndaryTintColor}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <ButtonText>Parent Details</ButtonText>
                </View>
                <View style={{padding: 10}}>
                  <Text>Edit Profile</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <Text>Your role is</Text>
                </View>
                <View style={{padding: 10}}>
                  <Text>Father</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{padding: 10}}>
                  <Text>Name</Text>
                </View>
                <View style={{padding: 10}}>
                  <Text>Obama</Text>
                </View>
              </View>
            </View>
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildProfile;
