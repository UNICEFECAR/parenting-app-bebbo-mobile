import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useContext, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  SafeAreaView,
} from 'react-native';
import {RootStackParamList} from '../navigation/types';
import {
  Header,
  Container,
  HeaderText,
  Header2Text,
  Header3Text,
} from '../styles/style';
import ActionSheet from 'react-native-actions-sheet';
import {ThemeContext} from 'styled-components';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ChildRelationList,
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
} from '@components/shared/ChildSetupStyle';
import {
  Heading1w,
  Heading1Centerw,
  Heading3,
  ShiftFromTop30,
  Heading3Regular,
} from '../styles/typography';
import Icon from '@components/shared/Icon';
import {ButtonPrimary, ButtonText} from '@components/shared/ButtonGlobal';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const EditParentDetails = ({navigation}: Props) => {
  const [relationship, setRelationship] = useState('');
  const genders = ['Father', 'Mother', 'Other'];
  const actionSheetRef = createRef();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
            borderBottomColor: 'gray',
            borderBottomWidth: 2,
          }}>
          <View style={{flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Text>Back</Text>
            </Pressable>
          </View>
          <View style={{flex: 3}}>
            <Text> {'Edit Parent Details'}</Text>
          </View>
        </View>

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
          <View>
            <LabelText>Parent Name</LabelText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={''}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder="Enter your name"
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            />
          </View>
          <View style={{width: '100%', marginTop: 30}}>
            <ButtonPrimary
              onPress={() => {
                navigation.navigate('ChildProfileScreen');
              }}>
              <ButtonText>Save Data</ButtonText>
            </ButtonPrimary>
          </View>
      </SafeAreaView>
    </>
  );
};

export default EditParentDetails;
const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#FFF',
    color: '#20232a',
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
