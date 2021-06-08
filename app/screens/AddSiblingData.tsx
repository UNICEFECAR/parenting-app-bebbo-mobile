
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import ChildDate from '@components/ChildDate';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header2Text } from '../styles/style';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const AddSiblingData = ({ navigation }: Props) => {

  return (
    <>
      <Container>
        <View>

          <Header>
            <HeaderText>Add Brother or Sister</HeaderText>
          </Header>
          <ChildDate />
          
        </View>
          <Button
            title="Save Data"
            onPress={() => navigation.navigate('ChildSetupList')}
          />

      </Container>
    </>
  );
};

export default AddSiblingData;
