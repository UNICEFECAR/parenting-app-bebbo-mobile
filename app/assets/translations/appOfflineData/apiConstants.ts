<<<<<<< HEAD
import { apiUrlDevelop, apiBabuniUrlDevelop } from "react-native-dotenv";
=======
import { apiUrlDevelop } from "react-native-dotenv";
>>>>>>> origin/tmp-remove-hist-ga
import RNFS from 'react-native-fs';
export const destinationFolder = RNFS.DocumentDirectoryPath + '/content/';
export const buildForFoleja = 'foleja'; //'foleja'
export const buildForBebbo = 'bebbo'; //'foleja'
<<<<<<< HEAD
export const buildForBangla = 'bangla'; //'foleja'
export const buildFor = buildForBangla; //'foleja'
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategoryIdArray = [376, 386, 391, 396, 401, 406];
export const articleCategoryArray = ['health_and_wellbeing', 'nutrition_and_breastfeeding', 'parenting_corner', 'play_and_learning', 'responsive_parenting', 'safety_and_protection'];
export const activityCategoryArray = ['socio_ emotional', 'language_and_communication', 'cognitive', 'motor'];
=======
export const buildFor = buildForBebbo; //'foleja'
export const maxRelatedArticleSize = 3;
export const isArticlePinned = '1';
export const articleCategory = '4,1,55,56,3,2';
export const articleCategoryArray = [4, 1, 55, 56, 3, 2];
>>>>>>> origin/tmp-remove-hist-ga
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
<<<<<<< HEAD
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
export const relationShipMotherId = 626;
export const relationShipFatherId = 631;
export const relationShipOtherCaregiverId = 636;
export const relationShipServiceProviderId = 641;
export const femaleData: any = {
  "id": 616,
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
export const bothParentGender = 621;
export const bothChildGender = 536;
export const girlChildGender = 531;
export const boyChildGender = 526;
=======
export const shareText = (String(buildFor) != buildForBebbo) ? '\nhttps://www.bebbo.app/foleja/share/' : '\nhttps://www.bebbo.app/share/';
export const shareTextButton = (String(buildFor) != buildForBebbo) ? 'https://www.bebbo.app/foleja/share/' : 'https://www.bebbo.app/share/';
// export const bebboShareMailId = 'mailto:admin@bebbo.app';
// export const folejaShareMailId = 'mailto:prishtina@unicef.org';
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
>>>>>>> origin/tmp-remove-hist-ga
export const weightGrowthType = 32786;
export const heightGrowthType = 6461;
const today = new Date();
today.setFullYear(today.getFullYear() + 5);
export const fiveYearFromNow = today;
export const restOfTheWorldCountryId = 126;
export const videoArticleMandatory = 0;
export const maxArticleSize = 5;
<<<<<<< HEAD
=======
export const bebboName = 'Bebbo';
export const folejaName = 'Foleja';
>>>>>>> origin/tmp-remove-hist-ga
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
<<<<<<< HEAD
  vaccinePinnedContent: 'pinnedvaccinations',
  childGrowthPinnedContent: 'child_growth',
  healthcheckupPinnedContent: 'health_check_ups',
  faqPinnedContent: 'faq',
  faqUpdatedPinnedContent: 'updatedfaq',
  milestoneRelatedArticle: 'milestonerelatedarticle',
  checkUpdate: 'check-update',
  faqs: 'faqs',
  archive: 'archive',
}
export const finalUrl = (apiEndpoint: string, selectedCountry: number | undefined, selectedLang: string): any => {
  const isBuildForBabuni = buildFor == String(buildForBangla);
  const apiURLDevelop = isBuildForBabuni ? apiBabuniUrlDevelop :apiUrlDevelop;
  console.log('API URL is',apiURLDevelop)
  if (apiEndpoint == appConfig.sponsors) {
    return apiURLDevelop + '/' + apiEndpoint + '/' + selectedCountry;
  }
  if (apiEndpoint == appConfig.taxonomies) {
    return apiURLDevelop + '/' + apiEndpoint + '/' + selectedLang + '/all';
  }
  if (apiEndpoint == appConfig.checkUpdate) {
    return apiURLDevelop + '/' + apiEndpoint + '/' + selectedCountry;
  }
  if (apiEndpoint == appConfig.vaccinePinnedContent) {
    return apiURLDevelop + '/pinned-contents/' + selectedLang + '/vaccinations';
  }
  if (apiEndpoint == appConfig.childGrowthPinnedContent) {
    return apiURLDevelop + '/pinned-contents/' + selectedLang + '/' + apiEndpoint;
  }
  if (apiEndpoint == appConfig.healthcheckupPinnedContent) {
    return apiURLDevelop + '/pinned-contents/' + selectedLang + '/' + apiEndpoint;
  }
  if (apiEndpoint == appConfig.faqPinnedContent) {
    return apiURLDevelop + '/pinned-contents/' + selectedLang + '/' + apiEndpoint;
  }
  if (apiEndpoint == appConfig.milestoneRelatedArticle) {
    return apiURLDevelop + '/related-article-contents/' + selectedLang + '/milestone';
  }
  if (apiEndpoint == appConfig.faqUpdatedPinnedContent) {
    return apiURLDevelop + '/updated-pinned-contents/' + selectedLang + '/faq';
  }
  return apiURLDevelop + '/' + apiEndpoint + '/' + selectedLang;
}

=======
  checkUpdate: 'check-update',
  faqs: 'faqs',
  archive: 'archive',
  countryGroups: 'country-groups',
}
export const finalUrl = (
  apiEndpoint: string,
  selectedCountry: number | undefined,
  selectedLang: string
): string => {
  const baseUrl = `${apiUrlDevelop}/${apiEndpoint}`;

  switch (apiEndpoint) {
    case appConfig.countryGroups:
      return `${baseUrl}/${buildFor === String(buildForFoleja) ? folejaName : bebboName}`;
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
>>>>>>> origin/tmp-remove-hist-ga

export const allApisObject = (isDatetimeReq: any, dateTimeObj: any): any => {
  const allApiObject = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
<<<<<<< HEAD
=======
      apiEndpoint: appConfig.countryGroups,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
>>>>>>> origin/tmp-remove-hist-ga
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
<<<<<<< HEAD
      apiEndpoint: appConfig.vaccinePinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childGrowthPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthcheckupPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqPinnedContent,
      method: 'get',
      postdata: isDatetimeReq == true && dateTimeObj['faqPinnedContentDatetime'] != '' ? { datetime: dateTimeObj['faqPinnedContentDatetime'] } : {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
=======
>>>>>>> origin/tmp-remove-hist-ga
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
<<<<<<< HEAD
    // {
    //   apiEndpoint: appConfig.faqUpdatedPinnedContent,
    //   method: 'get',
    //   postdata: isDatetimeReq == true && dateTimeObj['faqUpdatedPinnedContentDatetime'] != '' ? { datetime: dateTimeObj['faqUpdatedPinnedContentDatetime'] } : dateTimeObj['faqPinnedContentDatetime'] != '' ? { datetime: dateTimeObj['faqPinnedContentDatetime'] } : {},
    //   saveinDB: true,
    // },
=======
>>>>>>> origin/tmp-remove-hist-ga
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
<<<<<<< HEAD
  { name: 'playingAndLearning', id: 396, image: 'ic_artl_play' },
  { name: 'healthAndWellbeingid', id: 376, image: 'ic_artl_health' },
  { name: 'safetyAndProtection', id: 406, image: 'ic_artl_safety' },
  { name: 'responsiveParenting', id: 401, image: 'ic_artl_responsive' },
  { name: 'parentingCorner', id: 391, image: 'ic_artl_parenting' },
  { name: 'nutritionAndBreastfeeding', id: 386, image: 'ic_artl_nutrition' },
]
export const activityCategoryobj = [
  { name: 'Socio-emotional', id: 546, image: 'ic_act_emotional' },
  { name: 'Language and communication', id: 556, image: 'ic_act_language' },
  { name: 'Cognitive', id: 551, image: 'ic_act_cognitive' },
  { name: 'Motor', id: 541, image: 'ic_act_movement' },
]

=======
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
>>>>>>> origin/tmp-remove-hist-ga
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