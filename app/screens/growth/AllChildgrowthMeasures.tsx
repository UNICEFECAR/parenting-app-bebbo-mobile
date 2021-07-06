import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonTextMdLine } from '@components/shared/ButtonGlobal';
import { FDirRow, Flex1, Flex2, FlexDirCol, FlexDirColStart, FlexDirRowEnd, FlexDirRowSpace, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading2w, Heading3, Heading4Regular, Heading5, Paragraph, ShiftFromTop20,ShiftFromTop10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { ThemeContext } from 'styled-components/native';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AllChildgrowthMeasures = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const {t} = useTranslation();
  const DATA = [
    {
      duration: '2 Months',
      measurementDate: new Date(),
      weight: 5,
      length: 50,
    },
    {
      duration: 'Birth',
      measurementDate: new Date(),
      weight: 3.5,
      length: 40,
    },
  ];
  const data = [
    {
      title: '5 month',
      weight: 8,
      height: 73,
      measureDate: ' 1 may 2020',
    },
    {
      title: '2.5 month',
      weight: 8,
      height: 63,
      measureDate: ' 1 Feb 2020',
    },
    {
      title: '2 month',
      weight: 8,
      height: 48,
      measureDate: ' 14 Jan 2020',
    },
    {
      title: '1 month',
      weight: 8,
      height: 39,
      measureDate: ' 14 Dec 2019',
    },
    {
      title: 'Born',
      weight: 8,
      height: 30,
      measureDate: ' 13 Nov 2019',
    },
  ];
  const renderDetail = (rowData, sectionID, rowID) => {
    let title = (
      <FDirRow>
        <Heading3>{rowData.title}</Heading3>
        <Heading5>{rowData.measureDate}</Heading5>
      </FDirRow>
    );

    return (
      
      <Flex1>
        {title}
        <ShiftFromTop10>
            <FlexDirRowSpace>
              <Flex2> 
                <FlexFDirRowSpace>
                <FlexDirColStart>
                  <Heading4Regular>
                  {t('growthScreenwText')}
                  </Heading4Regular>
                  <Heading2>
                  {rowData.weight} {t('growthScreenkgText')}
                  </Heading2>
                </FlexDirColStart>
               
                <FlexDirColStart>
                  <Heading4Regular>
                  {t('growthScreenhText')}
                  </Heading4Regular>
                  <Heading2>
                  {rowData.height} {t('growthScreencmText')}
                  </Heading2>
                </FlexDirColStart>
                </FlexFDirRowSpace>
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
            </ShiftFromTop10>
      </Flex1>
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 9, padding: 7}}>
              <Heading2>
                {t('growthScreenallMeasureHeader')}
              </Heading2>
            </View>
          </View>
          <View
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              padding: 20,
              paddingLeft:5,
              maxHeight: '100%',
            }}>
            <Timeline
              data={data}
              circleSize={20}
              // circleStyle={{marginTop:13,}}
              // renderFullLine={true}
              circleColor={headerColor}
              lineColor="#000"
              showTime={false}
              lineWidth={1}
              descriptionStyle={{color: 'gray'}}
              renderDetail={renderDetail}
              innerCircle={'icon'}
              iconDefault={<Icon name={'ic_tick'} color="#000" size={10} />}
              
              eventDetailStyle={{
                backgroundColor: '#FFF',
                marginBottom: 10,
                padding: 15,borderRadius:4,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AllChildgrowthMeasures;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 65,
//     backgroundColor: 'white',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
