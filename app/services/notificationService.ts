import { DateTime } from "luxon";
import { maxPeriodDays } from "./healthCheckupService";
import { getCurrentChildAgeInDays } from './childCRUD';
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
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods).sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  const lastvcperiod = vcNotis.findIndex(item => item.growth_period == notiExist.lastvcperiodid)
  const currentvcperiod = vcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods);
  console.log(hcNotis, "hcNotis")
  const lasthcperiod = hcNotis.findIndex(item => item.growth_period == notiExist.lasthcperiodid)
  const currenthcperiod = hcNotis.findIndex(item => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)


  if (childAgeObj.findIndex(item => item.id == notiExist.lastgwperiodid) <=
    childAgeObj.findIndex(item => item.id == child.taxonomyData.id) || lastvcperiod <= currentvcperiod || lasthcperiod <= currenthcperiod) {
    return true
  } else {
    return false
  }
}
export const getCDGWNotisForChild = (childTaxonomyData: any) => {
  // childTaxonomyData.days_from childTaxonomyData.days_to

  let noti = [];
  noti.push(//at the begginning of the period
    {
      "days_from": childTaxonomyData.days_from,
      "days_to": childTaxonomyData.days_to,
      "type": "gw",
      "title": ('gwNoti1'),
      "checkinField": "days_to",
      "isRead":false,
      "isDeleted":false,
      "periodName": childTaxonomyData.name,
      "growth_period": childTaxonomyData.id,
    },
    {
      "days_from": childTaxonomyData.days_from,
      "days_to": childTaxonomyData.days_to,
      "type": "cd",
      "title": ('cdNoti1'),
      "checkinField": "days_from",
      "isRead":false,
      "isDeleted":false,
      "periodName": childTaxonomyData.name,
      "growth_period": childTaxonomyData.id,
    })


  //if> 3months then add noti
  //check gap between days_to and days_from
  if ((childTaxonomyData.days_to - childTaxonomyData.days_from) >= threeeMonthDays) {
    const diff = Math.round((childTaxonomyData.days_to - childTaxonomyData.days_from) / twoMonthDays);
    // console.log(diff, item.days_from) //
    for (var i = 0; i < diff; i++) {
      noti.push(
        {
          "days_from": childTaxonomyData.days_from + (i * twoMonthDays),
          "days_to": (i == diff - 1) ? childTaxonomyData.days_to - beforeDays : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays,
          "type": "gw",
          "title": ('gwNoti1'),
          "checkinField": "days_from",
          "isRead":false,
          "isDeleted":false,
          "periodName": childTaxonomyData.name,
          "growth_period": childTaxonomyData.id,
        },
        {
          "days_from": childTaxonomyData.days_from + (i * twoMonthDays),
          "days_to": (i == diff - 1) ? childTaxonomyData.days_to - beforeDays : childTaxonomyData.days_to < childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays ? childTaxonomyData.days_to : childTaxonomyData.days_from + (i * twoMonthDays) + twoMonthDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "isRead":false,
          "isDeleted":false,
          "periodName": childTaxonomyData.name,
          "growth_period": childTaxonomyData.id,
        },
      )
    }

  } else {
    noti.push(
      {
        "days_from": childTaxonomyData.days_from,
        "days_to": childTaxonomyData.days_to - beforeDays,
        "type": "cd",
        "title": ('cdNoti2'),
        "checkinField": "days_to",
        "isRead":false,
        "isDeleted":false,
        "periodName": childTaxonomyData.name,
        "growth_period": childTaxonomyData.id,
      },
    )
    // console.log(noti,"noti")
  }
  return noti;
}
export const getNextChildNotification = (gwperiodid: any, vcperiodid: any, hcperiodid: any, child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childAgeObj = childAge.sort(
    (a: any, b: any) => a.days_from - b.days_from,
  );
  //child.taxonomyData.id
  const lastchildgwperiod = childAgeObj.find(item => String(item.id) == String(gwperiodid));
  let lastgwperiodid = gwperiodid, lastvcperiodid = vcperiodid, lasthcperiodid = hcperiodid;
  let gwcdnotis: any[] = [];
  let vcnotis: any[] = [];
  let hcnotis: any[] = [];
  childAgeObj.map((element: any, index: number) => {
    // console.log(element, lastchildgwperiod)
    if (element.days_from >= lastchildgwperiod.days_from && element.days_from <= childAgeInDays) {
      let currentgwPeriodNoti = getCDGWNotisForChild(element);
      console.log(currentgwPeriodNoti, "currentgwPeriodNoti");
      lastgwperiodid = element.id;
      if (gwperiodid != lastgwperiodid) {
        currentgwPeriodNoti.forEach((noti) => {
          gwcdnotis.push(noti)
        })
      }
    }
  });
  ///perform computation for hc,vc
  // get all notis between last period id to current running period
  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods).sort(
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

  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods);
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

  let notis = {
    lastgwperiodid, gwcdnotis,
    lastvcperiodid, vcnotis,
    lasthcperiodid, hcnotis,
  }
  console.log(notis, "newCalcNotis")
  return notis
}
export const getChildNewNotification = (child, childAgeInDays, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods, childtaxonomy) => {
  let currentgwPeriodNoti = getCDGWNotisForChild(childtaxonomy)
  console.log(currentgwPeriodNoti, "currentgwPeriodNoti", childtaxonomy.id);

  let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods);
  console.log(vcNotis, "vcNotis")
  const currentvcPeriodNoti = vcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  console.log(currentvcPeriodNoti, "currentvcPeriodNoti", currentvcPeriodNoti[0].growth_period);

  let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods);
  console.log(hcNotis, "hcNotis")
  const currenthcPeriodNoti = hcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
  console.log(currenthcPeriodNoti, "currenthcPeriodNoti", currenthcPeriodNoti[0].growth_period);
  let notis = {
    lastgwperiodid: childtaxonomy.id, gwcdnotis: currentgwPeriodNoti,
    lastvcperiodid: currentvcPeriodNoti[0].growth_period, vcnotis: currentvcPeriodNoti,
    lasthcperiodid: currenthcPeriodNoti[0].growth_period, hcnotis: currenthcPeriodNoti,
  }
  return notis
}
export const getChildNotification = (child: any, childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any) => {
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.birthDate)).toMillis(),
  );
  const childCreateDate = DateTime.fromJSDate(new Date(child.createdAt));
  const childBirthDate = DateTime.fromJSDate(new Date(child.birthDate));
  console.log(childCreateDate < childBirthDate ? child.birthDate : child.createdAt);

  const childCreateDateInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(child.createdAt)).toMillis(),
  );
  if (childCreateDate > childBirthDate) {
    let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods);
    console.log(vcNotis, "vcNotis")
    //sort by days_from => find days_from period id to
    const currentvcPeriodNoti = vcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
    console.log(currentvcPeriodNoti, "currentvcPeriodNoti", currentvcPeriodNoti[0].growth_period);


    let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods);
    console.log(hcNotis, "hcNotis")
    const currenthcPeriodNoti = hcNotis.filter((item) => item.days_from <= childAgeInDays && item.days_to >= childAgeInDays)
    console.log(currenthcPeriodNoti, "currenthcPeriodNoti", currenthcPeriodNoti[0].growth_period);

    let currentgwPeriodNoti = getCDGWNotisForChild(child.taxonomyData)
    console.log(currentgwPeriodNoti, "currentgwPeriodNoti", child.taxonomyData.id);
    // {lastperiodid:child.taxonomyData.id,notis:currentgwPeriodNoti}
    let notis = {
      lastgwperiodid: child.taxonomyData.id, gwcdnotis: currentgwPeriodNoti,
      lastvcperiodid: currentvcPeriodNoti[0].growth_period, vcnotis: currentvcPeriodNoti,
      lasthcperiodid: currenthcPeriodNoti[0].growth_period, hcnotis: currenthcPeriodNoti,
    }
    console.log(notis, "newCalcNotis")
        // show current period's notifications if child was created after birth date (expecting child)

    return notis
  }
  else {
    console.log('childcreated but child is yet to born');
    return {
  // no notifications for expecting child 
    }
  
  }


  // const allnotis = getAllNotifications(childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods);
  // console.log(allnotis, "generatedNotis");
  // console.log(child);
  // console.log(childAgeInDays,"childAgeInDays",child)
  // if (childCreateDate > childBirthDate) {
  //   console.log('inif')
  //   //get notifications,from,to for period from child.taxonomyData for cd,gw
  //   //get notifications,from,to for hc,vc
  //   const childNotis = (allnotis.filter((item) => item.days_from<=child.taxonomyData.days_from && item.days_to>=child.taxonomyData.days_to));
  //   return {days_from:child.taxonomyData.days_from,days_to:child.taxonomyData.days_to,childNotis}
  // } else {
  //   console.log('inelse') //show current period's notifications if child was created after birth date
  //   const childNotis = (allnotis.filter((item) => item.days_from < childAgeInDays && item.days_to >= childAgeInDays));
  //   const childNotisItem= allnotis.find(item=>item.days_from < childAgeInDays && item.days_to >= childAgeInDays)
  //   return {days_from:childNotisItem.days_from,days_to:childNotisItem.days_to,childNotis};
  //   //  allnotis.filter((item) => item.days_from < childAgeInDays))
  // }
  // show all notifications if child was created before birth date or what? =>expecting child case
  // after period passed , show all previous period's notifications  till childcreate date or child dob ?

}
export const getNotisForNextPeriod = (days_from, days_to, child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods) => {
  const allnotis = getAllNotifications(childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods);
  console.log(allnotis, "generatedNotis");
  console.log(child);
  //generate notis from daysfrom to child.taxonomyData.days_from
  const childNotis = allnotis.filter((item) => item.days_from >= days_from && item.days_from <= child.taxonomyData.days_from)
  return { days_from: child.taxonomyData.days_from, days_to: child.taxonomyData.days_to, childNotis };
}
export const getAllNotifications = (childAge: any, allHealthCheckupsData: any, allVaccinePeriods: any, allGrowthPeriods: any) => {

  if (childAge?.length > 0 && allVaccinePeriods?.length > 0 && allHealthCheckupsData?.length > 0 && allGrowthPeriods?.length > 0) {
    //for cd1 notification=> show at days_from
    //for cd2 notification=> show at days_to
    //for gw1 notification=>show at days_to
    let vcNotis: any = getVCNotis(allVaccinePeriods, allGrowthPeriods);
    console.log(vcNotis, "vcNotis")
    let hcNotis: any = getHCReminderNotis(allHealthCheckupsData, allGrowthPeriods);
    console.log(hcNotis, "hcNotis")
    const notiData = getHCGWNotis(childAge)
    let notis: any = [];
    notiData.forEach((element: any) => {
      element?.noti.forEach((element1: any) => {
        notis.push(element1)
      })
    });
    return [...vcNotis, ...hcNotis, ...notis];
  } else {
    return []
    //no notifications if all arrays are empty
  }
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
export const getVCNotis = (allVaccinePeriods: any, allGrowthPeriods: any) => {
  let noti: any[] = [];
  // var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj, item) {
  //   // console.log(obj,item, "item");
  //   // const checkIfVacineMeasured = isVaccineMeasured(item.uuid);
  //   // console.log(checkIfVacineMeasured, "checkIfVacineMeasured");
  //   obj[item.growth_period] = obj[item.growth_period] || [];
  //   obj[item.growth_period].push({ id: item.id,uuid: item.uuid,title: item.title, pinned_article: item.pinned_article, created_at: item.created_a updated_at: item.updated_at });
  //   return obj;
  // }, {});
  // let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
  //   return { periodID: key, vaccines: group_to_growthPeriod[key] };
  // });
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
  groupsForPeriods.forEach((item: any, index: number) => {
    // console.log(item,'vcNoti')
    noti.push({
      "days_from": item?.vaccination_opens,
      "days_to": item?.vaccination_closes,
      "type": "vc",
      "title": ('vcNoti1'),
      "checkinField": "days_from",
      "isRead":false,
      "isDeleted":false,
      "growth_period": Number(item?.periodID),
      "periodName": item?.periodName,
    })
  });
  // console.log(noti, "inVC")
  return noti;
}
export const getHCReminderNotis = (allHealthCheckupsData: any, allGrowthPeriods: any) => {
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
        "isRead":false,
        "isDeleted":false,
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
export const getHCGWNotis = (childAge: any) => {

  //add gwNoti1 only if measures does not exist in that period
  let notiData = childAge;
  // console.log(childAge,"childAge")
  const getNotiData = (item: any) => {
    // console.log(item,"item")
    let noti = [];
    noti.push(//at the begginning of the period
      {
        "days_from": item.days_from,
        "days_to": item.days_to,
        "type": "gw",
        "title": ('gwNoti1'),
        "checkinField": "days_to",
        "isRead":false,
        "isDeleted":false,
        "periodName": item.name,
        "growth_period": item.id,
      },
      {
        "days_from": item.days_from,
        "days_to": item.days_to,
        "type": "cd",
        "title": ('cdNoti1'),
        "checkinField": "days_to",
        "isRead":false,
        "isDeleted":false,
        "periodName": item.name,
        "growth_period": item.id,
      })
    //if> 3months then add noti
    //check gap between days_to and days_from
    if ((item.days_to - item.days_from) >= threeeMonthDays) {
      const diff = Math.round((item.days_to - item.days_from) / twoMonthDays);
      // console.log(diff, item.days_from) //
      for (var i = 0; i < diff; i++) {
        noti.push(
          {
            "days_from": item.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? item.days_to - beforeDays : item.days_to < item.days_from + (i * twoMonthDays) + twoMonthDays ? item.days_to : item.days_from + (i * twoMonthDays) + twoMonthDays,
            "type": "gw",
            "title": ('gwNoti1'),
            "checkinField": "days_from",
            "isRead":false,
            "isDeleted":false,
            "periodName": item.name,
            "growth_period": item.id,
          },
          {
            "days_from": item.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? item.days_to - beforeDays : item.days_to < item.days_from + (i * twoMonthDays) + twoMonthDays ? item.days_to : item.days_from + (i * twoMonthDays) + twoMonthDays,
            "type": "cd",
            "title": ('cdNoti2'),
            "checkinField": "days_to",
            "isRead":false,
            "isDeleted":false,
            "periodName": item.name,
            "growth_period": item.id,
          },
        )
      }

    } else {
      noti.push(
        {
          "days_from": item.days_from,
          "days_to": item.days_to - beforeDays,
          "type": "cd",
          "title": ('cdNoti2'),
          "checkinField": "days_to",
          "isRead":false,
          "isDeleted":false,
          "periodName": item.name,
          "growth_period": item.id,
        },
      )
      // console.log(noti,"noti")
    }
    return noti;
  }

  return notiData.map((item: any) => ({ ...item, noti: getNotiData(item) }));
}