import Icon from '@components/shared/Icon';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Radio, { RadioActive, RadioCountryItem, RadioItem, RadioItemText } from './shared/radio';

const LanguageItem = ({ item, currentItem, setLanguage }: any): any => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentItem != null && currentItem[0]?.luxonLocale != null) {
      setIsActive(item === currentItem[0] ? true : false);
    } else {
      setIsActive(item === currentItem ? true : false);
    }
  }, [currentItem, item, isActive]);
  return (
    <>
      <Pressable
        onPress={(): any => {
          setLanguage(item);
        }}>
        <RadioCountryItem>
          <View>
            {isActive ? <RadioActive><Icon name="ic_tick" size={12} color="#fff" /></RadioActive> : <Radio></Radio>}
          </View>
          <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioCountryItem>
      </Pressable>
    </>
  );
};
export default LanguageItem;
