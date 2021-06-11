import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Icon from '@components/shared/Icon';
import Radio, { RadioActive, RadioItemText,RadioItem} from './shared/radio';
const LanguageItem = ({item, currentItem, setLanguage}) => {
  const isActive = item === currentItem ? true : false;
  return (
    <>
      <Pressable
        onPress={() => {
        //  console.log(item);
          setLanguage(item);
        }}>
        <RadioItem>
        <View>
            {isActive ? <RadioActive><Icon name="ic_tick" size={12} color="#000" /></RadioActive> : <Radio></Radio> } 
            </View>
            <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioItem>
      </Pressable>
    </>
  );
};
export default LanguageItem;
