import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
const Item = ({title}: any) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${(props) => props.theme.colors.SECONDARY_TINTCOLOR};
`;

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your filgers',
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
    title: 'Gripping your filgers',
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
      <View style={styles.item} key={index}>
        <ImageBackground source={item.imagePath} style={styles.cardImage}>
          <Text style={styles.title}>{item.title}</Text>
        </ImageBackground>
        <Text>{t('homeScreen.todaygame') || t('homeScreen.todayarticle')}</Text>
        <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#FFF'}}>
          <View style={styles.btn}>
            <Text style={styles.btntxt}>{t('homeScreen.shareText')}</Text>
          </View>
          <View style={styles.btn}>
            <Text style={styles.btntxt}>{t('homeScreen.viewDetailsText')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ContainerView>
        <Text>{t('homeScreen.dailyReadsTitle')}</Text>
        <FlatList
          data={DATA}
          horizontal
          renderItem={({item, index}) => renderDailyReadItem(item, index)}
          keyExtractor={(item) => item.id}
        />
      </ContainerView>
    </>
  );
};

export default DailyReads;

const styles = StyleSheet.create({
  item: {
    // backgroundColor: '#FFF',
    // padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 300,
    borderRadius: 5,
  },
  btn: {
    width: 150,
    padding: 10,
  },
  btntxt: {
    color: '#000',
  },
  title: {
    fontSize: 16,
    padding: 5,
    color: '#FFF',
  },
  cardImage: {
    width: '100%',
    height: 120,
    flex: 1,
    position: 'relative',
    top: 0,
    left: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    // backgroundColor: 'red'
  },
});
