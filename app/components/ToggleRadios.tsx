import { useFocusEffect } from '@react-navigation/core';
import { Heading3, Heading3Regular } from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FDirRow } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';
import { RadioBoxContainer, RadioInnerBox, RadioOuter } from './shared/radio';

const ToggleRadios = (props: any) => {
  const {options,tickColor,tickbgColor,defaultValue} = props;
  const [checkedItem, setCheckedItem] = useState(defaultValue?defaultValue:null);
  useEffect(()=>{
      setCheckedItem(defaultValue);
  },[defaultValue])
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setCheckedItem(defaultValue);
  //   }, [defaultValue])
  // );
  return (
    <>
    <RadioBoxContainer>
      <FDirRow>
        {options.map((item: typeof options[0], index: number) => {
          return (
            
              <RadioOuter key={index}
                >
                <RadioInnerBox
                  onPress={() => {
                    setCheckedItem(item);
                    props.getCheckedItem(item);
                  }}>
                  <CheckboxItem>
                    <View>
                    {(checkedItem?.title && checkedItem.title == item.title) ? (
                        <CheckboxActive style={{borderRadius: 50,backgroundColor:tickbgColor}}>
                          <Icon name="ic_tick" size={12} color={tickColor} />
                        </CheckboxActive>
                      ) : (
                        <Checkbox
                          style={{borderWidth: 1, borderRadius: 50}}></Checkbox>
                      )}
                    </View>
                  </CheckboxItem>
                  
                  <View style={{flexDirection:'row',flex:1}}>
                  {(checkedItem?.title && checkedItem.title == item.title) ? (
                      <Heading3 style={{flexShrink:1}} numberOfLines={2}>{item.title} </Heading3>
                    ) : (
                      <Heading3Regular style={{flexShrink:1}} numberOfLines={2}>{item.title} </Heading3Regular>
                    )}
                  </View>
                </RadioInnerBox>
              </RadioOuter>
              
          );
        })}
      </FDirRow></RadioBoxContainer>
    </>
  );
};
export default ToggleRadios;
