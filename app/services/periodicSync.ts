import { appConfig } from "../instance";
import { DateTime } from "luxon";
import { useAppSelector } from "../../App";

export const getAllPeriodicSyncData = (): any => {
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const bufferAgeBracket = useAppSelector((state: any) =>
    state.childData.childDataSet.bufferAgeBracket
  );
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const userIsOnboarded = useAppSelector(
    (state: any) => state.utilsData.userIsOnboarded,
  );
  const weeklyDownloadDate = useAppSelector(
    (state: any) => state.utilsData.weeklyDownloadDate,
  );
  const monthlyDownloadDate = useAppSelector(
    (state: any) => state.utilsData.monthlyDownloadDate,
  );
  const incrementalSyncDT = useAppSelector((state: any) =>
    (state.utilsData.incrementalSyncDT),
  );
  const apiJsonDataFirstSync = [
    {
      apiEndpoint: appConfig.apiConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    //FAQ content
    //Chat questions list
    {
      apiEndpoint: appConfig.apiConfig.videoArticles,
      method: 'get',
      postdata: incrementalSyncDT['videoArticlesDatetime'] != '' ? { datetime: incrementalSyncDT['videoArticlesDatetime'] } : {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.activities,
      method: 'get',
      postdata: incrementalSyncDT['activitiesDatetime'] != '' ? { datetime: incrementalSyncDT['activitiesDatetime'] } : {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.faqs,
      method: 'get',
      postdata: incrementalSyncDT['faqsDatetime'] != '' ? { datetime: incrementalSyncDT['faqsDatetime'] } : {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.archive,
      method: 'get',
      postdata: incrementalSyncDT['archiveDatetime'] != '' ? { datetime: incrementalSyncDT['archiveDatetime'] } : incrementalSyncDT['faqPinnedContentDatetime'] != '' ? { datetime: incrementalSyncDT['faqPinnedContentDatetime'] } : {},
      saveinDB: true,
    }
  ];
  const apiJsonDataSecondSync = [
    {
      apiEndpoint: appConfig.apiConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
      apiEndpoint: appConfig.apiConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.dailyMessages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.milestones,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.childDevelopmentData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.vaccinations,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.healthCheckupData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    }
  ];
  const apiJsonData: any[] = [];
  let downloadWeeklyData, downloadMonthlyData, downloadBufferData;
  let ageBrackets: any = [];
  if (userIsOnboarded == false) {
    console.log("Don't sync");
  }
  else {
    if (childList.length > 0) {
      childList.map((child: any) => {
        const childAgedays = (DateTime.now()).diff((DateTime.fromISO(child.birthDate)), 'days').toObject().days;
        if (childAgedays >= child.taxonomyData.days_to - child.taxonomyData.buffers_days) {
          const i = childAge.findIndex((_item: any) => _item.id === child.taxonomyData.id);
          // i > -1 && i < childAge.length
          if (i > -1 && i < childAge.length - 1) {
            const nextchildAgeData = childAge[i + 1];
            if (nextchildAgeData.age_bracket.length > 0) {
              nextchildAgeData.age_bracket.map((ages: any) => {
                ageBrackets.push(ages);
              })
            }
          }
        }
      })
    }
    ageBrackets = [...new Set(ageBrackets)];
    if (bufferAgeBracket) {
      ageBrackets = ageBrackets.filter((val: any) => !bufferAgeBracket.includes(val));
    }
    if (ageBrackets.length > 0) {
      downloadBufferData = true;
    } else {
      downloadBufferData = false
    }
    const weeklydiffdays = (DateTime.now()).diff((DateTime.fromMillis(weeklyDownloadDate)), 'days').toObject().days;
    if (weeklydiffdays && weeklydiffdays > appConfig.firstPeriodicSyncDays) {
      downloadWeeklyData = true;
      apiJsonDataFirstSync.map((value: any) => {
        const i = apiJsonData.findIndex(_item => _item.apiEndpoint === value.apiEndpoint);
        if (i == -1) {
          apiJsonData.push(value)
        }
      });
    } else {
      downloadWeeklyData = false;
    }

    const monthlydiffdays = (DateTime.now()).diff((DateTime.fromMillis(monthlyDownloadDate)), 'days').toObject().days;
    if (monthlydiffdays && monthlydiffdays > appConfig.secondPeriodicSyncDays) {
      downloadMonthlyData = true;
      apiJsonDataSecondSync.map((value: any) => {
        const i = apiJsonData.findIndex(_item => _item.apiEndpoint === value.apiEndpoint);
        if (i == -1) {
          apiJsonData.push(value)
        }
      });
    } else {
      downloadMonthlyData = false;
    }
  }
  return { downloadWeeklyData, downloadMonthlyData, apiJsonData, downloadBufferData, ageBrackets };

}