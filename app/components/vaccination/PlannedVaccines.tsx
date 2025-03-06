import { BgContainer } from "@components/shared/Container";
import { Heading4 } from "../../instances/bebbo/styles/typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import VaccineItem from "./VaccineItem";
type VaccineItemProps = {
  uuid: string;
};
const PlannedVaccines = (props: any): any => {
  const {
    currentPeriodVaccines,
    onPlannedVaccineToggle,
    fromScreen,
    backgroundActiveColor,
  } = props;
  const { t } = useTranslation();
  const [checkedVaccines, setCheckedVaccines] = useState<VaccineItemProps[]>(
    []
  );
  const onToggleVaccine = (uuid: any, isVaccineItemChecked: any): any => {
    if (isVaccineItemChecked) {
      const allCheckedVaccines = [...checkedVaccines, { uuid: uuid }];
      setCheckedVaccines(allCheckedVaccines);
      onPlannedVaccineToggle(allCheckedVaccines);
    } else {
      const allCheckedVaccines = [...checkedVaccines].filter(
        (item) => item.uuid !== uuid
      );
      setCheckedVaccines(allCheckedVaccines);
      onPlannedVaccineToggle(allCheckedVaccines);
    }
  };
  const plannedVaccineView = (item: any, index: any): any => {
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
  return (
    <>
      {currentPeriodVaccines?.filter((vItem: any) => {
        return vItem.isMeasured == false;
      })?.length > 0 ? (
        <BgContainer>
          {currentPeriodVaccines
            ?.filter((vItem: any) => {
              return vItem.isMeasured == false;
            })
            ?.map((item: any, index: any) => {
              if (item.old_calendar == 1) {
                return null;
              } else {
                return plannedVaccineView(item, index);
              }
            })}
        </BgContainer>
      ) : (
        <Heading4>{t("noVaccinesForPeriod")}</Heading4>
      )}
    </>
  );
};
export default PlannedVaccines;
