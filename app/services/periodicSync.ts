import { appConfig, firstPeriodicSyncDays, secondPeriodicSyncDays } from "@assets/translations/appOfflineData/apiConstants";
import { DateTime } from "luxon";
import {  useAppSelector } from "../../App";

export const getAllPeriodicSyncData = () => {
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
      state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
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
          apiEndpoint: appConfig.taxonomies,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        //FAQ content
        //Chat questions list
        {
          apiEndpoint: appConfig.videoArticles,
          method: 'get',
          postdata: incrementalSyncDT['videoArticlesDatetime'] != '' ? {datetime: incrementalSyncDT['videoArticlesDatetime']} : {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.activities,
          method: 'get',
          postdata: incrementalSyncDT['activitiesDatetime'] != '' ? {datetime: incrementalSyncDT['activitiesDatetime']} : {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.vaccinePinnedContent,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.childGrowthPinnedContent,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.childdevGirlPinnedContent,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.childdevBoyPinnedContent,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.healthcheckupPinnedContent,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.faqPinnedContent,
          method: 'get',
          postdata: incrementalSyncDT['faqPinnedContentDatetime'] != '' ? {datetime: incrementalSyncDT['faqPinnedContentDatetime']} : {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.milestoneRelatedArticle,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.faqs,
          method: 'get',
          postdata: incrementalSyncDT['faqsDatetime'] != '' ? {datetime: incrementalSyncDT['faqsDatetime']} : {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.faqUpdatedPinnedContent,
          method: 'get',
          postdata: incrementalSyncDT['faqUpdatedPinnedContentDatetime'] != '' ? {datetime: incrementalSyncDT['faqUpdatedPinnedContentDatetime']} : incrementalSyncDT['faqPinnedContentDatetime'] != '' ? {datetime: incrementalSyncDT['faqPinnedContentDatetime']} : {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.archive,
          method: 'get',
          postdata: incrementalSyncDT['archiveDatetime'] != '' ? {datetime: incrementalSyncDT['archiveDatetime']} : incrementalSyncDT['faqPinnedContentDatetime'] != '' ? {datetime: incrementalSyncDT['faqPinnedContentDatetime']} : {},
          saveinDB: true,
        }
      ];
    const apiJsonDataSecondSync = [
        {
          apiEndpoint: appConfig.sponsors,
          method: 'get',
          postdata: {},
          saveinDB: false,
        },
        {
          apiEndpoint: appConfig.basicPages,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.dailyMessages,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.milestones,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.childDevelopmentData,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.vaccinations,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.healthCheckupData,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        {
            apiEndpoint: appConfig.standardDeviation,
            method: 'get',
            postdata: {},
            saveinDB: true,
        }
      ];
      const apiJsonData:any[] = [];
    let downloadWeeklyData,downloadMonthlyData,downloadBufferData;
    let ageBrackets: any = [];
    if (userIsOnboarded == false) {
      console.log("Don't sync");
        }
    else{
      childList.map((child: any) => {
        const childAgedays = (DateTime.now()).diff((DateTime.fromISO(child.birthDate)),'days').toObject().days;
        if(childAgedays >= child.taxonomyData.days_to - child.taxonomyData.buffers_days)
        {
          const i = childAge.findIndex((_item:any) => _item.id === child.taxonomyData.id);
          // i > -1 && i < childAge.length
            if(i > -1 && i < childAge.length-1){
            const nextchildAgeData = childAge[i+1];
             if(nextchildAgeData.age_bracket.length > 0){
              nextchildAgeData.age_bracket.map((ages:any)=>{
                ageBrackets.push(ages);
              })
            }
          }
        }
      })
      ageBrackets = [...new Set(ageBrackets)]; 
      if(bufferAgeBracket){
        ageBrackets = ageBrackets.filter((val:any)=>!bufferAgeBracket.includes(val));
      }
      if(ageBrackets.length > 0){
        downloadBufferData = true;
      }else {
        downloadBufferData = false
      }
        const weeklydiffdays = (DateTime.now()).diff((DateTime.fromMillis(weeklyDownloadDate)),'days').toObject().days;
        if(weeklydiffdays && weeklydiffdays > firstPeriodicSyncDays) {
            downloadWeeklyData = true;
            apiJsonDataFirstSync.map((value:any)=>{
                const i = apiJsonData.findIndex(_item => _item.apiEndpoint === value.apiEndpoint);
                if(i == -1){
                    apiJsonData.push(value) 
                }
            });
        }else {
            downloadWeeklyData = false;
        }

        const monthlydiffdays = (DateTime.now()).diff((DateTime.fromMillis(monthlyDownloadDate)),'days').toObject().days;
        if(monthlydiffdays && monthlydiffdays > secondPeriodicSyncDays) {
            downloadMonthlyData = true;
            apiJsonDataSecondSync.map((value:any)=>{
                const i = apiJsonData.findIndex(_item => _item.apiEndpoint === value.apiEndpoint);
                if(i == -1){
                    apiJsonData.push(value) 
                }
            });
        }else {
            downloadMonthlyData = false;
        }
    }
    return { downloadWeeklyData, downloadMonthlyData, apiJsonData, downloadBufferData, ageBrackets };

}