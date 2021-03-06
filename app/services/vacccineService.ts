import { DateTime } from "luxon";
import { useAppSelector } from "../../App";

export const getAllVaccinePeriods = () => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // console.log(activeChild.measures, "activeChild.measures filter by didChildGetVaccines");
  //filter measures by didChildGetVaccines
  const vaccineMeasures = activeChild?.measures.filter((item) => item.didChildGetVaccines == true);
  //  console.log(vaccineMeasures, "vaccineMeasures filter by didChildGetVaccines");
  let measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure, index) => {
    const vaccinesForAmeasure = (measure.vaccineIds || measure.vaccineIds != '' || measure.vaccineIds != null) ? JSON.parse(measure.vaccineIds) : [];
    //  console.log(vaccinesForAmeasure,"vaccinesForAmeasure");
    if (vaccinesForAmeasure) {
      vaccinesForAmeasure.forEach((vaccine, innerindex) => {
        measuredVaccines.push({ uuid: vaccine.uuid, measurementDate: measure.measurementDate });
      });
    }
  });
  // console.log(measuredVaccines,"measuredVaccines");
  // const getMeasureInfoForVaccine = (uuid :number=56276) => {
  // return vaccineMeasures.filter(measure => JSON.parse(measure.vaccineIds).indexOf(uuid) > -1);
  // }
  // console.log(getMeasureInfoForVaccine(),"getMeaasureInfoForVaccine");
  const vaccineMeasuredInfo = (vaccine) => {
    // console.log(measuredVaccines,vaccine,"uuid")
    return (measuredVaccines.find(item => String(item.uuid) == String(vaccine.uuid)))
  }
  let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  // console.log(childAgeIndays, 'childAgeIndays');
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  // console.log(taxonomy,taxonomy.growth_period);
  const allGrowthPeriods = taxonomy.growth_period
  // const allGrowthPeriods = taxonomydata['en'][0].allData.growth_period;
  // console.log(allGrowthPeriods, "taxonomydata_growth_period");
  const getVaccineInfo = (periodID) => {
    return allGrowthPeriods.find(item => item.id == periodID);
  }
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  // console.log(allVaccinePeriods);
  var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj, item) {
    // console.log(obj,item, "item");
    // const checkIfVacineMeasured = isVaccineMeasured(item.uuid);
    // console.log(checkIfVacineMeasured, "checkIfVacineMeasured");
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id, uuid: item.uuid, title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
    return obj;
  }, {});
  let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
    return { periodID: key, vaccines: group_to_growthPeriod[key] };
  });
  groupsForPeriods.forEach((item: any) => {
    const period = getVaccineInfo(item.periodID);
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;
    }
    item?.vaccines.forEach((vaccine: any) => {
      // console.log(vaccine)
      const vaccineMeasured = vaccineMeasuredInfo(vaccine);
      // console.log(vaccineMeasured, "vaccineMeasured");
      vaccine.isMeasured = vaccineMeasured ? true : false;
      // console.log(vaccine)
      vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
    })
  })
  // console.log(groupsForPeriods, "<groupsForPeriods>");

  let sortedGroupsForPeriods = [...groupsForPeriods].sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  const isUpComingPeriod = (vaccination_opens: number) => {
    return vaccination_opens > childAgeIndays ? true : false;
  };
  const isPreviousPeriod = (vaccination_opens: number) => {
    return vaccination_opens <= childAgeIndays ? true : false;
  };
  sortedGroupsForPeriods.forEach((period) => {
    period.isUpComing = isUpComingPeriod(period.vaccination_opens);
    period.isPrevious = isPreviousPeriod(period.vaccination_opens);
  });
  let upcomingPeriods = sortedGroupsForPeriods.filter(
    (period: any) => period.vaccination_opens > childAgeIndays,
  );
  let previousPeriods = sortedGroupsForPeriods
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
      return item?.vaccines.filter((item) => {
        return item?.isMeasured == false;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  if (previousPeriods?.length > 0) {
    totalPreviousVaccines = previousPeriods?.map((item) => {
      return item?.vaccines.length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  // console.log(totalPreviousVaccines, totalUpcomingVaccines, "totalPrevVaccines");
  // console.log(sortedlocalgrowthPeriod,"growth_period_uniqueData");

  if (sortedGroupsForPeriods?.length > 0) {
    doneVCcount = sortedGroupsForPeriods.map((item) => {
      return item.vaccines.filter((item) => {
        return item.isMeasured;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  if (previousPeriods?.length > 0) {
    overDuePreviousVCcount = previousPeriods.map((item) => {
      return item.vaccines.filter((item) => {
        return !item.isMeasured;
      }).length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  // console.log(doneVCcount,overDueVCcount,"doneVCcount");
  return { upcomingPeriods, previousPeriods, sortedGroupsForPeriods, totalPreviousVaccines, totalUpcomingVaccines, currentPeriod, overDuePreviousVCcount, doneVCcount };
}