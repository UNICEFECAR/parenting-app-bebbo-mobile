import { appConfig, firstPeriodicSyncDays, secondPeriodicSyncDays } from "@assets/translations/appOfflineData/apiConstants";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "../../App";
import { setuserIsOnboarded, setSyncDate } from "../redux/reducers/utilsSlice";

export const getAllPeriodicSyncData = () => {
    const dispatch = useAppDispatch();
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
    
    const userOnboardedDate = useAppSelector(
        (state: any) => state.utilsData.userOnboardedDate,
    );
    const weeklyDownloadDate = useAppSelector(
        (state: any) => state.utilsData.weeklyDownloadDate,
    );
    const monthlyDownloadDate = useAppSelector(
        (state: any) => state.utilsData.monthlyDownloadDate,
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
          postdata: {},
          saveinDB: true,
        },
        {
          apiEndpoint: appConfig.activities,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
        // {
        //   apiEndpoint: appConfig.milestones,
        //   method: 'get',
        //   postdata: {},
        //   saveinDB: true,
        // },
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
          apiEndpoint: appConfig.milestoneRelatedArticle,
          method: 'get',
          postdata: {},
          saveinDB: true,
        },
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
        // {
        //   apiEndpoint: appConfig.surveys,
        //   method: 'get',
        //   postdata: {},
        //   saveinDB: true,
        // },
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
      let apiJsonData:any[] = [];
    let currentDate = 0,downloadWeeklyData,downloadMonthlyData,downloadBufferData;
    let ageBrackets: any = [];
    if (userIsOnboarded == false) {
        // dispatch(setuserIsOnboarded(true));
        // currentDate = DateTime.now().toMillis();
        // dispatch(setSyncDate({key: 'userOnboardedDate', value: currentDate}));
        // dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
        // dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    }
    else{
      console.log(bufferAgeBracket,"childList--",childList);
      childList.map((child: any) => {
        const childAgedays = (DateTime.now()).diff((DateTime.fromISO(child.birthDate)),'days').toObject().days;
        console.log(childAgedays,"---child",child.taxonomyData);
        if(childAgedays >= child.taxonomyData.days_to - child.taxonomyData.buffers_days)
        {
          const i = childAge.findIndex((_item:any) => _item.id === child.taxonomyData.id);
          // if(i > -1 && i < childAge.length){
            if(i > -1 && i < childAge.length-1){
            const nextchildAgeData = childAge[i+1];
            console.log("nextchildAgeData--",nextchildAgeData);
            if(nextchildAgeData.age_bracket.length > 0){
              nextchildAgeData.age_bracket.map((ages:any)=>{
                ageBrackets.push(ages);
              })
            }
          }
        }
      })
      console.log("before--",ageBrackets);
      ageBrackets = [...new Set(ageBrackets)]; 
      console.log("unique--",ageBrackets);
      if(bufferAgeBracket){
        ageBrackets = ageBrackets.filter((val:any)=>!bufferAgeBracket.includes(val));
      }
      console.log("new ageBrackets--",ageBrackets);
      if(ageBrackets.length > 0){
        downloadBufferData = true;
      }else {
        downloadBufferData = false
      }
        const weeklydiffdays = (DateTime.now()).diff((DateTime.fromMillis(weeklyDownloadDate)),'days').toObject().days;
        // console.log("weeklydiffdays--",weeklydiffdays);
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
        // console.log("monthlydiffdays--",monthlydiffdays);
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