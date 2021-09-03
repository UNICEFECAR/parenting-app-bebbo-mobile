import { maxPeriodDays } from "./healthCheckupService";

export const getAllNotifications = (childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods) => {

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
    notiData.forEach(element => {
      element?.noti.forEach(element1 => {
        notis.push(element1)
      })
    });
    return [...vcNotis, ...hcNotis, ...notis];
  }else{
    return []
    //no notifications if all arrays are empty
  }
}
export const getVCPeriods = (allVaccinePeriods) => {
  var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj, item) {
    // console.log(obj,item, "item");
    // const checkIfVacineMeasured = isVaccineMeasured(item.uuid);
    // console.log(checkIfVacineMeasured, "checkIfVacineMeasured");
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id, uuid: item.uuid, title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
    return obj;
  }, { });
  let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
    return { periodID: key, vaccines: group_to_growthPeriod[key] };
  });

  console.log(groupsForPeriods, "groupsForPeriods")
  return groupsForPeriods
}
export const getVCNotis = (allVaccinePeriods, allGrowthPeriods) => {
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
    const period = allGrowthPeriods.find(gwitem => gwitem.id == Number(item.periodID));
    // console.log(period, "period");
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;
      
    }
  })
  groupsForPeriods.map((item: any, index: number)=>{
    item.vaccination_opens = item.vaccination_opens;
    item.vaccination_closes = (index == groupsForPeriods.length - 1) ? maxPeriodDays :  groupsForPeriods[index+1].vaccination_opens;
  })
  groupsForPeriods.forEach((item: any, index: number) => {
   noti.push({
        "days_from": item?.vaccination_opens,
        "days_to": item?.vaccination_closes,
        "type": "vaccination",
        "title": ('vcNoti1'),
        "checkinField": "days_from",
        "growth_period":Number(item?.periodID),
        "periodName":item?.periodName,
      })
  });
  console.log(noti, "inVC")
  return noti;
}
export const getHCReminderNotis = (allHealthCheckupsData, allGrowthPeriods) => {
  // console.log(allHealthCheckupsData,"allHealthCheckupsData")
  let noti: any[] = [];
  allHealthCheckupsData.map((hcItem: any) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item) => item.id == hcItem.growth_period);
    if (item) {
      hcItem.vaccination_opens = item?.vaccination_opens;
    }
  }).sort(
    (a: any, b: any) => a.vaccination_opens - b.vaccination_opens,
  );
  // console.log("allHealthCheckupsDatasorted",allHealthCheckupsData,allHealthCheckupsData.length);
  allHealthCheckupsData.reverse().forEach((hcItem: any, index: number) => {
    // hcItem.vaccines = getVaccinesForHCPeriod(hcItem.growth_period) // this is to show which vaccines are given / not given in Healthchecks period
    // hcItem.vaccination_opens = getVaccineOpens(hcItem.growth_period).vaccination_opens;
    const item = allGrowthPeriods.find((item) => item.id == hcItem.growth_period);
    // console.log(item,"hcItem",index)
    if (item) {
      noti.push({
        "days_from": item?.vaccination_opens,
        "days_to": (index == allHealthCheckupsData.length - 1) ? maxPeriodDays : allHealthCheckupsData[index + 1]?.vaccination_opens,
        "type": "healthchkp",
        "title": ('hcNoti1'),
        "checkinField": "days_from",
        "growth_period":hcItem.growth_period,
        "periodName":hcItem.title
      })
    }
    // const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
    // console.log(index, measuresForHCPeriod, "measuresForHCPeriod");
    // hcItem.growthMeasures = measuresForHCPeriod;

  });
  return noti;
  // console.log(noti,"withopen_close")
}
export const getHCGWNotis = (childAge) => {
  const threeeMonthDays = 90;
  const twoMonthDays = 60;
  const beforeDays = 5;
  let notiData = childAge;
  // console.log(childAge,"childAge")
  const getNotiData = (item: any) => {
    // console.log(item,"item")
    let noti = [];
    noti.push(//at the begginning of the period
      {
        "days_from": item.days_from,
        "days_to": item.days_to,
        "type": "growth",
        "title": ('gwNoti1'),
        "checkinField": "days_to",
        "periodName":item.name,
        "growth_period":item.id,
      },
      {
        "days_from": item.days_from,
        "days_to": item.days_to,
        "type": "development",
        "title": ('cdNoti1'),
        "checkinField": "days_to",
        "periodName":item.name,
        "growth_period":item.id,
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
            "type": "growth",
            "title": ('gwNoti1'),
            "checkinField": "days_from",
            "periodName":item.name,
            "growth_period":item.id,
          },
          {
            "days_from": item.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? item.days_to - beforeDays : item.days_to < item.days_from + (i * twoMonthDays) + twoMonthDays ? item.days_to : item.days_from + (i * twoMonthDays) + twoMonthDays,
            "type": "development",
            "title": ('cdNoti2'), 
            "checkinField": "days_to",
            "periodName":item.name,
            "growth_period":item.id,
          },
        )
      }

    } else {
      noti.push(
        {
          "days_from": item.days_from,
          "days_to": item.days_to - beforeDays,
          "type": "development",
          "title": ('cdNoti2'), 
          "checkinField": "days_to",
          "periodName":item.name,
          "growth_period":item.id,
        },
      )
      // console.log(noti,"noti")
    }
    return noti;
  }

  return notiData.map((item: any) => ({ ...item, noti: getNotiData(item) }));
}