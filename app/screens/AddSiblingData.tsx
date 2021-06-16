import ChildDate from '@components/ChildDate';
import { ButtonPrimary, ButtonRow, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Pressable, View } from 'react-native';
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
