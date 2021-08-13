import { BgArticlesTint } from '@components/shared/BackgroundColors';
import {
  ButtonArticles, ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow,FlexCol } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureContentBox, FeatureDivideArea, FeatureImageBox } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, ShiftFromBottom15 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';


const AdviceAndArticles = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
    <FlexCol>
    <BgArticlesTint>
      <FeatureDivideArea>
        <MainContainer>
          <FeatureBox>
         <FlexDirRow>
          <FeatureImageBox>
          <VectorImage source={require('@assets/svg/ic_article_color.svg')} />
          </FeatureImageBox>
          <FeatureContentBox>
            <ShiftFromBottom15>
            <Heading2>{t('homeScreenexpHeader')}</Heading2>
            </ShiftFromBottom15>
              <ButtonArticles
                onPress={() => navigation.navigate('Articles')}>
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
// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: '#FFF',
//     borderRadius: 5,
//     margin: 3,
//     padding: 10,
//     // width: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 16,
//     padding: 5,
//     width: 100,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
