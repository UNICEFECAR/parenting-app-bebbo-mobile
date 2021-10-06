import { maxPeriodDays } from '@assets/translations/appOfflineData/apiConstants';
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next';
import { useAppSelector } from "../../App";
import { MeasuresEntity } from './../database/schema/ChildDataSchema';
import { formatStringDate } from './Utils';
export const getAllHealthCheckupPeriods = () => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  let allGrowthPeriods = taxonomy.growth_period;
    // filter by measurementPlace  is Doctors and sort by measurementDate
    // getall doctor's place measures
  const allMeasures = activeChild?.measures.filter((item)=>(item.measurementPlace==0)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
   // getall measures where child received vaccines but growth data marked as measured at home
  const vcMeasures = activeChild?.measures.filter((item)=>(item.measurementPlace==1 && item.didChildGetVaccines==true)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
const checkIfMeasuredVaccineExistsForLocale = (vaccineIds)=>{
  // console.log(vaccineIds,"checkIfMeasuredVaccineExistsForLocale",allVaccinePeriods)
 return vaccineIds?.filter( vcId => {
    return allVaccinePeriods?.some( el => {
      return vcId.uuid === el.uuid;
    });
  });
}
  // sorting measures by date
  let allMeasurements = [...allMeasures,...vcMeasures].map((item: MeasuresEntity) => {
    let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
    // console.log(item.vaccineIds,"item.vaccineIds")
    const filteredVaccinesForLocale = (item.vaccineIds || item.vaccineIds != '') ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(item.vaccineIds)):[]
  //  console.log(filteredVaccinesForLocale,"filteredVaccinesForLocale");
    return {
      uuid: item.uuid,
      weight: item.weight ? parseFloat(item.weight) : 0,
      height: item.height ? parseFloat(item.height) : 0,
      measurementDate: formatStringDate(item?.measurementDate, luxonLocale),
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
  // console.log(allMeasurements, "allMeasurements");
  const vaccineMeasures = activeChild.measures.filter((item) => item.didChildGetVaccines == true);
  let measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure, index) => {
    // remove uuids from array if does not exist for a countrylocale, update  measuredVaccineIds,didChildGetVaccines accordingly
    const vaccinesForAmeasure = (measure.vaccineIds || measure.vaccineIds != '' || measure.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(measure.vaccineIds)) : [];
    //  console.log(vaccinesForAmeasure);
    if (vaccinesForAmeasure) {
      vaccinesForAmeasure.forEach((vaccine, innerindex) => {
        measuredVaccines.push(vaccine);
      });
    }

  });
  const vaccineMeasuredInfo = (uuid: number) => {
    // console.log(uuid,measuredVaccines, "vaccineMeasuredInfo uuid");
    return (measuredVaccines.find(item => item.uuid == uuid))
  }

  let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  // console.log(childAgeIndays, 'childAgeIndays');
  const getVaccinesForHCPeriod = (growthPeriodID) => {
    let vaccinesforHC = allVaccinePeriods.filter(item => item.growth_period == growthPeriodID);
    vaccinesforHC?.forEach(vaccine => {
      const vaccineMeasured = vaccineMeasuredInfo(vaccine.uuid);
      // console.log(vaccineMeasured, "vaccineMeasured", vaccine.uuid);
      vaccine.isMeasured = vaccineMeasured ? true : false;
      vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
    })

    return vaccinesforHC;
  }
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.healthCheckupsData),
  );
  console.log(allHealthCheckupsData, "allHealthCheckupsData");
  let additionalMeasures: any[] = [];
  const getMeasuresForHCPeriod = (hcItem: any, currentIndex: number) => {
    const { t } = useTranslation();
    if (hcItem) {
      const measure = allMeasurements.filter(measure => (measure.childAgeInDaysForMeasure >= hcItem?.vaccination_opens) && (measure.childAgeInDaysForMeasure < hcItem?.vaccination_ends))
      // console.log(measure, "allmeasure", measure.length);
      let regularMeasure: any = {};
      if (measure.length > 1) {
        // console.log("ho<>");
        for (let i = 0; i <= measure.length - 2; i++) {
          // console.log(measure,"in loop")
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
          // console.log(item,"Additonal");
          additionalMeasures.push(item)
        }
        regularMeasure = measure[0]; 
        // console.log(regularMeasure, measure[0], "loged");
        regularMeasure["isAdditional"] = false
        // console.log(additionalMeasures, "additionalMeasures");
      } else if (measure.length > 0) {
        regularMeasure = measure[0]; 
        // console.log(regularMeasure, measure[0], "loged");
        regularMeasure["isAdditional"] = false
      } else {
        regularMeasure = {};
        // console.log(regularMeasure, measure, "loged");
        regularMeasure["isAdditional"] = false
      }
      //  calculate is additional measure for the period
      return measure ? regularMeasure : null; // if no measure for the period return null, show pending vaccines
    }
  }

  allHealthCheckupsData.map((hcItem: any) => {
    hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item) => item.id == hcItem.growth_period);
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
    }
  }).sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  console.log("allHealthCheckupsDatasorted",allHealthCheckupsData,allHealthCheckupsData.length);
  allHealthCheckupsData.reverse().forEach((hcItem: any, index: number) => {
    hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item) => item.id == hcItem.growth_period);
    // console.log(item,"hcItem",index)
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
      hcItem.vaccination_ends = (index == allHealthCheckupsData.length - 1) ? maxPeriodDays : allHealthCheckupsData[index + 1]?.vaccination_opens;
    }
    const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
    // console.log(index, measuresForHCPeriod, "measuresForHCPeriod");
    hcItem.growthMeasures = measuresForHCPeriod;

  });
  console.log(allHealthCheckupsData, "allHealthCheckupsDataNew",allHealthCheckupsData.length);
  // console.log(allHealthCheckupsData, additionalMeasures, "modifiedHealthCheckupsData");
  // console.log(groupsForPeriods, "<groupsForPeriods>");
  //  regularAndAdditionalMeasures.additionalMeasures.filter(item => item.measurementPlace === "doctor").forEach((measures) => {
  // push all additional measures to allHealthCheckupsData
  // allHealthCheckupsData = allHealthCheckupsData.map((hcItem: any,index:number) => {
  //   if(hcItem.growthMeasures.length>0){
  //   return hcItem.growthMeasures.map((measure: any) => {
  //     hcItem.growthMeasures =  hcItem.growthMeasures[0];
  //     for(let i=1;i<hcItem.growthMeasures.length-1;i++){
  //       allHealthCheckupsData[index+i].growthMeasures.push(hcItem.growthMeasures[i])
  //       allHealthCheckupsData[index+i].created_at=hcItem.created_at;
  //       allHealthCheckupsData[index+i].growth_period=hcItem.growth_period;
  //       allHealthCheckupsData[index+i].id=hcItem.id;
  //       allHealthCheckupsData[index+i].pinned_article=hcItem.pinned_article;
  //       allHealthCheckupsData[index+i].title="Additional Health checkup";
  //       allHealthCheckupsData[index+i].type=hcItem.type;
  //       allHealthCheckupsData[index+i].updated_at=hcItem.updated_at;
  //       allHealthCheckupsData[index+i].vaccination_ends=hcItem.vaccination_ends;
  //       allHealthCheckupsData[index+i].vaccination_opens=hcItem.vaccination_opens;
  //       allHealthCheckupsData[index+i].isAdditionalHC = true;
  //     }
  //     // hcItem.growthMeasures.forEach((element,innerIndex) => {
  //     //   allHealthCheckupsData[index].growthMeasures.push(hcItem.growthMeasures[innerIndex+1]);
  //     // });

  //   })
  // }else{
  //   allHealthCheckupsData[index].isAdditionalHC = false
  // }

  // })


  let sortedGroupsForPeriods = [...allHealthCheckupsData, ...additionalMeasures].sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  console.log(sortedGroupsForPeriods, "sortedGroupsForPeriods");


  // const isUpComingPeriod = (vaccination_opens: number) => {
  //   return vaccination_opens > childAgeIndays ? true : false;
  // };
  // const isPreviousPeriod = (vaccination_opens: number) => {
  //   return vaccination_opens <= childAgeIndays ? true : false;
  // };
  // sortedGroupsForPeriods.forEach((period) => {
  //   period.isUpComing = isUpComingPeriod(period.vaccination_opens);
  //   period.isPrevious = isPreviousPeriod(period.vaccination_opens);

  // });
  let upcomingPeriods = sortedGroupsForPeriods.filter(
    (period: any) => period?.vaccination_opens > childAgeIndays,
  );
  let previousPeriods = sortedGroupsForPeriods
    .filter((period: any) => period?.vaccination_opens <= childAgeIndays)
    .reverse();
  // // logic to add current period to upcomingPeriods and remove it from previousPeriods
  let currentPeriod;
  console.log(previousPeriods,upcomingPeriods,"old")
  if (upcomingPeriods.length > 0) {
    currentPeriod = upcomingPeriods[0];
    //currentPEriod is childAgeIndays fall in open and end
    //if there are no additionalMeasures in previperiod[0] then
//     If HCU has data, will be shown under previous
// Next period will become upcoming HC period.
// Once the age period of child matches the upcoming HC period, only then Add button will be displayed
    // if(previousPeriods[0]?.isAdditional != true){
    //   upcomingPeriods = [previouss
    // }
    if(previousPeriods.length>0){
    if(!('uuid' in previousPeriods[0]?.growthMeasures)){
      upcomingPeriods = [previousPeriods[0], ...upcomingPeriods];
      currentPeriod = upcomingPeriods[0];
      previousPeriods.shift();
      console.log(currentPeriod,"currentPeriod")
    }
    }
    // if(upcomingPeriods[0].growthMeasures?.uuid){
    //   previousPeriods = [upcomingPeriods[0], ...previousPeriods];
    //   previousPeriods.unshift();
    // }

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
    });;
  }
  // console.log(totalPreviousVaccines, totalUpcomingVaccines, "totalPrevVaccines");
  // console.log(allHealthCheckupsData,"growth_period_uniqueData");


  return { upcomingPeriods, previousPeriods,childAgeIndays, sortedGroupsForPeriods, totalUpcomingVaccines, totalPreviousVaccines, currentPeriod };
}