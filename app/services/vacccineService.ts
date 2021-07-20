import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';
import { DateTime } from "luxon";
import { useAppSelector } from "../../App";

export const getAllVaccinePeriods = () => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );


  let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  console.log(childAgeIndays, 'childAgeIndays');


  const allVaccineData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );

  const findVaccinesForPeriod = (periodID) => {
    return allVaccineData.filter(
      (item) => item.growth_period == Number(periodID),
      //get if that vaccine is done for that period add flag here using child measures
    );

  };
  // const taxonomy = useAppSelector(
  //   (state: any) =>
  //     (state.utilsData.taxonomy?.allTaxonomyData!="" ?JSON.parse(state.utilsData.taxonomy?.allTaxonomyData): {}),
  // );
  // console.log(taxonomy,taxonomy.growth_period);
  const localgrowthPeriod = taxonomydata['en'][0].allData.growth_period;
  let sortedlocalgrowthPeriod = [...localgrowthPeriod].sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  const isUpComingPeriod = (vaccination_opens: number) => {
    return vaccination_opens > childAgeIndays ? true : false;
  };
  const isPreviousPeriod = (vaccination_opens: number) => {
    return vaccination_opens <= childAgeIndays ? true : false;
  };
  sortedlocalgrowthPeriod.forEach((period) => {
    period.vaccines = findVaccinesForPeriod(period.id);
    period.isUpComing = isUpComingPeriod(period.vaccination_opens);
    period.isPrevious = isPreviousPeriod(period.vaccination_opens);

  });
  let upcomingPeriods = sortedlocalgrowthPeriod.filter(
    (period: any) => period.vaccination_opens > childAgeIndays,
  );
  let previousPeriods = sortedlocalgrowthPeriod
    .filter((period: any) => period.vaccination_opens <= childAgeIndays)
    .reverse();
  console.log(sortedlocalgrowthPeriod);
  return { sortedlocalgrowthPeriod, upcomingPeriods, previousPeriods };
}