import { FormOuterCheckbox, LabelText } from '@components/shared/ChildSetupStyle';
import { Heading3, Heading3Regular } from '@styles/typography';
import React, { useState } from 'react';
import { View } from 'react-native';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import Icon from './shared/Icon';

const ToggleRadios = (props: any) => {
  const {options,tickColor,tickbgColor,defaultValue} = props;
  //console.log(defaultValue,"..defaultValue..")
  const [checkedItem, setCheckedItem] = useState(defaultValue);
 
  return (
    <>
      <View style={{flexDirection: 'row'}}>
        {options.map((item: typeof options[0], index: number) => {
          return (

              <View key={index}
                style={{
                  padding: 10,
                  backgroundColor: '#FFF',
                  marginHorizontal: 3,
                }}>
                <FormOuterCheckbox
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
                  <LabelText>
                  {(checkedItem?.title && checkedItem.title == item.title) ? (
                      <Heading3>{item.title}</Heading3>
                    ) : (
                      <Heading3Regular>{item.title}</Heading3Regular>
                    )}
                  </LabelText>
                </FormOuterCheckbox>
              </View>
          );
        })}
      </View>
    </>
  );
};
export default ToggleRadios;
