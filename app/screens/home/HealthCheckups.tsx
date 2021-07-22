import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import PreviousHealthCheckup from '@components/healthChekup/PreviousHealthCheckup';
import UpcomingHealthCheckup from '@components/healthChekup/UpcomingHealthCheckup';
import {
  ButtonContainerAuto,
  ButtonHealth, ButtonText, ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2Center, Heading4Center, ShiftFromBottom20, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { getAllHealthCheckupPeriods } from '../../services/healthCheckupService';

type HealthCheckupsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const {t} = useTranslation();
  let {upcomingPeriods,previousPeriods,sortedGroupsForPeriods,totalPreviousVaccines,totalUpcomingVaccines,currentPeriod} = getAllHealthCheckupPeriods();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <View>
          {upcomingPeriods?.map((item, itemindex) => {
            return (
              <UpcomingHealthCheckup
                item={item}
                currentPeriodId={currentPeriod?.id}
                key={itemindex}
                headerColor={headerColor}
                backgroundColor={backgroundColor}
              />
            );
          })}
        </View>
      );
    } else if (index === 1) {
      return (
        <View>
          {previousPeriods?.map((item, itemindex) => {
            return (
              <PreviousHealthCheckup
                item={item}
                key={itemindex}
                headerColor={headerColor}
                backgroundColor={backgroundColor}
              />
            );
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
            title={t('hcHeader')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <MainContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromBottom20>
                <Heading2Center>{t('hcSummaryHeader')}</Heading2Center>
                </ShiftFromBottom20>
              <ButtonTextSmLine>{t('hcReminderbtn')}</ButtonTextSmLine>

              <ButtonContainerAuto>
                <ButtonHealth
                  
                  onPress={
                    () => 
                    navigation.navigate('AddChildHealthCheckup', {
                      headerTitle: t('hcNewHeaderTitle')
                    })
                  }>
                  <ButtonText>{t('hcNewBtn')}</ButtonText>
                </ButtonHealth>
              </ButtonContainerAuto>
            </MainContainer>

            <TabBarContainer
              >
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

export default HealthCheckups;
