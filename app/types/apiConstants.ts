import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';

export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    //console.log("in finalurl", apiUrlDevelop);
   
    // if(apiEndpoint==appConfig.sponsors){
    //     return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
    // }else 
    if(apiEndpoint==appConfig.taxonomies){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
    }
    if(apiEndpoint==appConfig.basicPages){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
    }
    if(apiEndpoint==appConfig.vaccinePinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+selectedCountry+'/vaccinations';
    }
    if(apiEndpoint==appConfig.childGrowthPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+selectedCountry+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.childdevGirlPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+selectedCountry+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.childdevBoyPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+selectedCountry+'/'+apiEndpoint;
    }
    if(apiEndpoint==appConfig.healthcheckupPinnedContent){
        return apiUrlDevelop+ '/pinned-contents/'+selectedLang+'/'+selectedCountry+'/'+apiEndpoint;
    }
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
    // return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
}

export const appConfig = {
    articles: 'articles',
    videoArticles: 'video-articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages',
    sponsors:'sponsors',
    taxonomies:'taxonomies',
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
    healthcheckupPinnedContent:'health_check_ups'
}

export const activityCategory = [
    {name:'playingAndLearning',id:'55', image:'ic_artl_play'},
    {name:'healthAndWellbeingid',id:'2', image:'ic_artl_health'},
    {name:'safetyAndProtection', id:'3', image:'ic_artl_safety'},
    {name:'responsiveParenting', id:'56',image:'ic_artl_responsive'},
    {name:'parentingCorner', id:'4',image:'ic_artl_parenting'},
    {name:'nutritionAndBreastfeeding',id:'1', image:'ic_artl_nutrition'},
]

export const basicPagesUniqueName = {
    aboutus: 'about_us',
    terms: 'terms_and_conditions',
    privacypolicy: 'privacy_policy',

}