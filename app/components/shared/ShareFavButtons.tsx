import { ADVICE_SHARED, FAVOURITE_ADVICE_ADDED, FAVOURITE_GAME_ADDED, GAME_SHARED } from '@assets/data/firebaseEvents';
import { shareTextButton } from '@assets/translations/appOfflineData/apiConstants';
import { Heading4 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Share, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setFavouriteAdvices, setFavouriteGames } from '../../redux/reducers/childSlice';
import { FDirRow } from './FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow,OuterIconLeft1 } from './Icon';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { logEvent } from '../../services/EventSyncService';
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
const styles=StyleSheet.create({
alignItemsFlexEnd:{alignItems:"flex-end"},
flexShrink1:{flexShrink:1}
});
const ShareFavButtons = React.memo((props: any) => {
  const netInfo = useNetInfoHook();
  const activeChilduuid = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild).uuid
    : [],
);
const languageCode = useAppSelector(
  (state: any) => state.selectedCountry.languageCode,
);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {backgroundColor,item,isAdvice, isFavourite, fromScreen} = props;

   const onShare = async ():Promise<any> => {
   const suburl=isAdvice?"/article/":"/activity/";
   const mainUrl=shareTextButton+languageCode+suburl+item.id;
   console.log('onshare click')
    try {
      const result = await Share.share({
        message:item.title+'\n'+t('appShareText')+'\n'+mainUrl
      });
      console.log('onshare click1',result)
      if (result.action === Share.sharedAction) {
        console.log('onshare click1',item?.id)
        if(isAdvice){
          const adviceEventData= {'name': ADVICE_SHARED,'params':{ advise_id: item?.id } }
          logEvent(adviceEventData,netInfo.isConnected)
        }else{
          const gameEventData= {'name': GAME_SHARED,'params':{ game_id: item?.id } }
          logEvent(gameEventData,netInfo.isConnected)
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(t('generalError'));
    }
  };
  const onFavClick = async ():Promise<any>=>{
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    if(isAdvice){
    await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'advices',filterQuery);
    const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
    dispatch(setFavouriteAdvices(childData[0]?.favoriteadvices));
    const favAdviceData= {'name': FAVOURITE_ADVICE_ADDED,'params':{ advise_id: item?.id } }
    logEvent(favAdviceData,netInfo.isConnected)
    }else{
      await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'games',filterQuery);
      const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
      dispatch(setFavouriteGames(childData[0].favoritegames));
      const favGameData= {'name': FAVOURITE_GAME_ADDED,'params':{ game_id: item?.id } }
      logEvent(favGameData,netInfo.isConnected)
    }

    
  }
  const unFavHandler = async ():Promise<any>=>{
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    if(isAdvice){
      
      await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'advices',filterQuery);
      const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
      console.log('childdata is....',childData[0])
      dispatch(setFavouriteAdvices(childData[0]?.favoriteadvices));
  
      }else{
        await userRealmCommon.updateFavorites<ChildEntity>(ChildEntitySchema,item?.id,'games',filterQuery);
        const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
        dispatch(setFavouriteGames(childData[0]?.favoritegames));
      }
  }
  return (
    <>
      <ShareFavBox style={{backgroundColor: backgroundColor}}>
        <ShareFavPress onPress={():any => onShare()} >
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft1>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft1>
            </OuterIconRow>
            <Heading4 style={styles.flexShrink1} numberOfLines={1}>{t('actScreenshareText')}</Heading4>
          </FDirRow>
        </ShareFavPress>

        { isFavourite ? (fromScreen && fromScreen == 'Favourites' ? 
             (<ShareFavPress onPress={():any => unFavHandler()} style={styles.alignItemsFlexEnd}>
              <FDirRow>
                <OuterIconRow>
                  <OuterIconLeft1>
                    <Icon name="ic_trash" size={25} color="#000" />
                  </OuterIconLeft1>
                </OuterIconRow>
                <Heading4 style={styles.flexShrink1} numberOfLines={1}>{t('favScreenremoveText')}</Heading4>
              </FDirRow>
            </ShareFavPress>) :
             (<ShareFavPress onPress={():any => unFavHandler()} style={styles.alignItemsFlexEnd}>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft1>
                      <Icon name="ic_sb_favorites_filled" size={25} color="#000" />
                    </OuterIconLeft1>
                  </OuterIconRow>
                  <Heading4 style={styles.flexShrink1} numberOfLines={1}>{t('actScreenremovetoFavText')}</Heading4>
                </FDirRow>
              </ShareFavPress>)
        )
         : (
          fromScreen && fromScreen == 'Favourites' ? null :
            (<ShareFavPress onPress={():any =>onFavClick()} style={styles.alignItemsFlexEnd}>
              <FDirRow>
                <OuterIconRow>
                  <OuterIconLeft1>
                    <Icon name="ic_sb_favorites" size={25} color="#000" />
                  </OuterIconLeft1>
                </OuterIconRow>
                <Heading4 style={styles.flexShrink1} numberOfLines={1}>{t('actScreenaddtoFavText')}</Heading4>
              </FDirRow>
            </ShareFavPress>)
         )
        }
      </ShareFavBox>
    </>
  );
});
export default ShareFavButtons;
