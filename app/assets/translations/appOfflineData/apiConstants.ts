import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';
export const destinationFolder = RNFS.DocumentDirectoryPath + '/content/';
export const buildForFoleja = 'foleja'; //'foleja'
export const buildForBebbo = 'bebbo'; //'foleja'
export const buildFor = buildForBebbo; //'foleja'
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategory = '4,1,55,56,3,2';
export const articleCategoryArray = [4, 1, 55, 56, 3, 2];
export const regexpEmojiPresentation = /[^\p{L} ]/gu;
export const luxonDefaultLocale = "en-US";
export const videoTypeVimeo = "vimeo";
export const videoTypeYoutube = "youtube";
export const videoTypeImage = "novideo";
export const backupGDriveFolderName = 'ParentBuddy';
export const backupGDriveFileName = 'mybackup.json';
export const tempRealmFile = RNFS.DocumentDirectoryPath + '/' + 'user1.realm';
export const tempFuseJsonPath = RNFS.DocumentDirectoryPath + '/' + 'fuse-index.json';
export const backUpPath = RNFS.DocumentDirectoryPath + '/mybackup.json';
export const tempbackUpPath = RNFS.TemporaryDirectoryPath + 'mybackup.json';
export const firstPeriodicSyncDays = 7;
export const secondPeriodicSyncDays = 30;
export const shareText = (String(buildFor) != buildForBebbo) ? '\nhttps://www.bebbo.app/foleja/share/' : '\nhttps://www.bebbo.app/share/';
export const shareTextButton = (String(buildFor) != buildForBebbo) ? 'https://www.bebbo.app/foleja/share/' : 'https://www.bebbo.app/share/';
export const bebboShareMailId = 'mailto:admin@bebbo.app';
export const folejaShareMailId = 'mailto:prishtina@unicef.org';
export const maleData: any = {
  "id": 37,
  "name": "Male",
  "unique_name": "male"
};
export const relationShipMotherId = 109801;
export const relationShipFatherId = 109806;
export const relationShipOtherCaregiverId = 109811;
export const relationShipServiceProviderId = 109816;
export const femaleData: any = {
  "id": 38,
  "name": "Female",
  "unique_name": "female"
};
export const bothParentGender = 60;
export const bothChildGender = 59;
export const girlChildGender = 41;
export const boyChildGender = 40;
export const weightGrowthType = 32786;
export const heightGrowthType = 6461;
const today = new Date();
today.setFullYear(today.getFullYear() + 5);
export const fiveYearFromNow = today;
export const restOfTheWorldCountryId = 126;
export const videoArticleMandatory = 0;
export const maxArticleSize = 5;
export const appConfig = {
  articles: 'articles',
  videoArticles: 'video-articles',
  dailyMessages: 'daily-homescreen-messages',
  basicPages: 'basic-pages',
  sponsors: 'sponsors',
  taxonomies: 'taxonomies',
  standardDeviation: 'standard_deviation',
  milestones: 'milestones',
  activities: 'activities',
  surveys: 'surveys',
  childDevelopmentData: 'child-development-data',
  childGrowthData: 'child-growth-data',
  vaccinations: 'vaccinations',
  healthCheckupData: 'health-checkup-data',
  pinnedContent: 'pinned-contents',
  checkUpdate: 'check-update',
  faqs: 'faqs',
  archive: 'archive',
}
export const finalUrl = (apiEndpoint: string, selectedCountry: number | undefined, selectedLang: string): any => {
  if (apiEndpoint == appConfig.sponsors) {
    return apiUrlDevelop + '/' + apiEndpoint + '/' + selectedCountry;
  }
  if (apiEndpoint == appConfig.taxonomies) {
    return apiUrlDevelop + '/' + apiEndpoint + '/' + selectedLang + '/all';
  }
  if (apiEndpoint == appConfig.checkUpdate) {
    return apiUrlDevelop + '/' + apiEndpoint + '/' + selectedCountry;
  }
  return apiUrlDevelop + '/' + apiEndpoint + '/' + selectedLang;
}


export const allApisObject = (isDatetimeReq: any, dateTimeObj: any): any => {
  const allApiObject = [
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
      postdata: isDatetimeReq == true && dateTimeObj['videoArticlesDatetime'] != '' ? { datetime: dateTimeObj['videoArticlesDatetime'] } : {},
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
      postdata: isDatetimeReq == true && dateTimeObj['activitiesDatetime'] != '' ? { datetime: dateTimeObj['activitiesDatetime'] } : {},
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
      apiEndpoint: appConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqs,
      method: 'get',
      postdata: isDatetimeReq == true && dateTimeObj['faqsDatetime'] != '' ? { datetime: dateTimeObj['faqsDatetime'] } : {},
      saveinDB: true,
    }
  ];
  if (isDatetimeReq == true) {
    allApiObject.push(
      {
        apiEndpoint: appConfig.archive,
        method: 'get',
        postdata: isDatetimeReq == true && dateTimeObj['archiveDatetime'] != '' ? { datetime: dateTimeObj['archiveDatetime'] } : dateTimeObj['faqPinnedContentDatetime'] != '' ? { datetime: dateTimeObj['faqPinnedContentDatetime'] } : {},
        saveinDB: true,
      })
  }
  return allApiObject;
}
export const articleCategoryobj = [
  { name: 'playingAndLearning', id: 55, image: 'ic_artl_play' },
  { name: 'healthAndWellbeingid', id: 2, image: 'ic_artl_health' },
  { name: 'safetyAndProtection', id: 3, image: 'ic_artl_safety' },
  { name: 'responsiveParenting', id: 56, image: 'ic_artl_responsive' },
  { name: 'parentingCorner', id: 4, image: 'ic_artl_parenting' },
  { name: 'nutritionAndBreastfeeding', id: 1, image: 'ic_artl_nutrition' },
]
export const activityCategoryobj = [
  { name: 'Socio-emotional', id: 6431, image: 'ic_act_emotional' },
  { name: 'Language and communication', id: 6441, image: 'ic_act_language' },
  { name: 'Cognitive', id: 6436, image: 'ic_act_cognitive' },
  { name: 'Motor', id: 6421, image: 'ic_act_movement' },
]
export const basicPagesUniqueName = {
  aboutus: 'about_us',
  terms: 'terms_and_conditions',
  privacypolicy: 'privacy_policy',

}
export const measurementPlaces = (items: any): any => {
  return [{ id: 0, title: items[0] }, { id: 1, title: items[1] }]
}
export const maxCharForRemarks = 200;
export const threeeMonthDays = 90;
export const twoMonthDays = 60;
export const oneMonthDays = 30;
export const afterDays = 5;
export const beforeDays = 6;
export const maxPeriodDays = 2920;
export const maxWeight = 28;
export const maxHeight = 125;