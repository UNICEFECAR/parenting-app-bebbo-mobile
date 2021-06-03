import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header3Text } from '../styles/style';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const ChildSetupList = ({ navigation }: Props) => {
  return (
    <>
      <Container>
        <View>
          <Header>
            <HeaderText>Awesome! Your child profile has been created !</HeaderText>
            <Header3Text>Please review your child details before proceeding!</Header3Text>
          </Header>
          
          <Button
            title="Add Sister or Brother"
            onPress={() => {}}
          />
          <Button
            title="Continue"
            onPress={() => navigation.navigate('HomeDrawerNavigator')}
          />
        </View>
      </Container>
    </>
  );
};

export default ChildSetupList;
