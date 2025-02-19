// import { afterDays, appConfig.beforeDays, appConfig.maxPeriodDays, appConfig.oneMonthDays, appConfig.threeeMonthDays, appConfig.twoMonthDays } from "@assets/translations/appOfflineData/apiConstants";
import { appConfig } from "../instance";
import { DateTime } from "luxon";
import { getCurrentChildAgeInDays, isFutureDate, isFutureDateTime } from './childCRUD';
import { v4 as uuid } from 'uuid';

export const getVCPeriods = (allVaccinePeriods: any): any => {
  const groupToGrowthPeriod = allVaccinePeriods.reduce(function (obj: any, item: any) {
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id, uuid: item.uuid, title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
    return obj;
  }, {});
  const groupsForPeriods: any = Object.keys(groupToGrowthPeriod).map(function (key) {
    return { periodID: key, vaccines: groupToGrowthPeriod[key] };
  });

  return groupsForPeriods
}
export const getVCNotis = (allVaccinePeriods: any, allGrowthPeriods: any, child: any): any => {
  if (allVaccinePeriods.length > 0 && allGrowthPeriods.length > 0) {
    const noti: any[] = [];
    const groupsForPeriods = getVCPeriods(allVaccinePeriods);
    groupsForPeriods.forEach((item: any) => {
      const period = allGrowthPeriods.find((gwitem: any) => gwitem.id == Number(item.periodID));
      if (period) {
        item.periodName = period.name;
        item.vaccination_opens = period.vaccination_opens;

      }
    })
    const sortedGroupForPeriod = groupsForPeriods.sort(
      (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
    );
    sortedGroupForPeriod.map((item: any, index: number) => {
      const vaccination_opens = item.vaccination_opens;
      item.vaccination_opens = vaccination_opens;
      item.vaccination_closes = (index == sortedGroupForPeriod.length - 1) ? appConfig.maxPeriodDays : sortedGroupForPeriod[index + 1].vaccination_opens;
    })
    sortedGroupForPeriod.forEach((item: any) => {
      // console.log(DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (item?.vaccination_opens) }),"notificationDate")
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
    const sortednoti = noti.sort(
      (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
    );
    // console.log('SortedNoti',sortednoti)
    return sortednoti;
  }
}
export const getHCReminderNotis = (allHealthCheckupsData: any, allGrowthPeriods: any, child: any): any => {
  const noti: any[] = [];
  allHealthCheckupsData.map((hcItem: any) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item: any) => item.id == hcItem.growth_period);
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
    }
  })
  const allHCData = allHealthCheckupsData.sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  allHCData.forEach((hcItem: any, index: number) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item: any) => item.id == hcItem.growth_period);
    if (item) {
      noti.push({
        "days_from": item?.vaccination_opens,
        "days_to": (index == allHCData.length - 1) ? appConfig.maxPeriodDays : allHCData[index + 1]?.vaccination_opens,
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
export const isPeriodsMovedAhead = (childAge: any, notiExist: any, child: any, allVaccinePeriods: any, allGrowthPeriods: any, allHealthCheckupsData: any,): any => {
  // console.log(allVaccinePeriods,typeof allVaccinePeriods,"..isPeriodsMovedAheadallVaccinePeriods.length")

  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  const lastvcperiod = vcNotis.findIndex((item: any) => item.growth_period == notiExist.lastvcperiodid)
  const currentvcperiod = vcNotis.findIndex((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  const hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  const lasthcperiod = hcNotis.findIndex((item: any) => item.growth_period == notiExist.lasthcperiodid)
  const currenthcperiod = hcNotis.findIndex((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  if (childAgeObj.findIndex((item: any) => item.id == notiExist.lastgwperiodid) <
    childAgeObj.findIndex((item: any) => item.id == child.taxonomyData.id) || lastvcperiod < currentvcperiod || lasthcperiod < currenthcperiod) {
    return true
  } else {
    return false
  }
}

const IsGrowthMeasuresForPeriodExist = (child: any, daysFrom: any, daysTo: any): any => {
  if (child.measures.length > 0) {

    return child.measures.some((measure: any) => {
      const childMeasureDateInDays = DateTime.fromJSDate(new Date(measure.measurementDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
      if (daysFrom < childMeasureDateInDays && daysTo > childMeasureDateInDays) {
        return true;
      } else {
        return false;
      }
    });
  }
}
export const getCDGWNotisForChild = (childTaxonomyData: any, child: any, prematureTaxonomy: any, childDaysTo: any, childDaysFrom: any, isNewChild: boolean): any => {
  // all notis between item.days_from  and item.days_to of a period
  const noti = [];
  // noti.push(//at the begginning of the period
  //if> 3months then add noti
  //check gap between days_to and days_from
  const childBirthDatePlanned = child?.taxonomyData?.prematureTaxonomyId ?? child?.birthDate;
  const activityTaxonomyId = child?.taxonomyData?.prematureTaxonomyId ?? child?.taxonomyData?.id;

  if ((childDaysTo - childDaysFrom) <= appConfig.oneMonthDays) {
    noti.push(
      {
        "days_from": childDaysFrom,
        "days_to": childDaysTo,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom == 0 ? childDaysFrom + appConfig.afterDays + 1 : childDaysFrom + appConfig.afterDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      },
      {
        "days_from": childDaysFrom,
        "days_to": childDaysTo - appConfig.beforeDays,
        "type": "cd",
        "title": ('cdNoti2'),
        "checkinField": "days_to",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysTo - appConfig.beforeDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      },
    )
  }
  else if ((childDaysTo - childDaysFrom) <= appConfig.threeeMonthDays) {
    noti.push(
      {
        "days_from": childDaysFrom,
        "days_to": childDaysTo,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom + appConfig.afterDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      })
    const diff = Math.round((childDaysTo - childDaysFrom) / appConfig.oneMonthDays);
    for (let i = 0; i < diff; i++) {
      const notificationDate = DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: (i == diff - 1) ? childDaysTo - appConfig.beforeDays : childDaysTo < childDaysFrom + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays ? childDaysTo - appConfig.beforeDays : (childDaysFrom + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays - 1) - appConfig.beforeDays, });
      // check difference between today and notification date in days and if greater than or equal to appConfig.oneMonthDays then isDeleted=false
      let numOfDays: any;
      if (isFutureDateTime(notificationDate) == true) {
        numOfDays = (DateTime.fromISO(notificationDate)).diff((DateTime.now()), 'days').toObject().days
      } else {
        numOfDays = (DateTime.now()).diff((DateTime.fromISO(notificationDate)), 'days').toObject().days
      }
      noti.push(
        {
          "days_from": childDaysFrom + (i * appConfig.oneMonthDays),
          "days_to": (i == diff - 1) ? childDaysTo - appConfig.beforeDays : childDaysTo < childDaysFrom + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays ? childDaysTo - appConfig.beforeDays : (childDaysFrom + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays - 1) - appConfig.beforeDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "notificationDate": notificationDate,
          "isRead": false,
          "isDeleted": isNewChild == true ? numOfDays < appConfig.oneMonthDays - appConfig.beforeDays ? false : true : false,
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
        "notificationDate": DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: childDaysFrom + appConfig.afterDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": activityTaxonomyId
      })
    const diff = Math.round((childDaysTo - childDaysFrom) / appConfig.twoMonthDays);
    for (let i = 0; i < diff; i++) {
      const notificationDate = DateTime.fromJSDate(new Date(childBirthDatePlanned)).plus({ days: (i == diff - 1) ? childDaysTo - appConfig.beforeDays : childDaysTo < childDaysFrom + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? childDaysTo - appConfig.beforeDays : (childDaysFrom + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 1) - appConfig.beforeDays, });
      // check difference between today and notification date in days and if greater than or equal to appConfig.twoMonthDays then isDeleted=false
      let numOfDays: any;
      if (isFutureDateTime(notificationDate) == true) {
        numOfDays = (DateTime.fromISO(notificationDate)).diff((DateTime.now()), 'days').toObject().days
      } else {
        numOfDays = (DateTime.now()).diff((DateTime.fromISO(notificationDate)), 'days').toObject().days
      }
      noti.push(
        {
          "days_from": childDaysFrom + (i * appConfig.twoMonthDays),
          "days_to": (i == diff - 1) ? childDaysTo - appConfig.beforeDays : childDaysTo < childDaysFrom + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? childDaysTo - appConfig.beforeDays : (childDaysFrom + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 1) - appConfig.beforeDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "notificationDate": notificationDate,
          "isRead": false,
          "isDeleted": isNewChild == true ? numOfDays < appConfig.twoMonthDays - appConfig.beforeDays ? false : true : false,
          "periodName": childTaxonomyData.name,
          "growth_period": activityTaxonomyId
        },
      )
    }
  }

  if ((childTaxonomyData.days_to - childTaxonomyData.days_from) >= appConfig.threeeMonthDays) {
    const diff = Math.round((childTaxonomyData.days_to - childTaxonomyData.days_from) / appConfig.twoMonthDays);
    for (let i = 0; i < diff; i++) {
      const notificationDate = DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 2 });
      // check difference between today and notification date in days and if greater than or equal to appConfig.twoMonthDays then isDeleted=false
      const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, childTaxonomyData.days_from + (i * appConfig.twoMonthDays), (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 2)
      if (!isGrowthDataExist) {
        let numOfDays2: any;
        if (isFutureDateTime(notificationDate) == true) {
          numOfDays2 = (DateTime.fromISO(notificationDate)).diff((DateTime.now()), 'days').toObject().days
        } else {
          numOfDays2 = (DateTime.now()).diff((DateTime.fromISO(notificationDate)), 'days').toObject().days
        }
        noti.push(
          {
            "days_from": childTaxonomyData.days_from + (i * appConfig.twoMonthDays),
            "days_to": (i == diff - 1) ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? childTaxonomyData.days_to - 1 : childTaxonomyData.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 2,
            "type": "gw",
            "title": ('gwNoti1'),
            "checkinField": "days_from",
            "notificationDate": notificationDate,
            "isRead": false,
            "isDeleted": isNewChild == true ? numOfDays2 < appConfig.twoMonthDays ? false : true : false,
            "periodName": childTaxonomyData.name,
            "growth_period": childTaxonomyData.id,
          },
        )
      }

    }
  } else {
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
export const getNextChildNotification = (gwperiodid: any, vcperiodid: any, hcperiodid: any, child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean): any => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childBirthDatePlanned = child?.taxonomyData?.prematureTaxonomyId ?? child.birthDate;
  const childAgeInDaysForCD = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(childBirthDatePlanned)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const activityTaxonomyId = child?.taxonomyData?.prematureTaxonomyId || child?.taxonomyData?.id;
  const lastchildgwperiod = childAgeObj.find((item: any) => String(item.id) == String(gwperiodid));
  let vcnotis: any[] = [];
  let hcnotis: any[] = [];
  let lastgwperiodid = gwperiodid, lastvcperiodid = vcperiodid, lasthcperiodid = hcperiodid;
  let gwcdnotis: any[] = [];
  if (lastchildgwperiod != null && lastchildgwperiod != undefined && lastchildgwperiod != "") {
    const lastchildgwperiodIndex = childAgeObj.findIndex((item: any) => String(item.id) == String(gwperiodid));
    const currentchildgwperiodIndex = childAgeObj.findIndex((element: any) => element.days_from > lastchildgwperiod.days_from && element.days_to > childAgeInDaysForCD && element.days_from <= childAgeInDaysForCD);
    const prematurechildgwperiod = childAgeObj.find((item: any) => String(item.id) == String(activityTaxonomyId));
    //find next period and calculate for it and return for gw cd noti
    for (let i = lastchildgwperiodIndex + 1; i <= currentchildgwperiodIndex; i++) {
      const childDaysTo = child?.taxonomyData?.prematureTaxonomyId ? prematurechildgwperiod.days_to : childAgeObj[i].days_to;
      const childDaysFrom = child?.taxonomyData?.prematureTaxonomyId ? prematurechildgwperiod.days_from : childAgeObj[i].days_from;
      const currentgwPeriodNoti = getCDGWNotisForChild(childAgeObj[i], child, prematurechildgwperiod, childDaysTo, childDaysFrom, false);
      lastgwperiodid = childAgeObj[i].id;
      currentgwPeriodNoti.forEach((noti: any) => {
        gwcdnotis.push(noti)
      })
    }
  }
  console.log(allVaccinePeriods, typeof allVaccinePeriods, "..getNextChildNotificationallVaccinePeriods.length")

  ///perform computation for hc,vc
  // get all notis between last period id to current running period
  const vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  const lastvcperiod = vcNotis.findIndex((item: any) => item.growth_period == vcperiodid)
  const currentvcperiod = vcNotis.findIndex((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  if (lastvcperiod >= 0) {
    vcNotis.forEach((element: any, index: number) => {
      if (index > lastvcperiod && index <= currentvcperiod) {
        lastvcperiodid = element.growth_period;
        vcnotis.push(element);
      }
    });
  }

  const hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  const lasthcperiod = hcNotis.findIndex((item: any) => item.growth_period == hcperiodid)
  const currenthcperiod = hcNotis.findIndex((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  if (lasthcperiod >= 0) {
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
  const notis = {
    lastgwperiodid, gwcdnotis,
    lastvcperiodid, vcnotis,
    lasthcperiodid, hcnotis,
  }
  return notis

}
export const getChildNotification = (child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean): any => {
  if (child.birthDate != null && child.birthDate != undefined) {
    const activityTaxonomyId = child?.taxonomyData?.prematureTaxonomyId || child?.taxonomyData?.id;

    const prematurechildgwperiod = childAge.find((item: any) => String(item.id) == String(activityTaxonomyId));
    const childAgeInDays = getCurrentChildAgeInDays(
      DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
    );

    const childDaysTo = child?.taxonomyData?.prematureTaxonomyId ? prematurechildgwperiod.days_to : child.taxonomyData.days_to;
    const childDaysFrom = child?.taxonomyData?.prematureTaxonomyId ? prematurechildgwperiod.days_from : child.taxonomyData.days_from;

    if (!isFutureDate(child?.birthDate)) {

      const vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child);
      //sort by days_from => find days_from period id to
      let currentvcPeriodNoti = vcNotis.filter((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)

      const hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
      let currenthcPeriodNoti = hcNotis.filter((item: any) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


      if (vchcEnabledFlag == false) {
        if (currentvcPeriodNoti.length > 0) {
          currentvcPeriodNoti = [...currentvcPeriodNoti].map((item: any) => {
            return { ...item, isDeleted: true };
          })
        }
        if (currenthcPeriodNoti.length > 0) {
          currenthcPeriodNoti = [...currenthcPeriodNoti].map((item: any) => {
            return { ...item, isDeleted: true };
          })
        }
      }


      let currentgwPeriodNoti = getCDGWNotisForChild(child.taxonomyData, child, prematurechildgwperiod, childDaysTo, childDaysFrom, true)
      if (growthEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item: any) => {
          if (item.type == 'gw') {
            return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
      }
      if (developmentEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item: any) => {
          if (item.type == 'cd') {
            return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
      }
      if (currentvcPeriodNoti && currenthcPeriodNoti && currentgwPeriodNoti) {
        const notis = {
          lastgwperiodid: child.taxonomyData.id,
          gwcdnotis: currentgwPeriodNoti,
          lastvcperiodid: currentvcPeriodNoti.length > 0 ? currentvcPeriodNoti[0].growth_period : 0, vcnotis: currentvcPeriodNoti,
          lasthcperiodid: currenthcPeriodNoti.length > 0 ? currenthcPeriodNoti[0].growth_period : 0, hcnotis: currenthcPeriodNoti,
        }
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
export const getChildReminderNotifications = (child: any, reminderNotis: any, vchcEnabledFlag: boolean): any => {
  ///get existing notis and compare for isread and is deleted
  const noti: any[] = [];
  const filteredPastRemidnerNotis = reminderNotis.filter((item: any) => !isFutureDateTime(new Date(item.notificationDate)));
  if (filteredPastRemidnerNotis.length > 0) {
    filteredPastRemidnerNotis.map((x: any) => {
      noti.push(x);
    })
  }
  if (child?.reminders && child.reminders?.length > 0) {
    child.reminders?.forEach((element: any) => {

      const childvcReminderDateInDays = DateTime.fromJSDate(new Date(element.reminderDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
      const childvcReminderDateInDaysDefined = DateTime.fromJSDate(new Date(element.reminderDateDefined)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
      //find hc and vc reminder in existing notis by type
      // if hc exists, add vc ,and vica versa 
      // or add one that exists
      const itemtype = element.reminderType == 'vaccine' ? 'vcr' : 'hcr';

      const futurereminderexist = reminderNotis.filter((item: any) => item.uuid == element.uuid && item.type == itemtype && isFutureDateTime(new Date(item.notificationDate)))
      const reminderexist = reminderNotis.filter((item: any) => item.uuid == element.uuid && item.type == itemtype);
      //get only past reminders  till today and filter by child age
      let finalremDT: any, finalremDTDefined: any;
      const onlyDate = new Date(element.reminderDate);
      finalremDT = onlyDate.setHours(new Date(element.reminderTime).getHours());
      finalremDT = new Date(onlyDate.setMinutes(new Date(element.reminderTime).getMinutes()));
      const onlyDateDefined = new Date(element.reminderDateDefined);
      finalremDTDefined = onlyDateDefined.setHours(new Date(element.reminderTimeDefined).getHours());
      finalremDTDefined = new Date(onlyDateDefined.setMinutes(new Date(element.reminderTimeDefined).getMinutes()));
      if (futurereminderexist.length > 0) {
        const futureStartReminder = reminderNotis.filter((item: any) => item.uuid == element.uuid && item.type == itemtype && item.subtype == 'start');
        const futureMidReminder = futurereminderexist.find((x: any) => x.subtype == 'reminder');
        const futureScheduledReminder = futurereminderexist.find((x: any) => x.subtype == 'scheduled');
        if (futureMidReminder || futureScheduledReminder) {
          if (element.reminderDate == futureScheduledReminder.periodName && element.reminderTime == futureScheduledReminder.growth_period && element.reminderDateDefined == futureStartReminder[0].periodName && element.reminderTimeDefined == futureStartReminder[0].growth_period) {
            console.log("in if");
          } else {
            noti.push({
              "days_from": Math.floor(childvcReminderDateInDaysDefined),
              "days_to": Math.floor(childvcReminderDateInDaysDefined),
              "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
              "subtype": "start",
              "subtypeid": uuid(),
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
        if (futureMidReminder && futureMidReminder != undefined) {
          noti.push({
            "days_from": Math.floor(childvcReminderDateInDays),
            "days_to": Math.floor(childvcReminderDateInDays),
            "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
            "subtype": "reminder",
            "subtypeid": uuid(),
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
        if (futureScheduledReminder && futureScheduledReminder != undefined && futureScheduledReminder != null) {
          if (futureMidReminder == null || futureMidReminder == undefined) {
            if (element.reminderDate == futureScheduledReminder.periodName && element.reminderTime == futureScheduledReminder.growth_period && element.reminderDateDefined == futureStartReminder[0].periodName && element.reminderTimeDefined == futureStartReminder[0].growth_period) {
              console.log("in if 2");
            } else {
              noti.push({
                "days_from": Math.floor(childvcReminderDateInDays),
                "days_to": Math.floor(childvcReminderDateInDays),
                "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                "subtype": "reminder",
                "subtypeid": uuid(),
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
            "days_from": Math.floor(childvcReminderDateInDays + 1),
            "days_to": Math.floor(childvcReminderDateInDays + 1),
            "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
            "subtype": "scheduled",
            "subtypeid": uuid(),
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
      if (reminderexist.length == 0) {
        // a reminder has been set for {schedule date}.This will come as soon as reminder is created
        noti.push({
          "days_from": Math.floor(childvcReminderDateInDaysDefined),
          "days_to": Math.floor(childvcReminderDateInDaysDefined),
          "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
          "subtype": "start",
          "subtypeid": uuid(),
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
          "subtypeid": uuid(),
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
          "days_from": Math.floor(childvcReminderDateInDays + 1),
          "days_to": Math.floor(childvcReminderDateInDays + 1),
          "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
          "subtype": "scheduled",
          "subtypeid": uuid(),
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
  const sortednoti = noti.sort(
    (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
  );
  return sortednoti;
}

export const getVaccinesForPeriodCount = (allVaccineData: any, period: string): any => {
  const allvc = allVaccineData.filter((item: any) => item.growth_period == period);
  let vc = ' ';
  const vcArray: any = [];
  allvc.map((item: any, index: number) => {
    if (item.old_calendar != 1) {
      vcArray.push(item.title);
    }
  })
  if (vcArray && vcArray.length > 0) {
    vc += vcArray.join(", ");
    vc += '.';
  }
  else {
    vc = '';
  }
  return vc;
}

const getVaccinesForPeriod = (allVaccineData: any, period: string): any => {
  const allvc = allVaccineData.filter((item: any) => item.growth_period == period);
  let vc = ' ';
  const vcArray: any = [];
  allvc.map((item: any, index: number) => {
    if (item.old_calendar != 1) {
      vcArray.push(item.title);
    }
  })

  if (vcArray && vcArray.length > 0) {
    vc += vcArray.join(", ");
    vc += '.';
  }
  else {
    vc = '';
  }
  return vc;
}
const generatenotiId = (localNotifications: any, allNotis: any): any => {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  const commonArr = localNotifications?.find((x: any) => x.data.some((item: any) => item.notiid == String(rand)));
  const commonArr2 = allNotis?.data?.find((item: any) => item.notiid == String(rand));
  if (commonArr != null && commonArr != {} && commonArr != undefined) {
    generatenotiId(localNotifications, allNotis);
  } else if (commonArr2 != null && commonArr2 != {} && commonArr2 != undefined) {
    generatenotiId(localNotifications, allNotis);
  } else {
    return rand;
  }
}
export const createAllLocalNotificatoins = (child: any, childAge: any, developmentEnabledFlag: boolean, growthEnabledFlag: boolean, vchcEnabledFlag: boolean, t: any, allVaccinePeriods: any, allGrowthPeriods: any, allHealthCheckupsData: any, allVaccineData: any, localNotifications: any): any => {
  const allNotis: any[] = [];

  const childBirthDatePlanned = child?.taxonomyData?.prematureTaxonomyId ?? child.plannedTermDate;
  const activityTaxonomyId = child?.taxonomyData?.prematureTaxonomyId ?? child?.taxonomyData.id;

  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const filteredchildAgeObj = childAgeObj.filter((x: any) => x.id >= activityTaxonomyId);
  // for CD 1st day of period and 5 days before period end
  filteredchildAgeObj.map((agebracket: any) => {

    if ((agebracket.days_to - agebracket.days_from) <= appConfig.oneMonthDays) {
      if (developmentEnabledFlag == true) {
        const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_from == 0 ? agebracket.days_from + appConfig.afterDays + 1 : agebracket.days_from + appConfig.afterDays });
        if (isFutureDateTime(new Date(notificationDate))) {
          const message = t('cdNoti1', {
            childName:
              child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name
          });
          const currNotiId = generatenotiId(localNotifications, allNotis)
          allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate, 'notiMsg': message, 'childUuid': child.uuid });
        }
        const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_to - appConfig.beforeDays });
        if (isFutureDateTime(new Date(notificationDate2))) {
          const message2 = t('cdNoti2', {
            childName:
              child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name
          });
          const currNotiId = generatenotiId(localNotifications, allNotis)
          allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate2, 'notiMsg': message2, 'childUuid': child.uuid });
        }
      }
      if (growthEnabledFlag == true) {
        const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from, agebracket.days_to)
        if (!isGrowthDataExist) {
          const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_to - 1 });
          if (isFutureDateTime(new Date(notificationDate3))) {
            const message3 = t('gwNoti1', {
              childName:
                child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name
            });
            const currNotiId = generatenotiId(localNotifications, allNotis)
            allNotis.push({ 'type': 'gw', 'notiid': currNotiId, 'notiDate': notificationDate3, 'notiMsg': message3, 'childUuid': child.uuid });
          }
        }
      }
    }
    else if ((agebracket.days_to - agebracket.days_from) <= appConfig.threeeMonthDays) {
      if (developmentEnabledFlag == true) {
        const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_from + appConfig.afterDays });
        if (isFutureDateTime(new Date(notificationDate))) {
          const message = t('cdNoti1', {
            childName:
              child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name
          });
          const currNotiId = generatenotiId(localNotifications, allNotis)
          allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate, 'notiMsg': message, 'childUuid': child.uuid });
        }
      }
      //notification for growth
      if (growthEnabledFlag == true) {
        const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from, agebracket.days_to)
        if (!isGrowthDataExist) {
          const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_to - 1 });
          if (isFutureDateTime(new Date(notificationDate3))) {
            const message3 = t('gwNoti1', {
              childName:
                child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name
            });
            const currNotiId = generatenotiId(localNotifications, allNotis)
            allNotis.push({ 'type': 'gw', 'notiid': currNotiId, 'notiDate': notificationDate3, 'notiMsg': message3, 'childUuid': child.uuid });
          }
        }
      }
      const diff = Math.round((agebracket.days_to - agebracket.days_from) / appConfig.oneMonthDays);
      for (let i = 0; i < diff; i++) {
        if (developmentEnabledFlag == true) {
          const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: (i == diff - 1) ? agebracket.days_to - appConfig.beforeDays : agebracket.days_to < agebracket.days_from + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays ? agebracket.days_to - appConfig.beforeDays : (agebracket.days_from + (i * appConfig.oneMonthDays) + appConfig.oneMonthDays - 1) - appConfig.beforeDays, });
          if (isFutureDateTime(new Date(notificationDate2))) {
            const message2 = t('cdNoti2', {
              childName:
                child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name
            });
            const currNotiId = generatenotiId(localNotifications, allNotis)
            allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate2, 'notiMsg': message2, 'childUuid': child.uuid });
          }
        }

      }
    }
    else {
      if (developmentEnabledFlag == true) {
        const notificationDate = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: agebracket.days_from + appConfig.afterDays });
        if (isFutureDateTime(new Date(notificationDate))) {
          const message = t('cdNoti1', {
            childName:
              child.childName != null &&
                child.childName != '' &&
                child.childName != undefined
                ? child.childName
                : '', periodName: agebracket.name
          });
          const currNotiId = generatenotiId(localNotifications, allNotis)
          allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate, 'notiMsg': message, 'childUuid': child.uuid });
        }
      }
      const diff = Math.round((agebracket.days_to - agebracket.days_from) / appConfig.twoMonthDays);
      for (let i = 0; i < diff; i++) {
        if (developmentEnabledFlag == true) {
          const notificationDate2 = DateTime.fromJSDate(new Date(new Date(childBirthDatePlanned).setHours(19, 0, 0, 0))).plus({ days: (i == diff - 1) ? agebracket.days_to - appConfig.beforeDays : agebracket.days_to < agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? agebracket.days_to - appConfig.beforeDays : (agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 1) - appConfig.beforeDays, });
          if (isFutureDateTime(new Date(notificationDate2))) {
            const message2 = t('cdNoti2', {
              childName:
                child.childName != null &&
                  child.childName != '' &&
                  child.childName != undefined
                  ? child.childName
                  : '', periodName: agebracket.name
            });
            const currNotiId = generatenotiId(localNotifications, allNotis)
            allNotis.push({ 'type': 'cd', 'notiid': currNotiId, 'notiDate': notificationDate2, 'notiMsg': message2, 'childUuid': child.uuid });
          }
        }
        //notification for growth
        if (growthEnabledFlag == true) {
          const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, agebracket.days_from + (i * appConfig.twoMonthDays), (i == diff - 1) ? agebracket.days_to - 1 : agebracket.days_to < agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? agebracket.days_to - 1 : agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 2)
          if (!isGrowthDataExist) {
            const notificationDate3 = DateTime.fromJSDate(new Date(new Date(child.birthDate).setHours(19, 0, 0, 0))).plus({ days: (i == diff - 1) ? agebracket.days_to - 1 : agebracket.days_to < agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays ? agebracket.days_to - 1 : agebracket.days_from + (i * appConfig.twoMonthDays) + appConfig.twoMonthDays - 2 });
            if (isFutureDateTime(new Date(notificationDate3))) {
              const message3 = t('gwNoti1', {
                childName:
                  child.childName != null &&
                    child.childName != '' &&
                    child.childName != undefined
                    ? child.childName
                    : '', periodName: agebracket.name
              });
              const currNotiId = generatenotiId(localNotifications, allNotis)
              allNotis.push({ 'type': 'gw', 'notiid': currNotiId, 'notiDate': notificationDate3, 'notiMsg': message3, 'childUuid': child.uuid });
            }
          }
        }

      }
    }

  })

  if (vchcEnabledFlag == true) {
    console.log(allVaccinePeriods, typeof allVaccinePeriods, "..createAllLocalNotificatoinsallVaccinePeriods.length")

    const vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
      (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
    );

    const hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);

    vcNotis.map((vc: any) => {
      const notificationDate4 = DateTime.fromJSDate(new Date(new Date(vc.notificationDate).setHours(19, 0, 0, 0)))
      if (isFutureDateTime(new Date(notificationDate4)) && getVaccinesForPeriod(allVaccineData, vc.growth_period) != '' && getVaccinesForPeriod(allVaccineData, vc.growth_period) != null && getVaccinesForPeriod(allVaccineData, vc.growth_period) != undefined) {
        const message4 = t(vc.title, {
          childName:
            child.childName != null &&
              child.childName != '' &&
              child.childName != undefined
              ? child.childName
              : '', periodName: vc.periodName
        }) + getVaccinesForPeriod(allVaccineData, vc.growth_period)
        const currNotiId = generatenotiId(localNotifications, allNotis)
        allNotis.push({ 'type': 'vc', 'notiid': currNotiId, 'notiDate': notificationDate4, 'notiMsg': message4, 'childUuid': child.uuid });
      }
    })

    hcNotis.map((hc: any) => {
      const notificationDate5 = DateTime.fromJSDate(new Date(new Date(hc.notificationDate).setHours(19, 0, 0, 0)))
      if (isFutureDateTime(new Date(notificationDate5))) {
        const message5 = t(hc.title, {
          childName:
            child.childName != null &&
              child.childName != '' &&
              child.childName != undefined
              ? child.childName
              : '', periodName: hc.periodName
        })
        const currNotiId = generatenotiId(localNotifications, allNotis)
        allNotis.push({ 'type': 'hc', 'notiid': currNotiId, 'notiDate': notificationDate5, 'notiMsg': message5, 'childUuid': child.uuid });
      }
    })
  }
  return { 'key': child.uuid, 'data': [...allNotis] };
}

