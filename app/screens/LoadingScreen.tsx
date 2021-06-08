import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header2Text } from '../styles/style';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const LoadingScreen = ({ navigation }: Props) => {
  return (
    <>
      <Container>
        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Header2Text>Loading screen</Header2Text>
          <Button
            title="Next"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'ChildSetup'}],
              })
              // navigation.navigate('ChildSetup')
            }}
          />
        </View>
      </Container>
    </>
  );
};

export default LoadingScreen;
