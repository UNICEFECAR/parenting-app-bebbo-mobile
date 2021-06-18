import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useState} from 'react';
import ChildDate from '@components/ChildDate';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import {ButtonPrimary, ButtonRow, ButtonText} from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { Pressable, View } from 'react-native';
import {ChildCenterView,ChildAddTop} from '@components/shared/ChildSetupStyle';
import { Heading1Centerw,ShiftFromTop5 } from '../styles/typography';
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
              <ShiftFromTop5>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
              </ShiftFromTop5>
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
