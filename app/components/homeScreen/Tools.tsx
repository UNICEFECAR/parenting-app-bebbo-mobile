import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FeatureDivideArea, ToolBox, ToolBoxText, ToolPress } from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading3Center, ShiftFromTop10 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VectorImage from 'react-native-vector-image';
const Tools = ():any => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  return (
    <>
    <BgSecondaryTint>
    <FeatureDivideArea>
        <MainContainer>
          <ShiftFromTop10>
          <Heading2>{t('walkthroughTextstitle2')}</Heading2>
          </ShiftFromTop10>
          <ToolBox>
          
          <ToolPress onPress={():any => navigation.navigate("Tools", { screen: 'VaccinationTab' })}>
              <VectorImage source={require('@images/ic_vaccination_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreenvc')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
            <ToolPress onPress={():any => navigation.navigate("Tools", { screen: 'HealthCheckupsTab' })}>
              <VectorImage source={require('@images/ic_health_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreenhc')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
            <ToolPress onPress={():any => navigation.navigate("Tools", { screen: 'ChildgrowthTab' })}>
              <VectorImage source={require('@images/ic_growth_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreencg')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
          </ToolBox>
        </MainContainer>  
        </FeatureDivideArea>
      </BgSecondaryTint>
    </>
  );
};

export default Tools;