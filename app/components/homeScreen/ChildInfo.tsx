import {
  ButtonPrimary,
  ButtonSpacing,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Heading2Center, Heading3Center, Heading4Centerr, ShiftFromBottom10, ShiftFromTopBottom10 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';

const ChildInfo = () => {
  const {t} = useTranslation();
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
  return (
    <>
    <MainContainer>
      
        <ShiftFromBottom10>
        <Heading2Center>
          {t('homeScreenchildInfoTitle',{childName:"Baby",parentName:"Parent"})} 
           {/* if baby found use childInfoTitle */}
        </Heading2Center>
        </ShiftFromBottom10>
        <ShiftFromBottom10>
          <Image
            source={require('@assets/trash/card3.jpeg')}
            style={{width: '100%', borderRadius: 10}}
          />
        </ShiftFromBottom10>
        <Heading3Center>{t('babyNotificationbyAge',{childName:(activeChild.childName!=null && activeChild.childName!="" && activeChild.childName!=undefined)?activeChild.childName:'',ageInMonth:(activeChild.birthDate!=null && activeChild.birthDate!="" && activeChild.birthDate!=undefined)? getCurrentChildAgeInMonths(t,activeChild.birthDate):''})}</Heading3Center>

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
