import { Heading4 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Share } from 'react-native';
import styled from 'styled-components/native';
import { FDirRow } from './FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './Icon';
import analytics from '@react-native-firebase/analytics';
import { ADVICE_SHARED, APP_SHARE, FAVOURITE_ADVICE_ADDED, FAVOURITE_GAME_ADDED, GAME_SHARED } from '@assets/data/firebaseEvents';
export const ShareFavBox = styled.View`
  flex-direction: row;
  padding: 13px 10px;
  justify-content: space-between;
  align-items: center;
`;

const ShareFavButtons = (props: any) => {
  const {t} = useTranslation();
  const {backgroundColor, isFavourite,item,isAdvice} = props;
  const onShare = async () => {
   // console.log('share');
    try {
      const result = await Share.share({
        message:t('appShareText')
            });
      if (result.action === Share.sharedAction) {
        // await analytics().logEvent(APP_SHARE); //{advise_id:item?.id}
        if(isAdvice){
          await analytics().logEvent(ADVICE_SHARED, {advise_id:item?.id});
        }else{
          await analytics().logEvent(GAME_SHARED, {game_id:item?.id});
        }
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
  const onFavClick = async()=>{
    if(isAdvice){
    await analytics().logEvent(FAVOURITE_ADVICE_ADDED, {advise_id:item?.id});
  }else{
    await analytics().logEvent(FAVOURITE_GAME_ADDED, {game_id:item?.id});
  }

    
  }
  const unFavHandler = ()=>{

  }
  return (
    <>
      <ShareFavBox style={{backgroundColor: backgroundColor}}>
        <Pressable onPress={() => onShare()} style={{flex:1}}>
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft>
                <Icon name="ic_sb_shareapp" size={20} color="#000" />
              </OuterIconLeft>
            </OuterIconRow>
            <Heading4 numberOfLines={1}>{t('actScreenshareText')}</Heading4>
          </FDirRow>
        </Pressable>

        {isFavourite ? (
          <Pressable onPress={() => unFavHandler()} style={{flex:1, alignItems:'flex-end'}}>
            <FDirRow>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_trash" size={20} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4 numberOfLines={1}>{t('actScreenremovetoFavText')}</Heading4>
            </FDirRow>
          </Pressable>
        ) : (
          <Pressable onPress={() =>onFavClick()} style={{flex:1, alignItems:'flex-end'}}>
            <FDirRow>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_sb_favorites" size={20} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4 numberOfLines={1}>{t('actScreenaddtoFavText')}</Heading4>
            </FDirRow>
          </Pressable>
        )}
      </ShareFavBox>
    </>
  );
};
export default ShareFavButtons;
