import Icon from '@components/shared/Icon';
import React from 'react';
import { Pressable, View } from 'react-native';
import Radio, { RadioActive, RadioCountryItem, RadioItemText } from './shared/radio';

const CountryItem = ({ item, currentItem, setCountry }: any): any => {

  const isActive = item && currentItem && item.CountryID === currentItem.CountryID;
  return (
    <>
      <Pressable
        onPress={(): any => {
          setCountry(item);
        }}>
        <RadioCountryItem>
          <View>
            {isActive ? (
              <RadioActive>
                <Icon name="ic_tick" size={12} color="#fff" />
              </RadioActive>
            ) : (
              <Radio></Radio>
            )}
          </View>
          <RadioItemText isActive={isActive}>{item.name}</RadioItemText>
        </RadioCountryItem>
      </Pressable>
    </>
  );
};
export default CountryItem;
