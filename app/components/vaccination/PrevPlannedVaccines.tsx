import { BgContainer } from '@components/shared/Container';
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
    title: 'Polio (IPV) (2nd dose)',
    isChecked: false,
  },
  {
    title: 'Pneumococcal disease (PCV13) (2nd dose)',
    isChecked: false,
  },
  {
    title: 'Rotavirus (RV) (2nd dose)',
    isChecked: false,
  },
];

const PrevPlannedVaccines = (props: any) => {
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
export default PrevPlannedVaccines;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });
