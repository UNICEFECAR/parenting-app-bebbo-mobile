import styled from 'styled-components/native';
import FavActivities from '@components/FavActivities';
import FavArticles from '@components/FavArticles';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading4Centerw,Heading4Center, ShiftFromBottom10,ShiftFromBottom5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeContext } from 'styled-components/native';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import { useFocusEffect } from '@react-navigation/native';
type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

const Favourites = ({navigation, route}: Props) => {
  const themeContext = useContext(ThemeContext);
  const {t, i18n} = useTranslation();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const headerColorBlack = themeContext.colors.PRIMARY_TEXTCOLOR;
  const backgroundColor = themeContext.colors.PRIMARY_TINTCOLOR;
  
  const backgroundBlue = themeContext.colors.SECONDARY_COLOR;
  const backgroundBlueTint = themeContext.colors.SECONDARY_TINTCOLOR;
  

  const [selectedIndex, setSelectedIndex] = React.useState<number>();
  const data = [
    {title: t('articleScreenheaderTitle')},
    {title: t('actScreenheaderTitle')},
  ];
  useFocusEffect(
    React.useCallback(() => {
      // console.log("child dev usefocuseffect");
      // console.log("in favorites usefocuseffect 11", route.params);
      if (route.params?.backClicked != 'yes') {
        setSelectedIndex(0);
      } else {
        setSelectedIndex(route.params?.tabIndex);
        if (route.params?.backClicked == 'yes') {
          navigation.setParams({ backClicked: 'no' })
        }
      }

    }, [route.params?.tabIndex])
  );
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
      <View style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <TabScreenHeader
          title={t('favScreenHeader')}
          headerColor={headerColor}
          textColor="#FFF"
        />

        <TabBarContainer style={{backgroundColor:headerColor}}>
          {data.map((item, itemindex) => {
            return (
              <Pressable
                key={itemindex}
                style={{flex: 1}}
                onPress={() => {
                  setSelectedIndex(itemindex);
                }}>
                  <ShiftFromBottom5>
                <TabBarDefault
                  style={[
                    {
                      backgroundColor:
                        itemindex == selectedIndex
                          ? backgroundBlue
                          : backgroundBlueTint,
                      
                    },
                  ]}>
                  <Heading4Center numberOfLines={2}
                  // style={[
                  //   {
                  //     color:
                  //       itemindex == selectedIndex
                  //         ? headerColorWhite
                  //         : headerColorBlack,
                      
                  //   },
                  // ]}
                  >{item.title}</Heading4Center>
                </TabBarDefault>
                </ShiftFromBottom5>
              </Pressable>
            );
          })}
        </TabBarContainer>
       
        <Flex1>
          {renderItem(selectedIndex)}
        </Flex1>
      </View>
    </>
  );
};
export default Favourites;
