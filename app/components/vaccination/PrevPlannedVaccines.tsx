import React from 'react';
import { StyleSheet, View } from 'react-native';
import VaccineItem from './VaccineItem';

const plannedVaccines = [
  {
    title:
      'Hepatitis B - the first dose',
    isChecked: false,
  },
  {
    title: 'Tuberculosis',
    isChecked: false,
  },
  {
    title: 'Tuberculosis1',
    isChecked: false,
  },
  {
    title: 'Tuberculosis2',
    isChecked: false,
  },
];

const PrevPlannedVaccines = (props: any) => {
  return (
    <>
      <View style={styles.item}>
        {plannedVaccines.map((item, index) => {
          return <VaccineItem key={index} item={item} />;
        })}
      </View>
    </>
  );
};
export default PrevPlannedVaccines;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
  },
});
