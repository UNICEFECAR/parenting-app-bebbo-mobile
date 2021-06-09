import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { RadioItem, RadioItemText } from '../styles/style';
import Icon from './shared/Icon';

const CountryItem = ({ item, currentItem, setCountry }) => {
  const isActive = item === currentItem ? true : false;
  const netInfo=useNetInfo();
  // console.log(netInfo,"..netInfo..");
  // const Icon = createIconSetFromFontello(fontelloConfig);
  return (
    <>
   
      <Pressable
        onPress={() => {
          console.log(item);
          setCountry(item);
        }}>
        <RadioItem>
          <View style={{
            flexDirection: "row"
          }}>

            <Icon name="checkbox" size={30} color="#FFF" />
            <Text style={{ flex: 1, }}> {isActive ? 'Act' : 'inA'} </Text>
            <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
          </View>

        </RadioItem>
      </Pressable>
   </>
  );
};
export default CountryItem;
