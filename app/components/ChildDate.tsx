import React from 'react';
import {View, Button, StyleSheet, TextInput} from 'react-native';
import { Header3Text } from '../styles/style';
import CheckBox from './Checkbox';
const ChildDate = () => {
  return (
    <View>
        <Header3Text>Child Date of Birth / Expected due date</Header3Text>
      <TextInput/>
      <CheckBox  label="Baby Born Prematurely" checkedValue={false}/>
      <Header3Text>Original due date</Header3Text>
      <TextInput/>
    </View>
  );
};
export default ChildDate;

