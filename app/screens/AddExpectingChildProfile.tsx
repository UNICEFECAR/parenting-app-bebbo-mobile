import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import {
  Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { ThemeContext } from 'styled-components';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddExpectingChildProfile = ({navigation}: Props) => {
  const [dobDate, setdobDate] = useState();
  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const showdobDatepicker = () => {
    setdobShow(true);
  };
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
            <Text> {'Add Expecting Child Details'}</Text>
          </View>
        </View>

        <View style={{margin: 10}}>
          <FormDateContainer>
            <FormInputGroup onPress={showdobDatepicker}>
              <LabelText>Expected due date</LabelText>
              <FormInputBox>
                <FormDateText>
                  <Text> {dobDate ? dobDate.toDateString() : null}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
          </FormDateContainer>

          <View>
            {showdob && (
              <DateTimePicker
                testID="dobdatePicker"
                value={new Date()}
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
            )}
          </View>

          <View>
            <LabelText>Any preferred Name</LabelText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={''}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder="Enter your child name"
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
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddExpectingChildProfile;
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
