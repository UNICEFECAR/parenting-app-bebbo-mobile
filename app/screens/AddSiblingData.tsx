import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Pressable} from 'react-native';
import ChildDate from '@components/ChildDate';
import {RootStackParamList} from '../navigation/types';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import {ButtonPrimary, ButtonRow, ButtonText} from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import {ChildCenterView,ChildAddTop} from '@components/shared/ChildSetupStyle';
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
            <ChildAddTop>
              <Heading1Centerw>Add Brother or Sister</Heading1Centerw>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
            </ChildAddTop>
          </OnboardingHeading>
          <ChildDate />
          
          
        </View>

        <ButtonRow>
            <ButtonPrimary
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'HomeDrawerNavigator'}],
                // })
                navigation.navigate('ChildSetupList');
              }}>
              <ButtonText>Save data</ButtonText>
            </ButtonPrimary>
            </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default AddSiblingData;
