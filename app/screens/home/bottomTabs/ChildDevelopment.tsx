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
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native';
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
      title:
        'Begins a mimic facial movements and expressions, as well as sound',
    },
    {
      id: 4,
      title: "Carefully observes people's face",
    },
    {
      id: 5,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 6,
      title:
        'Begins a mimic facial movements and expressions, as well as soundy',
    },
  ];
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const {t} = useTranslation();
  const onPressInfo = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  };
  const renderItem = (item: typeof cditems[0]) => (
    <CollapsibleItem item={item} subItemSaperatorColor={headerColor} />
  );
  const ContentThatGoesBelowTheFlatList = () => {
    return (
      <>
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 15,
            padding: 20,
            backgroundColor: '#FFF',
          }}>
          <Heading5>{t('developScreentipsText')}</Heading5>
          <Heading3>
            Watch your baby's behaviour and talk to your paediatrician or
            visiting nurse if you notice that at the end of the first month you
            baby:
          </Heading3>
        </View>
      </>
    );
  };
  const ContentThatGoesAboveTheFlatList = () => {
    return (
      <>
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
              {t('developScreenprematureText')}
            </Text>
          </View>
          <Heading2>
            The Period of Diverse Experiences
            <Pressable onPress={onPressInfo}>
              <Icon name="ic_info" size={15} color="#000" />
            </Pressable>
          </Heading2>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginVertical: 10,
            marginHorizontal: 15,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="ic_incom"
              size={25}
              color="#FFF"
              style={{backgroundColor: 'red', borderRadius: 150}}
            />
            <Heading5>{t('developScreenchartLabel')}</Heading5>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Heading3 style={{flex: 8}}>{t('developScreenchartText')}</Heading3>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 44 / 2,
                backgroundColor: headerColor,
                flex: 1,
              }}></View>
          </View>
        </View>
        <Heading3 style={{paddingHorizontal: 15}}>
          {t('developScreenmileStoneQ')}
        </Heading3>
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
            title={t('developScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <View style={{flex: 4, backgroundColor: backgroundColor}}>
            <View>
              <FlatList
                data={cditems}
                renderItem={({item, index}) => renderItem(item)}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                ListFooterComponent={ContentThatGoesBelowTheFlatList}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildDevelopment;
