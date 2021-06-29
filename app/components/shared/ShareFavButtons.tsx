import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Share, Text, View } from 'react-native';
import Icon from './Icon';

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
    <View style={{flexDirection: 'row', padding: 10,backgroundColor:backgroundColor}}>
        <View style={{flex: 1}}>
          <Pressable onPress={() => {onShare()}} style={{flexDirection: 'row'}}>
            <Icon name="ic_sb_shareapp" size={20} color="#000" />
            <Text>{t('actScreenshareText')}</Text>
          </Pressable>
        </View>
        <View style={{flex: 1}}>
          {isFavourite ? <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
            <Icon name="ic_trash" size={20} color="#000" />
            <Text>{t('actScreenremovetoFavText')}</Text>
          </Pressable>:<Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
            <Icon name="ic_sb_favorites" size={20} color="#000" />
            <Text>{t('actScreenaddtoFavText')}</Text>
          </Pressable>
}
        </View>
      </View>
      </>
  );
};
export default ShareFavButtons;