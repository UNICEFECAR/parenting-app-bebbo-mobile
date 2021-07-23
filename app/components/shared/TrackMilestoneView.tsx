import { useNavigation } from '@react-navigation/native';
import { Heading3, ShiftFromBottom15 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { ButtonDevelopmentMd, ButtonTextMd } from './ButtonGlobal';
import { BannerContainer, MainContainer } from './Container';
import { Flex1, Flex3, FlexDirRowStart } from './FlexBoxStyle';
import Icon, { IconBox, OuterIconLeft, OuterIconRow } from './Icon';
const TrackMilestoneView = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  // const {backgroundColor}= props;
  return (
    <>
    <ShiftFromBottom15>
    <MainContainer>
      <BannerContainer style={{backgroundColor: backgroundColor,}}>
        <FlexDirRowStart>
        <Flex1>
          <OuterIconRow>
            <OuterIconLeft>
            <IconBox>
        <Icon name="ic_milestone" size={25} color="#000" />
        </IconBox>
            </OuterIconLeft>
          </OuterIconRow>
          
       
        </Flex1>
        <Flex3>
          <ShiftFromBottom15>
        <Heading3>
           {t('trackMilestoneViewHeader')}
          </Heading3>
          </ShiftFromBottom15>
          <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
            <ButtonDevelopmentMd
              onPress={() =>
                navigation.navigate('Home', {screen: 'ChildDevelopment'})
              }>
              <ButtonTextMd>{t('trackMilestoneViewBtn')}</ButtonTextMd>
            </ButtonDevelopmentMd>
          </Pressable>
        </Flex3>
        </FlexDirRowStart>
      {/* <View
        style={{
          flexDirection: 'row',
          backgroundColor: backgroundColor,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: headerColor,
            borderRadius: 50,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Icon name="ic_milestone" size={25} color="#000" />
        </View>
        <View style={{flex: 6}}>
          <Heading3>
           {t('trackMilestoneViewHeader')}
          </Heading3>
          <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
            <ButtonPrimary
              onPress={() =>
                navigation.navigate('Home', {screen: 'ChildDevelopment'})
              }>
              <ButtonText>{t('trackMilestoneViewBtn')}</ButtonText>
            </ButtonPrimary>
          </Pressable>
        </View>
      </View> */}
      </BannerContainer> 
      </MainContainer>
      </ShiftFromBottom15>
    </>
  );
};
export default TrackMilestoneView;
