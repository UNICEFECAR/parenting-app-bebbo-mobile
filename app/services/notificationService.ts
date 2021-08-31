export const getAllNotifications = (t, childAge,allHealthCheckupsData,allVaccinePeriods,allGrowthPeriods) => {


  //for cd1 notification=> show at days_from
  //for cd2 notification=> show at days_to
  //for gw1 notification=>show at days_to
  let vcNotis:any = getVCNotis(t,allVaccinePeriods,allGrowthPeriods);
  console.log(vcNotis,"vcNotis")
  let hcNotis:any = getHCReminderNotis(t,allHealthCheckupsData,allGrowthPeriods);
  console.log(hcNotis,"hcNotis")
  const notiData = getHCGWNotis(t,childAge)
  let notis: any = [];
  notiData.forEach(element => {
    element?.noti.forEach(element1 => {
      notis.push(element1)
    })
  });
  return [...vcNotis,...hcNotis,...notis];
}
export const getVCPeriods = (allVaccinePeriods,allGrowthPeriods)=>{
  var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj, item) {
    // console.log(obj,item, "item");
    // const checkIfVacineMeasured = isVaccineMeasured(item.uuid);
    // console.log(checkIfVacineMeasured, "checkIfVacineMeasured");
    obj[item.growth_period] = obj[item.growth_period] || [];
    obj[item.growth_period].push({ id: item.id,uuid: item.uuid,title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
    return obj;
  }, {});
  let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
    return { periodID: key, vaccines: group_to_growthPeriod[key] };
  });
  
  console.log(groupsForPeriods,"groupsForPeriods")
  return groupsForPeriods
}
export const getVCNotis = (t,allVaccinePeriods,allGrowthPeriods) => {
  let noti: any[] = [];
  // var group_to_growthPeriod = allVaccinePeriods.reduce(function (obj, item) {
  //   // console.log(obj,item, "item");
  //   // const checkIfVacineMeasured = isVaccineMeasured(item.uuid);
  //   // console.log(checkIfVacineMeasured, "checkIfVacineMeasured");
  //   obj[item.growth_period] = obj[item.growth_period] || [];
  //   obj[item.growth_period].push({ id: item.id,uuid: item.uuid,title: item.title, pinned_article: item.pinned_article, created_at: item.created_at, updated_at: item.updated_at });
  //   return obj;
  // }, {});
  // let groupsForPeriods: any = Object.keys(group_to_growthPeriod).map(function (key) {
  //   return { periodID: key, vaccines: group_to_growthPeriod[key] };
  // });
 let groupsForPeriods = getVCPeriods(allVaccinePeriods,allGrowthPeriods);
  groupsForPeriods.forEach((item: any) => {
    // console.log(item,"groupsForPeriodsitem",allGrowthPeriods)
    const period = allGrowthPeriods.find(gwitem => gwitem.id == Number(item.periodID));
    // console.log(period, "period");
    if (period) {
      item.periodName = period.name;
      item.vaccination_opens = period.vaccination_opens;
      noti.push({
        "title": t('vcNoti1'), 
        "type": "vaccination", 
        "isRead": false,
        "isDeleted":false, "checkinField":"days_from",
        "days_from" : period?.vaccination_opens,
      })
    }
  })
  console.log(noti,"inVC")
  return noti;
}
export const getHCReminderNotis = (t,allHealthCheckupsData,allGrowthPeriods) => {
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
    console.log(item,"hcItem",index)
    if (item) {
      noti.push({
        "title": t('hcNoti1'), 
        "type": "healthchkp", 
        "isRead": false,
        "isDeleted":false, "checkinField":"days_from",
        "days_from" : item?.vaccination_opens,
        "days_to" : (index == allHealthCheckupsData.length - 1) ? 2920 : allHealthCheckupsData[index + 1]?.vaccination_opens,
      })
    }
    // const measuresForHCPeriod = getMeasuresForHCPeriod(hcItem, index)
    // console.log(index, measuresForHCPeriod, "measuresForHCPeriod");
    // hcItem.growthMeasures = measuresForHCPeriod;

  });
  return noti;
  console.log(noti,"withopen_close")
}
export const getHCGWNotis = (t,childAge) => {
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
        "title": t('gwNoti1'), type: "growth", "isRead": false,
        "isDeleted": false, checkinField: "days_from",
        "days_from": item.days_from,
        "days_to": item.days_to,
        
      },
      {
        "title": t('cdNoti1'), type: "development", "isRead": false,
        "isDeleted": false, checkinField: "days_from",
        "days_from": item.days_from,
        "days_to": item.days_to,
        
      })
    //if> 3months then add noti
    //check gap between days_to and days_from
    if ((item.days_to - item.days_from) >= threeeMonthDays) {
      const diff = Math.round((item.days_to - item.days_from) / twoMonthDays);
      console.log(diff, item.days_from) //what if 3.6 months
      for (var i = 0; i < diff; i++) {
        noti.push(
          {
            "title": t('gwNoti1'), type: "growth", "isRead": false,
            "isDeleted": false, checkinField: "days_from",
            "days_from": item.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? item.days_to - beforeDays : item.days_to < item.days_from + (i * twoMonthDays) + twoMonthDays ? item.days_to : item.days_from + (i * twoMonthDays) + twoMonthDays,
   
          },
          {
            "title": t('cdNoti2'), type: "development", "isRead": false,
            "isDeleted": false, checkinField: "days_to",
            "days_from": item.days_from + (i * twoMonthDays),
            "days_to": (i == diff - 1) ? item.days_to - beforeDays : item.days_to < item.days_from + (i * twoMonthDays) + twoMonthDays ? item.days_to : item.days_from + (i * twoMonthDays) + twoMonthDays,
   
          },
        )
      }

    } else {
      noti.push(
        {
          "title": t('cdNoti2'), type: "development", "isRead": false,
          "isDeleted": false, checkinField: "days_to",
          "days_from": item.days_from,
          "days_to": item.days_to - beforeDays,
 
        },
      )
      // console.log(noti,"noti")
    }
    return noti;
  }

  return notiData.map((item: any) => ({ ...item, noti: getNotiData(item) }));
}