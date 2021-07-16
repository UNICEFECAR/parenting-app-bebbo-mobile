import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import LastChildMeasure from '@components/growth/LastChildMeasure';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { BgContainer } from '@components/shared/Container';
import { FlexDirCol } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Centerr,
  Heading4,
  Heading4Center, Paragraph,
  ShiftFromBottom5,
  ShiftFromTop10, ShiftFromTopBottom20,
  SideSpacing10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';

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
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
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
            {activeChild.measures.length == 0 ? (
              <FlexDirCol>
                <ShiftFromBottom5>
                  <Heading3>
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
                          ? getCurrentChildAgeInMonths(t, activeChild.birthDate)
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
            ) : (
              <View>
                <Paragraph>
                  {
                    'In the second year, the growth is intense, but it slows down slightly compared to the first year, so now children gain an average of ten centimeters (1 cm per month). As a result, appetite decreases, which is a normal occurrence.'
                  }
                </Paragraph>

               <LastChildMeasure activeChild={activeChild}/>

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
                      [Child growth progress text] [Child growth progress text]
                      [Child growth progress text] [Child growth progress text]
                      [Child growth progress text] [Child growth progress text]
                    </Paragraph>
                  </SideSpacing10>
                </BgContainer>
                <View style={{flex: 1, padding: 5, marginVertical: 10}}>
                  {/* <RelatedArticles related_articles={[]} category={"5"} currentId={0} headerColor={headerColor} backgroundColor={backgroundColor} listCategoryArray={[]} navigation={navigation}/> */}
                </View>
              </View>
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
        </View>
      </SafeAreaView>
    </>
  );
};

export default Childgrowth;
