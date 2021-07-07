import { FormOuterCheckbox, LabelText } from '@components/shared/ChildSetupStyle';
import { BgContainer, MainContainer, VacItemContainer } from '@components/shared/Container';
import { FDirRow, Flex1, FlexDirRow } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconRight, OuterIconRow } from '@components/shared/Icon';
import { ToolsHeadView } from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading3, Heading4Regular, ShiftFromTop5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import Checkbox, { CheckboxActive, CheckboxItem } from '../shared/CheckboxStyle';
const VaccineItem = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const navigation =  useNavigation();
  const bgColor = themeContext.colors.VACCINATION_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'Articles',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  };
  const {title, isChecked,key} = props.item;
  const [toggleCheckBox, setToggleCheckBox] = useState(isChecked);
  return (
    <>
      <VacItemContainer key={key}
        >
        <ToolsHeadView>
          <FlexDirRow>
        <FormOuterCheckbox
          onPress={() => {
            setToggleCheckBox(!toggleCheckBox);
          }}>
          <CheckboxItem>
            <View>
              {toggleCheckBox ? (
                <CheckboxActive style={{backgroundColor:bgColor}}>
                  <Icon name="ic_tick" size={12} color="#000" />
                </CheckboxActive>
              ) : (
                <Checkbox style={{borderWidth: 1}}></Checkbox>
              )}
            </View>
          </CheckboxItem> 
          <Flex1>
          <LabelText>
          <Heading4Regular>{title}</Heading4Regular>
          </LabelText>
          </Flex1>
        </FormOuterCheckbox>
        </FlexDirRow>
        <Pressable
            onPress={() => {
              gotoArticle();
            }}>
            <OuterIconRow>
           <OuterIconRight>
             
           <Icon name="ic_info" size={15} color="#000" />
           
             </OuterIconRight> 
            </OuterIconRow>  
            
          </Pressable>
        
        </ToolsHeadView>
      </VacItemContainer>
    </>
  );
};
export default VaccineItem;
