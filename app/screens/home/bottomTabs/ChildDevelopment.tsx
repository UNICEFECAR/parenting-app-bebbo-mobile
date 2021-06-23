import AgeBrackets from '@components/AgeBrackets';
import CollapsibleItem from '@components/CollapsibleItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Icon from '@components/shared/Icon';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3, Heading5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components';

type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  const cditems = [
    {
      id: 0,
      title: 'Laughs at a human face',
    },
    {
      id: 1,
      title: "Carefully observes people's face",
    },
    {
      id: 2,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 3,
      title: 'Begins a mimic facial movements and expressions, as well as sound',
    },
    {
      id: 4,
      title: "Carefully observes people's face",
    },
    {
      id: 5,
      title: "Shows that she is angry or happy",
    },
    {
      id: 6,
      title: "Begins a mimic facial movements and expressions, as well as soundy",
    },
  ];
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  const {t} = useTranslation();
  const renderItem = (item: typeof cditems[0]) => (
    <CollapsibleItem item={item} subItemSaperatorColor={headerColor}/>
  );
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
          <ScrollView style={{flex: 4, backgroundColor: backgroundColor}}  nestedScrollEnabled={true}>
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
                  The Period of Diverse Experiences
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
              <FlatList
                data={cditems}
                renderItem={({item, index}) => renderItem(item)}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
              />
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                  padding: 20,
                  backgroundColor: '#FFF',
                }}>
                <Heading5>{t('developScreen.tipsText')}</Heading5>
                <Heading3>
                  Watch your baby's behaviour and talk to your paediatrician or
                  visiting nurse if you notice that at the end of the first
                  month you baby:
                </Heading3>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildDevelopment;
