import {
    ButtonContainer,
    ButtonPrimary,
    ButtonText
} from '@components/shared/ButtonGlobal';
import { Header3Text } from '@styles/style';
import { Heading2Center } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

const ChildInfo = () => {
  const {t} = useTranslation();
  return (
    <>
      <View style={{padding: 10}}>
        <Heading2Center>
          {t('homeScreen.childInfoTitle2')} 
           {/* if baby found use childInfoTitle */}
        </Heading2Center>
        <View
          style={{
            marginVertical: 8,
            marginHorizontal: 16,
          }}>
          <Image
            source={require('@assets/trash/card5.jpeg')}
            style={{width: '100%', borderRadius: 10}}
          />
        </View>
        <Header3Text>your baby is 3 month Old</Header3Text>
        <Header3Text>
          your baby can likely roll from front to back and hold their head with
          fewer wobbles these days
        </Header3Text>
        <ButtonContainer>
          <ButtonPrimary onPress={() => {}}>
            <ButtonText>{t('homeScreen.childBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonContainer>
      </View>
    </>
  );
};

export default ChildInfo;
