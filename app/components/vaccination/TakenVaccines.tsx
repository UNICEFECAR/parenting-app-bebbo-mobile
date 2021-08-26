import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
// type VaccineItemProps = {
//   vaccineid:number,
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
      //     vaccineid: id,
      //     // measurementDate: DateTime.now().toMillis(),
      //   }];
      // takenVaccines.map(x => (x.vaccineid == id ? { ...x, isChecked: true } : x));
      console.log(takenVaccines,"inTrue");
      // takenVaccines.forEach((vcItem)=>{
      //   vcItem.isChecked = vcItem.vaccineid == id ?  true : false;
      // })
      let updatedItem =  takenVaccines.find(el => el.vaccineid === id)
      updatedItem.isChecked= true;
      takenVaccines[takenVaccines.findIndex(el => el.vaccineid === id)]=updatedItem;
      console.log(updatedItem,"updatedItem")
      setCheckedVaccines(takenVaccines);
      // allCheckedVaccines.push({
      //   vaccineid: id,
      //   measurementDate: DateTime.now().toMillis(),
      // });
      onTakenVaccineToggle(takenVaccines);
      // console.log(allCheckedVaccines,checkedVaccines,"allCheckedVaccines")
    } else {
      console.log(checkedVaccines,"checkedVaccines");
      takenVaccines.map(x => (x.vaccineid == id ? { ...x, isChecked: false } : x));
      console.log(takenVaccines,"inFalse");
      let updatedItem =  takenVaccines.find(el => el.vaccineid === id)
      updatedItem.isChecked= false;
      takenVaccines[takenVaccines.findIndex(el => el.vaccineid === id)]=updatedItem;
      console.log(updatedItem,"updatedItem")
      // takenVaccines.forEach((vcItem)=>{
      //   vcItem.isChecked = vcItem.vaccineid == id ?  false : true;
      // })
      // takenVaccines = takenVaccines?.find(
      //   (item) => item.vaccineid == String(id),
      // )?.isChecked = false;
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
