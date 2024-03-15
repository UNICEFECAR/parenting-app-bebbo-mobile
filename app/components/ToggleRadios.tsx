import { Heading3, Heading3Regular } from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FDirRow } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';
import Radio, { RadioActive, RadioBoxContainer, RadioInnerBox, RadioItem, RadioOuter } from './shared/radio';
const styles = StyleSheet.create({
  checkbox: { borderRadius: 50, borderWidth: 1 },
  checkboxItem: { borderRadius: 50 },
  heading3: { flexShrink: 1 },
  lastView: { flexDirection: 'row', flex: 1,margin:12 }
})

const ToggleRadios = (props: any): any => {
  const { options, tickColor, tickbgColor, defaultValue } = props;
  const [checkedItem, setCheckedItem] = useState(defaultValue ? defaultValue : null);
  useEffect(() => {
    setCheckedItem(defaultValue);
  }, [defaultValue])
  return (
    <>
      <RadioBoxContainer>
        <FDirRow>
          {options.map((item: typeof options[0], index: number) => {
            return (

              <RadioOuter key={index}
              >
                <Pressable
                  onPress={(): any => {
                    setCheckedItem(item);
                    props.getCheckedItem(item);
                  }}>
                  <RadioItem>
                    <View>
                      {(checkedItem?.title && checkedItem.title == item.title) ?<RadioActive><Icon name="ic_tick" size={12} color="#fff" /></RadioActive> : <Radio></Radio>}
                    </View>
                
                  </RadioItem>
                </Pressable>
                <View style={styles.lastView}>
                    {(checkedItem?.title && checkedItem.title == item.title) ? (
                      <Heading3 style={styles.heading3} numberOfLines={2}>{item.title} </Heading3>
                    ) : (
                      <Heading3Regular style={styles.heading3} numberOfLines={2}>{item.title} </Heading3Regular>
                    )}
                  </View>

                {/* <Pressable
                  onPress={(): any => {
                    setCheckedItem(item);
                    props.getCheckedItem(item);
                  }}>
                  <RadioItem>
                    <View>
                      {(checkedItem?.title && checkedItem.title == item.title) ? (
                        <RadioActive style={[styles.checkboxItem, { backgroundColor: tickbgColor }]}>
                          <Icon name="ic_tick" size={12} color={tickColor} />
                        </RadioActive>
                      ) : (
                        <Radio
                          style={styles.checkbox}></Radio>
                      )}
                    </View>
                  </RadioItem>

                  <View style={styles.lastView}>
                    {(checkedItem?.title && checkedItem.title == item.title) ? (
                      <Heading3 style={styles.heading3} numberOfLines={2}>{item.title} </Heading3>
                    ) : (
                      <Heading3Regular style={styles.heading3} numberOfLines={2}>{item.title} </Heading3Regular>
                    )}
                  </View>
                </Pressable> */}
              </RadioOuter>

            );
          })}
        </FDirRow></RadioBoxContainer>
    </>
  );
};
export default ToggleRadios;
