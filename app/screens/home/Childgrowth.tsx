import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import ChartHeightForAge from '@components/growth/ChartHeightForAge';
import ChartWeightForHeight from '@components/growth/ChartWeightForHeight';
import GrowthIntroductory from '@components/growth/GrowthIntroductory';
import LastChildMeasure from '@components/growth/LastChildMeasure';
import BabyNotification from '@components/homeScreen/BabyNotification';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import {
  BgContainer,
  MainContainer,
  SafeAreaContainer
} from '@components/shared/Container';
import { FlexCol, FlexDirCol } from '@components/shared/FlexBoxStyle';
import {
  TabBarContainerBrd,
  TabBarDefault
} from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading3,
  Heading3Centerr,
  Heading4,
  Heading4Center,
  ShiftFromBottom5,
  ShiftFromTop10,
  ShiftFromTopBottom20,
  SideSpacing10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';

type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildgrowthNavigationProp;
  AddNewChildgrowth;
};
const Childgrowth = ({navigation}: Props) => {
  const {t} = useTranslation();
  const data = [
    {title: t('growthScreenweightForHeight')},
    {title: t('growthScreenheightForAge')},
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const standardDevData = useAppSelector((state: any) =>
    JSON.parse(state.utilsData.taxonomy.standardDevData),
  );
  // console.log(standardDevData,"statestandardDevData")
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const renderDummyChart = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 4,
            alignItems: 'center',
            margin: 15,
            padding: 15,
          }}>
          <VectorImage source={require('@assets/svg/chart.svg')} />
        </View>
      </>
    );
  };
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexCol>
          <TabScreenHeader
            title={t('growthScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              maxHeight: '100%',
            }}>
            <BabyNotification />
            {activeChild.measures.length == 0 ? (
              <>
                <FlexDirCol>
                  <ShiftFromBottom5>
                    <Heading3 style={{marginTop:15}}>
                      {t('babyNotificationbyAge', {
                        childName:
                          activeChild.childName != null &&
                          activeChild.childName != '' &&
                          activeChild.childName != undefined
                            ? activeChild.childName
                            : '',
                        ageInMonth:
                          activeChild.birthDate != null &&
                          activeChild.birthDate != '' &&
                          activeChild.birthDate != undefined
                            ? getCurrentChildAgeInMonths(
                                t,
                                activeChild.birthDate,
                              )
                            : '',
                      })}

                      {/* {t('growthScreengrowthDataTitle', {childAge: 3})} */}
                    </Heading3>
                  </ShiftFromBottom5>

                  {activeChild.measures.length == 0 ? (
                    <Heading3Centerr>
                      {t('growthScreennoGrowthData')}
                    </Heading3Centerr>
                  ) : null}
                  <ShiftFromTopBottom20>
                    <Heading4>{t('growthScreennoGrowthDataHelpText')}</Heading4>
                  </ShiftFromTopBottom20>
                </FlexDirCol>
                {renderDummyChart()}
              </>
            ) : (
              <MainContainer>
                <GrowthIntroductory activeChild={activeChild} />

                <LastChildMeasure />

                <>
                  <BgContainer>
                    <TabBarContainerBrd
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
                    </TabBarContainerBrd>

                    <SideSpacing10>
                      {selectedIndex == 0 ? (
                      <ChartWeightForHeight />
                      ): null}
                      {selectedIndex == 1 ? (
                      <ChartHeightForAge />
                      ): null}
                    </SideSpacing10>
                  </BgContainer>
                </>

                <View style={{flex: 1}}>
                  {/* <RelatedArticles related_articles={[]} category={"5"} currentId={0} headerColor={headerColor} backgroundColor={backgroundColor} listCategoryArray={[]} navigation={navigation}/> */}
                </View>
              </MainContainer>
            )}
          </ScrollView>

          <ButtonContainer style={{backgroundColor: backgroundColor}}>
            <ShiftFromTop10>
              <ButtonPrimary
                disabled={isFutureDate(activeChild?.birthDate)}
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
        </FlexCol>
      </SafeAreaContainer>
    </>
  );
};

export default Childgrowth;
