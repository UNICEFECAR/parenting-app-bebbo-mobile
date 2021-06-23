import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Center,
  Heading5,
  Paragraph
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ChildgrowthNavigationProp;
  AddNewChildgrowth;
};
const Childgrowth = ({navigation}: Props) => {
  const {t} = useTranslation();
  const data = [
    {title: t('growthScreen.weightForHeight')},
    {title: t('growthScreen.heightForAge')},
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
            title={t('growthScreen.headerTitle')}
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
              <View style={{alignItems: 'center'}}>
                <Pressable
                  onPress={() => {
                    setChildmeasures([1]);
                  }}>
                  <Heading3>
                    {t('growthScreen.growthDataTitle', {childAge: 3})}
                  </Heading3>
                </Pressable>
                <Heading3Regular>
                  {t('growthScreen.noGrowthData')}
                </Heading3Regular>
                <Heading4>{t('growthScreen.noGrowthDataHelpText')}</Heading4>
              </View>
            ) : (
              <View>
                <Paragraph>
                  {
                    'In the second year, the growth is intense, but it slows down slightly compared to the first year, so now children gain an average of ten centimeters (1 cm per month). As a result, appetite decreases, which is a normal occurrence.'
                  }
                </Paragraph>
                <View
                  style={{
                    padding: 10,
                    backgroundColor: '#FFF',
                    marginBottom: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Heading3>{t('growthScreen.subHeading')}</Heading3>
                    <Text style={{backgroundColor: headerColor, padding: 2}}>
                      {t('growthScreen.prematureText')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Heading5>
                      {' '}
                      {t('growthScreen.lastMeasureText', {
                        measureDate: '13th Nov,2019',
                      })}
                    </Heading5>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('AllChildgrowthMeasures')
                      }>
                      <Text
                        style={{padding: 2, textDecorationLine: 'underline'}}>
                        {t('growthScreen.allMeasureHeader')}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column', flex: 2}}>
                      <Paragraph>{t('growthScreen.wText')}</Paragraph>
                      <Heading2 style={{padding: 2}}>
                        8 {t('growthScreen.kgText')}
                      </Heading2>
                    </View>
                    <View style={{flexDirection: 'column', flex: 2}}>
                      <Paragraph>{t('growthScreen.hText')}</Paragraph>
                      <Heading2 style={{padding: 2}}>
                        73 {t('growthScreen.cmText')}
                      </Heading2>
                    </View>
                    <View style={{flex: 2, flexDirection: 'row'}}>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('AddNewChildgrowth', {
                            headerTitle: t('growthScreen.editNewBtntxt'),
                          });
                        }}>
                        <Text
                          style={{padding: 2, textDecorationLine: 'underline'}}>
                          {t('growthScreen.editText')}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={{backgroundColor: '#FFF'}}>
                  <View style={{flexDirection: 'column', flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#FFF',
                        justifyContent: 'center',
                        flex: 1,
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
                            <View
                              style={[
                                {
                                  backgroundColor:
                                    itemindex == selectedIndex
                                      ? headerColor
                                      : backgroundColor,
                                  padding: 7,
                                  margin: 3,
                                },
                              ]}>
                              <Heading4Center>{item.title}</Heading4Center>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={{flex: 1, width: '100%', padding: 5}}>
                      {renderItem(data[selectedIndex], selectedIndex)}
                      <Heading2>{t('growthScreen.sumHeading')}</Heading2>
                      <Paragraph>
                        [Child growth progress text] [Child growth progress
                        text] [Child growth progress text] [Child growth
                        progress text] [Child growth progress text] [Child
                        growth progress text]
                      </Paragraph>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View
            style={{flex: 1, backgroundColor: backgroundColor, maxHeight: 100}}>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary
                style={{backgroundColor: headerColor}}
                onPress={() => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreen.addNewBtntxt'),
                  });
                }}>
                <ButtonText>{t('growthScreen.addNewBtntxt')}</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Childgrowth;
