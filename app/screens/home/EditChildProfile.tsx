import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import ChildDate from '@components/ChildDate';
import {ThemeContext} from 'styled-components';
import {
  Heading1w,
  Heading1Centerw,
  Heading3,
  ShiftFromTop30,
  Heading3Regular,
} from '../../styles/typography';
import {ButtonPrimary, ButtonText} from '@components/shared/ButtonGlobal';
import {LabelText} from '@components/shared/ChildSetupStyle';
const genders = ['Male', 'Female', 'Other'];
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Text>Back</Text>
            </Pressable>
          </View>
          <View style={{flex: 3}}>
            <Text> {'Edit Child Profile'}</Text>
          </View>
        </View>

        <ScrollView>
          <View style={{flexDirection: 'column'}}>
            <View>
              <Image
                source={require('@assets/trash/card3.jpeg')}
                style={{width: '100%'}}
              />
            </View>
            <View style={{padding: 10}}>
              <LabelText>Name</LabelText>
              <View style={{flex: 1}}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  value={''}
                  // onChangeText={queryText => handleSearch(queryText)}
                  placeholder="Enter your child anme"
                  style={{
                    backgroundColor: '#FFF',
                  }}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                {genders.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{padding: 10, backgroundColor: '#FFF', margin: 3}}>
                      <Pressable
                        onPress={() => {
                          console.log(item);
                        }}>
                        <Heading3>{item}</Heading3>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
              <ChildDate />
              <View style={{width: '100%', marginTop: 30}}>
                <ButtonPrimary onPress={() => {}}>
                  <ButtonText>Update Profile</ButtonText>
                </ButtonPrimary>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditChildProfile;
