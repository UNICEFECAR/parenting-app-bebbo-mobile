import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Pressable} from 'react-native';
import ChildDate from '@components/ChildDate';
import {RootStackParamList} from '../navigation/types';
import {
  Header,
  Container,
  HeaderText,
  Header2Text,
  ButtonText,
} from '../styles/style';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import {ButtonPrimary} from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import {ChildCenterView} from '@components/shared/ChildSetupStyle';
import { Heading1Centerw } from '../styles/typography';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddSiblingData = ({navigation}: Props) => {
  return (
    <>
      <OnboardingContainer>
        <View>
          <OnboardingHeading>
            <ChildCenterView style={{flexDirection: 'row',justifyContent:'space-between'}}>
              <Heading1Centerw>Add Brother or Sister</Heading1Centerw>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
            </ChildCenterView>
          </OnboardingHeading>
          <ChildDate />

          <View style={{width: '100%', marginTop: 30}}>
            <ButtonPrimary
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'HomeDrawerNavigator'}],
                // })
                navigation.navigate('ChildSetupList');
              }}>
              <ButtonText>Continue</ButtonText>
            </ButtonPrimary>
          </View>
        </View>
      </OnboardingContainer>
    </>
  );
};

export default AddSiblingData;
