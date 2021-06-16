import Icon from '@components/shared/Icon';
import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { Pressable, View } from 'react-native';
import Radio, { RadioActive, RadioItem, RadioItemText } from './shared/radio';


const CountryItem = ({ item, currentItem, setCountry }) => {
  const isActive = item === currentItem ? true : false;
  const netInfo=useNetInfo();
  // console.log(netInfo,"..netInfo..");
  // const Icon = createIconSetFromFontello(fontelloConfig);
  return (
    <>
   
      <Pressable
        onPress={() => {
        //  console.log(item);
          setCountry(item);
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
export default CountryItem;
