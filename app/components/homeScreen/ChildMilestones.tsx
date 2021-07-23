import { BgDevelopmentTint } from '@components/shared/BackgroundColors';
import {
  ButtonDevelopment, ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow,FlexCol } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureContentBox, FeatureDivideArea, FeatureImageBox } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';

const ChildMilestones = () => {
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
                onPress={() => navigation.navigate('ChildDevelopment')}>
                <ButtonText>{t('homeScreencdButton')}</ButtonText>
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
