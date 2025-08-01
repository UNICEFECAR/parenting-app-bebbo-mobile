import { appConfig } from "../../instances";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HardcodedDataType {
  acceptTerms: boolean;
  userIsOnboarded: boolean;
  appVersion: string;
  userIsFirstTime: boolean;
  taxonomy: {
    allTaxonomyData: string;
    languageCode: string;
  };
  taxonomyIds: {
    relationShipMotherId: string;
    relationShipFatherId: string;
    relationShipOtherCaregiverId: string;
    relationShipServiceProviderId: string;
    bothChildGender: string;
    bothParentGender: string;
    femaleData: string;
    maleData: string;
    girlChildGender: string;
    boyChildGender: string;
    articleCategoryArray: number[];
    activityCategoryArray: number[];
  };
  aboutus: {
    id: number;
    title: string;
    body: string;
    unique_name: string;
  };
  terms: {
    id: number;
    title: string;
    body: string;
    unique_name: string;
  };
  privacypolicy: {
    id: number;
    title: string;
    body: string;
    unique_name: string;
  };
  weight_for_height: string;
  height_for_age: string;
  IsWeightModalOpened: boolean;
  IsHeightModalOpened: boolean;
  IsArticleModalOpened: boolean;
  IsActivityModalOpened: boolean;
  IsChildDevModalOpened: boolean;
  IsGrowthModalOpened: boolean;
  IsVaccineModalOpened: boolean;
  IsHCUModalOpened: boolean;
  showDownloadPopup: boolean;
  generateNotifications: boolean;
  dailyMessageNotification: string;
  dailymessages: string;
  vaccineData: {
    id: number;
    uuid: string;
    type: string;
    title: string;
    pinned_article: number;
    growth_period: number;
    created_at: string;
    updated_at: string;
    old_calendar: number;
  };
  healthCheckupsData: {
    id: number;
    type: string;
    title: string;
    pinned_article: number;
    growth_period: number;
    created_at: string;
    updated_at: string;
  };
  ChildDevData: {
    id: number;
    type: string;
    title: string;
    child_age: number[];
    boy_video_article: number;
    girl_video_article: number;
    milestone: string;
    created_at: string;
    updated_at: string;
    mandatory: number;
  };
  MileStonesData: string;
  VideoArticlesData: string;
  ActivitiesData: string;
  surveryData: string;
  faqsData: string;
  userOnboardedDate: number;
  weeklyDownloadDate: number;
  monthlyDownloadDate: number;
  bufferDataDownloadFlag: boolean;
  incrementalSyncDT: {
    articlesDatetime: string;
    videoArticlesDatetime: string;
    activitiesDatetime: string;
    faqPinnedContentDatetime: string;
    faqsDatetime: string;
    faqUpdatedPinnedContentDatetime: string;
    archiveDatetime: string;
  };
  allDataDownloadFlag: boolean;
}
const initialState: HardcodedDataType = {
  acceptTerms: false,
  userIsOnboarded: false,
  appVersion: "",
  userIsFirstTime: false,
  taxonomy: {
    allTaxonomyData: "",
    languageCode: "en",
  },
  taxonomyIds: {
    relationShipMotherId: "",
    relationShipFatherId: "",
    relationShipOtherCaregiverId: "",
    relationShipServiceProviderId: "",
    bothChildGender: "",
    bothParentGender: "",
    femaleData: "",
    maleData: "",
    girlChildGender: "",
    boyChildGender: "",
    articleCategoryArray: [],
    activityCategoryArray: [],
  },
  aboutus: {
    id: 0,
    title: "",
    body: "",
    unique_name: "",
  },
  terms: {
    id: 0,
    title: "",
    body: "",
    unique_name: "",
  },
  privacypolicy: {
    id: 0,
    title: "",
    body: "",
    unique_name: "",
  },
  weight_for_height: "",
  height_for_age: "",
  IsWeightModalOpened: true,
  IsHeightModalOpened: true,
  IsArticleModalOpened: true,
  IsActivityModalOpened: true,
  IsChildDevModalOpened: true,
  IsGrowthModalOpened: true,
  IsVaccineModalOpened: true,
  IsHCUModalOpened: true,
  showDownloadPopup: true,
  generateNotifications: true,
  dailyMessageNotification: "",
  dailymessages: "",
  vaccineData: {
    id: 0,
    uuid: "",
    type: "",
    title: "",
    pinned_article: 0,
    growth_period: 0,
    created_at: "",
    updated_at: "",
    old_calendar: 0,
  },
  healthCheckupsData: {
    id: 0,
    type: "",
    title: "",
    pinned_article: 0,
    growth_period: 0,
    created_at: "",
    updated_at: "",
  },

  ChildDevData: {
    id: 0,
    type: "",
    title: "",
    child_age: [],
    boy_video_article: 0,
    girl_video_article: 0,
    milestone: "",
    created_at: "",
    updated_at: "",
    mandatory: 0,
  },
  MileStonesData: "",
  VideoArticlesData: "",
  ActivitiesData: "",
  surveryData: "",
  faqsData: "",
  userOnboardedDate: 0,
  weeklyDownloadDate: 0,
  monthlyDownloadDate: 0,
  bufferDataDownloadFlag: false,
  incrementalSyncDT: {
    articlesDatetime: "",
    videoArticlesDatetime: "",
    activitiesDatetime: "",
    faqPinnedContentDatetime: "",
    faqsDatetime: "",
    faqUpdatedPinnedContentDatetime: "",
    archiveDatetime: "",
  },
  allDataDownloadFlag: false,
};
export const utilsSlice = createSlice({
  name: "utilsData",
  initialState,
  reducers: {
    setAcceptTerms: (state, action: PayloadAction<any>): any => {
      state.acceptTerms = action.payload;
    },
    setuserIsOnboarded: (state, action: PayloadAction<any>): any => {
      state.userIsOnboarded = action.payload;
    },
    setAppVersion: (state, action: PayloadAction<any>): any => {
      state.appVersion = action.payload;
    },
    setuserIsFirstTime: (state, action: PayloadAction<any>): any => {
      state.userIsFirstTime = action.payload;
    },
    setSyncDate: (state: any, action: PayloadAction<any>): any => {
      state[action.payload.key] = action.payload.value;
    },
    setDailyMessagesData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.dailymessages = action.payload;
    },
    setAllTaxonomyData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "string"
        ? (action.payload = JSON.parse(action.payload))
        : null;
      if (action.payload[0]) {
        state.taxonomy.allTaxonomyData =
          typeof action.payload[0].allData == "object"
            ? JSON.stringify(action.payload[0].allData)
            : action.payload[0].allData;
        state.taxonomy.languageCode = action.payload[0].langCode;
      }
    },
    setTaxonomyIds: (state, action: PayloadAction<any>): any => {
      action.payload?.relationship_to_parent?.map((x: any) => {
        if (
          x.unique_name == appConfig.relationshipUniqueName.relationShipMotherId
        ) {
          state.taxonomyIds.relationShipMotherId = x.unique_name;
        } else if (
          x.unique_name == appConfig.relationshipUniqueName.relationShipFatherId
        ) {
          state.taxonomyIds.relationShipFatherId = x.unique_name;
        } else if (
          x.unique_name ==
          appConfig.relationshipUniqueName.relationShipOtherCaregiverId
        ) {
          state.taxonomyIds.relationShipOtherCaregiverId = x.unique_name;
        } else if (
          x.unique_name ==
          appConfig.relationshipUniqueName.relationShipOtherCaregiverId
        ) {
          state.taxonomyIds.relationShipOtherCaregiverId = x.unique_name;
        }
      });
      action.payload?.child_gender?.map((x: any) => {
        if (x.unique_name == appConfig.childGenderUniqueName.bothChildGender) {
          state.taxonomyIds.bothChildGender = x.unique_name;
        } else if (
          x.unique_name == appConfig.childGenderUniqueName.girlChildGender
        ) {
          state.taxonomyIds.girlChildGender = x.unique_name;
        } else if (
          x.unique_name == appConfig.childGenderUniqueName.boyChildGender
        ) {
          state.taxonomyIds.boyChildGender = x.unique_name;
        }
      });
      action.payload?.parent_gender?.map((x: any) => {
        if (
          x.unique_name == appConfig.parentGenderUniqueName.bothParentGender
        ) {
          state.taxonomyIds.bothParentGender = x.unique_name;
        } else if (
          x.unique_name == appConfig.parentGenderUniqueName.maleParentGender
        ) {
          state.taxonomyIds.maleData = x;
        } else if (
          x.unique_name == appConfig.parentGenderUniqueName.femaleParentGender
        ) {
          state.taxonomyIds.femaleData = x;
        }
      });

      // Create a lookup object
      const categoryLookup = action.payload?.category?.reduce(
        (acc: any, category: any) => {
          acc[category.unique_name] = category.id;
          return acc;
        },
        {}
      );
      const activityCategoryLookup = action.payload?.activity_category?.reduce(
        (acc: any, activity_category: any) => {
          acc[activity_category.unique_name] = activity_category.id;
          return acc;
        },
        {}
      );

      state.taxonomyIds.articleCategoryArray =
        appConfig.articleCategoryArray.map(
          (uniqueName) => categoryLookup[uniqueName]
        );
      state.taxonomyIds.activityCategoryArray =
        appConfig.activityCategoryArray.map(
          (uniqueName) => activityCategoryLookup[uniqueName]
        );
    },
    setAllTermsData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "string"
        ? (action.payload = JSON.parse(action.payload))
        : null;
      action.payload.map((x: any) => {
        if (x.unique_name == appConfig.basicPagesUniqueName.aboutus) {
          state.aboutus.id = x.id;
          state.aboutus.title = x.title;
          state.aboutus.body = x.body;
          state.aboutus.unique_name = x.unique_name;
        } else if (x.unique_name == appConfig.basicPagesUniqueName.terms) {
          state.terms.id = x.id;
          state.terms.title = x.title;
          state.terms.body = x.body;
          state.terms.unique_name = x.unique_name;
        } else if (
          x.unique_name == appConfig.basicPagesUniqueName.privacypolicy
        ) {
          state.privacypolicy.id = x.id;
          state.privacypolicy.title = x.title;
          state.privacypolicy.body = x.body;
          state.privacypolicy.unique_name = x.unique_name;
        }
      });
    },
    setInfoModalOpened: (
      state: any = initialState,
      action: PayloadAction<any>
    ): any => {
      state[action.payload.key] = action.payload.value;
    },
    setIncrementalSyncDT: (state: any, action: PayloadAction<any>): any => {
      state.incrementalSyncDT[action.payload.key] = action.payload.value;
    },
    setStandardDevWFHData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.weight_for_height = action.payload;
    },
    setStandardDevHFAData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.height_for_age = action.payload;
    },
    setAllVaccineData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      // console.log(action.payload,"..action.payload..");
      state.vaccineData = action.payload;
    },
    setAllHealthCheckupsData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.healthCheckupsData = action.payload;
    },
    setAllChildDevData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.ChildDevData = action.payload;
    },
    setAllMileStonesData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.MileStonesData = action.payload;
    },
    setAllVideoArticlesData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.VideoArticlesData = action.payload;
    },
    setAllActivitiesData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.ActivitiesData = action.payload;
    },
    setAllSurveyData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.surveryData = action.payload;
    },
    setAllFaqsData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (action.payload = JSON.stringify(action.payload))
        : null;
      state.faqsData = action.payload;
    },
  },
});

export const {
  setAcceptTerms,
  setuserIsOnboarded,
  setAppVersion,
  setuserIsFirstTime,
  setSyncDate,
  setAllTaxonomyData,
  setTaxonomyIds,
  setAllTermsData,
  setInfoModalOpened,
  setDailyMessagesData,
  setStandardDevWFHData,
  setStandardDevHFAData,
  setAllVaccineData,
  setAllHealthCheckupsData,
  setAllChildDevData,
  setAllMileStonesData,
  setAllVideoArticlesData,
  setAllActivitiesData,
  setAllSurveyData,
  setAllFaqsData,
  setIncrementalSyncDT,
} = utilsSlice.actions;
export default utilsSlice.reducer;
