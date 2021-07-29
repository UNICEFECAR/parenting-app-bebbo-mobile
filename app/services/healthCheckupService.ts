import { useTranslation } from 'react-i18next';
import { MeasuresEntity } from './../database/schema/ChildDataSchema';
import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';
import { DateTime } from "luxon";
import { useAppSelector } from "../../App";

export const getAllHealthCheckupPeriods = () => {
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // console.log(activeChild.measures, "activeChild.measures");
  // const taxonomy = useAppSelector(
  //   (state: any) =>
  //     (state.utilsData.taxonomy?.allTaxonomyData!="" ?JSON.parse(state.utilsData.taxonomy?.allTaxonomyData): {}),
  // );
  // console.log(taxonomy,taxonomy.growth_period);
  let allGrowthPeriods = taxonomydata['en'][0].allData.growth_period;
  // console.log(allGrowthPeriods);
  allGrowthPeriods = allGrowthPeriods.map((item, index) => {
    // console.log(index);
    if (index == allGrowthPeriods.length - 1) {
      return {
        id: item.id,
        name: item.name,
        vaccination_opens: item.vaccination_opens,
        vaccination_ends: 2555,// days in total 7 year,
      };
    } else {
      return {
        id: item.id,
        name: item.name,
        vaccination_opens: item.vaccination_opens,
        vaccination_ends: allGrowthPeriods[index + 1].vaccination_opens,
      };

    }

  });
  // console.log(allGrowthPeriods, "taxonomydata_growth_period");
  const allMeasures = activeChild.measures.sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  // sorting measures by date
  let allMeasurements = allMeasures.map((item: MeasuresEntity) => {
    let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
    console.log(item.vaccineIds,"item.vaccineIds")
    return {
      uuid: item.uuid,
      weight: item.weight ? parseFloat(item.weight) : 0,
      height: item.height ? parseFloat(item.height) : 0,
      measurementDate: DateTime.fromJSDate(new Date(item.measurementDate)).toFormat("dd/MM/yyyy"),
      dateToMilis: item.measurementDate,
      childAgeInDaysForMeasure: Math.round(
        DateTime.fromJSDate(new Date(item.measurementDate)).diff(birthDay, 'days').days,
      ),
      titleDateInMonth: item.titleDateInMonth ? item.titleDateInMonth : '',
      measuredVaccineIds: (item.vaccineIds || item.vaccineIds!='')? JSON.parse(item.vaccineIds) : [],
      didChildGetVaccines: item.didChildGetVaccines,
      isChildMeasured: item.isChildMeasured,
      measurementPlace: item.measurementPlace,
      doctorComment: item.doctorComment
    };
  })
  // console.log(allMeasurements, "allMeasurements");
  const vaccineMeasures = activeChild.measures.filter((item) => item.didChildGetVaccines == true);
  let measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure,index) => {
    const vaccinesForAmeasure =  (measure.vaccineIds || measure.vaccineIds!=''|| measure.vaccineIds!=null) ?JSON.parse(measure.vaccineIds): [];
  //  console.log(vaccinesForAmeasure);
   if(vaccinesForAmeasure){
    vaccinesForAmeasure.forEach((vaccine,innerindex) => {
      measuredVaccines.push(vaccine);
    });
   }
    
  });
  const vaccineMeasuredInfo = (vaccineid: number) => {
    return (measuredVaccines.find(item => item.vaccineid == vaccineid))
  }

  let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  // console.log(childAgeIndays, 'childAgeIndays');

  const getVaccineOpens = (periodID) => {
    return allGrowthPeriods.find(item => item.id == periodID);
  }
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const getVaccinesForHCPeriod = (growthPeriodID) => {
    let vaccinesforHC = allVaccinePeriods.filter(item => item.growth_period == growthPeriodID);
    vaccinesforHC?.forEach(vaccine => {
      const vaccineMeasured = vaccineMeasuredInfo(vaccine.id);
      vaccine.isMeasured = vaccineMeasured ? true : false;
      vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
    })

    return vaccinesforHC;
  }
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.healthCheckupsData),
  );
  // const getPeriodTitle = (periodID) => {
  //   return allHealthCheckupsData.find(item => item.growth_period == periodID);
  // }

  let additionalMeasures:any[] = [];
  const getMeasuresForHCPeriod = (hcItem: any, currentIndex: number) => {
    const {t} = useTranslation();
    const periodForMeasure = allGrowthPeriods.find((item) => item.id == hcItem.growth_period);
    const measure = allMeasurements.filter(measure => (measure.childAgeInDaysForMeasure >= periodForMeasure.vaccination_opens) && (measure.childAgeInDaysForMeasure < periodForMeasure.vaccination_ends))
    // console.log(measure, "allmeasure",measure.length);
    if (measure.length > 1) {
      // console.log("ho<>");
      for (let i = 0; i <= measure.length - 2; i++) {
        // console.log(measure,"in loop")
        const item =  {
          created_at: hcItem.created_at,
          growthMeasures: measure[i+1],
          growth_period: hcItem.growth_period,
          id: hcItem.id,
          pinned_article: hcItem.pinned_article,
          title: t('hcSummaryHeader'),
          isAdditional:true,
          type: hcItem.type,
          updated_at: hcItem.updated_at,
          vaccination_ends: hcItem.vaccination_ends,
          vaccination_opens: hcItem.vaccination_opens,
          vaccines:[],
        }
        // console.log(item,"Additonal");
        additionalMeasures.push(item)
      }
// console.log(additionalMeasures, "additionalMeasures");




  }
  let regularMeasure = {...measure[0]};
  regularMeasure["isAdditional"]=false
  //  calculate is additional measure for the period
  return measure ? regularMeasure : null; // if no measure for the period return null, show pending vaccines
  // return  allGrowthPeriods.filter(period => {
  //   return allMeasurements.filter(item => ((item.childAgeInDaysForMeasure >=  period.vaccination_opens) &&(item.childAgeInDaysForMeasure <=    period.vaccination_ends)));
  // });
}

allHealthCheckupsData.forEach((hcItem: any, index: number) => {
  hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
  // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
  hcItem.vaccination_opens = allGrowthPeriods.find((item) => item.id == hcItem.growth_period).vaccination_opens;
  hcItem.vaccination_ends = allGrowthPeriods.find((item) => item.id == hcItem.growth_period).vaccination_ends;
  const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
  hcItem.growthMeasures = measuresForHCPeriod;
  // if(measuresForHCPeriod?.length>1){
  //   console.log("create additional measure entryfor the period");
  //     return measuresForHCPeriod.map((measure: any) => {
  //       // hcItem.growthMeasures =  hcItem.growthMeasures[0];
  //       for(let i=1;i<measuresForHCPeriod.length-1;i++){
  //         allHealthCheckupsData[index+i].growthMeasures= [(hcItem.growthMeasures[i])]
  //         allHealthCheckupsData[index+i].created_at=hcItem.created_at;
  //         allHealthCheckupsData[index+i].growth_period=hcItem.growth_period;
  //         allHealthCheckupsData[index+i].id=hcItem.id;
  //         allHealthCheckupsData[index+i].pinned_article=hcItem.pinned_article;
  //         allHealthCheckupsData[index+i].title="Additional Health checkup";
  //         allHealthCheckupsData[index+i].type=hcItem.type;
  //         allHealthCheckupsData[index+i].updated_at=hcItem.updated_at;
  //         allHealthCheckupsData[index+i].vaccination_ends=hcItem.vaccination_ends;
  //         allHealthCheckupsData[index+i].vaccination_opens=hcItem.vaccination_opens;
  //         allHealthCheckupsData[index+i].isAdditionalHC = true;
  //       }
  //     })
  //   }

});
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


let sortedGroupsForPeriods = [...allHealthCheckupsData,...additionalMeasures].sort(
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
  (period: any) => period.vaccination_opens > childAgeIndays,
);
let previousPeriods = sortedGroupsForPeriods
  .filter((period: any) => period.vaccination_opens <= childAgeIndays)
  .reverse();
// // logic to add current period to upcomingPeriods and remove it from previousPeriods
let currentPeriod;
if(previousPeriods.length>0){
currentPeriod = previousPeriods[0];
upcomingPeriods = [previousPeriods[0], ...upcomingPeriods];
previousPeriods.shift();
}
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


return { upcomingPeriods, previousPeriods, sortedGroupsForPeriods, totalUpcomingVaccines, totalPreviousVaccines,currentPeriod };
}