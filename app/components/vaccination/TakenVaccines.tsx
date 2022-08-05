import { BgContainer } from '@components/shared/Container';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
const TakenVaccines = (props: any) => {
  const {onTakenVaccineToggle, fromScreen,backgroundActiveColor} = props;
  let {takenVaccines} = props;
  const {t} = useTranslation();
  const [checkedVaccines,setCheckedVaccines] = useState<any[]>(takenVaccines);
  const onToggleVaccine = (id: any, isVaccineItemChecked: any) => {
     if (isVaccineItemChecked) {
     let updatedItem =  takenVaccines.find((el: any) => el.uuid === id)
      updatedItem.isMeasured= true;
      takenVaccines[takenVaccines.findIndex((el: any) => el.uuid === id)]=updatedItem;
      setCheckedVaccines(takenVaccines);
      onTakenVaccineToggle(takenVaccines);
    } else {
      takenVaccines.map((x:any) => (x.uuid == id ? { ...x, isMeasured: false } : x));
      let updatedItem =  takenVaccines.find((el: any) => el.uuid === id)
      updatedItem['isMeasured']= false;
      takenVaccines[takenVaccines.findIndex((el: any) => el.uuid === id)]=updatedItem;
      setCheckedVaccines(takenVaccines);
      onTakenVaccineToggle(takenVaccines);
    }
    
   
  };
  return (
    <>
        <BgContainer>
          {takenVaccines?.map((item, index) => {
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
      
    </>
  );
};
export default TakenVaccines;
