import React from 'react';
import {Pressable} from 'react-native';
import {RadioItem, RadioItemText} from '../styles/style';
const LanguageItem = ({item, currentItem, setLanguage}) => {
  const isActive = item === currentItem ? true : false;
  return (
    <>
      <Pressable
        onPress={() => {
          console.log(item);
          setLanguage(item);
        }}>
        <RadioItem isActive={isActive}>
          <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioItem>
      </Pressable>
    </>
  );
};
export default LanguageItem;
