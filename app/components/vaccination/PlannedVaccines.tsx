import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
type VaccineItemProps = {
  vaccineid:number,
  measurementDate:number
}
const PlannedVaccines = (props: any) => {
  const {currentPeriodVaccines, onPlannedVaccineToggle, fromScreen,backgroundActiveColor} = props;
  const {t} = useTranslation();
  const [checkedVaccines,setCheckedVaccines] = useState<VaccineItemProps[]>([]);
  // let allCheckedVaccines: any[] = [];
  const onToggleVaccine = (id, isVaccineItemChecked) => {
    // console.log(id,isVaccineItemChecked);
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [...checkedVaccines, {
          vaccineid: id,
          measurementDate: DateTime.now().toMillis(),
        }];
      setCheckedVaccines(allCheckedVaccines);
      // allCheckedVaccines.push({
      //   vaccineid: id,
      //   measurementDate: DateTime.now().toMillis(),
      // });
      onPlannedVaccineToggle(allCheckedVaccines);
      // console.log(allCheckedVaccines,checkedVaccines,"allCheckedVaccines")
    } else {
     const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.vaccineid !== id,
      );
      setCheckedVaccines(allCheckedVaccines);
      onPlannedVaccineToggle(allCheckedVaccines);
      // console.log(allCheckedVaccines,checkedVaccines,"allCheckedVaccines")
    }
    
   
  };
  return (
    <>
      {currentPeriodVaccines?.length > 0 ? (
        <BgContainer>
          {currentPeriodVaccines?.map((item, index) => {
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
      ) : (
        <Heading4>{t('noVaccinesForPeriod')}</Heading4>
      )}
    </>
  );
};
export default PlannedVaccines;
