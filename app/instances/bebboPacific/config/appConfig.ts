import { Platform } from "react-native";
import { apiUrlDevelop } from "react-native-dotenv";
import RNFS from "react-native-fs";
import { isPregnancy } from "../../../services/Utils";

const config = {
  destinationFolder: `${RNFS.DocumentDirectoryPath}/content/`,
  buildForBebbo: "bebboPacific",
  buildFor: "bebboPacific", // 'bebboPacific'
  maxRelatedArticleSize: 3,
  isArticlePinned: "1",
  articleCategory: "4,1,55,56,3,2", //not used
  articleCategoryIdArray: [
    386, 396, 401, 406, 411, 416, 426, 431, 436, 441, 446, 451
  ],
  articleCategoryArray: [
    "health_and_wellbeing",
    "nutrition_and_breastfeeding",
    "parenting_corner",
    "play_and_learning",
    "responsive_parenting",
    "safety_and_protection",
    "week_by_week",
    "staying_healthy",
    "preparing_for_a_baby",
    "support_during_pregnancy",
    "labour_and_birth",
    "pregnancy_complications",
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
  backupGDriveFolderName: "BebboPacific App Backup",
  backupGDriveFileName: "mybackup.json",
  tempRealmFile: `${RNFS.DocumentDirectoryPath}/user1.realm`,
  tempFuseJsonPath: `${RNFS.DocumentDirectoryPath}/fuse-index.json`,
  backUpPath: `${RNFS.DocumentDirectoryPath}/mybackup.json`,
  tempbackUpPath: `${RNFS.TemporaryDirectoryPath}mybackup.json`,
  firstPeriodicSyncDays: 7,
  secondPeriodicSyncDays: 30,
  shareText: `\nhttps://bebbopacific.app/share/`,
  shareTextButton: "https://bebbopacific.app/share/",
  maleData: {
    id: 3371,
    name: "Male",
    unique_name: "male",
  },
  relationShipMotherId: 3386,
  relationShipFatherId: 3391,
  relationShipOtherCaregiverId: 3396,
  relationShipServiceProviderId: 3401,
  femaleData: {
    id: 3376,
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
    { name: "weekByWeek", id: "week_by_week", image: "ic_art_week_by_week" },
    {
      name: "stayingHealthy",
      id: "staying_healthy",
      image: "ic_art_staying_healthy",
    },
    {
      name: "preparingForBaby",
      id: "preparing_for_a_baby",
      image: "ic_art_preparing_for_baby",
    },
    {
      name: "supportDuringPregnancy",
      id: "support_during_pregnancy",
      image: "ic_art_support_pregnancy",
    },
    {
      name: "labourAndBirth",
      id: "labour_and_birth",
      image: "ic_art_labour_birth",
    },
    {
      name: "pregnancyComplication",
      id: "pregnancy_complications",
      image: "ic_art_complications",
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
    { name: "Socio-emotional", id: 711, image: "ic_act_emotional" },
    { name: "Language and communication", id: 721, image: "ic_act_language" },
    { name: "Cognitive", id: 716, image: "ic_act_cognitive" },
    { name: "Motor", id: 706, image: "ic_act_movement" },
  ],
  articleCategoryobj: [
    { name: "playingAndLearning", id: 406, image: "ic_artl_play" },
    { name: "healthAndWellbeingid", id: 386, image: "ic_artl_health" },
    { name: "safetyAndProtection", id: 416, image: "ic_artl_safety" },
    { name: "responsiveParenting", id: 411, image: "ic_artl_responsive" },
    { name: "parentingCorner", id: 401, image: "ic_artl_parenting" },
    { name: "nutritionAndBreastfeeding", id: 496, image: "ic_artl_nutrition" },
  ],
  articleCategoryobjPregnancy: [
    { name: "weekByWeek", id: 426, image: "ic_art_week_by_week" },
    { name: "stayingHealthy", id: 431, image: "ic_art_staying_healthy" },
    {
      name: "preparingForBaby",
      id: 436,
      image: "ic_art_preparing_for_baby",
    },
    {
      name: "supportDuringPregnancy",
      id: 441,
      image: "ic_art_support_pregnancy",
    },
    { name: "labourAndBirth", id: 446, image: "ic_art_labour_birth" },
    {
      name: "pregnancyComplication",
      id: 451,
      image: "ic_art_complications",
    },
  ],
  reviewURL: Platform.select({
    android:
      "https://play.google.com/store/apps/details?id=org.unicef.pc.bebbopacific",
    ios: "itms-apps://itunes.apple.com/app/id6754923240?action=write-review",
  }),
  bothParentGender: 3381,
  bothChildGender: 701,
  boyChildGender: 691,
  girlChildGender: 696,
  weightForHeight: 771,
  heightForAge: 766,
  pregnancyId: 686,
  weekByWeekId: 426,
  languageCode: "en",
  searchMinimumLength: 3,
  today: new Date(),
  restOfTheWorldCountryId: 126,
  videoArticleMandatory: 0,
  maxArticleSize: 5,
  flavorName: "BebboPacific",
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
      case config.apiConfig.taxonomies:
        return `${baseUrl}/${selectedLang}/all${
          isPregnancy() ? "?pregnancy=true" : ""
        }`;
      case config.apiConfig.articles:
        console.log(
          `${baseUrl}/${selectedLang}${isPregnancy() ? "?pregnancy=true" : ""}`
        );
        return `${baseUrl}/${selectedLang}${
          isPregnancy() ? "?pregnancy=true" : ""
        }`;
      case config.apiConfig.videoArticles:
        console.log(
          `${baseUrl}/${selectedLang}${isPregnancy() ? "?pregnancy=true" : ""}`
        );
        return `${baseUrl}/${selectedLang}${
          isPregnancy() ? "?pregnancy=true" : ""
        }`;
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
