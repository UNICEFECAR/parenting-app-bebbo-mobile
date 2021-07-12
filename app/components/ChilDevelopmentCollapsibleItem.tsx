import { useNavigation } from '@react-navigation/native';
import { Heading4, Heading4Regular, Heading5, ShiftFromBottom5, ShiftFromTop5, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxDevActive, CheckboxItem } from './shared/CheckboxStyle';
import { MainContainer } from './shared/Container';
import { DevelopmentBox } from './shared/DevelopmentStyle';
import { DividerDev } from './shared/Divider';
import { FDirRow, Flex5 } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';



const ChilDevelopmentCollapsibleItem = (props: any) => {
  const {item} = props;
  // console.log(item);
  const navigation = useNavigation();
  const {t}= useTranslation()
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle =()=>{
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'ChildDevelopment',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  }
  const gotoActivity =()=>{
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'ChildDevelopment',
    //   headerColor: actHeaderColor,
    //   backgroundColor: actBackgroundColor,
    // });
  }
  return (
    <>
    <MainContainer>
    <DevelopmentBox>
    <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection:'row',
            }}>
            <Pressable
              onPress={() => {
                setToggleCheckBox(!toggleCheckBox);
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxDevActive>
                      <Icon name="ic_tick" size={12} color="#000" />
                    </CheckboxDevActive>
                  ) : (
                    <Checkbox style={{borderWidth: 1}}></Checkbox>
                  )}
                </View>
              </CheckboxItem>
            </Pressable>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 1
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>
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
          <ShiftFromTop5></ShiftFromTop5>
            <ShiftFromTopBottom10>
              <ShiftFromBottom5>
              <Heading4>Milestone</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
                <Image
                  source={require('@assets/trash/card1.jpeg')}
                  style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                  resizeMode={'cover'}
                />
                <Flex5>
                <ShiftFromBottom5>
                  <Heading5>
                    Often, easily and spontaneously smiles at people near her.
                  </Heading5>
                  </ShiftFromBottom5>
                  <Pressable onPress={gotoArticle}>
                    
                    <ButtonTextSmLineL>
                   {t('developScreenrelatedArticleText')}
                  </ButtonTextSmLineL>
                  
                  </Pressable>
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            <DividerDev></DividerDev>
            
              <ShiftFromTopBottom10>
              <ShiftFromBottom5>
              <Heading4>{t('developScreenrelatedAct')}</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
              <Image
                  source={require('@assets/trash/card1.jpeg')}
                  style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                  resizeMode={'cover'}
                />
                <Flex5>
                <ShiftFromBottom5>
                <Heading5>
                    Child related content goes here, Child related content goes
                    here,
                  </Heading5>
                  </ShiftFromBottom5>
                  <Pressable onPress={gotoActivity}>
                    
                    <ButtonTextSmLineL>
                   {t('developScreenviewDetails')}
                  </ButtonTextSmLineL>
                  
                  </Pressable>
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            
          </>
        ) : null}
    </DevelopmentBox>
    </MainContainer>
    </>
  );
};
export default ChilDevelopmentCollapsibleItem;

const styles = StyleSheet.create({
  // item: {
  //   padding: 10,
  //   color: '#000',
  //   backgroundColor: '#FFF',
  //   // marginVertical: 8,
  //   marginHorizontal: 16,

  //   marginVertical: 5,
  // },
  title: {
    fontSize: 12,
  },
});
