import { useNavigation } from '@react-navigation/native';
import { Heading4, Heading4Regular, Heading5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import Icon from './shared/Icon';

const ChilDevelopmentCollapsibleItem = (props: any) => {
  const {item} = props;
  // console.log(item);
  const navigation = useNavigation()
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle =()=>{
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  }
  const gotoActivity =()=>{
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: actHeaderColor,
      backgroundColor: actBackgroundColor,
    });
  }
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
            <View style={{padding: 10}}>
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
                  <Pressable onPress={gotoArticle}><Text style={{textDecorationLine: 'underline'}}>
                    View Related Article
                  </Text>
                  </Pressable>
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
                  <Pressable onPress={gotoActivity}><Text style={{textDecorationLine: 'underline'}}>
                    View details
                  </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};
export default ChilDevelopmentCollapsibleItem;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
    // marginVertical: 8,
    marginHorizontal: 16,

    marginVertical: 5,
  },
  title: {
    fontSize: 12,
  },
});
