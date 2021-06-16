import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildRelationList, LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useContext } from 'react';
import {
  Pressable, SafeAreaView, ScrollView, Text, TextInput, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { ThemeContext } from 'styled-components';
import {
  Heading3
} from '../../styles/typography';
const genders = ['Male', 'Female', 'Other'];
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  const genders = ['boy','girl'];
  const imageOptions = ['Camera', 'Gallery'];
  const actionSheetRef = createRef<any>();
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

        <ScrollView style={{flex:4}}>
          <View style={{flexDirection: 'column'}}>
            {/* <View>
              <Image
                source={require('@assets/trash/card3.jpeg')}
                style={{width: '100%'}}
              />
            </View> */}
            <Pressable style={{height:150,backgroundColor:SecondaryColor,  justifyContent: 'center',
    alignItems: 'center'}} onPress={()=>{actionSheetRef.current?.setModalVisible();}}>
              <Icon name="ic_camera" size={20} color="#FFF" />
            </Pressable>
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
          <ActionSheet ref={actionSheetRef}>
          <View>
            {imageOptions.map((item, index) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={() => {
                      actionSheetRef.current?.hide();
                    }}>
                    <Heading3>{item}</Heading3>
                  </Pressable>
                </ChildRelationList>
              );
            })}
          </View>
        </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditChildProfile;
