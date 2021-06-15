
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import ChildDate from '@components/ChildDate';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header2Text } from '../styles/style';
import ActionSheet from "react-native-actions-sheet";
import Icon from '@components/shared/Icon';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import { Heading1w,Heading1Centerw,Heading3 } from '../styles/typography';
import { ChildCenterView ,ChildContentArea,LabelText,ChildSection} from '@components/shared/ChildSetupStyle';
import { ButtonPrimary } from '@components/shared/ButtonGlobal';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const ChildSetup = ({ navigation }: Props) => {
  const [relationship, setRelationship] = useState('');
  const genders = ['Father', 'Mother', 'Other'];
  const actionSheetRef = createRef();
  return (
    <>

<OnboardingContainer>
          <OnboardingHeading>
                <ChildCenterView><Heading1Centerw> Please take a moment to personalize your app</Heading1Centerw></ChildCenterView>
          </OnboardingHeading>
     

      <ChildContentArea>
      <ChildSection>
            <ChildDate />
          </ChildSection>
      </ChildContentArea>
      
      <View style={{width:'100%', marginTop:30,flex:1, }}>

          
          
          <View style={{marginTop:10 }}>
            <LabelText>Relationship with child</LabelText>
            <View style={{ flexDirection: 'row', backgroundColor: '#ffffff',height:60 }}>
            <View style={{ flex: 4,alignItems:'center',flexDirection:'row',paddingLeft:15,paddingTop:10, }}>
                <Pressable
                  onPress={() => {
                    actionSheetRef.current?.setModalVisible();
                  }}
                >
                  <Heading3>{relationship ? relationship : 'Select'}</Heading3>
                </Pressable>
              </View>
              <View style={{ flex: 1,justifyContent:'center',alignItems:'center',flexDirection:'row', }}>
                <Icon name="ic_angle_down" size={10} color="#000" />
              </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
              <View>
                {
                  genders.map((item, index) => {
                    return (
                      <View key={index}>
                        <Pressable
                          onPress={() => {
                            setRelationship(item);
                            actionSheetRef.current?.hide();
                          }}>
                          <Header2Text>{item}</Header2Text>
                        </Pressable>
                      </View>
                    )
                  })
                }
              </View>
            </ActionSheet>
          </View>
        </View>
        <View style = {{marginBottom:15,}}>

        
        <Button title="Continue"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'ChildSetupList'}],
            })
            // navigation.navigate('ChildSetupList')
          }}
        />
</View>

      
      </OnboardingContainer>
    </>
  );
};

export default ChildSetup;
