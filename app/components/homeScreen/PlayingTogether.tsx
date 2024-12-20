import { BgActivityTint } from '@components/shared/BackgroundColors';
import {
  ButtonActivity,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow, FlexCol } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureContentBox, FeatureDivideArea, FeatureImageBox } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';
import { Pressable } from 'react-native';

const PlayingTogether = (): any => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  return (
    <>
      <FlexCol>
        <BgActivityTint>
          <FeatureDivideArea>
            <MainContainer>
              <FeatureBox>
                <FlexDirRow>
                  <Pressable onPress={(): any => navigation.navigate('Activities')}>
                    <FeatureImageBox>
                      <VectorImage source={require('@images/ic_activity_color.svg')} />
                    </FeatureImageBox>
                  </Pressable>
                  <FeatureContentBox>
                    <ShiftFromBottom15>
                      <Heading2>{t('homeScreenptHeader')}</Heading2>
                    </ShiftFromBottom15>
                    <ButtonActivity
                      onPress={(): any => navigation.navigate('Activities')}>
                      <ButtonText numberOfLines={2}>{t('homeScreenptButton')}</ButtonText>
                    </ButtonActivity>
                  </FeatureContentBox>
                </FlexDirRow>
              </FeatureBox>
            </MainContainer>
          </FeatureDivideArea>
        </BgActivityTint>
      </FlexCol>
    </>
  );
};

export default PlayingTogether;
