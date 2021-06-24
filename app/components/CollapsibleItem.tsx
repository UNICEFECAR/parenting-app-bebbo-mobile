import { Heading4, Heading4Regular, Heading5 } from '@styles/typography';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import Icon from './shared/Icon';

const CollapsibleItem = (props: any) => {
  const {item} = props;
  console.log(item);
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <>
      <View style={styles.item}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              // backgroundColor:'red',
              alignItems: 'center',
            }}>
            <FormOuterCheckbox
              style={{alignSelf: 'center'}}
              onPress={() => {
                setToggleCheckBox(!toggleCheckBox);
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxActive>
                      <Icon name="ic_tick" size={12} color="#000" />
                    </CheckboxActive>
                  ) : (
                    <Checkbox style={{borderWidth: 1}}></Checkbox>
                  )}
                </View>
              </CheckboxItem>
            </FormOuterCheckbox>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 8,
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <Heading4Regular style={[styles.title, {flex: 7,textAlignVertical:'center'}]}>
              {item.title}
            </Heading4Regular>
            <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </Pressable>
        </View>
        {isOPen ? (
          <>
            <View style={{padding: 5}}>
              <Heading4>Milestone</Heading4>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('@assets/trash/card1.jpeg')}
                  style={{flex: 1, width: '100%', height: 50, borderRadius: 5}}
                  resizeMode={'cover'}
                />
                <View style={{flex: 5, marginHorizontal: 5}}>
                  <Heading5>
                    Often, easily and spontaneously smiles at people near her.
                  </Heading5>
                  <Text style={{textDecorationLine: 'underline'}}>
                    View Related Article
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: props.subItemSaperatorColor,
                borderBottomWidth: 1,
                margin: 5,
                padding: 1,
              }}></View>
            <View style={{padding: 5}}>
              <Heading4>Related Activity</Heading4>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('@assets/trash/card1.jpeg')}
                  style={{flex: 1, width: '100%', height: 50, borderRadius: 5}}
                  resizeMode={'cover'}
                />
                <View style={{flex: 5, marginHorizontal: 5}}>
                  <Heading5>
                    Child related content goes here, Child related content goes
                    here,
                  </Heading5>
                  <Text style={{textDecorationLine: 'underline'}}>
                    View details
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};
export default CollapsibleItem;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
    // marginVertical: 8,
    // marginHorizontal: 16,
    margin: 10,
  },
  title: {
    fontSize: 12,
  },
});
