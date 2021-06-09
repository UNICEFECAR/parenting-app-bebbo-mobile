import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { RadioItem, RadioItemText } from '../styles/style';
// import { createIconSetFromFontello } from 'react-native-vector-icons';
// import fontelloConfig from '../assets/iconConfig/config.json';
const CountryItem = ({ item, currentItem, setCountry }) => {
  const isActive = item === currentItem ? true : false;
  const netInfo=useNetInfo();
  console.log(netInfo,"..netInfo..");
  // const Icon = createIconSetFromFontello(fontelloConfig);
  return (
    <>
    <Text>{netInfo.isConnected}</Text>
    <Text>{netInfo.type}</Text>
      <Pressable
        onPress={() => {
          console.log(item);
          setCountry(item);
        }}>
        <RadioItem>
          <View style={{
            flexDirection: "row"
          }}>
            {/* <Icon name="ic_sb_loveapp" size={30} color="#FFF" /> */}
            <Text style={{ flex: 1, }}> {isActive ? 'Act' : 'inA'} </Text>
            <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
          </View>

        </RadioItem>
      </Pressable>
   </>
  );
};
export default CountryItem;
