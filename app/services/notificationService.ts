import { DateTime } from "luxon";
import { getCurrentChildAgeInDays, isFutureDate } from './childCRUD';
import { maxPeriodDays } from "./healthCheckupService";
export const threeeMonthDays = 90;
export const twoMonthDays = 60;
export const beforeDays = 5;
export const isPeriodsMovedAhead = (childAge: any, notiExist: any, child: any, allVaccinePeriods: any, allGrowthPeriods: any, allHealthCheckupsData: any,) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const lastvcperiod = vcNotis.findIndex(item => item.growth_period == notiExist.lastvcperiodid)
  const currentvcperiod = vcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  console.log(hcNotis, "hcNotis")
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
  // console.log(isGrowthNotMeasureExist, 'isGrowthMeasureExist')
  // return isGrowthNotMeasureExist
}
export const getCDGWNotisForChild = (childTaxonomyData: any, child: any) => {
  // childTaxonomyData.days_from childTaxonomyData.days_to
  // (childAgeInDays >= item.days_from && childAgeInDays <= item.days_to)
  // all notis between item.days_from  and item.days_to of a period
  let noti = [];
  // noti.push(//at the begginning of the period
  //   )
  //if> 3months then add noti
  //check gap between days_to and days_from
  if ((childTaxonomyData.days_to - childTaxonomyData.days_from) >= threeeMonthDays) {
    noti.push(
      {
        "days_from": childTaxonomyData.days_from,
        "days_to": childTaxonomyData.days_to,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: childTaxonomyData.days_from }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": childTaxonomyData.id,
      })
    const diff = Math.round((childTaxonomyData.days_to - childTaxonomyData.days_from) / twoMonthDays);
    // console.log(diff, item.days_from) //
    for (var i = 0; i < diff; i++) {

      const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, childTaxonomyData.days_from + (i * twoMonthDays), (i == diff - 1) ? childTaxonomyData.days_to - beforeDays : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays)
      if (!isGrowthDataExist) {
        noti.push(
          {
            "days_from": childTaxonomyData.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? childTaxonomyData.days_to : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays,
            "type": "gw",
            "title": ('gwNoti1'),
            "checkinField": "days_from",
            "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (i == diff - 1) ? childTaxonomyData.days_to : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays }),
            "isRead": false,
            "isDeleted": false,
            "periodName": childTaxonomyData.name,
            "growth_period": childTaxonomyData.id,
          },
        )
      }
      noti.push(
        {
          "days_from": childTaxonomyData.days_from + (i * twoMonthDays),
          "days_to": (i == diff - 1) ? childTaxonomyData.days_to - beforeDays : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: (i == diff - 1) ? childTaxonomyData.days_to - beforeDays : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays, }),
          "isRead": false,
          "isDeleted": false,
          "periodName": childTaxonomyData.name,
          "growth_period": childTaxonomyData.id,
        },
      )
    }

  } else {
    const isGrowthDataExist = IsGrowthMeasuresForPeriodExist(child, childTaxonomyData.days_from, childTaxonomyData.days_to)
    // if growth measure does not exist in that child age period, noti  should be added
    if (!isGrowthDataExist) {
      noti.push(
        {
          "days_from": childTaxonomyData.days_from,
          "days_to": childTaxonomyData.days_to,
          "type": "gw",
          "title": ('gwNoti1'),
          "checkinField": "days_to",
          "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: childTaxonomyData.days_to }),
          "isRead": false,
          "isDeleted": false,
          "periodName": childTaxonomyData.name,
          "growth_period": childTaxonomyData.id,
        })
    }
    noti.push(
      {
        "days_from": childTaxonomyData.days_from,
        "days_to": childTaxonomyData.days_to,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_from",
        "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: childTaxonomyData.days_from }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": childTaxonomyData.id,
      },
      {
        "days_from": childTaxonomyData.days_from,
        "days_to": childTaxonomyData.days_to - beforeDays,
        "type": "cd",
        "title": ('cdNoti2'),
        "checkinField": "days_to",
        "notificationDate": DateTime.fromJSDate(new Date(child.birthDate)).plus({ days: childTaxonomyData.days_to - beforeDays }),
        "isRead": false,
        "isDeleted": false,
        "periodName": childTaxonomyData.name,
        "growth_period": childTaxonomyData.id,
      },
    )
    // console.log(noti,"noti")
  }
  return noti;
}
export const getNextChildNotification = (gwperiodid: any, vcperiodid: any, hcperiodid: any, child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  //child.taxonomyData.id
  const lastchildgwperiod = childAgeObj.find(item => String(item.id) == String(gwperiodid));
  const lastchildgwperiodIndex = childAgeObj.findIndex(item => String(item.id) == String(gwperiodid));
  const currentchildgwperiod = childAgeObj.find(element => element.days_from > lastchildgwperiod.days_from && element.days_from <= childAgeInDays);
  const currentchildgwperiodIndex = childAgeObj.findIndex(element => element.days_from > lastchildgwperiod.days_from && element.days_from <= childAgeInDays);
  // Alert.alert(String(lastchildgwperiod.id), 'last child gw period');
  // Alert.alert(String(currentchildgwperiod.id), 'current child gw period');
  // Alert.alert(currentchildgwperiodIndex + " currentchildgwperiodIndex");
  // Alert.alert(lastchildgwperiodIndex + "lastchildgwperiodIndex");
  let lastgwperiodid = gwperiodid, lastvcperiodid = vcperiodid, lasthcperiodid = hcperiodid;
  let gwcdnotis: any[] = [];
  let vcnotis: any[] = [];
  let hcnotis: any[] = [];
  //find next period and calculate for it and return for gw cd noti

  for (let i = lastchildgwperiodIndex + 1; i <= currentchildgwperiodIndex; i++) {
    let currentgwPeriodNoti = getCDGWNotisForChild(childAgeObj[i], child);
    console.log(currentgwPeriodNoti, "currentgwPeriodNoti");
    lastgwperiodid = childAgeObj[i].id;
    // if (gwperiodid != lastgwperiodid) {
    currentgwPeriodNoti.forEach((noti) => {
      gwcdnotis.push(noti)
    })
    // }
  }
  ///perform computation for hc,vc
  // get all notis between last period id to current running period
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child).sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const lastvcperiod = vcNotis.findIndex(item => item.growth_period == vcperiodid)
  const currentvcperiod = vcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  vcNotis.forEach((element: any, index: number) => {
    if (index > lastvcperiod && index <= currentvcperiod) {
      lastvcperiodid = element.growth_period;
      vcnotis.push(element);
    }
  });
  console.log('NEWVCNOTIS', vcnotis, lastvcperiodid)

  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
  console.log(hcNotis, "hcNotis")
  const lasthcperiod = hcNotis.findIndex(item => item.growth_period == hcperiodid)
  const currenthcperiod = hcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  hcNotis.forEach((element: any, index: number) => {
    if (index > lasthcperiod && index <= currenthcperiod) {
      lasthcperiodid = element.growth_period;
      hcnotis.push(element);
    }
  });
  console.log('NEWHCNOTIS', hcnotis, lasthcperiodid)
  if (vchcEnabledFlag == false) {
    vcnotis = [...vcnotis].map(item => {
      if (isFutureDate(new Date(item.notificationDate))) {
        return { ...item, isDeleted: true };
      } else {
        return { ...item };
      }
    })
    hcnotis = [...hcnotis].map(item => {
      if (isFutureDate(new Date(item.notificationDate))) {
        return { ...item, isDeleted: true };
      } else {
        return { ...item };
      }
    })
  }
  if (growthEnabledFlag == false) {
    gwcdnotis = [...gwcdnotis]?.map((item) => {
      if (item.type == 'gw') {
        // console.log(isFutureDate(new Date(item.notificationDate)),"isFutureDate")
        if (isFutureDate(new Date(item.notificationDate))) {
          return { ...item, isDeleted: true };
        } else {
          return { ...item };
        }
      } else {
        return { ...item };
      }
    })
  }
  if (developmentEnabledFlag == false) {
    gwcdnotis = [...gwcdnotis]?.map((item) => {
      if (item.type == 'cd') {
        // console.log(isFutureDate(new Date(item.notificationDate)),"isFutureDate")
        if (isFutureDate(new Date(item.notificationDate))) {
          return { ...item, isDeleted: true };
        } else {
          return { ...item };
        }
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
  console.log(notis, "newCalcNotis")
  return notis
}
export const getChildNotification = (child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any, growthEnabledFlag: boolean, developmentEnabledFlag: boolean, vchcEnabledFlag: boolean) => {
  console.log(child,"child","getChildNotification")
  if (child.birthDate != null && child.birthDate != undefined) {

    const childAgeInDays = getCurrentChildAgeInDays(
      DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
    );
    const childCreateDate = DateTime.fromJSDate(new Date(child.createdAt)).toMillis();
    const childBirthDate = DateTime.fromJSDate(new Date(child.birthDate)).toMillis();
    console.log(childCreateDate > childBirthDate? child.createdAt:child.birthDate );

    // const childCreateDateInDays = getCurrentChildAgeInDays(
    //   DateTime.fromJSDate(new Date(child.createdAt)).toMillis(),
    // );
    if (childCreateDate >= childBirthDate) {
      // console.log("in here")
      let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods, child);
      console.log(vcNotis, "vcNotis")
      //sort by days_from => find days_from period id to
      let currentvcPeriodNoti = vcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
      // console.log(currentvcPeriodNoti, "currentvcPeriodNoti", currentvcPeriodNoti[0].growth_period);

      let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods, child);
      console.log(hcNotis, "hcNotis")
      let currenthcPeriodNoti = hcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
      // console.log(currenthcPeriodNoti, "currenthcPeriodNoti", currenthcPeriodNoti[0].growth_period);


      if (vchcEnabledFlag == false) {
        currentvcPeriodNoti = [...currentvcPeriodNoti].map(item => {
          if (isFutureDate(new Date(item.notificationDate))) {
            return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
        currenthcPeriodNoti = [...currenthcPeriodNoti].map(item => {
          if (isFutureDate(new Date(item.notificationDate))) {
            return { ...item, isDeleted: true };
          } else {
            return { ...item };
          }
        })
      }


      let currentgwPeriodNoti = getCDGWNotisForChild(child.taxonomyData, child)
      // console.log(currentgwPeriodNoti, "currentgwPeriodNoti", child.taxonomyData.id);
      if (growthEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item) => {
          if (item.type == 'gw') {
            // console.log(isFutureDate(new Date(item.notificationDate)),"isFutureDate")
            if (isFutureDate(new Date(item.notificationDate))) {
              return { ...item, isDeleted: true };
            } else {
              return { ...item };
            }
          } else {
            return { ...item };
          }
        })
      }
      if (developmentEnabledFlag == false) {
        currentgwPeriodNoti = [...currentgwPeriodNoti]?.map((item) => {
          if (item.type == 'cd') {
            // console.log(isFutureDate(new Date(item.notificationDate)),"isFutureDate")
            if (isFutureDate(new Date(item.notificationDate))) {
              return { ...item, isDeleted: true };
            } else {
              return { ...item };
            }
          } else {
            return { ...item };
          }
        })
      }
      console.log(child,"child")
      console.log(child.taxonomyData, "child.taxonomyData.id");
      // {lastperiodid:child.taxonomyData.id,notis:currentgwPeriodNoti}
      if (currentvcPeriodNoti && currenthcPeriodNoti && currentgwPeriodNoti) {
        let notis = {
          lastgwperiodid: child.taxonomyData.id, gwcdnotis: currentgwPeriodNoti,
          lastvcperiodid: currentvcPeriodNoti[0].growth_period, vcnotis: currentvcPeriodNoti,
          lasthcperiodid: currenthcPeriodNoti[0].growth_period, hcnotis: currenthcPeriodNoti,
        }
        console.log(notis, "newCalcNotis")
        // show current period's notifications if child was created after birth date (expecting child)

        return notis
      }
    }
    else {
      console.log('childcreated but child is yet to born');
      return {
        // no notifications for expecting child 
      }

    }
  }
}
export const getChildReminderNotifications = (child: any, reminderNotis: any, vchcEnabledFlag: boolean) => {
  ///get existing notis and compare for isread and is deleted
  console.log(reminderNotis, "ExistingreminderNotis")
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  let noti: any[] = [];
  if (child?.reminders && child.reminders?.length > 0) {
    child.reminders?.forEach((element: any, index: number) => {

      if (element.reminderType == 'vaccine') {
        // const childvcReminderDateInDays = getCurrentChildAgeInDays(
        const childvcReminderDateInDays = DateTime.fromJSDate(new Date(element.reminderDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
        console.log(childvcReminderDateInDays, "childvcReminderDateInDays");
        if (reminderNotis.length > 0) {
          //find hc and vc reminder in existing notis by type
          // if hc exists, add vc ,and vica versa 
          // or add one that exists
          const reminderexist = reminderNotis.find(item => item.uuid == element.uuid && item.type == 'vcr')
          console.log(reminderexist, "reminderexist");
          //get only past reminders  till today and filter by child age
          if (reminderexist) {
            noti.push({
              "days_from": Math.floor(childvcReminderDateInDays),
              "days_to": Math.floor(childvcReminderDateInDays),
              "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
              "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
              "checkinField": "days_from",
              "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
              "isRead": element.reminderDate == reminderexist.periodName ? reminderexist.isRead : false,
              "isDeleted": element.reminderDate == reminderexist.periodName ? reminderexist.isDeleted : false,
              "growth_period": element.reminderTime,
              "periodName": element.reminderDate,
              "uuid": element.uuid,
            })
          } else {
            if (Math.floor(childvcReminderDateInDays) <= childAgeInDays) {
              noti.push({
                "days_from": Math.floor(childvcReminderDateInDays),
                "days_to": Math.floor(childvcReminderDateInDays),
                "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
                "checkinField": "days_from",
                "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
                "isRead": false,
                "isDeleted": vchcEnabledFlag == false ? true : false,
                "growth_period": element.reminderTime,
                "periodName": element.reminderDate,
                "uuid": element.uuid,
              })
            }
          }
        } else {
          console.log('in else for generating notis for reminder')
          if (Math.floor(childvcReminderDateInDays) <= childAgeInDays) {
            noti.push({
              "days_from": Math.floor(childvcReminderDateInDays),
              "days_to": Math.floor(childvcReminderDateInDays),
              "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
              "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
              "checkinField": "days_from",
              "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
              "isRead": false,
              "isDeleted": vchcEnabledFlag == false ? true : false,
              "growth_period": element.reminderTime,
              "periodName": element.reminderDate,
              "uuid": element.uuid,
            })
          }
        }
      } else {
        // const childvcReminderDateInDays = getCurrentChildAgeInDays(
        const childvcReminderDateInDays = DateTime.fromJSDate(new Date(element.reminderDate)).diff(DateTime.fromJSDate(new Date(child.birthDate)), "days").days;
        console.log(childvcReminderDateInDays, "childvcReminderDateInDays");
        if (reminderNotis) {
          //find hc and vc reminder in existing notis by type
          // if hc exists, add vc ,and vica versa 
          // or add one that exists
          const reminderexist = reminderNotis.find(item => item.uuid == element.uuid && item.type == 'hcr')
          console.log(reminderexist, "reminderexist");
          //get only past reminders  till today and filter by child age
          if (reminderexist) {
            noti.push({
              "days_from": Math.floor(childvcReminderDateInDays),
              "days_to": Math.floor(childvcReminderDateInDays),
              "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
              "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
              "checkinField": "days_from",
              "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
              "isRead": element.reminderDate == reminderexist.periodName ? reminderexist.isRead : false,
              "isDeleted": element.reminderDate == reminderexist.periodName ? reminderexist.isDeleted : false,
              "growth_period": element.reminderTime,
              "periodName": element.reminderDate,
              "uuid": element.uuid,
            })
          } else {
            if (Math.floor(childvcReminderDateInDays) <= childAgeInDays) {
              noti.push({
                "days_from": Math.floor(childvcReminderDateInDays),
                "days_to": Math.floor(childvcReminderDateInDays),
                "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
                "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
                "checkinField": "days_from",
                "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
                "isRead": false,
                "isDeleted": vchcEnabledFlag == false ? true : false,
                "growth_period": element.reminderTime,
                "periodName": element.reminderDate,
                "uuid": element.uuid,
              })
            }
          }
        } else {
          console.log('in else for generating notis for reminder')
          if (Math.floor(childvcReminderDateInDays) <= childAgeInDays) {
            noti.push({
              "days_from": Math.floor(childvcReminderDateInDays),
              "days_to": Math.floor(childvcReminderDateInDays),
              "type": element.reminderType == 'vaccine' ? "vcr" : "hcr",
              "title": element.reminderType == 'vaccine' ? ('vcrNoti1') : ('hcrNoti1'),
              "checkinField": "days_from",
              "notificationDate": DateTime.fromJSDate(new Date(element.reminderDate)),
              "isRead": false,
              "isDeleted": vchcEnabledFlag == false ? true : false,
              "growth_period": element.reminderTime,
              "periodName": element.reminderDate,
              "uuid": element.uuid,
            })
          }
        }
      }

    });
  }
  let sortednoti = noti.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  // if(vchcEnabledFlag==false){
  //   sortednoti = [...sortednoti].map(item=>{
  //     if(isFutureDate(new Date(item.notificationDate))){
  //       return { ...item, isDeleted: true };
  //     }else{
  //       return {...item};
  //     }
  //   })
  // }
  console.log(sortednoti, "sortednoti")
  return sortednoti;
  // healthCheckupReminders.forEach((element: any, index: number) => {
  //   const childhcReminderDateInDays = getCurrentChildAgeInDays(
  //     DateTime.fromJSDate(new Date(element.reminderDate)).toMillis(),
  //   );
  // });
  // convert vaccineReminders,healthCheckupReminders into days_from => days_to from birthdate onwards

}
export const getVCPeriods = (allVaccinePeriods: any) => {
  var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj: any, item: any) {
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

  // console.log(groupsForPeriods, "groupsForPeriods")
  return groupsForPeriods
}
export const getVCNotis = (allVaccinePeriods: any, allGrowthPeriods: any, child: any) => {
  console.log(allVaccinePeriods,allGrowthPeriods,child, "allVaccinePeriods,allGrowthPeriods,child");
  if(allVaccinePeriods.length>0 && allGrowthPeriods.length>0){

 
  let noti: any[] = [];
  let groupsForPeriods = getVCPeriods(allVaccinePeriods);
  groupsForPeriods.forEach((item: any, index: number) => {
    // console.log(item,"groupsForPeriodsitem",allGrowthPeriods)
    const period = allGrowthPeriods.find((gwitem: any) => gwitem.id == Number(item.periodID));
    // console.log(period, "period");
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;

    }
  })
  groupsForPeriods.map((item: any, index: number) => {
    item.vaccination_opens = item.vaccination_opens;
    item.vaccination_closes = (index == groupsForPeriods.length - 1) ? maxPeriodDays : groupsForPeriods[index + 1].vaccination_opens;
  })
  // console.log(groupsForPeriods, "groupsForPeriods")
  groupsForPeriods.forEach((item: any, index: number) => {
    // console.log(item,'vcNoti')
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
  // console.log(groupsForPeriods, "groupsForPeriods")
  // console.log(noti, "inVC")
  let sortednoti = noti.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  return sortednoti;
}
}
export const getHCReminderNotis = (allHealthCheckupsData: any, allGrowthPeriods: any, child: any) => {
  // console.log(allHealthCheckupsData,"allHealthCheckupsData")
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
  // console.log("allHealthCheckupsDatasorted",allHCData,allHCData.length);
  allHCData.forEach((hcItem: any, index: number) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item: any) => item.id == hcItem.growth_period);
    // console.log(item,"hcItem",index,hcItem)
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
      // console.log('hcitem',noti,index)
    }
    // const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
    // console.log(index, measuresForHCPeriod, "measuresForHCPeriod");
    // hcItem.growthMeasures = measuresForHCPeriod;

  });
  return noti;
  // console.log(noti,"withopen_close")
}