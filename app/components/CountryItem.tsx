import React from 'react';
import {Pressable} from 'react-native';
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
        <RadioItem isActive={isActive}>
          <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioItem>
      </Pressable>
    </>
  );
};
export default CountryItem;
