
import {apiUrlDevelop} from "@env"

export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    console.log("in finalurl", apiUrlDevelop);
    if(apiEndpoint==appConfig.sponsors){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang;
    }
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
}

export const appConfig = {
    articles: 'articles',
    videoArticles: 'video-articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages',
    sponsors:'sponsors'
}
