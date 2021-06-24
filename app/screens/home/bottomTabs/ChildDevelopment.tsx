import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Icon from '@components/shared/Icon';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3, Heading5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';

type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  const {t} = useTranslation();
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
            title={t('developScreen.headerTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4, backgroundColor: backgroundColor}}>
            <View>
              <View style={{flexDirection: 'column'}}></View>
              <AgeBrackets
                itemColor={backgroundColor}
                activatedItemColor={headerColor}
              />
              <View>
                <Image
                  source={require('@assets/trash/card2.jpeg')}
                  style={{width: '100%'}}
                />
              </View>
              <View style={{padding: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Heading3>3rd and 4th Month </Heading3>
                  <Text style={{backgroundColor: headerColor, padding: 2}}>
                    {t('developScreen.prematureText')}
                  </Text>
                </View>
                <Heading2>
                  The Period of Diverse Experiences{'        '}
                  <Icon name="ic_info" size={15} color="#000" />
                </Heading2>
              </View>
              <View style={{marginVertical: 10, marginHorizontal: 15}}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Icon
                      name="ic_incom"
                      size={25}
                      color="#FFF"
                      style={{backgroundColor: 'red', borderRadius: 150}}
                    />
                    <Heading5>{t('developScreen.chartLabel')}</Heading5>
                  </View>
                  <Heading3>{t('developScreen.chartText')}</Heading3>
                </View>
              </View>
              <Heading3>{t('developScreen.mileStoneQ')}</Heading3>
              <View style={{marginVertical: 10, marginHorizontal: 15,padding:20,backgroundColor:'#FFF'}}>
              <Heading5>{t('developScreen.tipsText')}</Heading5>
              <Heading3>Watch your baby's behaviour and talk to your paediatrician or visiting nurse if you notice that at the end of the first month you baby:</Heading3>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildDevelopment;
