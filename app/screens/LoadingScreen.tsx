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


const LoadingScreen = ({ navigation }: Props) => {
  return (
    <>
      <Container>
        <View>
          
          <Button
            title="Continue"
            onPress={() => navigation.navigate('HomeDrawerNavigator')}
          />
        </View>
      </Container>
    </>
  );
};

export default LoadingScreen;
