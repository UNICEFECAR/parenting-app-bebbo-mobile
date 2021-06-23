
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
    articles: 'articless',
    videoArticles: 'video-articlesss',
    dailyMessages: 'daily-homescreen-messagesss',
    basicPages: 'basic-pagessss',
    sponsors:'sponsorsss',
    taxonomies:'taxonomiesss'
}

export const activityCategory = {
    playingAndLearning: '55',
    healthAndWellbeing: '2',
    safetyAndProtection: '3',
    responsiveParenting: '56',
    parentingCorner: '4',
    nutritionAndBreastfeeding: '1',

}