import { FormOuterCheckbox, LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading3 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import Checkbox, { CheckboxActive, CheckboxItem } from '../shared/CheckboxStyle';
const VaccineItem = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const navigation =  useNavigation();
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'Articles',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  };
  const {title, isChecked} = props.item;
  const [toggleCheckBox, setToggleCheckBox] = useState(isChecked);
  return (
    <>
      <View
        style={{
          backgroundColor: '#FFF',
          margin: 3,
          flexDirection: 'row',
        }}>
        <FormOuterCheckbox
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
          <LabelText>
          <Heading3>{title}</Heading3>
          <Pressable
            onPress={() => {
              gotoArticle();
            }}>
            <Icon name="ic_info" size={15} color="#000" />
          </Pressable>
          </LabelText>
        </FormOuterCheckbox>
      </View>
    </>
  );
};
export default VaccineItem;
