import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonPrimary, ButtonText, ButtonTextMdLine } from '@components/shared/ButtonGlobal';
import { BannerContainer1, BgContainer } from '@components/shared/Container';
import { Flex1, Flex2, FlexDirCol, FlexDirColStart, FlexDirRowEnd, FlexDirRowSpace, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import { PrematureTagGrowth } from '@components/shared/PrematureTag';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3, Heading3Centerr, Heading4,
  Heading4Center, Heading4Regular, Heading5, Heading5Bold, Paragraph, ShiftFromBottom5, ShiftFromTop10, ShiftFromTop20, ShiftFromTopBottom20, SideSpacing10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ChildgrowthNavigationProp,
  'AddNewChildgrowth'
};
const Childgrowth = ({navigation}: Props) => {
  const {t} = useTranslation();
  const data = [
    {title: t('growthScreenweightForHeight')},
    {title: t('growthScreenheightForAge')},
  ];
  const [childmeasures, setChildmeasures] = React.useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const renderItem = (item: typeof data[0], index: number) => {
    return (
      <>
        <View style={{padding: 100}}>
          <Heading2>Graph for {item.title}</Heading2>
        </View>
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TabScreenHeader
            title={t('growthScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              padding: 15,
              maxHeight: '100%',
            }}>
            {childmeasures.length == 0 ? (
              <FlexDirCol>
                <Pressable
                  onPress={() => {
                    setChildmeasures([1]);
                  }}>
                    <ShiftFromBottom5>
                  <Heading3>
                    {t('growthScreengrowthDataTitle', {childAge: 3})}
                  </Heading3>
                  </ShiftFromBottom5>
                </Pressable>
                <Heading3Centerr>
                  {t('growthScreennoGrowthData')}
                </Heading3Centerr>
                <ShiftFromTopBottom20>
                <Heading4>{t('growthScreennoGrowthDataHelpText')}</Heading4>
                </ShiftFromTopBottom20>
              </FlexDirCol>
            ) : (
              <View>
                <Paragraph>
                  {
                    'In the second year, the growth is intense, but it slows down slightly compared to the first year, so now children gain an average of ten centimeters (1 cm per month). As a result, appetite decreases, which is a normal occurrence.'
                  }
                </Paragraph>
                
          <BannerContainer1>
            <FlexDirRowSpace>
              <Heading3>{t('growthScreensubHeading')}</Heading3>
              <PrematureTagGrowth>
                <Heading5Bold>
                  {t('developScreenprematureText')}
                </Heading5Bold>
              </PrematureTagGrowth>
            </FlexDirRowSpace>
            
            <FlexFDirRowSpace>
              <Heading5>
                {/* {' '} */}
                {t('growthScreenlastMeasureText', {measureDate: '13th Nov,2019',})}
              </Heading5>
              <Pressable
                onPress={() =>
                  navigation.navigate('AllChildgrowthMeasures')
                }>
                <ButtonTextMdLine>
                  {t('growthScreenallMeasureHeader')}
                </ButtonTextMdLine>
              </Pressable>
            </FlexFDirRowSpace>

           
            <ShiftFromTop20>
            <FlexDirRowSpace>
              <Flex2> 
                <FlexDirRowSpace>
                <FlexDirColStart>
                  <Heading4Regular>
                  {t('growthScreenwText')}
                  </Heading4Regular>
                  <Heading2>
                  8 {t('growthScreenkgText')}
                  </Heading2>
                </FlexDirColStart>
               
                <FlexDirColStart>
                  <Heading4Regular>
                  {t('growthScreenhText')}
                  </Heading4Regular>
                  <Heading2>
                  73 {t('growthScreencmText')}
                  </Heading2>
                </FlexDirColStart>
                </FlexDirRowSpace>
              </Flex2>
              <Flex1>
              <Pressable
                        onPress={() => {
                          navigation.navigate('AddNewChildgrowth', {
                            headerTitle: t('growthScreeneditNewBtntxt'),
                          });
                        }}>
                          <FlexDirRowEnd>
                        <ButtonTextMdLine>
                          {t('growthScreeneditText')}
                        </ButtonTextMdLine>
                        </FlexDirRowEnd>
                      </Pressable>
              </Flex1>
            </FlexDirRowSpace>
            </ShiftFromTop20>
          </BannerContainer1>
                
                <BgContainer>
                 
                    <TabBarContainer
                      style={{
                        maxHeight: 50,
                      }}>
                      {data.map((item, itemindex) => {
                        return (
                          <Pressable
                            key={itemindex}
                            style={{flex: 1}}
                            onPress={() => {
                              setSelectedIndex(itemindex);
                            }}>
                            <TabBarDefault
                              style={[
                                {
                                  backgroundColor:
                                    itemindex == selectedIndex
                                      ? headerColor
                                      : backgroundColor,
                                },
                              ]}>
                              <Heading4Center>{item.title}</Heading4Center>
                            </TabBarDefault>
                          </Pressable>
                        );
                      })}
                    </TabBarContainer>

                    <SideSpacing10>
                      {renderItem(data[selectedIndex], selectedIndex)}
                      <Heading2>{t('growthScreensumHeading')}</Heading2>
                      <Paragraph>
                        [Child growth progress text] [Child growth progress
                        text] [Child growth progress text] [Child growth
                        progress text] [Child growth progress text] [Child
                        growth progress text]
                      </Paragraph>
                    </SideSpacing10>
                  
                </BgContainer>
                <View style={{flex: 1,padding: 5,marginVertical:10}}>
                  {/* <RelatedArticles/> */}
                </View>
              </View>
            )}
          </ScrollView>

          <ButtonContainer
            style={{backgroundColor: backgroundColor}}>
            <ShiftFromTop10>
              <ButtonPrimary
                style={{backgroundColor: headerColor}}
                onPress={() => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreenaddNewBtntxt'),
                  });
                }}>
                <ButtonText>{t('growthScreenaddNewBtntxt')}</ButtonText>
              </ButtonPrimary>
              </ShiftFromTop10>
          </ButtonContainer>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Childgrowth;
