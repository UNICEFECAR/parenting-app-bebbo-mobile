import { apiUrlDevelop } from 'react-native-dotenv';
import RNFS from 'react-native-fs';

const config = {
  destinationFolder: `${RNFS.DocumentDirectoryPath}/content/`,
  buildForBebbo: 'bebbo',
  buildFor: 'bebbo',
  maxRelatedArticleSize: 3,
  isArticlePinned: '1',
  articleCategory: '4,1,55,56,3,2',
  articleCategoryIdArray: [4, 1, 55, 56, 3, 2],
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
  backupGDriveFolderName: 'ParentBuddy',
  backupGDriveFileName: 'mybackup.json',
  tempRealmFile: `${RNFS.DocumentDirectoryPath}/user1.realm`,
  tempFuseJsonPath: `${RNFS.DocumentDirectoryPath}/fuse-index.json`,
  backUpPath: `${RNFS.DocumentDirectoryPath}/mybackup.json`,
  tempbackUpPath: `${RNFS.TemporaryDirectoryPath}mybackup.json`,
  firstPeriodicSyncDays: 7,
  secondPeriodicSyncDays: 30,
  shareText: `\nhttps://www.bebbo.app/share/`,
  shareTextButton: 'https://www.bebbo.app/share/',
  maleData: {
    id: 611,
    name: 'Male',
    unique_name: 'male',
  },
  relationShipMotherId: 109801,
  relationShipFatherId: 109806,
  relationShipOtherCaregiverId: 109811,
  relationShipServiceProviderId: 109816,
  femaleData: {
    id: 38,
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
    { name: 'Socio-emotional', id: 6431, image: 'ic_act_emotional' },
    { name: 'Language and communication', id: 6441, image: 'ic_act_language' },
    { name: 'Cognitive', id: 6436, image: 'ic_act_cognitive' },
    { name: 'Motor', id: 6421, image: 'ic_act_movement' },
  ],
  articleCategoryobj: [
    { name: 'playingAndLearning', id: 55, image: 'ic_artl_play' },
    { name: 'healthAndWellbeingid', id: 2, image: 'ic_artl_health' },
    { name: 'safetyAndProtection', id: 3, image: 'ic_artl_safety' },
    { name: 'responsiveParenting', id: 56, image: 'ic_artl_responsive' },
    { name: 'parentingCorner', id: 4, image: 'ic_artl_parenting' },
    { name: 'nutritionAndBreastfeeding', id: 1, image: 'ic_artl_nutrition' },
  ],
  bothParentGender: 60,
  bothChildGender: 59,
  girlChildGender: 41,
  boyChildGender: 40,
  weightForHeight: 32786,
  heightForAge: 6461,
  today: new Date(),
  restOfTheWorldCountryId: 126,
  videoArticleMandatory: 0,
  maxArticleSize: 5,
  flavorName: 'Bebbo',
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
