import { BgSecondary } from '@components/shared/BackgroundColors';
import { ButtonLinkPress, ButtonTertiaryMd, ButtonTextMd } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirCol, FDirRow, Flex1, Flex2, FlexDirRowSpace } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading3, Heading5 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';

const BabyNotification = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
  const bgColor=themeContext.colors.SECONDARY_COLOR;
  return (
    <>
    <BgSecondary>
     <MainContainer>
      <FlexDirRowSpace>
        <FDirRow>
        <OuterIconRow>
          <OuterIconLeft>
          <Icon name="ic_baby" size={36} color="#000" />
          </OuterIconLeft>
        </OuterIconRow>
        <FDirCol>
        <Heading3>{t('babyNotificationbyAge',{childName:(activeChild.childName!=null && activeChild.childName!="" && activeChild.childName!=undefined)?activeChild.childName:'',ageInMonth:(activeChild.birthDate!=null && activeChild.birthDate!="" && activeChild.birthDate!=undefined)? getCurrentChildAgeInMonths(t,activeChild.birthDate):''})}</Heading3>
        <Heading5>
        {t('babyNotificationText')}
        </Heading5>
        </FDirCol>
        </FDirRow>
        <FDirCol>
        <ButtonTertiaryMd>
        <ButtonLinkPress
                  onPress={() =>
                    navigation.navigate('EditChildProfile', {childData: (activeChild!=null && activeChild!="" && activeChild!=undefined)?activeChild:null})
                  }>
        <ButtonTextMd>
                    {t('babyNotificationUpdateBtn')}
        </ButtonTextMd>
        </ButtonLinkPress>
        </ButtonTertiaryMd>
        </FDirCol>
       
       
                
           
      </FlexDirRowSpace>
      </MainContainer>
      </BgSecondary>
    </>
  );
};

export default BabyNotification;
