import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Button} from 'react-native';
import ChildDate from '../components/ChildDate';
import {RootStackParamList} from '../navigation/types';
import { Header,Container, HeaderText } from '../styles/style';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
const ChildSetup = ({navigation}: Props) => {
  return (
    <>
    <Container>
    <View>
        <Header>
          <HeaderText>Please take a moment to personalize your app</HeaderText>
        </Header>
        <ChildDate/>
        <Text>Relationship with child</Text>
      <Button
        title="Continue & Go to Home"
        onPress={() => navigation.navigate('HomeDrawerNavigator')}
      />
    </View>
    </Container>
    </>
  );
};

export default ChildSetup;
