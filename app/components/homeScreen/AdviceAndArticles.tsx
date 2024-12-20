import { BgArticlesTint } from '@components/shared/BackgroundColors';
import {
  ButtonArticles, ButtonText
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

const AdviceAndArticles = (): any => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  return (
    <>
      <FlexCol>
        <BgArticlesTint>
          <FeatureDivideArea>
            <MainContainer>
              <FeatureBox>
                <FlexDirRow>
                  <Pressable onPress={(): any => navigation.navigate('Articles')}>
                    <FeatureImageBox>
                      <VectorImage source={require('@images/ic_article_color.svg')} />
                    </FeatureImageBox>
                  </Pressable>
                  <FeatureContentBox>
                    <ShiftFromBottom15>
                      <Heading2>{t('homeScreenexpHeader')}</Heading2>
                    </ShiftFromBottom15>
                    <ButtonArticles
                      onPress={(): any => navigation.navigate('Articles')}>
                      <ButtonText numberOfLines={2}>{t('homeScreenexpButton')}</ButtonText>
                    </ButtonArticles>
                  </FeatureContentBox>
                </FlexDirRow>
              </FeatureBox>
            </MainContainer>
          </FeatureDivideArea>
        </BgArticlesTint>
      </FlexCol>

    </>
  );
};

export default AdviceAndArticles;