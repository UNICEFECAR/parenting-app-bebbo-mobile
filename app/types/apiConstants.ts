
//import {apiUrlDevelop} from "@env";
const apiUrlDevelop = 'http://parentbuddy2fz6bm64mba.devcloud.acquia-sites.com/api';
export const finalUrl = (apiEndpoint:string,selectedCountry: number | undefined,selectedLang: string)=>{
    console.log("in finalurl");
    if(apiEndpoint==appConfig.sponsors){
        return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang;
    }
    return apiUrlDevelop+ '/'+apiEndpoint+'/'+selectedLang+'/'+selectedCountry;
}

export const appConfig = {
    articles: 'articles',
    dailyMessages: 'daily-homescreen-messages',
    basicPages: 'basic-pages',
    sponsors:'sponsors'
}
