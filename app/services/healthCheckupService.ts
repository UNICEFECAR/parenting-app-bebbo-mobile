import { maxPeriodDays } from '@assets/translations/appOfflineData/apiConstants';
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next';
import { useAppSelector } from "../../App";
import { MeasuresEntity } from './../database/schema/ChildDataSchema';
import { formatStringDate } from './Utils';
export const getAllHealthCheckupPeriods = ():any => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  const allGrowthPeriods = taxonomy.growth_period;
    // filter by measurementPlace  is Doctors and sort by measurementDate
    // getall doctor's place measures
  const allMeasures = activeChild?.measures.filter((item:any)=>(item.measurementPlace==0)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
   // getall measures where child received vaccines but growth data marked as measured at home
  const vcMeasures = activeChild?.measures.filter((item:any)=>(item.measurementPlace==1 && item.didChildGetVaccines==true)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  const allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
const checkIfMeasuredVaccineExistsForLocale = (vaccineIds:any):any=>{
  return vaccineIds?.filter( (vcId:any) => {
    return allVaccinePeriods?.some((el:any) => {
      return vcId.uuid === el.uuid;
    });
  });
}
  // sorting measures by date
  const allMeasurements = [...allMeasures,...vcMeasures].map((item: MeasuresEntity) => {
    const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
    const filteredVaccinesForLocale = (item.vaccineIds || item.vaccineIds != '') ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(item.vaccineIds)):[]
    return {
      uuid: item.uuid,
      weight: item.weight ? parseFloat(item.weight) : 0,
      height: item.height ? parseFloat(item.height) : 0,
      measurementDate: formatStringDate(item?.measurementDate),
      dateToMilis: item.measurementDate,
      childAgeInDaysForMeasure: Math.round(
        DateTime.fromJSDate(new Date(item.measurementDate)).diff(birthDay, 'days').days,
      ),
      titleDateInMonth: item.titleDateInMonth ? item.titleDateInMonth : '',
      // remove uuids from array if does not exist for a countrylocale, update  measuredVaccineIds,didChildGetVaccines accordingly
      measuredVaccineIds: filteredVaccinesForLocale,
      didChildGetVaccines: filteredVaccinesForLocale?.length>0 ? item.didChildGetVaccines: false,
      isChildMeasured: item.isChildMeasured,
      measurementPlace: item.measurementPlace,
      doctorComment: item.doctorComment
    };
  })
  const vaccineMeasures = activeChild.measures.filter((item:any) => item.didChildGetVaccines == true);
  const measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure:any) => {
    // remove uuids from array if does not exist for a countrylocale, update  measuredVaccineIds,didChildGetVaccines accordingly
    const vaccinesForAmeasure = (measure.vaccineIds || measure.vaccineIds != '' || measure.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(measure.vaccineIds)) : [];
    if (vaccinesForAmeasure) {
      vaccinesForAmeasure.forEach((vaccine:any) => {
        measuredVaccines.push(vaccine);
      });
    }

  });
  const vaccineMeasuredInfo = (uuid: number):any => {
    return (measuredVaccines.find(item => String(item.uuid) == String(uuid)))
  }

  const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  const getVaccinesForHCPeriod = (growthPeriodID:any):any => {
    const vaccinesforHC = allVaccinePeriods.filter((item:any) => item.growth_period == growthPeriodID);
    vaccinesforHC?.forEach((vaccine:any) => {
      const vaccineMeasured = vaccineMeasuredInfo(vaccine.uuid);
      vaccine.isMeasured = vaccineMeasured ? true : false;
      vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
    })

    return vaccinesforHC;
  }
  const allHealthCheckupsData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.healthCheckupsData),
  );
  const additionalMeasures: any[] = [];
  const getMeasuresForHCPeriod = (hcItem: any, currentIndex: number):any => {
    // console.log("currentIndex--",currentIndex)
    const { t } = useTranslation();
    if (hcItem) {
      const measure = allMeasurements.filter((measure:any) => (measure.childAgeInDaysForMeasure >= hcItem?.vaccination_opens) && (measure.childAgeInDaysForMeasure < hcItem?.vaccination_ends))
      let regularMeasure: any = {};
      if (measure.length > 1) {
       for (let i = 0; i <= measure.length - 2; i++) {
          const item = {
            created_at: hcItem.created_at,
            growthMeasures: measure[i + 1], 
            growth_period: hcItem.growth_period,
            id: hcItem.id,
            pinned_article: hcItem.pinned_article,
            title: t('hcSummaryHeader'),
            isAdditional: true,
            type: hcItem.type,
            updated_at: hcItem.updated_at,
            vaccination_ends: hcItem.vaccination_ends,
            vaccination_opens: hcItem.vaccination_opens,
            vaccines: [], // no vaccines planned for additional health checkup
          }
          additionalMeasures.push(item)
        }
        regularMeasure = measure[0]; 
        regularMeasure["isAdditional"] = false
      } else if (measure.length > 0) {
        regularMeasure = measure[0]; 
        regularMeasure["isAdditional"] = false
      } else {
        regularMeasure = {};
        regularMeasure["isAdditional"] = false
      }
      //  calculate is additional measure for the period
      return measure ? regularMeasure : null; // if no measure for the period return null, show pending vaccines
    }
  }

  allHealthCheckupsData.map((hcItem: any) => {
    hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    const item = allGrowthPeriods.find((item:any) => Number(item.id) == Number(hcItem.growth_period));
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
    }
  })

  let allHealthCheckupsDataNew =  allHealthCheckupsData.sort(
    (a: any, b: any) =>  Number(b.vaccination_opens) > Number(a.vaccination_opens)?1:-1,
  );
  allHealthCheckupsDataNew = allHealthCheckupsDataNew.reverse();
  allHealthCheckupsDataNew.forEach((hcItem: any, index: number) => {
  hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
  const item = allGrowthPeriods.find((item:any) => Number(item.id) == Number(hcItem.growth_period));
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
      hcItem.vaccination_ends = index < allHealthCheckupsDataNew.length-1 ?  allHealthCheckupsDataNew[index + 1]?.vaccination_opens :maxPeriodDays;
     }
    const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
    hcItem.growthMeasures = measuresForHCPeriod;
  });

  const sortedGroupsForPeriods = [...allHealthCheckupsDataNew, ...additionalMeasures].sort(
    (a: any, b: any) => Number(a.vaccination_opens) > Number(b.vaccination_opens) ?1:-1,
  );
  let upcomingPeriods = sortedGroupsForPeriods.filter(
    (period: any) => period?.vaccination_opens > childAgeIndays,
  );
  const previousPeriods = sortedGroupsForPeriods
    .filter((period: any) => period?.vaccination_opens <= childAgeIndays)
    .reverse();
   // logic to add current period to upcomingPeriods and remove it from previousPeriods
  let currentPeriod;
  if (upcomingPeriods.length > 0) {
    currentPeriod = upcomingPeriods[0];
    //currentPEriod is childAgeIndays fall in open and end
    //if there are no additionalMeasures in previperiod[0] then
    //If HCU has data, will be shown under previous
    // Next period will become upcoming HC period.
    // Once the age period of child matches the upcoming HC period, only then Add button will be displayed
   if(previousPeriods.length>0){
    if(!('uuid' in previousPeriods[0]?.growthMeasures)){
      upcomingPeriods = [previousPeriods[0], ...upcomingPeriods];
      currentPeriod = upcomingPeriods[0];
      previousPeriods.shift();
     }
    }
  }
  let totalUpcomingVaccines;
  if (upcomingPeriods?.length > 0) {
    totalUpcomingVaccines = upcomingPeriods?.map((item) => {
      return item.vaccines.length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  let totalPreviousVaccines;
  if (previousPeriods?.length > 0) {
    totalPreviousVaccines = previousPeriods?.map((item) => {
      return item.vaccines.length;
    }).reduce((accumulator, current) => {
      return accumulator + current;
    });
  }
  return { upcomingPeriods, previousPeriods,childAgeIndays, sortedGroupsForPeriods, totalUpcomingVaccines, totalPreviousVaccines, currentPeriod };
}