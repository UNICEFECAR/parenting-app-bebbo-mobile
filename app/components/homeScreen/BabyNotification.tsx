import { ButtonText } from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import { Header3Text } from '@styles/style';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const BabyNotification = () => {
  const {t} = useTranslation();
  return (
    <>
      <View style={{padding: 10,flexDirection:'row',backgroundColor:'#EEE'}}>
      <Icon name="ic_baby" size={25} color="#000" />
        <View style={{flexDirection:'column'}}>
        <Header3Text>{t('babyNotificationbyAge',{ageInMonth: '4'})}</Header3Text>
        <Header3Text>
        {t('babyNotificationText')}
        </Header3Text>
        </View>
       
                <ButtonText>{t('babyNotificationUpdateBtn')}</ButtonText>
           
      </View>
    </>
  );
};

export default BabyNotification;
