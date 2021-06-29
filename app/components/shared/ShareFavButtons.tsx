import { Heading4 } from '@styles/typography';
import styled from 'styled-components/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { FDirRow, Flex1 } from './FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './Icon';

export const ShareFavBox = styled.View`
flex-direction:row;
padding:13px 10px;
justify-content:space-between;
align-items:center;
`

const ShareFavButtons = (props:any) => {
  const {t} = useTranslation();
  const {backgroundColor,isFavourite}= props;
  const onShare = async () => {
    console.log("share");
    try {
      const result = await Share.share({
        message:
          'Parenbuddy App | An App for parents to monitor and guide your child growth',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <>
    <ShareFavBox style={{backgroundColor:backgroundColor}}>
          <Pressable onPress={() => {}} >
            <FDirRow>
            <OuterIconRow>
              <OuterIconLeft>
              <Icon name="ic_sb_shareapp" size={20} color="#000" />
              </OuterIconLeft>
            </OuterIconRow>
            <Heading4>{t('actScreenshareText')}</Heading4>
            </FDirRow>
          </Pressable>
        
          
          <Pressable onPress={() => {}} >
          <FDirRow>
          <OuterIconRow>
              <OuterIconLeft>
              <Icon name="ic_sb_favorites" size={20} color="#000" />
              </OuterIconLeft>
            </OuterIconRow>
            <Heading4>{t('actScreenaddtoFavText')}</Heading4>
            </FDirRow>
          </Pressable>
        
      </ShareFavBox>
      </>
  );
};
export default ShareFavButtons;