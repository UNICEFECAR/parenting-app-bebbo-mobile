import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
// type VaccineItemProps = {
//   uuid:number,
//   // measurementDate:number
// }
const TakenVaccines = (props: any) => {
  const {onTakenVaccineToggle, fromScreen,backgroundActiveColor} = props;
  let {takenVaccines} = props;
  console.log(takenVaccines,"takenVaccines")

  const {t} = useTranslation();
  const [checkedVaccines,setCheckedVaccines] = useState<any[]>(takenVaccines);
  // let allCheckedVaccines: any[] = [];
  const onToggleVaccine = (id, isVaccineItemChecked) => {
    console.log(id,isVaccineItemChecked,"onToggleVaccine");
    if (isVaccineItemChecked) {
      // const allCheckedVaccines = [...checkedVaccines, {
      //     uuid: id,
      //     // measurementDate: DateTime.now().toMillis(),
      //   }];
      // takenVaccines.map(x => (x.uuid == id ? { ...x, isMeasured: true } : x));
      console.log(takenVaccines,"inTrue");
      // takenVaccines.forEach((vcItem)=>{
      //   vcItem.isMeasured = vcItem.uuid == id ?  true : false;
      // })
      let updatedItem =  takenVaccines.find(el => el.uuid === id)
      updatedItem.isMeasured= true;
      takenVaccines[takenVaccines.findIndex(el => el.uuid === id)]=updatedItem;
      console.log(updatedItem,"updatedItem")
      setCheckedVaccines(takenVaccines);
      // allCheckedVaccines.push({
      //   uuid: id,
      //   measurementDate: DateTime.now().toMillis(),
      // });
      onTakenVaccineToggle(takenVaccines);
      // console.log(allCheckedVaccines,checkedVaccines,"allCheckedVaccines")
    } else {
      console.log(checkedVaccines,"checkedVaccines");
      takenVaccines.map(x => (x.uuid == id ? { ...x, isMeasured: false } : x));
      console.log(takenVaccines,"inFalse");
      let updatedItem =  takenVaccines.find(el => el.uuid === id)
      console.log(updatedItem);
      updatedItem['isMeasured']= false;
      takenVaccines[takenVaccines.findIndex(el => el.uuid === id)]=updatedItem;
      console.log(updatedItem,"updatedItem")
      // takenVaccines.forEach((vcItem)=>{
      //   vcItem.isMeasured = vcItem.uuid == id ?  false : true;
      // })
      // takenVaccines = takenVaccines?.find(
      //   (item) => item.uuid == String(id),
      // )?.isMeasured = false;
      setCheckedVaccines(takenVaccines);
      onTakenVaccineToggle(takenVaccines);
      console.log(takenVaccines,checkedVaccines,"allCheckedVaccines")
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
