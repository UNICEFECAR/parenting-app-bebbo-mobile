import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';

const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${props => props.theme.colors.SECONDARY_TINTCOLOR};
`;
const Tools = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
      <ContainerView>
        <View>
          <Text>{t('localization.homeScreentoolsHeader')}</Text>
          <ScrollView style={{ flex: 1, flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
            <Pressable style={styles.item}  onPress={() => navigation.navigate("Tools", { screen: 'VaccinationTab' })}>
              <VectorImage source={require('@assets/svg/ic_vaccination_color.svg')} />
              <Text style={styles.title}>{t('localization.homeScreenvc')}</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navigation.navigate("Tools", { screen: 'HealthCheckupsTab' })}>
              <VectorImage source={require('@assets/svg/ic_health_color.svg')} />
              <Text style={styles.title}>{t('localization.homeScreenhc')}</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={() => navigation.navigate("Tools", { screen: 'ChildgrowthTab' })}>
              <VectorImage source={require('@assets/svg/ic_growth_color.svg')} />
              <Text style={styles.title}>{t('localization.homeScreencg')}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </ContainerView>
    </>
  );
};

export default Tools;
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