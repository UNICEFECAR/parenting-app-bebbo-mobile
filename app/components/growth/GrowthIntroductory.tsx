import { Heading4Regular, ShiftFromBottom20 } from '@styles/typography';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInDays } from '../../services/childCRUD';

const GrowthIntroductory = (props: any) => {
  let {activeChild} = props;
  const taxonomy = useAppSelector((state: any) =>
    state.utilsData.taxonomy?.allTaxonomyData != ''
      ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData)
      : {},
  );
  const growthIntroductoryData = taxonomy?.growth_introductory;
  // console.log(growthIntroductoryData, 'growthIntroductoryData');
  const childBirthDate = activeChild.birthDate;
  const childGender = activeChild.gender;
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  const {t} = useTranslation();
  let defaultMessage = '';
  let periodIntroductionText: string = '';
  const growthPeriod = () => {
    if (childAgeInDays !== null) {
      let ageInDays = 0;

      if (childAgeInDays >= 1885) {
        ageInDays = 1885;
        defaultMessage = t('defaultPeriodInterpretationText');
      } else {
        ageInDays = Math.round(childAgeInDays);
        defaultMessage = '';
      }

      // let allPeriods = ('growthPeriods') as ([] | null)

      // growthIntroductoryData?.filter(item => (ageInDays >= item.days_from && ageInDays <= item.days_to))[0]

      const body = growthIntroductoryData?.filter(
        (item) =>
          ageInDays >= Number(item.days_from) &&
          ageInDays <= Number(item.days_to),
      )[0].body;
      return body;
      // periodIntroductionText = growthPeriod?.body ? growthPeriod.body : "";
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
