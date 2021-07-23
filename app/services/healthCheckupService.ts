import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';
import { DateTime } from "luxon";
import { useAppSelector } from "../../App";

export const getAllHealthCheckupPeriods = () => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  console.log(activeChild.measures, "activeChild.measures filter by didChildGetVaccines");
  //filter measures by didChildGetVaccines,isChildMeasured
  const growthMeasures =activeChild.measures.filter((item) => item.isChildMeasured == true);

  const vaccineMeasures =activeChild.measures.filter((item) => item.didChildGetVaccines == true);
  let measuredVaccines :any[]= [];
  vaccineMeasures.forEach(measure => {
    measuredVaccines = [JSON.parse(measure.vaccineIds)[0], ...measuredVaccines];
  });
  const vaccineMeasuredInfo = (vaccineid:number)=>{
    return (measuredVaccines.find(item => item.vaccineid == vaccineid))
   }

  let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  console.log(childAgeIndays, 'childAgeIndays');
 // const taxonomy = useAppSelector(
  //   (state: any) =>
  //     (state.utilsData.taxonomy?.allTaxonomyData!="" ?JSON.parse(state.utilsData.taxonomy?.allTaxonomyData): {}),
  // );
  // console.log(taxonomy,taxonomy.growth_period);
  const allGrowthPeriods = taxonomydata['en'][0].allData.growth_period;
  console.log(allGrowthPeriods, "taxonomydata_growth_period");
  const getVaccineOpens = (periodID) => {
    return allGrowthPeriods.find(item => item.id == periodID);
  }
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.healthCheckupsData),
  );
  // const getPeriodTitle = (periodID) => {
  //   return allHealthCheckupsData.find(item => item.growth_period == periodID);
  // }
  const getVaccinesForHCPeriod = (growthPeriodID) => {
      let vaccinesforHC = allVaccinePeriods.filter(item => item.growth_period == growthPeriodID);
      vaccinesforHC?.forEach(vaccine => {
        const vaccineMeasured = vaccineMeasuredInfo(vaccine.id);
        vaccine.isMeasured = vaccineMeasured? true: false;
        vaccine.measurementDate = vaccineMeasured? vaccineMeasured.measurementDate: "";
      })
    
    return vaccinesforHC;
  }


  // console.log(allHealthCheckupsData,"allHealthCheckupsData");
  // console.log(allVaccinePeriods,"allVaccinePeriods");
  allHealthCheckupsData.forEach((hcItem:any) => {
   hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period)
  hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
  });
  console.log(allHealthCheckupsData,"modifiedHealthCheckupsData");
  // console.log(groupsForPeriods, "<groupsForPeriods>");
//  regularAndAdditionalMeasures.additionalMeasures.filter(item => item.measurementPlace === "doctor").forEach((measures) => {
// push all additional measures to the measures list and sort by date
  let sortedGroupsForPeriods = [...allHealthCheckupsData].sort(
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
  const currentPeriod = previousPeriods[0];
  upcomingPeriods = [previousPeriods[0], ...upcomingPeriods];
  previousPeriods.shift();
let totalUpcomingVaccines;
  if(upcomingPeriods?.length > 0) {
   totalUpcomingVaccines = upcomingPeriods?.map((item) => {
    return item.vaccines.length;
  }).reduce((accumulator, current) => {
    return accumulator + current;
  });
}
let totalPreviousVaccines;
if(previousPeriods?.length > 0){
   totalPreviousVaccines = previousPeriods?.map((item) => {
    return item.vaccines.length;
  }).reduce((accumulator, current) => {
    return accumulator + current;
  });;
}
  // console.log(totalPreviousVaccines, totalUpcomingVaccines, "totalPrevVaccines");
  // console.log(allHealthCheckupsData,"growth_period_uniqueData");

 
  return { upcomingPeriods, previousPeriods, sortedGroupsForPeriods,totalUpcomingVaccines,totalPreviousVaccines, currentPeriod };
}