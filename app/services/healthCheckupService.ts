// import { maxPeriodDays } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from '../instances';
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next';
import { useAppSelector } from "../../App";
import { MeasuresEntity } from './../database/schema/ChildDataSchema';
import { formatStringDate } from './Utils';
import { useEffect } from 'react';
import { t } from 'i18next';
import { selectActiveChild, selectAllTaxonomyData, selectHealthCheckupsData, selectVaccineData } from './selectors';
export const getAllHealthCheckupPeriods = (): any => {
  const activeChild = useAppSelector(selectActiveChild);
  const taxonomy = useAppSelector(selectAllTaxonomyData);

  const allGrowthPeriods = taxonomy.growth_period;
  const allMeasures = activeChild?.measures.filter((item: any) => (item.measurementPlace == 0)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  // getall measures where child received vaccines but growth data marked as measured at home
  const vcMeasures = activeChild?.measures.filter((item: any) => (item.measurementPlace == 1 && item.didChildGetVaccines == true)).sort(
    (a: any, b: any) => a.measurementDate - b.measurementDate,
  );
  const allVaccinePeriods = useAppSelector(selectVaccineData);
  const checkIfMeasuredVaccineExistsForLocale = (vaccineIds: any): any => {
    return vaccineIds?.filter((vcId: any) => {
      return allVaccinePeriods?.some((el: any) => {
        return vcId.uuid === el.uuid;
      });
    });
  }
  // sorting measures by date
  const allMeasurements = [...allMeasures, ...vcMeasures].map((item: MeasuresEntity) => {
    const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
    const filteredVaccinesForLocale = (item.vaccineIds || item.vaccineIds != '') ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(item.vaccineIds)) : []
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
      didChildGetVaccines: filteredVaccinesForLocale?.length > 0 ? item.didChildGetVaccines : false,
      isChildMeasured: item.isChildMeasured,
      measurementPlace: item.measurementPlace,
      doctorComment: item.doctorComment
    };
  })
  const vaccineMeasures = activeChild.measures.filter((item: any) => item.didChildGetVaccines == true);
  const measuredVaccines: any[] = [];
  vaccineMeasures.forEach((measure: any) => {
    // remove uuids from array if does not exist for a countrylocale, update  measuredVaccineIds,didChildGetVaccines accordingly
    const vaccinesForAmeasure = (measure.vaccineIds || measure.vaccineIds != '' || measure.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(measure.vaccineIds)) : [];
    if (vaccinesForAmeasure) {
      vaccinesForAmeasure.forEach((vaccine: any) => {
        measuredVaccines.push(vaccine);
      });
    }

  });
  const vaccineMeasuredInfo = (uuid: number): any => {
    return (measuredVaccines.find(item => String(item.uuid) == String(uuid)))
  }

  const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
  const childAgeIndays = Math.round(
    DateTime.fromJSDate(new Date()).diff(birthDay, 'days').days,
  );
  const getVaccinesForHCPeriod = (growthPeriodID: any): any => {
    let vaccinesforHC: any = null;
    if (growthPeriodID == 0) {
      vaccinesforHC = allVaccinePeriods;
      vaccinesforHC?.forEach((vaccine: any) => {
        const vaccineMeasured = vaccineMeasuredInfo(vaccine.uuid);
        vaccine.isMeasured = vaccineMeasured ? true : false;
        vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
      })
      return vaccinesforHC;
    } else {
      vaccinesforHC = allVaccinePeriods?.filter((item: any) => item?.growth_period == growthPeriodID);
      vaccinesforHC?.forEach((vaccine: any) => {
        const vaccineMeasured = vaccineMeasuredInfo(vaccine.uuid);
        vaccine.isMeasured = vaccineMeasured ? true : false;
        vaccine.measurementDate = vaccineMeasured ? vaccineMeasured.measurementDate : "";
      })

      return vaccinesforHC;
    }
  }
  const allHealthCheckupsData = useAppSelector(selectHealthCheckupsData);
  const additionalMeasures: any[] = [];
  const getMeasuresForHCPeriod = (hcItem: any, currentIndex: number): any => {
    // console.log("currentIndex--",currentIndex)
    const { t } = useTranslation();
    if (hcItem && hcItem.vaccination_opens !== undefined && hcItem.vaccination_ends !== undefined) {
      const measure = allMeasurements.filter((measure: any) => (measure.childAgeInDaysForMeasure >= hcItem?.vaccination_opens) && (measure.childAgeInDaysForMeasure < hcItem?.vaccination_ends))
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
    } else {
      // const measure = allMeasurements;
      // additionalMeasures.push(allMeasurements)
      // return measure;

      const measure = allMeasurements;
      let regularMeasure: any = {};
      if (measure.length >= 1) {
        for (let i = 0; i < measure.length; i++) {
          const item = {
            created_at: measure[i].measurementDate,
            growthMeasures: measure[i],
            growth_period: 0,
            id: measure[i].uuid,
            pinned_article: 0,
            title: t('hcSummaryHeader'),
            isAdditional: true,
            type: 'isAdditional',
            updated_at: measure[i].measurementDate,
            vaccination_ends: 0,
            vaccination_opens: 0,
            vaccines: [], // no vaccines planned for additional health checkup
          }
          additionalMeasures.push(item)
        }
        console.log('Addition health checkup is', additionalMeasures)

        regularMeasure = measure[0];
        regularMeasure["isAdditional"] = true
      } else if (measure.length > 0) {
        regularMeasure = measure[0];
        regularMeasure["isAdditional"] = true
      } else {
        regularMeasure = {};
        regularMeasure["isAdditional"] = true
      }
      //  calculate is additional measure for the period
      return measure ? regularMeasure : null; // if no measure for the period return null, show pending vaccines
    }
  }

  // if(allHealthCheckupsData.length==0){
  //   allHealthCheckupsData = allMeasures;
  // }


  if (allHealthCheckupsData.length == 0) {
    getVaccinesForHCPeriod(6466)
  } else {
    allHealthCheckupsData?.map((hcItem: any) => {

      hcItem.vaccines = getVaccinesForHCPeriod(hcItem?.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
      const item = allGrowthPeriods.find((item: any) => Number(item.id) == Number(hcItem.growth_period));
      if (item) {
        hcItem.vaccination_opens = item?.vaccination_opens;
      }
    })
  }

  let allHealthCheckupsDataNew = allHealthCheckupsData.sort(
    (a: any, b: any) => Number(b.vaccination_opens) > Number(a.vaccination_opens) ? 1 : -1,
  );
  allHealthCheckupsDataNew = allHealthCheckupsDataNew.reverse();
  if (allHealthCheckupsDataNew.length == 0) {
    allHealthCheckupsDataNew = getMeasuresForHCPeriod('', 0);
    console.log('After measures period', allHealthCheckupsDataNew)
  } else {
    allHealthCheckupsDataNew?.forEach((hcItem: any, index: number) => {
      hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
      const item = allGrowthPeriods.find((item: any) => Number(item.id) == Number(hcItem.growth_period));
      if (item) {
        hcItem.vaccination_opens = item?.vaccination_opens;
        hcItem.vaccination_ends = index < allHealthCheckupsDataNew.length - 1 ? allHealthCheckupsDataNew[index + 1]?.vaccination_opens : appConfig.maxPeriodDays;
      }
      const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
      hcItem.growthMeasures = measuresForHCPeriod;
    });
  }

  allHealthCheckupsDataNew = Array.isArray(allHealthCheckupsDataNew) ? allHealthCheckupsDataNew : [allHealthCheckupsDataNew];
  const sortedGroupsForPeriods = [...allHealthCheckupsDataNew, ...additionalMeasures]?.sort(
    (a: any, b: any) => Number(a.vaccination_opens) > Number(b.vaccination_opens) ? 1 : -1,
  );
  console.log('sortedGroupsForPeriods', sortedGroupsForPeriods)
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
    if (previousPeriods.length > 0) {
      if (!('uuid' in previousPeriods[0]?.growthMeasures || '')) {
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
  return { upcomingPeriods, previousPeriods, childAgeIndays, sortedGroupsForPeriods, totalUpcomingVaccines, totalPreviousVaccines, currentPeriod };
}