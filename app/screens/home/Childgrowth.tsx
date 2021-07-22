import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import GrowthChart, { chartTypes } from '@components/growth/GrowthChart';
import GrowthInterpretation from '@components/growth/GrowthInterpretation';
import GrowthIntroductory from '@components/growth/GrowthIntroductory';
import LastChildMeasure from '@components/growth/LastChildMeasure';
import BabyNotification from '@components/homeScreen/BabyNotification';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { FlexDirCol } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Centerr,
  Heading4,
  Heading4Center,
  ShiftFromBottom5,
  ShiftFromTop10,
  ShiftFromTopBottom20
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';
import { formatDaysData, formatHeightData } from '../../services/growthService';
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
  const [relatedArticles, setrelatedArticles] = React.useState<any[]>([]);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  console.log(activeChild,"activeChild");
  const standardDevData = useAppSelector((state: any) =>
    JSON.parse(state.utilsData.taxonomy.standardDevData),
  );
  // console.log(standardDevData,"statestandardDevData")
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const fullScreenChart = (chartType, obj, standardDeviation) => {
    // console.log((activeChild,chartType,obj,standardDeviation));
    navigation.navigate('ChartFullScreen', {
      activeChild,
      chartType,
      obj,
      standardDeviation,
    });
  };
  const renderItem = (item: typeof data[0], index: number) => {
    if (index == 0) {
      let obj;
      let standardDeviation;
      if (activeChild?.gender == '40' || activeChild?.gender == '') {
        //boy or no gender added
        // standardDeviation = require('../../assets/translations/appOfflineData/boystandardDeviation.json');
        const genderBoyData = standardDevData.filter(
          (item) => item.growth_type == 6461 && item.child_gender == 40,
        );
        standardDeviation = genderBoyData;
        obj = formatHeightData(genderBoyData);
      } else {
        //girl
        // standardDeviation = require('../../assets/translations/appOfflineData/girlstandardDeviation.json');
        const genderGirlData = standardDevData.filter(
          (item) => item.growth_type == 6461 && item.child_gender == 41,
        );
        standardDeviation = genderGirlData;
        obj = formatHeightData(genderGirlData);
      }
      const uniqueID = uuidv4();
      console.log(uniqueID,"uniqueID");
      return (
        <>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'column',
              backgroundColor: 'white',
              // paddingLeft: 20,
              // paddingTop: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Heading2>{item.title}</Heading2>
              <Pressable
                onPress={() =>
                  fullScreenChart(
                    chartTypes.weightForHeight,
                    obj,
                    standardDeviation,
                  )
                }>
                <Icon name="ic_fullscreen" size={16} />
              </Pressable>
            </View>

            <GrowthChart
              activeChild={activeChild}
              chartType={chartTypes.weightForHeight}
              bgObj={obj}
              standardDeviation={standardDeviation}
            />
            <GrowthInterpretation
              activeChild={activeChild}
              chartType={chartTypes.weightForHeight}
              standardDeviation={standardDeviation}
              getrelatedArticles={setrelatedArticles}
            />
          </View>
          {/* 5 is growth category id */}
          <RelatedArticles
            fromScreen={'ChildgrowthTab'}
            related_articles={relatedArticles}
            category={5}
            currentId={uniqueID}
            headerColor={headerColor}
            backgroundColor={backgroundColor}
            navigation={navigation}
          />
        </>
      );
    } else if (index == 1) {
      let obj;
      let standardDeviation;
      if (activeChild?.gender == '40' || activeChild?.gender == '') {
        // standardDeviation = require('../../assets/translations/appOfflineData/boystandardDeviation.json');
        const genderBoyData = standardDevData.filter(
          (item) => item.growth_type == 32786 && item.child_gender == 40,
        );
        standardDeviation = genderBoyData;
        // console.log(standardDeviation,"standardDeviation");
        obj = formatDaysData(genderBoyData);
      } else {
        // standardDeviation = require('../../assets/translations/appOfflineData/girlstandardDeviation.json');
        const genderGirlData = standardDevData.filter(
          (item) => item.growth_type == 32786 && item.child_gender == 41,
        );
        standardDeviation = genderGirlData;
        obj = formatDaysData(genderGirlData);
      }
      const uniqueID = uuidv4();
      console.log(uniqueID,"uniqueID");
      return (
        <>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'column',
              backgroundColor: 'white',
              // paddingLeft: 20,
              // paddingTop: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Heading2>{item.title}</Heading2>
              <Pressable
                onPress={() =>
                  fullScreenChart(
                    chartTypes.heightForAge,
                    obj,
                    standardDeviation,
                  )
                }>
                <Icon name="ic_fullscreen" size={16} />
              </Pressable>
            </View>
            <GrowthChart
              activeChild={activeChild}
              chartType={chartTypes.heightForAge}
              bgObj={obj}
              standardDeviation={standardDeviation}
            />
            <GrowthInterpretation
              activeChild={activeChild}
              chartType={chartTypes.heightForAge}
              standardDeviation={standardDeviation}
              getrelatedArticles={setrelatedArticles}
            />
          </View>
          {/* 5 is growth category id */}
          <RelatedArticles
            fromScreen={'ChildgrowthTab'}
            related_articles={relatedArticles}
            category={5}
            currentId={uniqueID}
            headerColor={headerColor}
            backgroundColor={backgroundColor}
            navigation={navigation}
          />

          {/*  */}
        </>
      );
    }
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
              maxHeight: '100%',
            }}>
            <BabyNotification />
            {activeChild.measures.length == 0 ? (
              <>
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
              <View style={{padding: 15}}>
                <GrowthIntroductory activeChild={activeChild} />

                <LastChildMeasure activeChild={activeChild} />

                <View>
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

                  <View>{renderItem(data[selectedIndex], selectedIndex)}</View>
                </View>

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
