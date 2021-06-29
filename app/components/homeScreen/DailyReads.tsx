import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import {DailyBox, DailyArtTitle, DailyAction,OverlayFaded,DailyTag,DailyTagText} from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { Heading2, Heading3w, Heading4, ShiftFromTopBottom10 } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
const Item = ({title}: any) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);


const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your fingers',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'Picking stuff around',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'Gripping your fingers',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];

const DailyReads = () => {
  const {t} = useTranslation();
  const renderDailyReadItem = (item: typeof DATA[0], index: number) => {
    return (
      <View>
      <DailyBox key={index}>
        <ImageBackground source={item.imagePath} style={styles.cardImage}>
          <DailyArtTitle>
          <Heading3w>{item.title}</Heading3w>
          </DailyArtTitle>
          <OverlayFaded>
          <LinearGradient colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']} style={styles.linearGradient}>
            <Text >
          </Text>
          </LinearGradient>
          </OverlayFaded>
        </ImageBackground>
        {/*Tag*/ }
        <DailyTag >
        <DailyTagText>{t('homeScreentodaygame') || t('homeScreentodayarticle')}</DailyTagText>
        </DailyTag>
        {/*Parent Share , View Details*/ }
        <DailyAction>
          <FDirRow>
          <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_sb_shareapp" size={24} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
            <Heading4>{t('homeScreenshareText')}</Heading4>
          </FDirRow>
          <FDirRow>
          <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_view" size={13} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4>{t('homeScreenviewDetailsText')}</Heading4>
          </FDirRow>
         
        </DailyAction>
      </DailyBox>
      </View>
    );
  };

  return (
    <>
      <BgSecondaryTint>
        <MainContainer>
          <ShiftFromTopBottom10>
            <Heading2>{t('homeScreendailyReadsTitle')}</Heading2>
        </ShiftFromTopBottom10>
        <View style={{marginLeft:-7,marginRight:-7}}>
        <FlatList
          data={DATA}
          horizontal
          renderItem={({item, index}) => renderDailyReadItem(item, index)}
          keyExtractor={(item) => item.id}
        />
        </View>
        </MainContainer>
      </BgSecondaryTint>
    </>
  );
};

export default DailyReads;

const styles = StyleSheet.create({


  linearGradient: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 140,
    flex: 1,
    position: 'relative',
    // backgroundColor: 'red'
  },



});
