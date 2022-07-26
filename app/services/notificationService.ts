import { afterDays, beforeDays, maxPeriodDays, oneMonthDays, threeeMonthDays, twoMonthDays } from "@assets/translations/appOfflineData/apiConstants";
import { DateTime } from "luxon";
import { getCurrentChildAgeInDays, isFutureDate, isFutureDateTime } from './childCRUD';
import { v4 as uuidv4 } from 'uuid';
import { TFunction } from "react-i18next";
import LocalNotifications from "./LocalNotifications";
import { Alert } from "react-native";

export const isPeriodsMovedAhead = (childAge: any, notiExist: any, child: any, allVaccinePeriods: any, allGrowthPeriods: any, allHealthCheckupsData: any,) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  const lastvcperiod = vcNotis.findIndex(item => item.growth_period == notiExist.lastvcperiodid)
  const currentvcperiod = vcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  const lasthcperiod = hcNotis.findIndex(item => item.growth_period == notiExist.lasthcperiodid)
  const currenthcperiod = hcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  if (childAgeObj.findIndex(item => item.id == notiExist.lastgwperiodid) <
    childAgeObj.findIndex(item => item.id == child.taxonomyData.id) || lastvcperiod < currentvcperiod || lasthcperiod < currenthcperiod) {
    return true
  } else {
    return false
  }
}

const IsGrowthMeasuresForPeriodExist = (child, days_from, days_to) => {
  // isGrowthMeasureExistForDate(selectedMeasureDate,activeChild)
  // if item.days_to is today's date and thne check measures not entered then only show
  // let isGrowthNotMeasureExist = false;
  if (child.measures.length > 0) {

    return child.measures.some((measure, index) => {
      const childMeasureDateInDays = DateTime.fromJSDate(new Date(measure.measurementDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
      if (days_from < childMeasureDateInDays && days_to > childMeasureDateInDays) {
        return true;
      } else {
        return false;
      }
    });
  }
}
export const getCDGWNotisForChild = (childTaxonomyData: any, child: any,prematureTaxonomy:any,childDaysTo:any,childDaysFrom:any,isNewChild:boolean) => {
  // console.log(childTaxonomyData,"..childTaxonomyData..");
  // console.log(child,"..child..")
  // console.log(prematureTaxonomy,"..22prematureTaxonomy..");
  // console.log(childDaysTo,"..33childDaysTo..",childDaysFrom,"..44childDaysFrom..")
  // childTaxonomyData.days_from childTaxonomyData.days_to
  // (childAgeInDays >= item.days_from && childAgeInDays <= item.days_to)
  // all notis between item.days_from  and item.days_to of a period
  let noti = [];
  // noti.push(//at the begginning of the period
  //   )
  //if> 3months then add noti
  //check gap between days_to and days_from
  const childBirthDatePlanned=child?.taxonomyData.prematureTaxonomyId!=null && child?.taxonomyData.prematureTaxonomyId!="" && child?.taxonomyData.prematureTaxonomyId!=undefined? child.plannedTermDate:child.birthDate;
  const activityTaxonomyId = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? child?.taxonomyData.prematureTaxonomyId : child?.taxonomyData.id;

  if((childDaysTo - childDaysFrom) <= oneMonthDays) {
    noti.push(
      {
        "days_from": childDaysFrom,
        "days_to":childDaysTo,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom == 0 ? childDaysFrom + afterDays + 1 : childDaysFrom + afterDays}),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      },
      {
        "days_from":childDaysFrom,
        "days_to": childDaysTo - beforeDays,
        "type": "cd",
        "title": ('cdNoti2'),
        "checkinField": "days_to",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysTo - beforeDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      },
    )
  }
  else if((childDaysTo - childDaysFrom) <=threeeMonthDays) {
    noti.push(
      {
        "days_from": childDaysFrom,
        "days_to": childDaysTo,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom + afterDays}),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        // "growth_period": childTaxonomyData.id,
        "growth_period": activityTaxonomyId
      })
    const diff = Math.round((childDaysTo - childDaysFrom) / oneMonthDays);
    for (var i = 0; i < diff; i++) { 
      const notificationDate = DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: (i == diff - 1) ? childDaysTo - beforeDays : childDaysTo < childDaysFrom + (i * oneMonthDays) + oneMonthDays ? childDaysTo - beforeDays : (childDaysFrom + (i * oneMonthDays) + oneMonthDays - 1) - beforeDays, });
      // check difference between today and notification date in days and if greater than or equal to oneMonthDays then isDeleted=false
      let numOfDays;
      if(isFutureDateTime(notificationDate) == true) {
        numOfDays = (DateTime.fromISO(notificationDate)).diff((DateTime.now()),'days').toObject().days
      }else {
        numOfDays = (DateTime.now()).diff((DateTime.fromISO(notificationDate)),'days').toObject().days
      }
      noti.push(
        {
          "days_from": childDaysFrom + (i * oneMonthDays),
          "days_to": (i == diff - 1) ? childDaysTo - beforeDays : childDaysTo < childDaysFrom + (i * oneMonthDays) + oneMonthDays ? childDaysTo - beforeDays : (childDaysFrom + (i * oneMonthDays) + oneMonthDays - 1) - beforeDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "notificationDate": notificationDate,
          "isRead": false,
          "isDeleted": isNewChild == true ? numOfDays < oneMonthDays - beforeDays ? false : true : false,
          "periodName": childTaxonomyData.name,
          "growth_period": activityTaxonomyId
        },
      )
    }
  }
  else {
    noti.push(
      {
        "days_from": childDaysFrom,
        "days_to": childDaysTo,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom + afterDays}),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        // "growth_period": childTaxonomyData.id,
        "growth_period": activityTaxonomyId
      })
    const diff = Math.round((childDaysTo - childDaysFrom) / twoMonthDays);
    // console.log(diff, item.days_from) //
    for (var i = 0; i < diff; i++) { 
      const notificationDate = DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: (i == diff - 1) ? childDaysTo - beforeDays : childDaysTo < childDaysFrom + (i * twoMonthDays) + twoMonthDays ? childDaysTo - beforeDays : (childDaysFrom + (i * twoMonthDays) + twoMonthDays - 1) - beforeDays, });
      // check difference between today and notification date in days and if greater than or equal to twoMonthDays then isDeleted=false
      let numOfDays;
      if(isFutureDateTime(notificationDate) == true) {
        numOfDays = (DateTime.fromISO(notificationDate)).diff((DateTime.now()),'days').toObject().days
      }else {
        numOfDays = (DateTime.now()).diff((DateTime.fromISO(notificationDate)),'days').toObject().days
      }
      noti.push(
        {
          "days_from": childDaysFrom + (i * twoMonthDays),
          "days_to": (i == diff - 1) ? childDaysTo - beforeDays : childDaysTo < childDaysFrom + (i * twoMonthDays) + twoMonthDays ? childDaysTo - beforeDays : (childDaysFrom + (i * twoMonthDays) + twoMonthDays - 1) - beforeDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "notificationDate": notificationDate,
          "isRead": false,
          "isDeleted": isNewChild == true ? numOfDays < twoMonthDays - beforeDays ? false : true : false,
          "periodName": childTaxonomyData.name,
          "growth_period": activityTaxonomyId
        },
      )
    }
  }

  if((childTaxonomyData.days_to - childTaxonomyData.days_from) >= threeeMonthDays){
    const diff = Math.round((childTaxonomyData.days_to - childTaxonomyData.days_from) / twoMonthDays);
    for (var i = 0; i < diff; i++) {
      const notificationDate = DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays - 2 });
      // check difference between today and notification date in days and if greater than or equal to twoMonthDays then isDeleted=false
      const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, childTaxonomyData.days_from + (i * twoMonthDays), (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays - 2)
      if (!isGrowthDataExist) {
        let numOfDays2;
        if(isFutureDateTime(notificationDate) == true) {
          numOfDays2 = (DateTime.fromISO(notificationDate)).diff((DateTime.now()),'days').toObject().days
        }else {
          numOfDays2 = (DateTime.now()).diff((DateTime.fromISO(notificationDate)),'days').toObject().days
        }
        noti.push(
          {
            "days_from": childTaxonomyData.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays - 2,
            "type": "gw",
            "title": ('gwNoti1'),
            "checkinField": "days_from",
            "notificationDate": notificationDate,
            "isRead": false,
            "isDeleted": isNewChild == true ? numOfDays2 < twoMonthDays ? false : true : false,
            "periodName": childTaxonomyData.name,
            "growth_period": childTaxonomyData.id,
          },
        )
      }
     
    }
  }else {
    const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, childTaxonomyData.days_from, childTaxonomyData.days_to - 1)
    // if growth measure does not exist in that child age period, noti  should be added
    if (!isGrowthDataExist) {
      noti.push(
        {
          "days_from": childTaxonomyData.days_from,
          "days_to": childTaxonomyData.days_to,
          "type": "gw",
          "title": ('gwNoti1'),
          "checkinField": "days_to",
          "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: childTaxonomyData.days_to - 1 }),
          "isRead": false,
          "isDeleted": false,
          "periodName": childTaxonomyData.name,
          "growth_period": childTaxonomyData.id,
        })
    }
  }  
  return noti;
}
export const getNextChildNotification = (gwperiodid: any, vcperiodid: any, hcperiodid: any, child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childBirthDatePlanned=child?.taxonomyData.prematureTaxonomyId!=null && child?.taxonomyData.prematureTaxonomyId!="" && child?.taxonomyData.prematureTaxonomyId!=undefined? child.plannedTermDate:child.birthDate;
  const childAgeInDaysForCD = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(childBirthDatePlanned)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const activityTaxonomyId = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? child?.taxonomyData.prematureTaxonomyId : child?.taxonomyData.id;
  const lastchildgwperiod = childAgeObj.find(item => String(item.id) == String(gwperiodid));
  let vcnotis: any[] = [];
  let hcnotis: any[] = [];
  let lastgwperiodid = gwperiodid, lastvcperiodid = vcperiodid, lasthcperiodid = hcperiodid;
  let gwcdnotis: any[] = [];
  if(lastchildgwperiod!=null && lastchildgwperiod!=undefined && lastchildgwperiod!=""){
  const lastchildgwperiodIndex = childAgeObj.findIndex(item => String(item.id) == String(gwperiodid));
  const currentchildgwperiod = childAgeObj.find(element => element.days_from > lastchildgwperiod.days_from && element.days_from <= childAgeInDaysForCD);
  const currentchildgwperiodIndex = childAgeObj.findIndex(element => element.days_from > lastchildgwperiod.days_from && element.days_to > childAgeInDaysForCD && element.days_from <= childAgeInDaysForCD);
  const prematurechildgwperiod = childAgeObj.find(item => String(item.id) == String(activityTaxonomyId));
  console.log(prematurechildgwperiod,"..prematurechildgwperiod..");
  //find next period and calculate for it and return for gw cd noti
  for (let i = lastchildgwperiodIndex + 1; i <= currentchildgwperiodIndex; i++) {
    const childDaysTo = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? prematurechildgwperiod.days_to : childAgeObj[i].days_to;
    const childDaysFrom = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? prematurechildgwperiod.days_from : childAgeObj[i].days_from;
    let currentgwPeriodNoti = getCDGWNotisForChild(childAgeObj[i], child,prematurechildgwperiod,childDaysTo,childDaysFrom,false);
    lastgwperiodid = childAgeObj[i].id;
    // if (gwperiodid != lastgwperiodid) {
    currentgwPeriodNoti.forEach((noti) => {
      gwcdnotis.push(noti)
    })
    // }
  }
  }
  ///perform computation for hc,vc
  // get all notis between last period id to current running period
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  const lastvcperiod = vcNotis.findIndex(item => item.growth_period == vcperiodid)
  const currentvcperiod = vcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  if(lastvcperiod>=0){
  vcNotis.forEach((element: any, index: number) => {
    if (index > lastvcperiod && index <= currentvcperiod) {
      lastvcperiodid = element.growth_period;
      vcnotis.push(element);
    }
  });
}

  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  console.log(hcNotis, "hcNotis")
  const lasthcperiod = hcNotis.findIndex(item => item.growth_period == hcperiodid)
  const currenthcperiod = hcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  if(lasthcperiod>=0){
  hcNotis.forEach((element: any, index: number) => {
    if (index > lasthcperiod && index <= currenthcperiod) {
      lasthcperiodid = element.growth_period;
      hcnotis.push(element);
    }
  });
  } 
  if (vchcEnabledFlag == false) {
    vcnotis = [...vcnotis].map(item => {
        return { ...item, isDeleted: true };
    })
    hcnotis = [...hcnotis].map(item => {
        return { ...item, isDeleted: true };
    })
  }
  if (growthEnabledFlag == false) {
    gwcdnotis = [...gwcdnotis]?.map((item) => {
      if (item.type == 'gw') {
          return { ...item, isDeleted: true };
      } else {
        return { ...item };
      }
    })
  }
  if (developmentEnabledFlag == false) {
    gwcdnotis = [...gwcdnotis]?.map((item) => {
      if (item.type == 'cd') {
          return { ...item, isDeleted: true };
      } else {
        return { ...item };
      }
    })
  }
  let notis = {
    lastgwperiodid, gwcdnotis,
    lastvcperiodid, vcnotis,
    lasthcperiodid, hcnotis,
  }
  return notis

}
export const getChildNotification = (child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean) => {
  if (child.birthDate != null && child.birthDate != undefined) {
    const childBirthDatePlanned=child?.taxonomyData.prematureTaxonomyId!=null && child?.taxonomyData.prematureTaxonomyId!="" && child?.taxonomyData.prematureTaxonomyId!=undefined? child.plannedTermDate:child.birthDate;
    const childAgeInDaysForCD = getCurrentChildAgeInDays(
      DateTime.fromJSDate(new Date(childBirthDatePlanned)).toMillis(),
    );
    const activityTaxonomyId = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? child?.taxonomyData.prematureTaxonomyId : child?.taxonomyData.id;
 
    const prematurechildgwperiod = childAge.find(item => String(item.id) == String(activityTaxonomyId));
    const childAgeInDays = getCurrentChildAgeInDays(
      DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
    );
    const childCreateDate = DateTime.fromJSDate(new Date(child.createdAt)).toMillis();
    const childBirthDate = DateTime.fromJSDate(new Date(child.birthDate)).toMillis();
    const childDaysTo = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? prematurechildgwperiod.days_to : child.taxonomyData.days_to;
    const childDaysFrom = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? prematurechildgwperiod.days_from : child.taxonomyData.days_from;
    if (!isFutureDate(child?.birthDate)) {
      let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child);
      //sort by days_from => find days_from period id to
      let currentvcPeriodNoti = vcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)

      let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
      let currenthcPeriodNoti = hcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


      if (vchcEnabledFlag == false) {
        if(currentvcPeriodNoti.length > 0){
        currentvcPeriodNoti = [...currentvcPeriodNoti].map(item => {
            return { ...item, isDeleted: true };
        })
      }
      if(currenthcPeriodNoti.length > 0){
        currenthcPeriodNoti = [...currenthcPeriodNoti].map(item => {
            return { ...item, isDeleted: true };
        })
      }
      }


      let currentgwPeriodNoti = getCDGWNotisForChild(child.taxonomyData, child,prematurechildgwperiod,childDaysTo,childDaysFrom,true)
      if (growthEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item) => {
          if (item.type == 'gw') {
              return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
      }
      if (developmentEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item) => {
          if (item.type == 'cd') {
              return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
      }
      if (currentvcPeriodNoti && currenthcPeriodNoti && currentgwPeriodNoti) {
        let notis = {
          lastgwperiodid: child.taxonomyData.id, 
          gwcdnotis: currentgwPeriodNoti,
          lastvcperiodid: currentvcPeriodNoti.length>0 ? currentvcPeriodNoti[0].growth_period : 0, vcnotis: currentvcPeriodNoti,
          lasthcperiodid: currenthcPeriodNoti.length>0 ? currenthcPeriodNoti[0].growth_period : 0, hcnotis: currenthcPeriodNoti,
        }
       console.log('notis',JSON.stringify(notis));
        // show current period's notifications if child was created after birth date (expecting child)
        return notis
      }
    }
    else {
      return {
        // no notifications for expecting child 
      }

    }
  }
}
export const getChildReminderNotifications = (child: any, reminderNotis: any, vchcEnabledFlag: boolean) => {
  ///get existing notis and compare for isread and is deleted
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  let noti: any[] = [];
  const filteredPastRemidnerNotis = reminderNotis.filter((item:any)=> !isFutureDateTime(new Date(item.notificationDate)));
    if(filteredPastRemidnerNotis.length > 0) {
      filteredPastRemidnerNotis.map((x:any) => {
        noti.push(x);
      })
  }
  if (child?.reminders && child.reminders?.length > 0) {
    child.reminders?.forEach((element: any, index: number) => {

        const childvcReminderDateInDays = DateTime.fromJSDate(new Date(element.reminderDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
        const childvcReminderDateInDaysDefined = DateTime.fromJSDate(new Date(element.reminderDateDefined)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
          //find hc and vc reminder in existing notis by type
          // if hc exists, add vc ,and vica versa 
          // or add one that exists
          const itemtype = element.reminderType == 'vaccine' ? 'vcr' : 'hcr';
          
          const futurereminderexist = reminderNotis.filter((item:any) => item.uuid == element.uuid && item.type == itemtype && isFutureDateTime(new Date(item.notificationDate)) )
          const reminderexist = reminderNotis.filter((item:any) => item.uuid == element.uuid && item.type == itemtype);
          //get only past reminders  till today and filter by child age
          let finalremDT:any, finalremDTDefined:any;  
            const onlyDate = new Date(element.reminderDate);
            finalremDT = onlyDate.setHours(new Date(element.reminderTime).getHours());
            finalremDT = new Date(onlyDate.setMinutes(new Date(element.reminderTime).getMinutes()));
            const onlyDateDefined = new Date(element.reminderDateDefined);
            finalremDTDefined = onlyDateDefined.setHours(new Date(element.reminderTimeDefined).getHours());
            finalremDTDefined = new Date(onlyDateDefined.setMinutes(new Date(element.reminderTimeDefined).getMinutes()));
          if (futurereminderexist.length > 0) {
            const futureStartReminder =  reminderNotis.filter((item:any) => item.uuid == element.uuid && item.type == itemtype && item.subtype == 'start' );
            const futureMidReminder =  futurereminderexist.find((x:any) => x.subtype == 'reminder');
            const futureScheduledReminder =  futurereminderexist.find((x:any) => x.subtype == 'scheduled');
            if(futureMidReminder || futureScheduledReminder) {
              if(element.reminderDate == futureScheduledReminder.periodName && element.reminderTime == futureScheduledReminder.growth_period && element.reminderDateDefined == futureStartReminder[0].periodName && element.reminderTimeDefined == futureStartReminder[0].growth_period)
              {

              }else {
                noti.push({
                  "days_from": Math.floor(childvcReminderDateInDaysDefined),
                  "days_to": Math.floor(childvcReminderDateInDaysDefined),
                  "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                  "subtype": "start",
                  "subtypeid": uuidv4(),
                  "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
                  "checkinField": "days_from",
                  "notificationDate": DateTime.fromJSDate(new Date()),
                  "isRead": false,
                  "isDeleted": vchcEnabledFlag == false ? true : false,
                  "growth_period": element.reminderTimeDefined,
                  "periodName": element.reminderDateDefined,
                  "uuid": element.uuid,
                })
              }
            }
            if(futureMidReminder && futureMidReminder != undefined) {
                noti.push({
                  "days_from": Math.floor(childvcReminderDateInDays),
                  "days_to": Math.floor(childvcReminderDateInDays),
                  "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                  "subtype": "reminder",
                  "subtypeid": uuidv4(),
                  "title": element.reminderType == 'vaccine' ? ('vcrNoti2') : ('hcrNoti2'),
                  "checkinField": "days_from",
                  "notificationDate": DateTime.fromJSDate(finalremDTDefined),
                  "isRead": false,
                  "isDeleted": vchcEnabledFlag == false ? true : false,
                  "growth_period": element.reminderTime,
                  "periodName": element.reminderDate,
                  "uuid": element.uuid,
                })
            }
            if(futureScheduledReminder && futureScheduledReminder != undefined && futureScheduledReminder != null) {
              if(futureMidReminder == null || futureMidReminder == undefined) {
                if(element.reminderDate == futureScheduledReminder.periodName && element.reminderTime == futureScheduledReminder.growth_period && element.reminderDateDefined == futureStartReminder[0].periodName && element.reminderTimeDefined == futureStartReminder[0].growth_period) {
                }else {
                  noti.push({
                    "days_from": Math.floor(childvcReminderDateInDays),
                    "days_to": Math.floor(childvcReminderDateInDays),
                    "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                    "subtype": "reminder",
                    "subtypeid": uuidv4(),
                    "title": element.reminderType == 'vaccine' ? ('vcrNoti2') : ('hcrNoti2'),
                    "checkinField": "days_from",
                    "notificationDate": DateTime.fromJSDate(finalremDTDefined),
                    "isRead": false,
                    "isDeleted": vchcEnabledFlag == false ? true : false,
                    "growth_period": element.reminderTime,
                    "periodName": element.reminderDate,
                    "uuid": element.uuid,
                  })
                }
              }
              noti.push({
                "days_from": Math.floor(childvcReminderDateInDays+1),
                "days_to": Math.floor(childvcReminderDateInDays+1),
                "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                "subtype": "scheduled",
                "subtypeid": uuidv4(),
                "title": element.reminderType == 'vaccine' ? ('vcrNoti3') : ('hcrNoti3'),
                "checkinField": "days_from",
                "notificationDate": DateTime.fromJSDate(finalremDT),
                "isRead": false,
                "isDeleted": vchcEnabledFlag == false ? true : false,
                "growth_period": element.reminderTime,
                "periodName": element.reminderDate,
                "uuid": element.uuid,
              })
            }
                        
          } 
          if(reminderexist.length == 0) {
                // a reminder has been set for {schedule date}.This will come as soon as reminder is created
                noti.push({
                  "days_from": Math.floor(childvcReminderDateInDaysDefined),
                  "days_to": Math.floor(childvcReminderDateInDaysDefined),
                  "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                  "subtype": "start",
                  "subtypeid": uuidv4(),
                  "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
                  "checkinField": "days_from",
                  "notificationDate": DateTime.fromJSDate(new Date()),
                  "isRead": false,
                  "isDeleted": vchcEnabledFlag == false ? true : false,
                  "growth_period": element.reminderTimeDefined,
                  "periodName": element.reminderDateDefined,
                  "uuid": element.uuid,
                })
                // 1 reminder on defined reminder date
                noti.push({
                  "days_from": Math.floor(childvcReminderDateInDays),
                  "days_to": Math.floor(childvcReminderDateInDays),
                  "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                  "subtype": "reminder",
                  "subtypeid": uuidv4(),
                  "title": element.reminderType == 'vaccine' ? ('vcrNoti2') : ('hcrNoti2'),
                  "checkinField": "days_from",
                  "notificationDate": DateTime.fromJSDate(finalremDTDefined),
                  "isRead": false,
                  "isDeleted": vchcEnabledFlag == false ? true : false,
                  "growth_period": element.reminderTime,
                  "periodName": element.reminderDate,
                  "uuid": element.uuid,
                })
                //schedule date
                // if (Math.floor(childvcReminderDateInDays) <= childAgeInDays) {
                  noti.push({
                    "days_from": Math.floor(childvcReminderDateInDays+1),
                    "days_to": Math.floor(childvcReminderDateInDays+1),
                    "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                    "subtype": "scheduled",
                    "subtypeid": uuidv4(),
                    "title": element.reminderType == 'vaccine' ? ('vcrNoti3') : ('hcrNoti3'),
                    "checkinField": "days_from",
                    "notificationDate": DateTime.fromJSDate(finalremDT),
                    "isRead": false,
                    "isDeleted": vchcEnabledFlag == false ? true : false,
                    "growth_period": element.reminderTime,
                    "periodName": element.reminderDate,
                    "uuid": element.uuid,
                  })
          }

    });
  }
  let sortednoti = noti.sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  return sortednoti;
}
export const getVCPeriods = (allVaccinePeriods: any) => {
  var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj: any, item: any) {
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id, uuid: item.uuid, title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
    return obj;
  }, {});
  let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
    return { periodID: key, vaccines: group_to_growthPeriod[key] };
  });

  return groupsForPeriods
}
export const getVCNotis = (allVaccinePeriods: any, allGrowthPeriods: any, child: any) => {
  if(allVaccinePeriods.length>0 && allGrowthPeriods.length>0){

 
  let noti: any[] = [];
  let groupsForPeriods = getVCPeriods(allVaccinePeriods);
  groupsForPeriods.forEach((item: any, index: number) => {
    const period = allGrowthPeriods.find((gwitem: any) => gwitem.id == Number(item.periodID));
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;

    }
  })
  groupsForPeriods.map((item: any, index: number) => {
    item.vaccination_opens = item.vaccination_opens;
    item.vaccination_closes = (index == groupsForPeriods.length - 1) ? maxPeriodDays : groupsForPeriods[index + 1].vaccination_opens;
  })
  groupsForPeriods.forEach((item: any, index: number) => {
    noti.push({
      "days_from": item?.vaccination_opens,
      "days_to": item?.vaccination_closes,
      "type": "vc",
      "title": ('vcNoti1'),
      "checkinField": "days_from",
      "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (item?.vaccination_opens) }),
      "isRead": false,
      "isDeleted": false,
      "growth_period": Number(item?.periodID),
      "periodName": item?.periodName,
    })
  });
  let sortednoti = noti.sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  return sortednoti;
}
}
export const getHCReminderNotis = (allHealthCheckupsData: any, allGrowthPeriods: any, child: any) => {
  let noti: any[] = [];
  allHealthCheckupsData.map((hcItem: any) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item: any) => item.id == hcItem.growth_period);
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
    }
  })
  let allHCData = allHealthCheckupsData.sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  allHCData.forEach((hcItem: any, index: number) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item: any) => item.id == hcItem.growth_period);
    if (item) {
      noti.push({
        "days_from": item?.vaccination_opens,
        "days_to": (index == allHCData.length - 1) ? maxPeriodDays : allHCData[index + 1]?.vaccination_opens,
        "type": "hc",
        "title": ('hcNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (item?.vaccination_opens) }),
        "isRead": false,
        "isDeleted": false,
        "growth_period": hcItem.growth_period,
        "periodName": hcItem.title
      })
    }

  });
  return noti;
}
const getVaccinesForPeriod = (allVaccineData:any,period: string) => {
  const allvc = allVaccineData.filter((item) => item.growth_period == period);
  let vc = ' ';
  allvc.map((item: any, index: number) => {
    if (index == allvc.length - 1) {
      vc += `${item.title}.`
    } else {
      vc += `${item.title}, `
    }
  })
  return vc;
}
const generatenotiId = (localNotifications:any,allNotis:any) => {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  const commonArr = localNotifications?.find((x: any) => x.data.some(item => item.notiid == String(rand)));
  const commonArr2 = allNotis?.data?.find((item:any) => item.notiid == String(rand));
  if(commonArr != null && commonArr != {} && commonArr != undefined) {
    generatenotiId(localNotifications,allNotis);
  }else if(commonArr2 != null && commonArr2 != {} && commonArr2 != undefined) {
    generatenotiId(localNotifications,allNotis);
  }else {
    return rand;
  }
} 
export const createAllLocalNotificatoins = (child: any, childAge: any,developmentEnabledFlag: boolean, growthEnabledFlag: boolean, vchcEnabledFlag: boolean,t: any,allVaccinePeriods:any, allGrowthPeriods:any, allHealthCheckupsData:any, allVaccineData: any,localNotifications:any) => {	
    let allNotis: any[] = [];
    const childBirthDatePlanned=child?.taxonomyData.prematureTaxonomyId!=null && child?.taxonomyData.prematureTaxonomyId!="" && child?.taxonomyData.prematureTaxonomyId!=undefined? child.plannedTermDate:child.birthDate;
    const activityTaxonomyId = child?.taxonomyData.prematureTaxonomyId != null && child?.taxonomyData.prematureTaxonomyId != undefined && child?.taxonomyData.prematureTaxonomyId != "" ? child?.taxonomyData.prematureTaxonomyId : child?.taxonomyData.id;
    const childAgeObj = childAge.sort(
      (a: any, b: any) => a.days_from - b.days_from,
    );
    const filteredchildAgeObj = childAgeObj.filter((x:any) => x.id >= activityTaxonomyId);
    // for CD 1st day of period and 5 days before period end
    filteredchildAgeObj.map((agebracket:any)=> {

        if ((agebracket.days_to - agebracket.days_from) <= oneMonthDays) {
          if(developmentEnabledFlag == true) { 
            const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: agebracket.days_from == 0 ? agebracket.days_from + afterDays + 1 : agebracket.days_from + afterDays });
            if(isFutureDateTime(new Date(notificationDate))) 
            {
              const message = t('cdNoti1', { childName:
                child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name }); 
              const currNotiId = generatenotiId(localNotifications,allNotis)
              allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate,'notiMsg':message});
              // LocalNotifications.schduleNotification(new Date(notificationDate),t('remindersAlertTitle'),message,currNotiId); 
            }
            const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: agebracket.days_to - beforeDays});
            if(isFutureDateTime(new Date(notificationDate2))) 
            {
              const message2 = t('cdNoti2', { childName:
                child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name });
              const currNotiId = generatenotiId(localNotifications,allNotis)
              allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate2,'notiMsg':message2});
              // LocalNotifications.schduleNotification(new Date(notificationDate2),t('remindersAlertTitle'),message2,currNotiId); 
            }
          }
          if(growthEnabledFlag == true) {
            const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from, agebracket.days_to)
            if (!isGrowthDataExist) {
              const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(6,0,0,0))).plus({ days: agebracket.days_to - 1});
              if(isFutureDateTime(new Date(notificationDate3))) 
              {
                const message3 = t('gwNoti1', { childName:
                  child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name }); 
                const currNotiId = generatenotiId(localNotifications,allNotis)
                allNotis.push({'type':'gw','notiid':currNotiId,'notiDate':notificationDate3,'notiMsg':message3});
                // LocalNotifications.schduleNotification(new Date(notificationDate3),t('remindersAlertTitle'),message3,currNotiId);
              }
            }
          }
        }
        else if((agebracket.days_to - agebracket.days_from) <= threeeMonthDays) {
          if(developmentEnabledFlag == true){
            const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: agebracket.days_from + afterDays });
            if(isFutureDateTime(new Date(notificationDate))) 
            {
              const message = t('cdNoti1', { childName:
                child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name }); 
              const currNotiId = generatenotiId(localNotifications,allNotis)
              allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate,'notiMsg':message});
              // LocalNotifications.schduleNotification(new Date(notificationDate),t('remindersAlertTitle'),message,currNotiId); 
            }
          }
          //notification for growth
          if(growthEnabledFlag == true) {
            const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from, agebracket.days_to)
            if (!isGrowthDataExist) {
              const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(6,0,0,0))).plus({ days: agebracket.days_to - 1 });
              if(isFutureDateTime(new Date(notificationDate3))) 
              {
                const message3 = t('gwNoti1', { childName:
                  child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name }); 
                const currNotiId = generatenotiId(localNotifications,allNotis)
                allNotis.push({'type':'gw','notiid':currNotiId,'notiDate':notificationDate3,'notiMsg':message3});
                // LocalNotifications.schduleNotification(new Date(notificationDate3),t('remindersAlertTitle'),message3,currNotiId);
              }
            }
          }
          const diff = Math.round((agebracket.days_to - agebracket.days_from) / oneMonthDays);
          for (var i = 0; i < diff; i++) {
            if(developmentEnabledFlag == true) {
              const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: (i == diff - 1) ? agebracket.days_to - beforeDays : agebracket.days_to < agebracket.days_from + (i * oneMonthDays) + oneMonthDays ? agebracket.days_to - beforeDays : (agebracket.days_from + (i * oneMonthDays) + oneMonthDays - 1) - beforeDays, });
              if(isFutureDateTime(new Date(notificationDate2))) 
              {
                const message2 = t('cdNoti2', { childName:
                  child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name });
                const currNotiId = generatenotiId(localNotifications,allNotis)
                allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate2,'notiMsg':message2});
                // LocalNotifications.schduleNotification(new Date(notificationDate2),t('remindersAlertTitle'),message2,currNotiId); 
              }
            }

          }
        }
        else {
          if(developmentEnabledFlag == true){
            const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: agebracket.days_from + afterDays });
            if(isFutureDateTime(new Date(notificationDate))) 
            {
              const message = t('cdNoti1', { childName:
                child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name }); 
              const currNotiId = generatenotiId(localNotifications,allNotis)
              allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate,'notiMsg':message});
              // LocalNotifications.schduleNotification(new Date(notificationDate),t('remindersAlertTitle'),message,currNotiId); 
            }
          }
          const diff = Math.round((agebracket.days_to - agebracket.days_from) / twoMonthDays);
          for (var i = 0; i < diff; i++) {
            if(developmentEnabledFlag == true) {
              const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(6,0,0,0))).plus({ days: (i == diff - 1) ? agebracket.days_to - beforeDays : agebracket.days_to < agebracket.days_from + (i * twoMonthDays) + twoMonthDays ? agebracket.days_to - beforeDays : (agebracket.days_from + (i * twoMonthDays) + twoMonthDays - 1) - beforeDays, });
              if(isFutureDateTime(new Date(notificationDate2))) 
              {
                const message2 = t('cdNoti2', { childName:
                  child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name });
                const currNotiId = generatenotiId(localNotifications,allNotis)
                allNotis.push({'type':'cd','notiid':currNotiId,'notiDate':notificationDate2,'notiMsg':message2});
                // LocalNotifications.schduleNotification(new Date(notificationDate2),t('remindersAlertTitle'),message2,currNotiId); 
              }
            }
            //notification for growth
            if(growthEnabledFlag == true) {
              const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from + (i * twoMonthDays), (i == diff - 1) ? agebracket.days_to - 1 : agebracket.days_to < agebracket.days_from + (i * twoMonthDays) + twoMonthDays ? agebracket.days_to - 1: agebracket.days_from + (i * twoMonthDays) + twoMonthDays - 2)
              if (!isGrowthDataExist) {
                const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(6,0,0,0))).plus({ days: (i == diff - 1) ? agebracket.days_to - 1 : agebracket.days_to < agebracket.days_from + (i * twoMonthDays) + twoMonthDays ? agebracket.days_to - 1 : agebracket.days_from + (i * twoMonthDays) + twoMonthDays - 2 });
                if(isFutureDateTime(new Date(notificationDate3))) 
                {
                  const message3 = t('gwNoti1', { childName:
                    child.childName != null &&
                    child.childName != '' &&
                    child.childName != undefined
                    ? child.childName
                    : '', periodName: agebracket.name }); 
                  const currNotiId = generatenotiId(localNotifications,allNotis)
                  allNotis.push({'type':'gw','notiid':currNotiId,'notiDate':notificationDate3,'notiMsg':message3});
                  // LocalNotifications.schduleNotification(new Date(notificationDate3),t('remindersAlertTitle'),message3,currNotiId);
                }
              }
            }

          }
        }
        
    })

    if(vchcEnabledFlag == true) {
      let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
        (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
      );

      let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);

      vcNotis.map((vc:any) => {
        const notificationDate4 = DateTime.fromJSDate(new Date(new Date(vc.notificationDate).setHours(6,0,0,0)))
        if(isFutureDateTime(new Date(notificationDate4))) 
        {
          const message4 = t(vc.title, {
            childName:
                child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: vc.periodName
          }) + getVaccinesForPeriod(allVaccineData,vc.growth_period)
          const currNotiId = generatenotiId(localNotifications,allNotis)
          allNotis.push({'type':'vc','notiid':currNotiId,'notiDate':notificationDate4,'notiMsg':message4});
          // LocalNotifications.schduleNotification(new Date(notificationDate4),t('remindersAlertTitle'),message4,currNotiId); 
        }
      })

      hcNotis.map((hc:any) => {
        const notificationDate5 = DateTime.fromJSDate(new Date(new Date(hc.notificationDate).setHours(6,0,0,0)))
        if(isFutureDateTime(new Date(notificationDate5))) 
        {
          const message5 = t(hc.title, { childName:
            child.childName != null &&
            child.childName != '' &&
            child.childName != undefined
            ? child.childName
            : '', periodName: hc.periodName })
          const currNotiId = generatenotiId(localNotifications,allNotis)
          allNotis.push({'type':'hc','notiid':currNotiId,'notiDate':notificationDate5,'notiMsg':message5});
          // LocalNotifications.schduleNotification(new Date(notificationDate5),t('remindersAlertTitle'),message5,currNotiId); 
        }
      })
    }
    return {'key':child.uuid,'data' : [...allNotis]};
}

