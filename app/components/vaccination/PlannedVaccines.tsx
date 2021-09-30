import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
type VaccineItemProps = {
  uuid:string,
  // measurementDate:number
}
const PlannedVaccines = (props: any) => {
  const {currentPeriodVaccines, onPlannedVaccineToggle, fromScreen,backgroundActiveColor} = props;
  console.log(currentPeriodVaccines,"currentPeriodVaccines")
  const {t} = useTranslation();
  const [checkedVaccines,setCheckedVaccines] = useState<VaccineItemProps[]>([]);
  // let allCheckedVaccines: any[] = [];
  const onToggleVaccine = (uuid, isVaccineItemChecked) => {
    console.log(uuid,isVaccineItemChecked);
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [...checkedVaccines,
         {  uuid: uuid,}
          // measurementDate: DateTime.now().toMillis(),
        ];
      setCheckedVaccines(allCheckedVaccines);
      // allCheckedVaccines.push({
      //   uuid: id,
      //   measurementDate: DateTime.now().toMillis(),
      // });
      onPlannedVaccineToggle(allCheckedVaccines);
      // console.log(allCheckedVaccines,checkedVaccines,"allCheckedVaccines")
    } else {
     const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.uuid !== uuid,
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
          {currentPeriodVaccines?.filter(
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
      ) : (
        <Heading4>{t('noVaccinesForPeriod')}</Heading4>
      )}
    </>
  );
};
export default PlannedVaccines;
