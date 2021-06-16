import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Pressable} from 'react-native';
import ChildDate from '@components/ChildDate';
import {RootStackParamList} from '../navigation/types';

import ActionSheet from 'react-native-actions-sheet';
import Icon from '@components/shared/Icon';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import {
  Heading1w,
  Heading1Centerw,
  Heading3,
  ShiftFromTop30,
  Heading3Regular,
} from '../styles/typography';
import {
  ChildCenterView,
  ChildContentArea,
  LabelText,
  ChildSection,
  ChildRelationList,
  FormInputGroup,
  FormInputBox,
  FormDateText,
  FormDateAction,
} from '@components/shared/ChildSetupStyle';
import {
  ButtonPrimary,
  ButtonText,
  ButtonRow,
} from '@components/shared/ButtonGlobal';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const ChildSetup = ({navigation}: Props) => {
  const [relationship, setRelationship] = useState('');
  const genders = ['Father', 'Mother', 'Other'];
  const actionSheetRef = createRef();
  return (
    <>
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildCenterView>
            <Heading1Centerw>
              Please take a moment to personalize your app
            </Heading1Centerw>
          </ChildCenterView>
        </OnboardingHeading>

        <ChildContentArea>
          <ChildSection>
            <ChildDate />

            <FormInputGroup
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
              <LabelText>Relationship with child</LabelText>

              <FormInputBox>
                <FormDateText>
                  <Text>{relationship ? relationship : 'Select'}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_angle_down" size={10} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
          </ChildSection>
        </ChildContentArea>

        <ActionSheet ref={actionSheetRef}>
          <View>
            {genders.map((item, index) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={() => {
                      setRelationship(item);
                      actionSheetRef.current?.hide();
                    }}>
                    <Heading3>{item}</Heading3>
                  </Pressable>
                </ChildRelationList>
              );
            })}
          </View>
        </ActionSheet>

        <ButtonRow>
          <ButtonPrimary
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'ChildSetupList'}],
              });
              // navigation.navigate('ChildSetupList')
            }}>
            <ButtonText>Continue</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default ChildSetup;
