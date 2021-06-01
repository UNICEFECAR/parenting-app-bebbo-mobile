import React from 'react';
import {Pressable, Text} from 'react-native';
import {RadioItem, RadioItemText} from '../styles/style';
const CountryItem = ({item, currentItem, setCountry}) => {
  const isActive = item === currentItem ? true : false;
  return (
    <>
      <Pressable
        onPress={() => {
          console.log(item);
          setCountry(item);
        }}>
        <RadioItem>
        <Text> {isActive ? 'Act' : 'inA'} </Text>
          <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioItem>
      </Pressable>
    </>
  );
};
export default CountryItem;
