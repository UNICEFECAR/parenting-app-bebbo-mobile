import { BgSecondary } from '@components/shared/BackgroundColors';
import { ButtonTertiaryMd, ButtonTextMd } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirCol, FDirRow, Flex1, Flex2 } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { Heading3, Heading5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';

const BabyNotification = () => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const bgColor=themeContext.colors.SECONDARY_COLOR;
  return (
    <>
    <BgSecondary>
     <MainContainer>
      <FDirRow>
        
        <OuterIconRow>
          <OuterIconLeft>
          <Icon name="ic_baby" size={36} color="#000" />
          </OuterIconLeft>
        </OuterIconRow>
        <Flex2>
        <FDirCol>
        
        <Heading3>{t('babyNotificationbyAge',{ageInMonth: '4'})}</Heading3>
        <Heading5>
        {t('babyNotificationText')}
        </Heading5>
        </FDirCol>
        </Flex2>
       <Flex1>
        <ButtonTertiaryMd>
        <ButtonTextMd>{t('babyNotificationUpdateBtn')}</ButtonTextMd>
        </ButtonTertiaryMd>
       </Flex1>
       
                
           
      </FDirRow>
      </MainContainer>
      </BgSecondary>
    </>
  );
};

export default BabyNotification;
