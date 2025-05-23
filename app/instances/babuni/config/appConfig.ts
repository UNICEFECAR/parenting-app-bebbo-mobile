import { Platform } from "react-native";
import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from "react-native-fs";

const config = {
  destinationFolder: `${RNFS.DocumentDirectoryPath}/content/`,
  buildForBebbo: "bangla",
  buildFor: "bangla", // 'babuni'
  maxRelatedArticleSize: 3,
  isArticlePinned: "1",
  articleCategory: "4,1,55,56,3,2",
  articleCategoryIdArray: [376, 386, 391, 396, 401, 406],
  articleCategoryArray: [
    "health_and_wellbeing",
    "nutrition_and_breastfeeding",
    "parenting_corner",
    "play_and_learning",
    "responsive_parenting",
    "safety_and_protection",
  ],
  activityCategoryArray: [
    "socio_emotional",
    "language_and_communication",
    "cognitive",
    "motor",
  ],
  regexpEmojiPresentation: /[^\p{L} ]/gu,
  luxonDefaultLocale: "en-US",
  videoTypeVimeo: "vimeo",
  videoTypeYoutube: "youtube",
  videoTypeImage: "novideo",
  backupGDriveFolderName: "Babuni App Backup",
  backupGDriveFileName: "mybackup.json",
  tempRealmFile: `${RNFS.DocumentDirectoryPath}/user1.realm`,
  tempFuseJsonPath: `${RNFS.DocumentDirectoryPath}/fuse-index.json`,
  backUpPath: `${RNFS.DocumentDirectoryPath}/mybackup.json`,
  tempbackUpPath: `${RNFS.TemporaryDirectoryPath}mybackup.json`,
  firstPeriodicSyncDays: 7,
  secondPeriodicSyncDays: 30,
  shareText: `\nhttps://www.babuni.app/share/`,
  shareTextButton: "https://www.babuni.app/share/",
  maleData: {
    id: 611,
    name: "Male",
    unique_name: "male",
  },
  relationShipMotherId: 626,
  relationShipFatherId: 631,
  relationShipOtherCaregiverId: 636,
  relationShipServiceProviderId: 641,
  femaleData: {
    id: 616,
    name: "Female",
    unique_name: "female",
  },
  childGenderUniqueName: {
    bothChildGender: "both",
    girlChildGender: "girl",
    boyChildGender: "boy",
  },
  basicPagesUniqueName: {
    aboutus: "about_us",
    terms: "terms_and_conditions",
    privacypolicy: "privacy_policy",
  },
  relationshipUniqueName: {
    relationShipMotherId: "mother",
    relationShipFatherId: "father",
    relationShipOtherCaregiverId: "other_caregiver",
    relationShipServiceProviderId: "service_provider",
  },
  parentGenderUniqueName: {
    bothParentGender: "both",
    maleParentGender: "male",
    femaleParentGender: "female",
  },
  articleCategoryUniqueNameObj: [
    {
      name: "playingAndLearning",
      id: "play_and_learning",
      image: "ic_artl_play",
    },
    {
      name: "healthAndWellbeingid",
      id: "health_and_wellbeing",
      image: "ic_artl_health",
    },
    {
      name: "safetyAndProtection",
      id: "safety_and_protection",
      image: "ic_artl_safety",
    },
    {
      name: "responsiveParenting",
      id: "responsive_parenting",
      image: "ic_artl_responsive",
    },
    {
      name: "parentingCorner",
      id: "parenting_corner",
      image: "ic_artl_parenting",
    },
    {
      name: "nutritionAndBreastfeeding",
      id: "nutrition_and_breastfeeding",
      image: "ic_artl_nutrition",
    },
  ],
  activityCategoryUniqueNameObj: [
    {
      name: "Socio-emotional",
      id: "socio_emotional",
      image: "ic_act_emotional",
    },
    {
      name: "Language and communication",
      id: "language_and_communication",
      image: "ic_act_language",
    },
    { name: "Cognitive", id: "cognitive", image: "ic_act_cognitive" },
    { name: "Motor", id: "motor", image: "ic_act_movement" },
  ],
  activityCategoryobj: [
    { name: "Socio-emotional", id: 546, image: "ic_act_emotional" },
    { name: "Language and communication", id: 556, image: "ic_act_language" },
    { name: "Cognitive", id: 551, image: "ic_act_cognitive" },
    { name: "Motor", id: 541, image: "ic_act_movement" },
  ],
  articleCategoryobj: [
    { name: "playingAndLearning", id: 396, image: "ic_artl_play" },
    { name: "healthAndWellbeingid", id: 376, image: "ic_artl_health" },
    { name: "safetyAndProtection", id: 406, image: "ic_artl_safety" },
    { name: "responsiveParenting", id: 401, image: "ic_artl_responsive" },
    { name: "parentingCorner", id: 391, image: "ic_artl_parenting" },
    { name: "nutritionAndBreastfeeding", id: 386, image: "ic_artl_nutrition" },
  ],
  reviewURL: Platform.select({
    android:
      "https://play.google.com/store/apps/details?id=org.unicef.bangladesh.babuni",
    ios: "itms://itunes.apple.com/bangla/app/apple-store/id6504746888?action=write-review",
  }),
  bothParentGender: 621,
  bothChildGender: 536,
  boyChildGender: 526,
  girlChildGender: 531,
  weightForHeight: 606,
  heightForAge: 601,
  pregnancyId: 166191,
  languageCode: "en",
  searchMinimumLength: 3,
  today: new Date(),
  restOfTheWorldCountryId: 126,
  videoArticleMandatory: 0,
  maxArticleSize: 5,
  flavorName: "babuni",
  isCheckTokenize: false,
  stopWords: [],
  apiConfig: {
    articles: "articles",
    videoArticles: "video-articles",
    dailyMessages: "daily-homescreen-messages",
    basicPages: "basic-pages",
    // sponsors: 'sponsors',
    taxonomies: "taxonomies",
    standardDeviation: "standard_deviation",
    milestones: "milestones",
    activities: "activities",
    surveys: "surveys",
    childDevelopmentData: "child-development-data",
    childGrowthData: "child-growth-data",
    vaccinations: "vaccinations",
    healthCheckupData: "health-checkup-data",
    // pinnedContent: 'pinned-contents',
    checkUpdate: "check-update",
    faqs: "faqs",
    archive: "archive",
    countryGroups: "country-groups",
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
      // case config.apiConfig.sponsors:
      //   return `${baseUrl}/${selectedCountry}`;
      case config.apiConfig.taxonomies:
        return `${baseUrl}/${selectedLang}/all`;
      case config.apiConfig.checkUpdate:
        return `${baseUrl}/${selectedCountry}`;
      default:
        return `${baseUrl}/${selectedLang}`;
    }
  },
  allApisObject: (isDatetimeReq: any, dateTimeObj: any): any => {
    const allApiObject = [
      // { apiEndpoint: config.apiConfig.sponsors, method: 'get', postdata: {}, saveinDB: false },
      {
        apiEndpoint: config.apiConfig.articles,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.countryGroups,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.taxonomies,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.basicPages,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.surveys,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.milestones,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.childDevelopmentData,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.vaccinations,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.healthCheckupData,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.standardDeviation,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.dailyMessages,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.activities,
        method: "get",
        postdata:
          isDatetimeReq == true && dateTimeObj["activitiesDatetime"] != ""
            ? { datetime: dateTimeObj["activitiesDatetime"] }
            : {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.faqs,
        method: "get",
        postdata:
          isDatetimeReq == true && dateTimeObj["faqsDatetime"] != ""
            ? { datetime: dateTimeObj["faqsDatetime"] }
            : {},
        saveinDB: true,
      },
      {
        apiEndpoint: config.apiConfig.videoArticles,
        method: "get",
        postdata:
          isDatetimeReq && dateTimeObj["videoArticlesDatetime"] !== ""
            ? { datetime: dateTimeObj["videoArticlesDatetime"] }
            : {},
        saveinDB: true,
      },
      // Add other objects as needed...
    ];

    if (isDatetimeReq) {
      allApiObject.push({
        apiEndpoint: config.apiConfig.archive,
        method: "get",
        postdata:
          dateTimeObj["archiveDatetime"] !== ""
            ? { datetime: dateTimeObj["archiveDatetime"] }
            : dateTimeObj["faqPinnedContentDatetime"] !== ""
            ? { datetime: dateTimeObj["faqPinnedContentDatetime"] }
            : {},
        saveinDB: true,
      });
    }

    return allApiObject;
  },
};

export default config;
