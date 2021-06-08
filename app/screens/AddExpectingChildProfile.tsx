
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import ChildDate from '@components/ChildDate';
import { RootStackParamList } from '../navigation/types';
import { Header, Container, HeaderText, Header2Text, Header3Text } from '../styles/style';

import DateTimePicker from '@react-native-community/datetimepicker';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};


const AddExpectingChildProfile = ({ navigation }: Props) => {
  const [dobDate, setdobDate] = useState();
  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };

  const showdobDatepicker = () => {
    setdobShow(true);
  };
  return (
    <>
      <Container>
        <View>

          <Header>
            <HeaderText>Add Expecting Child Details</HeaderText>
            <Pressable onPress={() => {navigation.goBack()}}>
                  <Text>Back</Text>
                </Pressable>
          </Header>
         
          <Header3Text>Child Date of Birth / Expected due date</Header3Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, backgroundColor: 'gray' }}>
            <Header3Text> {dobDate ? dobDate.toDateString() : null}</Header3Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'green' }}>
            <Pressable style={styles.title} onPress={showdobDatepicker}>
              <Header3Text>Select DOBDate</Header3Text>
            </Pressable>
          </View>
        </View>
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
          
        </View>

         
        <View style={{flex:1}}>
          <TextInput
           autoCapitalize='none'
           autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder="Enter your child anme"
            style={{ backgroundColor: '#fff', paddingHorizontal: 20,paddingVertical: 20 }}
          />
        </View>
        <Button
            title="Save Data"
            onPress={() => navigation.navigate('ChildProfileScreen')}
          />
      </Container>
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