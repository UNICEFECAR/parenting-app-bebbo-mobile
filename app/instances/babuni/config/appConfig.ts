import { apiUrlDevelop } from 'react-native-dotenv';
import RNFS from 'react-native-fs';

const config = {
  destinationFolder: `${RNFS.DocumentDirectoryPath}/content/`,
  buildForBebbo: 'bangla',
  buildFor: 'bangla', // 'babuni'
  maxRelatedArticleSize: 3,
  isArticlePinned: '1',
  articleCategory: '4,1,55,56,3,2',
  articleCategoryIdArray: [376, 386, 391, 396, 401, 406],
  articleCategoryArray: [
    'health_and_wellbeing',
    'nutrition_and_breastfeeding',
    'parenting_corner',
    'play_and_learning',
    'responsive_parenting',
    'safety_and_protection',
  ],
  activityCategoryArray: [
    'socio_emotional',
    'language_and_communication',
    'cognitive',
    'motor',
  ],
  regexpEmojiPresentation: /[^\p{L} ]/gu,
  luxonDefaultLocale: 'en-US',
  videoTypeVimeo: 'vimeo',
  videoTypeYoutube: 'youtube',
  videoTypeImage: 'novideo',
  backupGDriveFolderName: 'Babuni App Backup',
  backupGDriveFileName: 'mybackup.json',
  tempRealmFile: `${RNFS.DocumentDirectoryPath}/user1.realm`,
  tempFuseJsonPath: `${RNFS.DocumentDirectoryPath}/fuse-index.json`,
  backUpPath: `${RNFS.DocumentDirectoryPath}/mybackup.json`,
  tempbackUpPath: `${RNFS.TemporaryDirectoryPath}mybackup.json`,
  firstPeriodicSyncDays: 7,
  secondPeriodicSyncDays: 30,
  shareText: `\nhttps://www.babuni.app/share/`,
  shareTextButton: 'https://www.babuni.app/share/',
  maleData: {
    id: 611,
    name: 'Male',
    unique_name: 'male',
  },
  relationShipMotherId: 626,
  relationShipFatherId: 631,
  relationShipOtherCaregiverId: 636,
  relationShipServiceProviderId: 641,
  femaleData: {
    id: 616,
    name: 'Female',
    unique_name: 'female',
  },
  childGenderUniqueName: {
    bothChildGender: 'both',
    girlChildGender: 'girl',
    boyChildGender: 'boy',
  },
  basicPagesUniqueName: {
    aboutus: 'about_us',
    terms: 'terms_and_conditions',
    privacypolicy: 'privacy_policy',

  },
  relationshipUniqueName: {
    relationShipMotherId: 'mother',
    relationShipFatherId: 'father',
    relationShipOtherCaregiverId: 'other_caregiver',
    relationShipServiceProviderId: 'service_provider',
  },
  parentGenderUniqueName: {
    bothParentGender: 'both',
    maleParentGender: 'male',
    femaleParentGender: 'female',
  },
  articleCategoryUniqueNameObj: [
    { name: 'playingAndLearning', id: 'play_and_learning', image: 'ic_artl_play' },
    { name: 'healthAndWellbeingid', id: 'health_and_wellbeing', image: 'ic_artl_health' },
    { name: 'safetyAndProtection', id: 'safety_and_protection', image: 'ic_artl_safety' },
    { name: 'responsiveParenting', id: 'responsive_parenting', image: 'ic_artl_responsive' },
    { name: 'parentingCorner', id: 'parenting_corner', image: 'ic_artl_parenting' },
    { name: 'nutritionAndBreastfeeding', id: 'nutrition_and_breastfeeding', image: 'ic_artl_nutrition' },
  ],
  activityCategoryUniqueNameObj: [
    { name: 'Socio-emotional', id: 'socio_emotional', image: 'ic_act_emotional' },
    { name: 'Language and communication', id: 'language_and_communication', image: 'ic_act_language' },
    { name: 'Cognitive', id: 'cognitive', image: 'ic_act_cognitive' },
    { name: 'Motor', id: 'motor', image: 'ic_act_movement' },
  ],
  activityCategoryobj: [
    { name: 'Socio-emotional', id: 546, image: 'ic_act_emotional' },
    { name: 'Language and communication', id: 556, image: 'ic_act_language' },
    { name: 'Cognitive', id: 551, image: 'ic_act_cognitive' },
    { name: 'Motor', id: 541, image: 'ic_act_movement' },
  ],
  articleCategoryobj: [
    { name: 'playingAndLearning', id: 396, image: 'ic_artl_play' },
    { name: 'healthAndWellbeingid', id: 376, image: 'ic_artl_health' },
    { name: 'safetyAndProtection', id: 406, image: 'ic_artl_safety' },
    { name: 'responsiveParenting', id: 401, image: 'ic_artl_responsive' },
    { name: 'parentingCorner', id: 391, image: 'ic_artl_parenting' },
    { name: 'nutritionAndBreastfeeding', id: 386, image: 'ic_artl_nutrition' },
  ],
  bothParentGender: 621,
  bothChildGender: 536,
  boyChildGender: 526,
  girlChildGender: 531,
  weightForHeight: 601,
  heightForAge: 606,
  today: new Date(),
  restOfTheWorldCountryId: 126,
  videoArticleMandatory: 0,
  maxArticleSize: 5,
  flavorName: 'babuni',
  apiConfig: {
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
    countryGroups: 'country-groups',
  },
  measurementPlaces: (items: any) => [
    { id: 0, title: items[0] },
    { id: 1, title: items[1] },
  ],
  maxCharForRemarks: 200,
  threeeMonthDays: 90,
  twoMonthDays: 60,
  oneMonthDays: 30,
  afterDays: 5,
  beforeDays: 6,
  maxPeriodDays: 2920,
  maxWeight: 33,
  maxHeight: 125,
  finalUrl: (
    apiEndpoint: string,
    selectedCountry: number | undefined,
    selectedLang: string
  ): string => {
    const baseUrl = `${apiUrlDevelop}/${apiEndpoint}`;
    switch (apiEndpoint) {
      case config.apiConfig.countryGroups:
        return `${baseUrl}/${config.flavorName}`;
      case config.apiConfig.sponsors:
        return `${baseUrl}/${selectedCountry}`;
      case config.apiConfig.taxonomies:
        return `${baseUrl}/${selectedLang}/all`;
      case config.apiConfig.checkUpdate:
        return `${baseUrl}/${selectedCountry}`;
      default:
        return `${baseUrl}/${selectedLang}`;
    }
  },
  allApisObject: (isDatetimeReq: boolean, dateTimeObj: Record<string, any>): any => {
    const apiList = [
      { key: "sponsors", saveInDB: false },
      { key: "articles", saveInDB: true },
      { key: "countryGroups", saveInDB: true },
      { key: "taxonomies", saveInDB: true },
      { key: "basicPages", saveInDB: true },
      { key: "surveys", saveInDB: true },
      { key: "milestones", saveInDB: true },
      { key: "childDevelopmentData", saveInDB: true },
      { key: "vaccinations", saveInDB: true },
      { key: "healthCheckupData", saveInDB: true },
      { key: "standardDeviation", saveInDB: true },
      { key: "dailyMessages", saveInDB: true },
      { key: "activities", saveInDB: true },
      { key: "faqs", saveInDB: true },
      { key: "videoArticles", saveInDB: true },
    ];  
    const allApiObject = apiList.map(({ key, saveInDB }) => ({
      apiEndpoint: config.apiConfig[key],
      method: "get",
      postdata: isDatetimeReq && dateTimeObj?.[`${key}Datetime`] ? { datetime: dateTimeObj[`${key}Datetime`] } : {},
      saveInDB,
    }));
  
    if (isDatetimeReq) {
      const archiveDate = dateTimeObj?.archiveDatetime || dateTimeObj?.faqPinnedContentDatetime;
      allApiObject.push({
        apiEndpoint: config.apiConfig.archive,
        method: "get",
        postdata: archiveDate ? { datetime: archiveDate } : {},
        saveInDB: true,
      });
    }
    
    return allApiObject;
  },
};

export default config;
