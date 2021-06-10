import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableHighlight, Dimensions, ScrollView, Image } from 'react-native';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';
const circleWidth = 130;
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  background-color: ${props => props.theme.colors.CHILDDEVELOPMENT_TINTCOLOR};
`;
const MilestoneCircle = () => (


  <View style={{
    width: circleWidth,
    height: circleWidth,
    // borderRadius: circleWidth / 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <VectorImage source={require('@assets/svg/ic_development_color.svg')} />
  </View>
);

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your filgers'
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'Molding your hands'
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'Picking stuff around'
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'Gripping your filgers'
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'Molding your hands'
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around'
  },
];
const ChildMilestones = ({ navigation }: Props) => {
  const renderDailyReadItem = (item: typeof DATA[0], index: number) => {
    if (index === 0) {
      return (<MilestoneCircle key={index} />)
    } else {
      return (
        <View style={styles.item} key={index}>
          <Image style={styles.cardImage}
            source={item.imagePath} resizeMode={'cover'} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      )
    }
  }

  return (
    <>
      <ContainerView>
        <Text>{'Child Milestones'}</Text>
        <FlatList
          data={DATA}
          horizontal
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item, index }) => renderDailyReadItem(item, index)}
          keyExtractor={item => item.id}
        />
      </ContainerView>
    </>
  );
};

export default ChildMilestones;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    // padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 200,
    borderRadius:5
  },
  title: {
    fontSize: 16,
    padding: 5
  },
  cardImage: {
    width: 200,
    height: 100,
  }
});