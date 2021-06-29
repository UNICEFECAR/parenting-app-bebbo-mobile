import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureDivideArea,ToolBox,ToolPress,ToolBoxText} from '@components/shared/HomeScreenStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading3Center, ShiftFromBottom10, ShiftFromTop10 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';


const Tools = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
    <BgSecondaryTint>
    <FeatureDivideArea>
        <MainContainer>
          <ShiftFromTop10>
          <Heading2>Tools</Heading2>
          </ShiftFromTop10>
          <ToolBox>
          
          <ToolPress onPress={() => navigation.navigate("Tools", { screen: 'VaccinationTab' })}>
              <VectorImage source={require('@assets/svg/ic_vaccination_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreenvc')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
            <ToolPress onPress={() => navigation.navigate("Tools", { screen: 'HealthCheckupsTab' })}>
              <VectorImage source={require('@assets/svg/ic_health_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreenhc')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
            <ToolPress onPress={() => navigation.navigate("Tools", { screen: 'ChildgrowthTab' })}>
              <VectorImage source={require('@assets/svg/ic_growth_color.svg')} />
              <ToolBoxText>
              <Heading3Center>{t('homeScreencg')}</Heading3Center>
              </ToolBoxText>
            </ToolPress>
          </ToolBox>
        </MainContainer>  
        </FeatureDivideArea>
      </BgSecondaryTint>
      {/* <ContainerView>
        <View>
          <Text>{t('homeScreentoolsHeader')}</Text>
          <ScrollView style={{ flex: 1, flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
            
          </ScrollView>
        </View>
      </ContainerView> */}
    </>
  );
};

export default Tools;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    // margin: 3,
    // padding: 10,
    // width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // title: {
  //   fontSize: 16,
  //   padding: 5,
  //   width: 100,
  //   fontWeight: 'bold',
  //   textAlign: 'center'
  // },
})