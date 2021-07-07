import { BgContainer } from '@components/shared/Container';
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
  {
    title:
      'Pneumococcal disease (PCV13) (1st dose) Rotavirus (RV)  ',
    isChecked: false,
  },
  {
    title: 'Diphtheria, tetanus, and whooping cough (pertussis) (DTaP) (2nd dose)',
    isChecked: false,
  },
];

const PlannedVaccines = (props: any) => {
  return (
    <>
      <BgContainer>
        {plannedVaccines.map((item, index) => {
          return <VaccineItem key={index} item={item} />;
        })}
      </BgContainer>
    </>
  );
};
export default PlannedVaccines;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });
