import { BgDevelopmentTint } from '@components/shared/BackgroundColors';
import {
  ButtonDevelopment, ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureContentBox, FeatureDivideArea, FeatureImageBox } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';
import React from 'react';
const ChildMilestones = ():any => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
   
      <BgDevelopmentTint>
      <FeatureDivideArea>
        <MainContainer>
          <FeatureBox>
         <FlexDirRow>
          <FeatureImageBox>
            <VectorImage
              source={require('@assets/svg/ic_development_color.svg')}
            />
          </FeatureImageBox>
          <FeatureContentBox>
            <ShiftFromBottom15>
            <Heading2>{t('homeScreencdHeader')}</Heading2>
            </ShiftFromBottom15>
              <ButtonDevelopment
                onPress={():any => navigation.navigate('ChildDevelopment')}>
                <ButtonText numberOfLines={2}>{t('homeScreencdButton')}</ButtonText>
                
              </ButtonDevelopment>
          </FeatureContentBox>
          </FlexDirRow>
          </FeatureBox>
        </MainContainer>
        </FeatureDivideArea>
      </BgDevelopmentTint>
      
    </>
  );
};

export default ChildMilestones;
