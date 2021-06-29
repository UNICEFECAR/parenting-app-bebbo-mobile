import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Icon from './Icon';

const ShareFavButtons = (props:any) => {
  const {t} = useTranslation();
  const {backgroundColor,isFavourite}= props;
  return (
    <>
    <View style={{flexDirection: 'row', padding: 10,backgroundColor:backgroundColor}}>
        <View style={{flex: 1}}>
          <Pressable onPress={() => {}} style={{flexDirection: 'row'}}>
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