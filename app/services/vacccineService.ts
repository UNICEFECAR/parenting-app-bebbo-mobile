import { DateTime } from "luxon";
import { apiUrlDevelop } from "react-native-dotenv";
import { useAppSelector } from "../../App";
import { selectActiveChild, selectAllTaxonomyData, selectVaccineData } from "./selectors";

export const getAllVaccinePeriods = (): any => {
  const activeChild = useAppSelector(selectActiveChild);
  //filter measures by didChildGetVaccines
  const vaccineMeasures = activeChild?.measures.filter((item: any) => item.didChildGetVaccines == true);
  const measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure: any) => {
    const vaccinesForAmeasure = (measure.vaccineIds || measure.vaccineIds != '' || measure.vaccineIds != null) ? JSON.parse(measure.vaccineIds) : [];
    if (vaccinesForAmeasure) {
      vaccinesForAmeasure.forEach((vaccine: any) => {
        measuredVaccines.push({ uuid: vaccine.uuid, measurementDate: measure.measurementDate });
      });
    }
  });
  const vaccineMeasuredInfo = (vaccine: any): any => {
    return (measuredVaccines.find(item => String(item.uuid) == String(vaccine.uuid)))
  }
  const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  const taxonomy = useAppSelector(selectAllTaxonomyData);
  const allGrowthPeriods = taxonomy.growth_period
  const getVaccineInfo = (periodID: any): any => {
    return allGrowthPeriods.find((item: any) => item.id == periodID);
  }
  const allVaccinePeriods = useAppSelector(selectVaccineData);
  const group_to_growthPeriod = allVaccinePeriods.reduce(function (obj: any, item: any) {
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id, uuid: item.uuid, title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at, old_calendar: item.old_calendar });
    return obj;
  }, {});
  const groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
    return { periodID: key, vaccines: group_to_growthPeriod[key] };
  });
  groupsForPeriods.forEach((item: any) => {
    const period = getVaccineInfo(item.periodID);
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;
    }
    item?.vaccines.forEach((vaccine: any) => {
      const vaccineMeasured = vaccineMeasuredInfo(vaccine);
      vaccine.isMeasured = vaccineMeasured ? true : false;
      vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
    })
  })
  const sortedGroupsForPeriods = [...groupsForPeriods].sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  const isUpComingPeriod = (vaccination_opens: number): any => {
    return vaccination_opens > childAgeIndays ? true : false;
  };
  const isPreviousPeriod = (vaccination_opens: number): any => {
    return vaccination_opens <= childAgeIndays ? true : false;
  };
  sortedGroupsForPeriods.forEach((period) => {
    period.isUpComing = isUpComingPeriod(period.vaccination_opens);
    period.isPrevious = isPreviousPeriod(period.vaccination_opens);
  });
  let upcomingPeriods = sortedGroupsForPeriods.filter(
    (period: any) => period.vaccination_opens > childAgeIndays,
  );
  const previousPeriods = sortedGroupsForPeriods
    .filter((period: any) => period.vaccination_opens <= childAgeIndays)
    .reverse();
  // logic to add current period to upcomingPeriods and remove it from previousPeriods
  let currentPeriod;
  if (previousPeriods.length > 0) {
    currentPeriod = previousPeriods[0];
    upcomingPeriods = [previousPeriods[0], ...upcomingPeriods];
    previousPeriods.shift();
  }
  let overDuePreviousVCcount, doneVCcount, totalUpcomingVaccines, totalPreviousVaccines;
  if (upcomingPeriods?.length > 0) {
    totalUpcomingVaccines = upcomingPeriods?.map((item) => {
      return item?.vaccines.filter((item: any) => {
        return item?.isMeasured == false && item.old_calendar == 0;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  if (previousPeriods?.length > 0) {
    totalPreviousVaccines = previousPeriods?.map((item: any) => {
      return item?.vaccines.length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  if (sortedGroupsForPeriods?.length > 0) {
    doneVCcount = sortedGroupsForPeriods.map((item) => {
      return item.vaccines.filter((item: any) => {
        return item.isMeasured;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  if (previousPeriods?.length > 0) {
    overDuePreviousVCcount = previousPeriods.map((item) => {
      return item.vaccines.filter((item: any) => {
        return !item.isMeasured && item.old_calendar == 0;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  return { upcomingPeriods, previousPeriods, sortedGroupsForPeriods, totalPreviousVaccines, totalUpcomingVaccines, currentPeriod, overDuePreviousVCcount, doneVCcount };
}