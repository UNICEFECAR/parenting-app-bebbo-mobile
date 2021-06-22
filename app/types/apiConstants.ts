
import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';

export const destinationFolder=RNFS.DocumentDirectoryPath + '/content/';
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    console.log("in finalurl", apiUrlDevelop);
    if(apiEndpoint==appConfig.sponsors){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang;
    }else if(apiEndpoint==appConfig.taxonomies){
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

export const activityCategory = {
    playingAndLearning: '55',
    healthAndWellbeing: '2',
    safetyAndProtection: '3',
    responsiveParenting: '56',
    parentingCorner: '4',
    nutritionAndBreastfeeding: '1',

}