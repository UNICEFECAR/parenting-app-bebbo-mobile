import { BgActivityTint } from '@components/shared/BackgroundColors';
import {
  ButtonActivity,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureContentBox, FeatureDivideArea, FeatureImageBox } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';

const PlayingTogether = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
    <BgActivityTint>
    <FeatureDivideArea>
        <MainContainer>
          <FeatureBox>
         <FlexDirRow>
          <FeatureImageBox>
          <VectorImage source={require('@assets/svg/ic_activity_color.svg')} />
          </FeatureImageBox>
          <FeatureContentBox>
            <ShiftFromBottom15>
            <Heading2>{t('homeScreenptHeader')}</Heading2>
            </ShiftFromBottom15>
              <ButtonActivity
                onPress={() => navigation.navigate('Activities')}>
                <ButtonText>{t('homeScreenptButton')}</ButtonText>
              </ButtonActivity>
          </FeatureContentBox>
          </FlexDirRow>
          </FeatureBox>
        </MainContainer>
        </FeatureDivideArea>
      </BgActivityTint>
      
    </>
  );
};

export default PlayingTogether;
