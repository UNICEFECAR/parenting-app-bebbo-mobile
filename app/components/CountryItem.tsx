import React from 'react';
import {Pressable, Text, View} from 'react-native';
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
        <View style={{
      flexDirection: "row"
    }}>
       <Text style={{ flex: 1,}}> {isActive ? 'Act' : 'inA'} </Text>
       <RadioItemText isActive={isActive}>{item.displayName}</RadioItemText>
    </View>
       
        </RadioItem>
      </Pressable>
    </>
  );
};
export default CountryItem;
