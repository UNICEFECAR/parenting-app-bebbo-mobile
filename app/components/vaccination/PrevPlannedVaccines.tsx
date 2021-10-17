import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllVaccinePeriods } from '../../services/vacccineService';
import VaccineItem from './VaccineItem';
type VaccineItemProps = {
  uuid: string;
  // measurementDate: number;
};
const PrevPlannedVaccines = (props: any) => {
  const {onPrevPlannedVaccineToggle,isEditScreen, currentPeriodVaccines,takenVaccine, fromScreen,backgroundActiveColor} = props;
  let {previousPeriods} = getAllVaccinePeriods();
  // previousPeriods.shift();
  //remove first period which is the current period
  let allPreviousPendingVaccines: any[] = [];
  previousPeriods.forEach((period) => {
    period.vaccines.forEach((vItem: any) => {
      allPreviousPendingVaccines.push(vItem);
    });
  });
  console.log(allPreviousPendingVaccines, currentPeriodVaccines);
  if(isEditScreen== true){
    currentPeriodVaccines.filter((vItem:any)=>{
      if(takenVaccine.length>0){
        if(vItem.isMeasured == false){
          allPreviousPendingVaccines.push(vItem);
        }
      }
    })
  }

  allPreviousPendingVaccines = allPreviousPendingVaccines.filter(
    (vItem: any) => {
      return !currentPeriodVaccines?.find((element) => {
        return element.uuid == vItem.uuid && element.isMeasured == false;
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

  const onToggleVaccine = (uuid, isVaccineItemChecked) => {
    // console.log(id,isVaccineItemChecked);
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [
        ...checkedVaccines,
        {  uuid: uuid,}
          // measurementDate: DateTime.now().toMillis(),
      ];
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
      // allCheckedVaccines.push({
      //   uuid: uuid,
      //   measurementDate: DateTime.now().toMillis(),
      // });
    } else {
      const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.uuid !== uuid,
      );
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
      // allCheckedVaccines = allCheckedVaccines.filter(
      //   (item) => item.uuid !== uuid,
      // );
    }
    // onPrevPlannedVaccineToggle(allCheckedVaccines);
    // console.log(allCheckedVaccines)
  };
  const {t} = useTranslation();
  return (
    <>
    {allPreviousPendingVaccines?.filter(
    (vItem: any) => {
      return vItem.isMeasured == false
    },
  )?.length > 0 ?
      <BgContainer>
        {allPreviousPendingVaccines?.filter(
    (vItem: any) => {
      return vItem.isMeasured == false
    },
  )?.map((item, index) => {
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
