
import { apiUrlDevelop } from 'react-native-dotenv';
import RNFS from 'react-native-fs';

export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    //console.log("in finalurl", apiUrlDevelop);
   
    // if(apiEndpoint==appConfig.sponsors){
    //     return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
    // }else 
    if(apiEndpoint==appConfig.taxonomies){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/all';
    }
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
}

export const appConfig = {
    articles: 'articles',
    videoArticles: 'video-articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages',
    sponsors:'sponsors',
    taxonomies:'taxonomies'
}

export const activityCategory = [
    {name:'playingAndLearning',id:'55', image:'ic_artl_play'},
    {name:'healthAndWellbeingid',id:'2', image:'ic_artl_health'},
    {name:'safetyAndProtection', id:'3', image:'ic_artl_safety'},
    {name:'responsiveParenting', id:'56',image:'ic_artl_responsive'},
    {name:'parentingCorner', id:'4',image:'ic_artl_parenting'},
    {name:'nutritionAndBreastfeeding',id:'1', image:'ic_artl_nutrition'},
]