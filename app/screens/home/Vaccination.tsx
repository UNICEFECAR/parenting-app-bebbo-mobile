import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import PreviousVaccines from '@components/vaccination/PreviousVaccines';
import UpcomingVaccines from '@components/vaccination/UpcomingVaccines';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading4Center,
  Paragraph
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components';
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
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TabScreenHeader
            title="Vaccination"
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <View style={{backgroundColor: backgroundColor}}>
              <Heading3>{t('vcSummaryHeader')}</Heading3>
              <View style={{padding: 5}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      padding: 10,
                      margin: 5,
                      backgroundColor: '#FFF',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Heading2>22</Heading2>
                    <Paragraph>{t('vcStatus1')}</Paragraph>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      margin: 5,
                      backgroundColor: '#FFF',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Heading2>4</Heading2>
                    <Paragraph>{t('vcStatus2')}</Paragraph>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      margin: 5,
                      backgroundColor: '#FFF',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Heading2>42</Heading2>
                    <Paragraph>{t('vcStatus3')}</Paragraph>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#FFF',
                justifyContent: 'center',
                padding: 5,
              }}>
              {data.map((item, itemindex) => {
                return (
                  <Pressable
                    key={itemindex}
                    style={{flex: 1}}
                    onPress={() => {
                      setSelectedIndex(itemindex);
                    }}>
                    <View
                      style={[
                        {
                          backgroundColor:
                            itemindex == selectedIndex
                              ? headerColor
                              : backgroundColor,
                          padding: 10,
                          margin: 3,
                        },
                      ]}>
                      <Heading4Center>{item.title}</Heading4Center>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{flex: 1, width: '100%'}}>
              {renderItem(selectedIndex)}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Vaccination;
