import FavActivities from '@components/FavActivities';
import FavArticles from '@components/FavArticles';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading4Center } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components';
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
      </SafeAreaView>
    </>
  );
};
export default Favourites;
