import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import PreviousHealthCheckup from '@components/healthChekup/PreviousHealthCheckup';
import UpcomingHealthCheckup from '@components/healthChekup/UpcomingHealthCheckup';
import {
  ButtonContainerAuto,
  ButtonHealth,
    ButtonPrimary,
    ButtonText,
    ButtonTextLine,
    ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Flex1, FlexCol } from '@components/shared/FlexBoxStyle';
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

const vaccines = [
  {
    title:
      'Diphtheria, tetanus, pertussis, polio, influenzae type b- the second dose',
  },
  {
    title: 'Bacteria Streptococus pnuemoniae - the second dose',
  },
  {
    title:
      'Pneumococcal disease (PCV13) (1st dose) Rotavirus (RV)  ',
  },
  {
    title: 'Diphtheria, tetanus, and whooping cough (pertussis) (DTaP) (2nd dose)',
  },
];
  const upcominghcitems = [
    {
      id: 0,
      title: 'With 3-5 Months',
      measures: {weight: 5, height: 10},
      givenVaccines:vaccines,
      doctorRemarks: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias molestiae cum quia reprehenderit nisi dolor enim quibusdam eligendi unde in vel eveniet voluptates dolores maxime. Quos quas cumque eveniet."
    },
    {
      id: 1,
      title: 'With Full 5 months',
      measures: {weight: 6.5, height: 11},
      givenVaccines:[],
      doctorRemarks: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum vero laborum enim blanditiis sit nam amet eligendi, dignissimos a? Non ex voluptates tenetur dolore aliquid fugit distinctio nam. Odit, ullam!"

    },
    {
      id: 2,
      title: 'With Full 6 months',
      measures: null,
      givenVaccines:[],
      doctorRemarks:""
    },
    {
      id: 3,
      title: 'With full 9 months',
      measures: {weight: 8.5, height: 15},
      givenVaccines:vaccines,
      doctorRemarks: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dicta consequatur vitae obcaecati, dolore neque? Quaerat, excepturi nihil dicta, ad dolores deleniti similique perferendis quae alias reiciendis suscipit sequi nobis."
    },
  ];
  const prevVcitems = [
    
    {
      id: 2,
      title: 'With Full 6 months',
      measures: null,
      givenVaccines:[],
      doctorRemarks:""
    },

    {
      id: 1,
      title: 'With Full 5 months',
      measures: {weight: 6.5, height: 11},
      givenVaccines:[],
      doctorRemarks: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum vero laborum enim blanditiis sit nam amet eligendi, dignissimos a? Non ex voluptates tenetur dolore aliquid fugit distinctio nam. Odit, ullam!"

    },
    {
      id: 3,
      title: 'With full 9 months',
      measures: {weight: 8.5, height: 15},
      givenVaccines:vaccines,
      doctorRemarks: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dicta consequatur vitae obcaecati, dolore neque? Quaerat, excepturi nihil dicta, ad dolores deleniti similique perferendis quae alias reiciendis suscipit sequi nobis."
    },
    {
      id: 0,
      title: 'With 3-5 Months',
      measures: {weight: 5, height: 10},
      givenVaccines:vaccines,
      doctorRemarks: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias molestiae cum quia reprehenderit nisi dolor enim quibusdam eligendi unde in vel eveniet voluptates dolores maxime. Quos quas cumque eveniet."
    },
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <View>
          {upcominghcitems.map((item, itemindex) => {
            return (
              <UpcomingHealthCheckup
                item={item}
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
          {prevVcitems.map((item, itemindex) => {
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
