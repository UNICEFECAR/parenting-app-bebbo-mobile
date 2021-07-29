import { BgContainer } from '@components/shared/Container';
import { Heading4 } from '@styles/typography';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VaccineItem from './VaccineItem';
const PlannedVaccines = (props: any) => {
  const {currentPeriodVaccines, onPlannedVaccineToggle, fromScreen} = props;
  const {t} = useTranslation();
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
    onPlannedVaccineToggle(allCheckedVaccines);
    // console.log(allCheckedVaccines)
  };
  return (
    <>
      {currentPeriodVaccines?.length > 0 ? (
        <BgContainer>
          {currentPeriodVaccines?.map((item, index) => {
            return (
              <VaccineItem
              fromScreen={fromScreen}
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
