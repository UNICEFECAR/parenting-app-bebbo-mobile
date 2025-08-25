import {
  Heading4Regular,
  ShiftFromBottom20,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React from "react";
import { useAppSelector } from "../../../App";
import { getCurrentChildAgeInDays } from "../../services/childCRUD";
import { selectAllTaxonomyData } from "../../services/selectors";

const GrowthIntroductory = (props: any): any => {
  const { activeChild } = props;
  const taxonomy = useAppSelector(selectAllTaxonomyData);
  const growthIntroductoryData = taxonomy?.growth_introductory;
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis()
  );
  const growthPeriod = (): any => {
    if (childAgeInDays !== null) {
      let ageInDays = 0;

      if (childAgeInDays >= 1885) {
        ageInDays = 1885;
      } else {
        ageInDays = Math.round(childAgeInDays);
      }
      const body = growthIntroductoryData?.filter(
        (item: any) =>
          ageInDays >= Number(item.days_from) &&
          ageInDays <= Number(item.days_to)
      )[0].body;
      return body;
    }
  };

  return (
    <>
      <ShiftFromBottom20>
        <Heading4Regular>{growthPeriod()}</Heading4Regular>
      </ShiftFromBottom20>
    </>
  );
};
export default GrowthIntroductory;
