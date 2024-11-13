import { apiUrlDevelop, apiBabuniUrlDevelop } from "react-native-dotenv";
import RNFS from 'react-native-fs';
export const destinationFolder = RNFS.DocumentDirectoryPath + '/content/';
export const buildForFoleja = 'foleja'; //'foleja'
export const buildForBebbo = 'bebbo'; //'beb
export const buildForBangla = 'bangla'; //'bangla'
export const buildFor = buildForBangla; //'foleja'
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategory = '4,1,55,56,3,2';
export const articleCategoryIdArray = buildFor != buildForBangla ? [4, 1, 55, 56, 3, 2] : [376, 386, 391, 396, 401, 406];
export const articleCategoryArray = ['health_and_wellbeing', 'nutrition_and_breastfeeding', 'parenting_corner', 'play_and_learning', 'responsive_parenting', 'safety_and_protection'];
export const activityCategoryArray = ['socio_emotional', 'language_and_communication', 'cognitive', 'motor'];
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
const bebboShareUrl = 'https://www.bebbo.app/share/';
const folejaShareUrl = 'https://www.bebbo.app/foleja/share/';
const babuniShareUrl = 'https://www.babuni.app/share/';

export const shareText = (String(buildFor) === buildForBebbo) ? `\n${bebboShareUrl}` : (String(buildFor) === buildForFoleja) ? `\n${folejaShareUrl}` : `\n${babuniShareUrl}`;
export const shareTextButton = (String(buildFor) === buildForBebbo) ? bebboShareUrl : (String(buildFor) === buildForFoleja) ? folejaShareUrl : babuniShareUrl;

export const bebboShareMailId = 'mailto:admin@bebbo.app';
export const folejaShareMailId = 'mailto:prishtina@unicef.org';
export const banglaShareMailId = 'mailto:info@babuni.app';
export const maleData: any = {
  "id": 611,
  "name": "Male",
  "unique_name": "male"
};
export const relationShipMotherId = buildFor !== buildForBangla ? 109801 : 626;
export const relationShipFatherId = buildFor !== buildForBangla ? 109806 : 631;
export const relationShipOtherCaregiverId = buildFor !== buildForBangla ? 109811 : 636;
export const relationShipServiceProviderId = buildFor !== buildForBangla ? 109816 : 641;
export const femaleData: any = {
  "id":  buildForBangla !== buildForBangla ? 38 : 616,
  "name": "Female",
  "unique_name": "female"
};
export const childGenderUniqueName = {
  bothChildGender: 'both',
  girlChildGender: 'girl',
  boyChildGender: 'boy'
}
export const relationshipUniqueName = {
  relationShipMotherId: 'mother',
  relationShipFatherId: 'father',
  relationShipOtherCaregiverId: 'other_caregiver',
  relationShipServiceProviderId: 'service_provider'
}
export const parentGenderUniqueName = {
  bothParentGender: 'both',
  maleParentGender: 'male',
  femaleParentGender: 'female'
}
export const articleCategoryoUniqueNameObj = [
  { name: 'playingAndLearning', id: 'play_and_learning', image: 'ic_artl_play' },
  { name: 'healthAndWellbeingid', id: 'health_and_wellbeing', image: 'ic_artl_health' },
  { name: 'safetyAndProtection', id: 'safety_and_protection', image: 'ic_artl_safety' },
  { name: 'responsiveParenting', id: 'responsive_parenting', image: 'ic_artl_responsive' },
  { name: 'parentingCorner', id: 'parenting_corner', image: 'ic_artl_parenting' },
  { name: 'nutritionAndBreastfeeding', unique_name: 'nutrition_and_breastfeeding', image: 'ic_artl_nutrition' },
]
export const activityCategoryUniqueNameObj = [
  { name: 'Socio-emotional', id: 'socio_ emotional', image: 'ic_act_emotional' },
  { name: 'Language and communication', id: 'language_and_communication', image: 'ic_act_language' },
  { name: 'Cognitive', id: 'cognitive', image: 'ic_act_cognitive' },
  { name: 'Motor', id: 'motor', image: 'ic_act_movement' },
]
export const bothParentGender =  buildFor !== buildForBangla ? 60 : 621;
export const bothChildGender =  buildFor !== buildForBangla ? 59 : 536;
export const girlChildGender =  buildFor !== buildForBangla ? 41 : 531;
export const boyChildGender =  buildFor !== buildForBangla ? 40 : 526;
export const weightGrowthType = 32786;
export const heightGrowthType = 6461;
const today = new Date();
today.setFullYear(today.getFullYear() + 5);
export const fiveYearFromNow = today;
export const restOfTheWorldCountryId = 126;
export const videoArticleMandatory = 0;
export const maxArticleSize = 5;
export const bebboName = 'Bebbo';
export const folejaName = 'Foleja';
export const babuniName = 'Babuni';
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
  countryGroups: 'country-groups'
}
const selectCountry = () => {
  if(buildFor === 'bangla'){
    return {build:'Babuni',apiURL :apiBabuniUrlDevelop }
  } else if(buildFor === 'foleja') {
    return {build:'Foleja',apiURL :apiUrlDevelop }
  } else {
    return {build:'Bebbo',apiURL :apiUrlDevelop }
  }
}
export const finalUrl = (
  apiEndpoint: string,
  selectedCountry: number | undefined,
  selectedLang: string
): string => {
  const baseUrl =  buildFor === String(buildForBangla) ? `${apiBabuniUrlDevelop}/${apiEndpoint}` :`${apiUrlDevelop}/${apiEndpoint}`;

  switch (apiEndpoint) {
    case appConfig.countryGroups:
      return `${baseUrl}/${buildFor === String(buildForBangla) ? babuniName : bebboName}`;
    case appConfig.sponsors:
      return `${baseUrl}/${selectedCountry}`;
    case appConfig.taxonomies:
      return `${baseUrl}/${selectedLang}/all`;
    case appConfig.checkUpdate:
      return `${baseUrl}/${selectedCountry}`;
    default:
      return `${baseUrl}/${selectedLang}`;
  }
};

export const allApisObject = (isDatetimeReq: any, dateTimeObj: any): any => {
  const allApiObject = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.countryGroups,
      method: 'get',
      postdata: {},
      saveinDB: true,
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
  { name: 'playingAndLearning', id: buildFor !== buildForBangla ? 55 : 396, image: 'ic_artl_play' },
  { name: 'healthAndWellbeingid', id: buildFor !== buildForBangla ? 2: 376, image: 'ic_artl_health' },
  { name: 'safetyAndProtection', id: buildFor !== buildForBangla ? 3: 406, image: 'ic_artl_safety' },
  { name: 'responsiveParenting', id: buildFor !== buildForBangla ? 56 :  401, image: 'ic_artl_responsive' },
  { name: 'parentingCorner', id: buildFor !== buildForBangla ? 4 : 391, image: 'ic_artl_parenting' },
  { name: 'nutritionAndBreastfeeding', id: buildFor !== buildForBangla ? 1 : 386, image: 'ic_artl_nutrition' },
]
export const activityCategoryobj = [
  { name: 'Socio-emotional', id: buildFor !== buildForBangla ? 6431 : 546, image: 'ic_act_emotional' },
  { name: 'Language and communication', id: buildFor !== buildForBangla ? 6441 : 556, image: 'ic_act_language' },
  { name: 'Cognitive', id: buildFor !== buildForBangla ? 6436 : 551, image: 'ic_act_cognitive' },
  { name: 'Motor', id: buildFor !== buildForBangla ? 6421 : 541, image: 'ic_act_movement' },
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