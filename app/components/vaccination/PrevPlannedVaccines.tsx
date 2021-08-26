import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllVaccinePeriods } from '../../services/vacccineService';
import VaccineItem from './VaccineItem';
type VaccineItemProps = {
  vaccineid: number;
  // measurementDate: number;
};
const PrevPlannedVaccines = (props: any) => {
  const {onPrevPlannedVaccineToggle, currentPeriodVaccines,takenVaccine, fromScreen,backgroundActiveColor} = props;
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
  allPreviousPendingVaccines = allPreviousPendingVaccines.filter(
    (vItem: any) => {
      return !currentPeriodVaccines?.find((element) => {
        return element.uuid == vItem.uuid;
      });
    },
  ).filter(
    (vItem: any) => {
      return !takenVaccine?.find((element) => {
        return element.uuid == vItem.uuid;
      });
    },
  );
  // console.log(allPreviousPendingVaccines);
  // let allCheckedVaccines: any[] = [];
  const [checkedVaccines, setCheckedVaccines] = useState<VaccineItemProps[]>(
    [],
  );

  const onToggleVaccine = (id, isVaccineItemChecked) => {
    // console.log(id,isVaccineItemChecked);
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [
        ...checkedVaccines,
        {  vaccineid: id,}
          // measurementDate: DateTime.now().toMillis(),
      ];
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
      // allCheckedVaccines.push({
      //   vaccineid: id,
      //   measurementDate: DateTime.now().toMillis(),
      // });
    } else {
      const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.vaccineid !== id,
      );
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
      // allCheckedVaccines = allCheckedVaccines.filter(
      //   (item) => item.vaccineid !== id,
      // );
    }
    // onPrevPlannedVaccineToggle(allCheckedVaccines);
    // console.log(allCheckedVaccines)
  };
  const {t} = useTranslation();
  return (
    <>
    {allPreviousPendingVaccines?.length > 0 ?
      <BgContainer>
        {allPreviousPendingVaccines.map((item, index) => {
          return (
            <VaccineItem
              fromScreen={fromScreen}
              backgroundActiveColor={backgroundActiveColor}
              key={index}
              item={item}
              onToggleVaccine={onToggleVaccine}
            />
          );
        })}
      </BgContainer>
      :(
        <Heading4>{t('noVaccinesForPeriod')}</Heading4>
      )}
    </>
  );
};
export default PrevPlannedVaccines;
