import { BgContainer } from '@components/shared/Container';
import { DateTime } from 'luxon';
import React from 'react';
import { getAllVaccinePeriods } from '../../services/vacccineService';
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
  const {onPrevPlannedVaccineToggle} = props;
  let {previousPeriods} = getAllVaccinePeriods() 
  previousPeriods.shift();
  //remove first period which is the current period
  let allPreviousPenddingVaccines:any[] = [];
  previousPeriods.forEach((period) => {
    period.vaccines.forEach((vItem:any) => {
      allPreviousPenddingVaccines.push(vItem)
    })
  });
  let allCheckedVaccines:any[] = [];
  const onToggleVaccine =(id,isVaccineItemChecked)=>{
    // console.log(id,isVaccineItemChecked);
    if(isVaccineItemChecked){
      allCheckedVaccines.push({vaccineid:id,measurementDate:DateTime.now().toMillis()});
    }else{
      allCheckedVaccines = allCheckedVaccines.filter((item)=> item.vaccineid !== id);
    }
    onPrevPlannedVaccineToggle(allCheckedVaccines);
    // console.log(allCheckedVaccines)
  }
  return (
    <>
      <BgContainer>
        {allPreviousPenddingVaccines.map((item, index) => {
          return <VaccineItem key={index} item={item} onToggleVaccine={onToggleVaccine}/>;
        })}
      </BgContainer>
    </>
  );
};
export default PrevPlannedVaccines;