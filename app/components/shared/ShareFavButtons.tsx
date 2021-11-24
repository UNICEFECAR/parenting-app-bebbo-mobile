import { ADVICE_SHARED, FAVOURITE_ADVICE_ADDED, FAVOURITE_GAME_ADDED, GAME_SHARED } from '@assets/data/firebaseEvents';
import { shareText } from '@assets/translations/appOfflineData/apiConstants';
import analytics from '@react-native-firebase/analytics';
import { Heading4 } from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Share } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setFavouriteAdvices, setFavouriteGames } from '../../redux/reducers/childSlice';
import { FDirRow } from './FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './Icon';
export const ShareFavBox = styled.View`
  flex-direction: row;
  padding: 5px 10px 0;
  justify-content: space-between;
  align-items: center;

`;
export const ShareFavPress = styled.Pressable`
  flex:1;

padding:12px 0px;
`;

const ShareFavButtons = React.memo((props: any) => {
  const activeChilduuid = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild).uuid
    : [],
);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {backgroundColor,item,isAdvice, isFavourite} = props;
  
  const onShare = async () => {
   // console.log('share');
    try {
      const result = await Share.share({
        message:item ? item.title :t('appShareText')+shareText
            });
      if (result.action === Share.sharedAction) {
        // await analytics().logEvent(APP_SHARE); //{advise_id:item?.id}
        if(isAdvice){
           analytics().logEvent(ADVICE_SHARED, {advise_id:item?.id});
        }else{
           analytics().logEvent(GAME_SHARED, {game_id:item?.id});
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
      // Alert.alert(error.message);
      Alert.alert(t('generalError'));
    }
  };
  const onFavClick = async ()=>{
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    //console.log(filterQuery,"vshdvh---",isAdvice);
    if(isAdvice){
    // console.log("filterQuery child dev--",filterQuery);
    const updatefavorites = await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'advices',filterQuery);
    const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
    // setisFavourite(!isFavourite);
    dispatch(setFavouriteAdvices(childData[0].favoriteadvices));

      analytics().logEvent(FAVOURITE_ADVICE_ADDED, {advise_id:item?.id});
    }else{
      const updatefavorites = await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'games',filterQuery);
      const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
      // setisFavourite(!isFavourite);
      dispatch(setFavouriteGames(childData[0].favoritegames));
      analytics().logEvent(FAVOURITE_GAME_ADDED, {game_id:item?.id});
    }

    
  }
  const unFavHandler = async ()=>{
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    if(isAdvice){
      // console.log("filterQuery child dev--",filterQuery);
      const updatefavorites = await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'advices',filterQuery);
      const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
      // setisFavourite(!isFavourite);
      dispatch(setFavouriteAdvices(childData[0].favoriteadvices));
  
      }else{
        const updatefavorites = await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'games',filterQuery);
        const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
        // setisFavourite(!isFavourite);
        dispatch(setFavouriteGames(childData[0].favoritegames));
      }
  }
  return (
    <>
      <ShareFavBox style={{backgroundColor: backgroundColor}}>
        <ShareFavPress onPress={() => onShare()} >
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft>
                <Icon name="ic_sb_shareapp" size={20} color="#000" />
              </OuterIconLeft>
            </OuterIconRow>
            <Heading4 style={{flexShrink:1}} numberOfLines={1}>{t('actScreenshareText')}</Heading4>
          </FDirRow>
        </ShareFavPress>

        { isFavourite ? (
          <ShareFavPress onPress={() => unFavHandler()} style={{alignItems:'flex-end'}}>
            <FDirRow>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_trash" size={20} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4 style={{flexShrink:1}} numberOfLines={1}>{t('actScreenremovetoFavText')}</Heading4>
            </FDirRow>
          </ShareFavPress>
        ) : (
          <ShareFavPress onPress={() =>onFavClick()} style={{alignItems:'flex-end'}}>
            <FDirRow>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_sb_favorites" size={20} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4 style={{flexShrink:1}} numberOfLines={1}>{t('actScreenaddtoFavText')}</Heading4>
            </FDirRow>
          </ShareFavPress>
        )}
      </ShareFavBox>
    </>
  );
});
export default ShareFavButtons;
