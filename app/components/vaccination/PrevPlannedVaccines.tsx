import { BgContainer } from '@components/shared/Container';
import { DateTime } from 'luxon';
import React from 'react';
import { getAllVaccinePeriods } from '../../services/vacccineService';
import VaccineItem from './VaccineItem';
const PrevPlannedVaccines = (props: any) => {
  const {onPrevPlannedVaccineToggle, currentPeriodVaccines} = props;
  let {previousPeriods} = getAllVaccinePeriods();
  previousPeriods.shift();
  //remove first period which is the current period
  let allPreviousPendingVaccines: any[] = [];
  previousPeriods.forEach((period) => {
    period.vaccines.forEach((vItem: any) => {
      allPreviousPendingVaccines.push(vItem);
    });
  });
  console.log(allPreviousPendingVaccines, currentPeriodVaccines);
  allPreviousPendingVaccines= allPreviousPendingVaccines.filter((vItem: any) => {
    return !currentPeriodVaccines?.find((element) => {
      return element.id == vItem.id;
    });
  });
  console.log(allPreviousPendingVaccines);
  let allCheckedVaccines: any[] = [];
  const onToggleVaccine = (id, isVaccineItemChecked) => {
    // console.log(id,isVaccineItemChecked);
    if (isVaccineItemChecked) {
      allCheckedVaccines.push({
        vaccineid: id,
        measurementDate: DateTime.now().toMillis(),
      });
    } else {
      allCheckedVaccines = allCheckedVaccines.filter(
        (item) => item.vaccineid !== id,
      );
    }
    onPrevPlannedVaccineToggle(allCheckedVaccines);
    // console.log(allCheckedVaccines)
  };
  return (
    <>
      <BgContainer>
        {allPreviousPendingVaccines.map((item, index) => {
          return (
            <VaccineItem
              key={index}
              item={item}
              onToggleVaccine={onToggleVaccine}
            />
          );
        })}
      </BgContainer>
    </>
  );
};
export default PrevPlannedVaccines;
