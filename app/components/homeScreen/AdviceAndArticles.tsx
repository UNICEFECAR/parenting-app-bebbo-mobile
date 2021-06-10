import { DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';
import { Header3Text } from '../../styles/style';

const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${props => props.theme.colors.ARTICLES_TINTCOLOR};
`;
const AdviceAndArticles = ({ navigation }: Props) => {
  return (
    <>
      <ContainerView>
        <View>
          <Text>Expert Advice And Articles</Text>

          <ScrollView style={{ flex: 1, flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.item} >
              <VectorImage source={require('@assets/svg/ic_art_play.svg')} />
              <Text style={styles.title}>Playing and Learning</Text>
            </View>
            <View style={styles.item} >
              <VectorImage source={require('@assets/svg/ic_art_health.svg')} />
              <Text style={styles.title}>Health and Wellbeing</Text>
            </View>
            <View style={styles.item}>
              <VectorImage source={require('@assets/svg/ic_art_safety.svg')} />
              <Text style={styles.title}>Safety and Protection</Text>
            </View>
            <View style={styles.item}>
              <VectorImage source={require('@assets/svg/ic_art_responsive.svg')} />
              <Text style={styles.title}>Responsive Parenting</Text>
            </View>
            <View style={styles.item}>
              <VectorImage source={require('@assets/svg/ic_art_parenting.svg')} />
              <Text style={styles.title}>Responsive Parenting</Text>
            </View>
            <View style={styles.item}>
              <VectorImage source={require('@assets/svg/ic_art_nutrition.svg')} />
              <Text style={styles.title}>Responsive Parenting</Text>
            </View>
          </ScrollView>
        </View>
      </ContainerView>
    </>
  );
};

export default AdviceAndArticles;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 3,
    padding: 10,
    // width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    padding: 5,
    width: 100,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})