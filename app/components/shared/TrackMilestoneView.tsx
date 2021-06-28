import { useNavigation } from '@react-navigation/native';
import { Heading3 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import { ButtonPrimary, ButtonText } from './ButtonGlobal';
import Icon from './Icon';
const TrackMilestoneView = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  // const {backgroundColor}= props;
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          margin: 10,
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
      </View>
    </>
  );
};
export default TrackMilestoneView;
