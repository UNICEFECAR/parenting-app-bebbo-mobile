import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
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
  // allPreviousPendingVaccines.push(...currentPeriodVaccines);
  console.log(allPreviousPendingVaccines, currentPeriodVaccines);
  if(allPreviousPendingVaccines.length === 0){
    if(isEditScreen== true){
    allPreviousPendingVaccines = currentPeriodVaccines.filter((item)=>{
      return item.isMeasured ==false;
    });
  }
  }
  else{
  console.log("222",isEditScreen,allPreviousPendingVaccines,takenVaccine);
  allPreviousPendingVaccines.push(...currentPeriodVaccines);
  allPreviousPendingVaccines = allPreviousPendingVaccines.filter(
    (vItem: any) => {
      if(isEditScreen== true){
        if(takenVaccine.length>0){
           //remove all current period vaccines which are measured
          return !currentPeriodVaccines?.find((element) => {
            return element.uuid == vItem.uuid && element.isMeasured == true;
          });
          }else{
             //remove all current period vaccines which are not measured
            return !currentPeriodVaccines?.find((element) => {
              return element.uuid == vItem.uuid && element.isMeasured == false;
            });
          }
      }else{
        // remove all current period vaccines which are not measured, because its already in planned vaccines
        return !currentPeriodVaccines?.find((element) => {
          return element.uuid == vItem.uuid
        });
      }
      
    },
  ).filter(
    (vItem: any) => {
       //remove all taken(measured) vaccines
      return !takenVaccine?.find((element) => {
        return element.uuid == vItem.uuid;
      });
    },
  );
}
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
