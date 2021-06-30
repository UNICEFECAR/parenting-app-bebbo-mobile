import { BgSecondary } from '@components/shared/BackgroundColors';
import { ButtonContainer, ButtonTertiary, ButtonTextMd ,ButtonTertiaryMd} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow,FDirRow,FDirCol,Flex1,Flex2} from '@components/shared/FlexBoxStyle';
import { HeaderActionView, HeaderIconView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconLeft, OuterIconLeft15, OuterIconRow } from '@components/shared/Icon';
import { Header3Text } from '@styles/style';
import React, { useContext } from 'react';
import { Heading3, Heading5 } from '@styles/typography';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
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
