import Icon from '@components/shared/Icon';
import React from 'react';
import { Pressable, View } from 'react-native';
import Radio, { RadioActive, RadioItem, RadioItemText } from './shared/radio';

const CountryItem = ({item, currentItem, setCountry}:any):any => {
  const isActive: boolean = item === currentItem ? true : false;
  return (
    <>
      <Pressable
        onPress={():any => {
          setCountry(item);
        }}>
        <RadioItem>
          <View>
            {isActive ? (
              <RadioActive>
                <Icon name="ic_tick" size={12} color="#fff" />
              </RadioActive>
            ) : (
              <Radio></Radio>
            )}
          </View>
          <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
        </RadioItem>
      </Pressable>
    </>
  );
};
export default CountryItem;
