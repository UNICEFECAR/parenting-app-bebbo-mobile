import { FormOuterCheckbox, LabelText } from '@components/shared/ChildSetupStyle';
import { VacItemContainer } from '@components/shared/Container';
import { Flex1, FlexDirRow } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconRight, OuterIconRow } from '@components/shared/Icon';
import { ToolsHeadView } from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading4Regular } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import Checkbox, { CheckboxActive, CheckboxItem } from '../shared/CheckboxStyle';
const VaccineItem = (props: any) => {
  const {item, onToggleVaccine, fromScreen} = props;
  const themeContext = useContext(ThemeContext);
  const navigation = useNavigation();
  const bgColor = themeContext.colors.VACCINATION_COLOR;
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = (pinned_articleID) => {
    if(pinned_articleID!=0){
    navigation.navigate('DetailsScreen', {
      fromScreen: fromScreen,
      headerColor: headerColor,
      backgroundColor: backgroundColor,
      detailData: pinned_articleID,
    });
  }
  };

  const {title, id, isChecked, pinned_article} = item;
  const [toggleCheckBox, setToggleCheckBox] = useState(isChecked);
  return (
    <>
      <VacItemContainer>
        <ToolsHeadView>
          <FlexDirRow>
            <FormOuterCheckbox
              onPress={() => {
                setToggleCheckBox(!toggleCheckBox);
                onToggleVaccine(id, !toggleCheckBox);
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxActive style={{backgroundColor: bgColor}}>
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
              gotoArticle(pinned_article);
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
