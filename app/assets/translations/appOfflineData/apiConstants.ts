import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';
export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategory = '4,1,55,56,3,2';
export const articleCategoryArray = [4,1,55,56,3,2];
export const regexpEmojiPresentation = /[^\p{L} ]/gu;                       
// export const articleCategory = '"parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"';
// export const articleCategoryArray = ["parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"];
export const videoTypeVimeo = "vimeo";
export const videoTypeYoutube = "youtube";
export const videoTypeImage = "novideo";
export const backupGDriveFolderName= 'ParentBuddy';
export const backupGDriveFileName= 'my.backup';
export const tempRealmFile=RNFS.DocumentDirectoryPath + '/' + 'user1.realm';
export const backUpPath = RNFS.DocumentDirectoryPath + '/my.backup';
export const firstPeriodicSyncDays = 7;
export const secondPeriodicSyncDays = 30;
export const shareText='\nhttps://www.bebbo.app/share';
export const shareTextButton='https://bebbo.app/share/';
// export const shareTextButton='https://tesmobility.datamatics.com/share/';
export const maleData:any={
    "id": 37,
    "name": "Male",
    "unique_name": "male"
};
export const relationShipMotherId=109801;
export const relationShipFatherId=109806;
export const femaleData:any={
    "id": 38,
    "name": "Female",
    "unique_name": "female"
};
export const both_parent_gender=60;
export const both_child_gender=59;
export const girl_child_gender=41;
export const boy_child_gender=40;
export const weight_growth_type=32786;
export const height_growth_type=6461;
let today = new Date();
today.setFullYear(today.getFullYear() + 5);
export const  fiveYearFromNow = today;
export const restOfTheWorldCountryId = 126;
export const restOfTheWorldAlertTitle = 'Warning';
export const restOfTheWorldOkTitle = 'Ok';
export const restOfTheWorldAlertText = 'By selecting Rest of the world, you will enjoy all features of Bebbo, but note that vaccinations and Health check-ups are not customized to a specific national health program.';
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    // console.log(apiEndpoint,"in finalurl", apiUrlDevelop);
    // console.log("in finalurl", apiUrlDevelop);
    if(apiEndpoint==appConfig.sponsors){
       // return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedCountry;
    } 
    if(apiEndpoint==appConfig.taxonomies){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
    }
    if(apiEndpoint==appConfig.checkUpdate){
        // return 'https://staging.bebbo.app/api'+ '/'+apiEndpoint+'/6';
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedCountry;
    }
    if(apiEndpoint==appConfig.vaccinePinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/vaccinations';
    }
    if(apiEndpoint==appConfig.childGrowthPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.childdevGirlPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.childdevBoyPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.healthcheckupPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.faqPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.milestoneRelatedArticle){
        return apiUrlDevelop+ '/related-article-contents/'+selectedLang+'/milestone';
    }
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang;
    // return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
}

export const appConfig = {
    articles: 'articles',
    videoArticles: 'video-articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages',
    sponsors:'sponsors',
    taxonomies:'taxonomies',
    standardDeviation:'standard_deviation',
    milestones:'milestones',
    activities:'activities',
    surveys:'surveys',
    childDevelopmentData:'child-development-data',
    childGrowthData:'child-growth-data',
    vaccinations:'vaccinations',
    healthCheckupData:'health-checkup-data',
    pinnedContent:'pinned-contents',
    vaccinePinnedContent:'pinnedvaccinations',
    childdevGirlPinnedContent:'child_development/'+girl_child_gender,
    childdevBoyPinnedContent:'child_development/'+boy_child_gender,
    childGrowthPinnedContent:'child_growth',
    healthcheckupPinnedContent:'health_check_ups',
    faqPinnedContent:'faq',
    milestoneRelatedArticle:'milestonerelatedarticle',
    checkUpdate:'check-update',
    faqs:'faqs'
}

export const allApisObject = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.videoArticles,
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
      apiEndpoint: appConfig.activities,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.surveys,
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
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqs,
      method: 'get',
      postdata: {},
      saveinDB: true,
    }
  ];
export const articleCategoryobj = [
    {name:'playingAndLearning',id:55, image:'ic_artl_play'},
    {name:'healthAndWellbeingid',id:2, image:'ic_artl_health'},
    {name:'safetyAndProtection', id:3, image:'ic_artl_safety'},
    {name:'responsiveParenting', id:56,image:'ic_artl_responsive'},
    {name:'parentingCorner', id:4,image:'ic_artl_parenting'},
    {name:'nutritionAndBreastfeeding',id:1, image:'ic_artl_nutrition'},
]
export const activityCategoryobj = [
    {name:'Socio-emotional',id:6431, image:'ic_act_emotional'},
    {name:'Language and communication', id:6441,image:'ic_act_language'},
    {name:'Cognitive', id:6436, image:'ic_act_cognitive'},
    {name:'Motor',id:6421, image:'ic_act_movement'},
]
export const basicPagesUniqueName = {
    aboutus: 'about_us',
    terms: 'terms_and_conditions',
    privacypolicy: 'privacy_policy',

}
export const measurementPlaces = (items:any)=>{
    return [ {id:0,title:items[0] },{id:1,title:items[1] }]
}
export const maxCharForRemarks = 200;
export const threeeMonthDays = 90;
export const twoMonthDays = 60;
export const beforeDays = 5;
export const maxPeriodDays = 2920;
export const maxWeight = 28;
export const maxHeight = 125;