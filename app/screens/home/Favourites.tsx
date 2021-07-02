import styled from 'styled-components/native';
import FavActivities from '@components/FavActivities';
import FavArticles from '@components/FavArticles';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading4Centerw } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeContext } from 'styled-components/native';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { Flex1 } from '@components/shared/FlexBoxStyle';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

const Favourites = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const {t, i18n} = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const backgroundColor = themeContext.colors.PRIMARY_TINTCOLOR;

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [
    {title: t('articleScreenheaderTitle')},
    {title: t('actScreenheaderTitle')},
  ];
  const renderItem = (index: number) => {
    if(index===0){
    return (
      <>
       <FavArticles/>
      </>
    );
  } else if(index===1){
    return (
      <>
       <FavActivities/>
      </>
    );
  }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <TabScreenHeader
          title={t('favScreenHeader')}
          headerColor={headerColor}
          textColor="#FFF"
        />

        <TabBarContainer>
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
                  <Heading4Centerw>{item.title}</Heading4Centerw>
                </TabBarDefault>
              </Pressable>
            );
          })}
        </TabBarContainer>

        <Flex1>
          {renderItem(selectedIndex)}
        </Flex1>
      </SafeAreaView>
    </>
  );
};
export default Favourites;
