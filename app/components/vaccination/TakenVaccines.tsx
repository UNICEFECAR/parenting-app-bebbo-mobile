import { BgContainer } from '@components/shared/Container';
import React from 'react';
import VaccineItem from './VaccineItem';
const TakenVaccines = (props: any):any => {
  const {onTakenVaccineToggle, fromScreen,backgroundActiveColor} = props;
  const {takenVaccines} = props;
   const onToggleVaccine = (id: any, isVaccineItemChecked: any):any => {
     if (isVaccineItemChecked) {
     const updatedItem =  takenVaccines.find((el: any) => el.uuid === id)
      updatedItem.isMeasured= true;
      takenVaccines[takenVaccines.findIndex((el: any) => el.uuid === id)]=updatedItem;
      onTakenVaccineToggle(takenVaccines);
    } else {
      takenVaccines.map((x:any) => (x.uuid == id ? { ...x, isMeasured: false } : x));
      const updatedItem =  takenVaccines.find((el: any) => el.uuid === id)
      updatedItem['isMeasured']= false;
      takenVaccines[takenVaccines.findIndex((el: any) => el.uuid === id)]=updatedItem;
      onTakenVaccineToggle(takenVaccines);
    }
    
   
  };
  return (
    <>
        <BgContainer>
          {takenVaccines?.map((item:any, index:any) => {
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
