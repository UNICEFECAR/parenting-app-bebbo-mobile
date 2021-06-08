
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, TextInput } from 'react-native';
import ChildDate from '@components/ChildDate';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header2Text } from '../styles/style';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const AddSiblingProfile = ({ navigation }: Props) => {

  return (
    <>
      <Container>
        <View>

          <Header>
            <HeaderText>Add Brother or Sister</HeaderText>
            <Pressable onPress={() => {navigation.goBack()}}>
                  <Text>Back</Text>
                </Pressable>
          </Header>
          <Text style={{backgroundColor:'gray',padding:50}}>Upload Child Photo</Text>
          <Text>Boy /Girl</Text>
          <ChildDate />
          
        </View>

          <Button
            title="Save Data"
            onPress={() => navigation.navigate('ChildProfileScreen')}
          />
        <View style={{flex:1}}>
          <TextInput
           autoCapitalize='none'
           autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder="Enter your child anme"
            style={{ backgroundColor: '#fff', paddingHorizontal: 20,paddingVertical: 20 }}
          />
        </View>
      </Container>
    </>
  );
};

export default AddSiblingProfile;
