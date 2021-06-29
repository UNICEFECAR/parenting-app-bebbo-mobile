import {
    ButtonContainer,
    ButtonPrimary,
    ButtonSpacing,
    ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Heading2Center, ShiftFromTop10,ShiftFromBottom10,ShiftFromBottom20,ShiftFromTopBottom10, Heading3, Heading3Center, Heading4Centerr} from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

const ChildInfo = () => {
  const {t} = useTranslation();
  return (
    <>
    <MainContainer>
      
        <ShiftFromBottom10>
        <Heading2Center>
          {t('homeScreenchildInfoTitle2')} 
           {/* if baby found use childInfoTitle */}
        </Heading2Center>
        </ShiftFromBottom10>
        <ShiftFromBottom10>
          <Image
            source={require('@assets/trash/card5.jpeg')}
            style={{width: '100%', borderRadius: 10}}
          />
        </ShiftFromBottom10>
       
        <Heading3Center>{t('babyNotificationbyAge',{ageInMonth: '4'})}</Heading3Center>
        <ShiftFromTopBottom10>
        <Heading4Centerr>
          your baby can likely roll from front to back and hold their head with
          fewer wobbles these days
        </Heading4Centerr>
        </ShiftFromTopBottom10>
        <ShiftFromBottom10>
          <ButtonSpacing>
          <ButtonPrimary onPress={() => {}}>
            <ButtonText>{t('homeScreenchildBtnText')}</ButtonText>
          </ButtonPrimary>
          </ButtonSpacing>
        </ShiftFromBottom10>
      
      </MainContainer>
    </>
  );
};

export default ChildInfo;
