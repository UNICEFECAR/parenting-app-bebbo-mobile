import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';
export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
// export const articleCategory = '4,1,55,56,3,2';
// export const articleCategoryArray = [4,1,55,56,3,2];
export const articleCategory = '"parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"';
export const articleCategoryArray = ["parenting_corner","nutrition_and_breastfeeding","play_and_learning","responsive_parenting","safety_and_protection","health_and_wellbeing"];
export const videoTypeVimeo = "vimeo";
export const videoTypeYoutube = "youtube";
export const videoTypeImage = "novideo";
export const backupGDriveFolderName= 'ParentBuddy';
export const backupGDriveFileName= 'my.backup';
export const backUpPath = RNFS.DocumentDirectoryPath + '/my.backup';
export const firstPeriodicSyncDays = 7;
export const secondPeriodicSyncDays = 30;
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
    childdevGirlPinnedContent:'child_development/41',
    childdevBoyPinnedContent:'child_development/40',
    childGrowthPinnedContent:'child_growth',
    healthcheckupPinnedContent:'health_check_ups',
    milestoneRelatedArticle:'milestonerelatedarticle'
}

export const articleCategoryobj = [
    {name:'playingAndLearning',unique_name:"play_and_learning",id:55, image:'ic_artl_play'},
    {name:'healthAndWellbeingid',unique_name:"health_and_wellbeing",id:2, image:'ic_artl_health'},
    {name:'safetyAndProtection',unique_name:"safety_and_protection", id:3, image:'ic_artl_safety'},
    {name:'responsiveParenting',unique_name:"responsive_parenting", id:56,image:'ic_artl_responsive'},
    {name:'parentingCorner',unique_name:"parenting_corner", id:4,image:'ic_artl_parenting'},
    {name:'nutritionAndBreastfeeding',unique_name: "nutrition_and_breastfeeding",id:1, image:'ic_artl_nutrition'},
]
export const activityCategoryobj = [
    {name:'Socio-emotional',unique_name: "socio_emotional",id:6431, image:'ic_act_emotional'},
    {name:'Language and communication',unique_name: "language_and_communication", id:6441,image:'ic_act_language'},
    {name:'Cognitive',unique_name: "cognitive", id:6436, image:'ic_act_cognitive'},
    {name:'Motor',unique_name: "motor",id:6421, image:'ic_act_movement'},
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