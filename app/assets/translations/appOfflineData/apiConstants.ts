import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';
export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategory = '4,1,55,56,3,2';
export const articleCategoryArray = [4,1,55,56,3,2];
// export const articleCategory = '"parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"';
// export const articleCategoryArray = ["parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"];
export const videoTypeVimeo = "vimeo";
export const videoTypeYoutube = "youtube";
export const videoTypeImage = "novideo";
export const backupGDriveFolderName= 'ParentBuddy';
export const backupGDriveFileName= 'my.backup';
export const backUpPath = RNFS.DocumentDirectoryPath + '/my.backup';
export const firstPeriodicSyncDays = 7;
export const secondPeriodicSyncDays = 30;
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
export const height_growth_type=6461
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
     console.log("in finalurl", apiUrlDevelop);
    if(apiEndpoint==appConfig.sponsors){
       // return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedCountry;
    } 
    if(apiEndpoint==appConfig.taxonomies){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
    }
    // if(apiEndpoint==appConfig.basicPages){
    //     return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang;
    // }
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
    milestoneRelatedArticle:'milestonerelatedarticle'
}

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
export const maxCharForRemarks = 200