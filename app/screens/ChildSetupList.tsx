import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button, StyleSheet, Pressable} from 'react-native';
import {useAppDispatch} from '../../App';
import {RootStackParamList} from '../navigation/types';
import {
  Header,
  Container,
  HeaderText,
  Header3Text,
  ButtonText,
} from '../styles/style';
import {appConfig} from '../types/apiConstants';
import {Heading3Centerw, Heading1Centerw, Heading3w} from '../styles/typography';
import Icon from '@components/shared/Icon';
import {ButtonPrimary} from '@components/shared/ButtonGlobal';
import {ChildCenterView} from '@components/shared/ChildSetupStyle';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const ChildSetupList = ({navigation}: Props) => {
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {
        childAge: '43',
        childGender: '40',
        parentGender: 'all',
        Seasons: 'all',
      },
      saveinDB: true,
    },
    // {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{},saveinDB:true},
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}
  ];
  const childSetup = () => {
    // if(netInfo.isConnected){
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: {apiJsonData: apiJsonData, prevPage: 'ChilSetup'},
        },
      ],
    });
    // navigation.navigate('HomeDrawerNavigator')
  };
  // else{
  //   Alert.alert("No Internet Connection.")
  // }

  return (
    <>
      <OnboardingContainer>
        {/* <OnboardingHeading>
          <Header>
            <HeaderText>
              Awesome!! Your child profile has been created !
            </HeaderText>
            <Header3Text>
              Please review your child details before proceeding!
            </Header3Text>
          </Header>
        </OnboardingHeading> */}

        <OnboardingHeading>
          <ChildCenterView style={{flexDirection:'column'}}>
            <Heading1Centerw>
              Awesome!! Your child profile has been created !
            </Heading1Centerw>
            <Heading3Centerw>
              Please review your child details before proceeding!
            </Heading3Centerw>
          </ChildCenterView>
        </OnboardingHeading>
        

        <View style={{alignItems: 'flex-start'}}>
          <View
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: '#8CAEE4',
              flexDirection: 'row',
              marginBottom: 15,
            }}>
            <View style={{flex: 2}}>
              <Text>Child1</Text>
              <Text>Born on 08 july 2020</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{marginRight: 10, borderBottomWidth: 2}}>
                Delete
              </Text>
              <Text style={{borderBottomWidth: 2}}>Edit Profile</Text>
            </View>
          </View>
          <View
            style={{
              borderRadius: 4,
              padding: 10,
              backgroundColor: '#8CAEE4',
              flexDirection: 'row',
            }}>
            <View style={{flex: 2}}>
              <Text>Child1</Text>
              <Text>Born on 08 july 2020</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{marginRight: 10, borderBottomWidth: 2}}>
                Delete
              </Text>
              <Text style={{borderBottomWidth: 2}}>Edit Profile</Text>
            </View>
          </View>
        </View>

        <View style={{marginBottom: 15, alignItems: 'center'}}>
          <View>
            <Pressable
              style={{flexDirection: 'row'}}
              onPress={() => navigation.navigate('AddSiblingDataScreen')}>
              <Icon name="ic_plus" size={20} color="#FFF" />

              <Heading3w>Add Sister or Brother</Heading3w>
            </Pressable>
          </View>
          <View style={{width: '100%'}}>
            <ButtonPrimary
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'HomeDrawerNavigator'}],
                // })
                childSetup();
              }}>
              <ButtonText>Continue</ButtonText>
            </ButtonPrimary>
            {/* <Button
              title="Continue"
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'HomeDrawerNavigator'}],
                // })
                childSetup();
              }}
            /> */}
          </View>
        </View>
      </OnboardingContainer>
    </>
  );
};

export default ChildSetupList;
