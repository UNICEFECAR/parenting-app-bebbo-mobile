import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { useAppDispatch } from '../../App';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header3Text } from '../styles/style';
import { appConfig } from '../types/apiConstants';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const ChildSetupList = ({ navigation }: Props) => {
    // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'43',childGender:'40',parentGender:'all',Seasons:'all'},saveinDB:true},
    // {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{},saveinDB:true},
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}
  ]
  const childSetup=()=>{
    // if(netInfo.isConnected){
      navigation.reset({
        index: 0,
        routes: [{name: 'LoadingScreen',params:{apiJsonData:apiJsonData,prevPage:'ChilSetup'}}]      
      })
      // navigation.navigate('HomeDrawerNavigator')
    }
    // else{
    //   Alert.alert("No Internet Connection.")
    // }
  
  return (
    <>
<Container>
      <View >
      <Header>
        <HeaderText>Awesome!! Your child profile has been created !</HeaderText>
        <Header3Text>Please review your child details before proceeding!</Header3Text>
        </Header>
      </View>
      <View style={{flex:2}}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: "red" }} >
            <Text>Child1</Text>
            <Text>Born on 08 july 2020</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "darkorange" }} >
            <Text>Delete</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "green" }} >
            <Text>Edit Profile</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: "green" }} >
            <Text>Child1</Text>
            <Text>Born on 08 july 2020</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "gray" }} >
            <Text>Delete</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "red" }} >
            <Text>Edit Profile</Text>
          </View>
        </View>
        </View>
        <View>
        <Button
          title="Add Sister or Brother"
          onPress={() => navigation.navigate('AddSiblingDataScreen')}
        />
        <Button
          title="Continue"
          onPress={() => {
            // navigation.reset({
            //   index: 0,
            //   routes: [{name: 'HomeDrawerNavigator'}],
            // })
            childSetup()
          }}
        />
      </View>
      </Container>
    </>
  );
};

export default ChildSetupList;
