import React from 'react';
import { StyleSheet, View } from 'react-native';
import VaccineItem from './VaccineItem';

const plannedVaccines = [
  {
    title:
      'Diphtheria, tetanus, pertussis, polio, influenzae type b- the second dose',
    isChecked: false,
  },
  {
    title: 'Bacteria Streptococus pnuemoniae - the second dose',
    isChecked: false,
  },
];

const PlannedVaccines = (props: any) => {
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
export default PlannedVaccines;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
  },
});
