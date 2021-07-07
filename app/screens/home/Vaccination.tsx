import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { MainContainer } from '@components/shared/Container';
import { Flex1, FlexDirRow, FlexDirRowAround, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer, VacSummaryBox } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import PreviousVaccines from '@components/vaccination/PreviousVaccines';
import UpcomingVaccines from '@components/vaccination/UpcomingVaccines';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    Heading2,
    Heading3,
    Heading4,
    Heading4Center,
    Heading4Regular,
    Paragraph,
    ShiftFromTopBottom5
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
type VaccinationNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: VaccinationNavigationProp;
};
const Vaccination = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const {t} = useTranslation();
  const vcitems = [
    {
      id: 0,
      title: 'With 3-5 Months',
      totalVc: 5,
      doneVc: 0,
    },
    {
      id: 1,
      title: 'With Full 5 months',
      totalVc: 6,
      doneVc: 2,
    },
    {
      id: 2,
      title: 'With Full 6 months',
      totalVc: 8,
      doneVc: 1,
    },
    {
      id: 3,
      title: 'With full 9 months',
      totalVc: 7,
      doneVc: 3,
    },
  ];
  const prevVcitems = [
    {
      id: 0,
      title: 'At Birth',
      totalVc: 5,
      doneVc: 5,
    },
    {
      id: 1,
      title: 'With Full 1 months',
      totalVc: 6,
      doneVc: 2,
    },
    {
      id: 2,
      title: 'With Full 2 months',
      totalVc: 8,
      doneVc: 8,
    },
    {
      id: 3,
      title: 'With full 3 months',
      totalVc: 7,
      doneVc: 3,
    },
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <View>
          {vcitems.map((item, itemindex) => {
            return <UpcomingVaccines item={item} key={itemindex} headerColor={headerColor} backgroundColor={backgroundColor}/>;
          })}
        </View>
      );
    } else if (index === 1) {
      return (
        <View>
          {prevVcitems.map((item, itemindex) => {
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
              <VacSummaryBox>
              <Heading2>22</Heading2>
                    <Heading4Regular>{t('vcStatus1')}</Heading4Regular>
              </VacSummaryBox>
              <VacSummaryBox>

              <Heading2>4</Heading2>
              <Heading4Regular>{t('vcStatus2')}</Heading4Regular>
              </VacSummaryBox>
              <VacSummaryBox>

              <Heading2>42</Heading2>
              <Heading4Regular>{t('vcStatus3')}</Heading4Regular>
              </VacSummaryBox>
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
              
            <Flex1>
              {renderItem(selectedIndex)}
            </Flex1>
          </ScrollView>
        </ToolsBgContainer>
      </SafeAreaView>
    </>
  );
};

export default Vaccination;
