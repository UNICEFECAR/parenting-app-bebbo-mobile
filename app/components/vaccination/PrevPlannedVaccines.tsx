import { BgContainer } from "@components/shared/Container";
import { Heading4 } from "../../instances/bebbo/styles/typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllVaccinePeriods } from "../../services/vacccineService";
import VaccineItem from "./VaccineItem";
type VaccineItemProps = {
  uuid: string;
};
const PrevPlannedVaccines = (props: any): any => {
  const {
    onPrevPlannedVaccineToggle,
    isEditScreen,
    currentPeriodVaccines,
    takenVaccine,
    fromScreen,
    backgroundActiveColor,
  } = props;
  const { previousPeriods } = getAllVaccinePeriods();
  //remove first period which is the current period
  let allPreviousPendingVaccines: any[] = [];
  previousPeriods.forEach((period: any) => {
    period?.vaccines?.forEach((vItem: any) => {
      if (vItem.isMeasured == false) {
        allPreviousPendingVaccines.push(vItem);
      }
    });
  });
  if (isEditScreen == true) {
    if (takenVaccine.length > 0) {
      allPreviousPendingVaccines = allPreviousPendingVaccines.filter(
        (vItem) => {
          return !currentPeriodVaccines?.find((element: any) => {
            return element.uuid == vItem.uuid && element.isMeasured == false;
          });
        }
      );
    } else {
      allPreviousPendingVaccines.push(
        [...currentPeriodVaccines].filter((item) => {
          return item.isMeasured == false;
        })
      );
    }
  } else {
    allPreviousPendingVaccines = allPreviousPendingVaccines.filter(
      (vItem: any) => {
        return !currentPeriodVaccines?.find((element: any) => {
          return element.uuid == vItem.uuid;
        });
      }
    );
  }

  const [checkedVaccines, setCheckedVaccines] = useState<VaccineItemProps[]>(
    []
  );

  const onToggleVaccine = (uuid: any, isVaccineItemChecked: any): any => {
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [...checkedVaccines, { uuid: uuid }];
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
    } else {
      const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.uuid !== uuid
      );
      setCheckedVaccines(allCheckedVaccines);
      onPrevPlannedVaccineToggle(allCheckedVaccines);
    }
  };
  const prevVaccineView = (item: any, index: any): any => {
    return (
      <VaccineItem
        fromScreen={fromScreen}
        backgroundActiveColor={backgroundActiveColor}
        key={index}
        item={item}
        onToggleVaccine={onToggleVaccine}
      />
    );
  };
  const { t } = useTranslation();
  return (
    <>
      {allPreviousPendingVaccines?.filter((vItem: any) => {
        return vItem.isMeasured == false;
      })?.length > 0 ? (
        <BgContainer>
          {allPreviousPendingVaccines
            ?.filter((vItem: any) => {
              return vItem.isMeasured == false;
            })
            ?.map((item, index) => {
              if (item.old_calendar == 1) {
                return null;
              } else {
                return prevVaccineView(item, index);
              }
            })}
        </BgContainer>
      ) : (
        <Heading4>{t("noVaccinesForPeriod")}</Heading4>
      )}
    </>
  );
};
export default PrevPlannedVaccines;
