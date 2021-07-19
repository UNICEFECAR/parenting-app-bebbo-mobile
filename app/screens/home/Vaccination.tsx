import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { MainContainer } from '@components/shared/Container';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer, VacSummaryBox } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import PreviousVaccines from '@components/vaccination/tabs/PreviousVaccines';
import UpcomingVaccines from '@components/vaccination/tabs/UpcomingVaccines';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3, Heading4Center,
  Heading4Regular, ShiftFromTopBottom10,
  ShiftFromTopBottom5
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
type VaccinationNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: VaccinationNavigationProp;
};
const Vaccination = ({navigation}: Props) => {

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const [childageInDays, setChildageInDays] = React.useState<number>(0);
  const [previousPeriods, setPreviousPeriods] = React.useState<any>();
  const [upcomingPeriods, setUpcomingPeriods] = React.useState<any>();
  const {t} = useTranslation();
  const allVaccineData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // const taxonomy = useAppSelector(
  //   (state: any) =>
  //     (state.utilsData.taxonomy?.allTaxonomyData!="" ?JSON.parse(state.utilsData.taxonomy?.allTaxonomyData): {}),
  // );
  // console.log(taxonomy,taxonomy.growth_period);
  //use this growth period to get the correct data of vaccines
const findVaccinesForPeriod =(periodID)=>{
  return allVaccineData.filter(item => item.growth_period == Number(periodID));
}
  const localgrowthPeriod = taxonomydata['en'][0].allData.growth_period;
  // console.log(localgrowthPeriod,"localVaccinePeriods");
  let sortedlocalgrowthPeriod = [...localgrowthPeriod].sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  sortedlocalgrowthPeriod.forEach(period => {
    period.vaccines = findVaccinesForPeriod(period.id)
    period.doneVc = 0
  })
  console.log(sortedlocalgrowthPeriod,"sortedlocalgrowthPeriod",allVaccineData);
 
  useFocusEffect(
    React.useCallback(() => {
      if (activeChild?.birthDate) {
        let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
        const childAgeIndays = (Math.round(DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days));
        console.log(childAgeIndays,"childAgeIndays");
        setChildageInDays(childAgeIndays)
        // const previousPeriods = sortedlocalgrowthPeriod.filter((period: any) =>period.vaccination_opens <=childageInDays);
        // const upcomingPeriods = sortedlocalgrowthPeriod.filter((period: any) =>period.vaccination_opens > childageInDays);
        // const currentPeriod = upcomingPeriods[0];
        // setUpcomingPeriods(upcomingPeriods);
        // setPreviousPeriods(previousPeriods);
        // console.log(previousPeriods,upcomingPeriods,allVaccineData);
      }
    }, [activeChild,taxonomydata]),
  );

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  const renderItem = (index: number) => {
    if (index === 0) {
      const previousPeriods = sortedlocalgrowthPeriod.filter((period: any) =>period.vaccination_opens <=childageInDays);
// console.log(previousPeriods);
      return (
        <View>
          {previousPeriods.map((item, itemindex) => {
            return <UpcomingVaccines item={item} key={itemindex} headerColor={headerColor} backgroundColor={backgroundColor}/>;
          })}
        </View>
      );
    } else if (index === 1) {
      const upcomingPeriods = sortedlocalgrowthPeriod.filter((period: any) =>period.vaccination_opens > childageInDays);
      return (
        <View>
          {upcomingPeriods.map((item, itemindex) => {
            return <PreviousVaccines item={item} key={itemindex} headerColor={headerColor} backgroundColor={backgroundColor}/>;
          })}
        </View>
      );
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title="Vaccination"
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <MainContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromTopBottom5>
            <Heading3>{t('vcSummaryHeader')}</Heading3>
            </ShiftFromTopBottom5>
            <View style={{flex:1,flexDirection:'row', justifyContent:'space-around'}}>	
            <Pressable onPress={()=>setSelectedIndex(0)}>
              <VacSummaryBox>
              <Heading2>22</Heading2>
                    <Heading4Regular>{t('vcStatus1')}</Heading4Regular>
              </VacSummaryBox>
              </Pressable>
              <Pressable onPress={()=>setSelectedIndex(1)}>
              <VacSummaryBox>

              <Heading2>4</Heading2>
              <Heading4Regular>{t('vcStatus2')}</Heading4Regular>
              </VacSummaryBox>
              </Pressable>
              <Pressable onPress={()=>setSelectedIndex(1)}>
              <VacSummaryBox>

              <Heading2>42</Heading2>
              <Heading4Regular>{t('vcStatus3')}</Heading4Regular>
              </VacSummaryBox>
              </Pressable>
            </View>
            
            </MainContainer>
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
            <ShiftFromTopBottom10>
            <Flex1>
              {renderItem(selectedIndex)}
            </Flex1>
            </ShiftFromTopBottom10>
          </ScrollView>
        </ToolsBgContainer>
      </SafeAreaView>
    </>
  );
};

export default Vaccination;
