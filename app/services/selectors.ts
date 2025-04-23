import { createSelector } from '@reduxjs/toolkit';
import { getLanguageCode } from '../services/Utils';
const cache = new Map<string, any>();

export function memoizedJsonParse(json: string, fallback: any = []) {
  if (!json) return fallback;

  if (cache.has(json)) return cache.get(json);

  try {
    const parsed = JSON.parse(json);
    cache.set(json, parsed);
    return parsed;
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return fallback;
  }
}
// Language Code
export const selectLanguageCode = (state: any) => state.selectedCountry.languageCode;
export const selectLocale = createSelector([selectLanguageCode], (languageCode) =>
  getLanguageCode(languageCode)
);

// Taxonomy IDs
export const selectTaxonomyIds = (state: any) => state.utilsData.taxonomyIds;

// User Onboarded
export const selectUserIsOnboarded = (state: any) => state.utilsData.userIsOnboarded;

// Error Object
export const selectErrorObj = (state: any) => state.failedOnloadApiObjReducer.errorObj;

// Show Download Popup
export const selectShowDownloadPopup = (state: any) => state.utilsData.showDownloadPopup;

// Incremental Sync
export const selectIncrementalSyncDT = (state: any) => state.utilsData.incrementalSyncDT;

// Buffer Age Bracket
export const selectBufferAgeBracket = (state: any) => state.childData.childDataSet.bufferAgeBracket;

// Active Child
export const selectActiveChild = createSelector(
  [(state: any) => state.childData.childDataSet.activeChild],
  (activeChild) => (activeChild ? memoizedJsonParse(activeChild) : [])
);

// Survey Item
export const selectSurveyItem = createSelector(
  [(state: any) => state.utilsData.surveryData],
  (surveyData) => {
    if (surveyData && surveyData !== "") {
      try {
        return memoizedJsonParse(surveyData, [])?.find((item: any) => item.type === "survey");
      } catch (e) {
        console.warn("Invalid survey JSON", e);
      }
    }
    return null;
  }
);

export const selectPluralShow = createSelector(
  [(state: any) => state.selectedCountry.pluralShow],
  (pluralShow) => pluralShow
);


// Daily Messages (parsed)
export const selectDailyMessages = createSelector(
  [(state: any) => state.utilsData.dailymessages],
  (dailyMessages) => {
    if (dailyMessages && dailyMessages !== '') {
      try {
        return memoizedJsonParse(dailyMessages);
      } catch (e) {
        console.warn('Invalid dailyMessages JSON:', e);
      }
    }
    return [];
  }
);

// Current Notification
export const selectDailyMessageNotification = (state: any) =>
  state.utilsData.dailyMessageNotification;

// --- Activities ---
const activities = (state: any) => state.utilsData.ActivitiesData;
export const selectActivitiesDataAll = createSelector([activities], (data) => {
  if (data && data !== '') {
    try {
      return memoizedJsonParse(data);
    } catch (e) {
      console.warn('Invalid ActivitiesData JSON:', e);
    }
  }
  return [];
});

// --- Taxonomy Activity Categories ---
const taxonomyData = (state: any) => state.utilsData.taxonomy.allTaxonomyData;
export const selectActivityCategoryArray = createSelector([taxonomyData], (data) => {
  try {
    return memoizedJsonParse(data)?.activity_category ?? [];
  } catch (e) {
    console.warn('Invalid taxonomy JSON:', e);
    return [];
  }
});

// --- Daily Categories ---
export const selectDailyDataCategoryAll = (state: any) => state.articlesData.dailyDataCategory;
export const selectShowedDailyDataCategoryAll = (state: any) =>
  state.articlesData.showedDailyDataCategory;

// --- Favorites ---
export const selectFavoriteAdvices = (state: any) =>
  state.childData.childDataSet.favoriteadvices;
export const selectFavoriteGames = (state: any) =>
  state.childData.childDataSet.favoritegames;


const articles = (state: any) => state.articlesData.article.articles;
export const selectArticleDataAll = createSelector([articles], (articles) => {
  if (articles && articles !== '') {
    try {
      return memoizedJsonParse(articles);
    } catch (e) {
      console.warn('Invalid article JSON:', e);
    }
  }
  return [];
});

export const selectFilteredArticles = (appConfig: any) =>
  createSelector([selectArticleDataAll], (articles) =>
    articles.filter((x: any) => appConfig.articleCategoryIdArray.includes(x.category))
  );

// --- Bandwidth ---
export const selectLowBandwidth = (state: any) =>
  state.bandWidthData?.lowbandWidth ?? false;

export const selectAllConfigData = createSelector(
  [(state: any) => state.variableData?.variableData],
  (data) => {
    if (data && data !== "") {
      try {
        return memoizedJsonParse(data);
      } catch (e) {
        console.warn("Invalid variableData JSON:", e);
      }
    }
    return [];
  }
);

// --- Child Development Data ---
export const selectChildDevData = createSelector(
  [(state: any) => state.utilsData.ChildDevData],
  (data) => {
    if (data && data !== "") {
      try {
        return memoizedJsonParse(data);
      } catch (e) {
        console.warn("Invalid ChildDevData JSON:", e);
      }
    }
    return [];
  }
);

// --- Pinned Child Development Videos ---
export const selectPinnedChildDevData = createSelector(
  [(state: any) => state.utilsData.VideoArticlesData],
  (data) => {
    if (data && data !== "") {
      try {
        return memoizedJsonParse(data);
      } catch (e) {
        console.warn("Invalid VideoArticlesData JSON:", e);
      }
    }
    return [];
  }
);

export const selectAllDataDownloadFlag = (state: any) =>
  state.utilsData.allDataDownloadFlag;

export const selectLocalNotifications = (state: any) =>
  state.notificationData.localNotifications;

export const selectScheduledLocalNotifications = (state: any) =>
  state.notificationData.scheduledlocalNotifications;

export const selectCountryId = (state: any) =>
  state.selectedCountry?.countryId;

export const selectWeeklyDownloadDate = (state: any) =>
  state.utilsData.weeklyDownloadDate;

export const selectMonthlyDownloadDate = (state: any) =>
  state.utilsData.monthlyDownloadDate;

// --- Memoized JSON-parsed selectors ---
export const selectAllCountries = createSelector(
  [(state: any) => state.selectedCountry?.countries],
  (countries) => {
    if (countries && countries !== "") {
      try {
        return memoizedJsonParse(countries);
      } catch (error) {
        console.error("Failed to parse countries JSON:", error);
      }
    }
    return [];
  }
);

export const selectChildAge = createSelector(
  [(state: any) => state.utilsData.taxonomy.allTaxonomyData],
  (data) => {
    if (data && data !== "") {
      try {
        return memoizedJsonParse(data)?.child_age ?? [];
      } catch (e) {
        console.warn("Invalid taxonomy JSON (child_age):", e);
      }
    }
    return [];
  }
);

// --- Notification Flags ---
export const selectGrowthEnabledFlag = (state: any) =>
  state.notificationData.growthEnabled;

export const selectDevelopmentEnabledFlag = (state: any) =>
  state.notificationData.developmentEnabled;

export const selectVchcEnabledFlag = (state: any) =>
  state.notificationData.vchcEnabled;

// --- Child Genders from Taxonomy ---
export const selectChildGenders = createSelector(
  [(state: any) => state.utilsData.taxonomy.allTaxonomyData],
  (data) => {
    if (data && data !== "") {
      try {
        return memoizedJsonParse(data)?.child_gender ?? [];
      } catch (e) {
        console.warn("Invalid taxonomy JSON (child_gender):", e);
      }
    }
    return [];
  }
);

// --- Child List ---
export const selectChildList = createSelector(
  [(state: any) => state.childData.childDataSet.allChild],
  (allChild) => {
    if (allChild && allChild !== "") {
      try {
        return memoizedJsonParse(allChild);
      } catch (e) {
        console.warn("Invalid allChild JSON:", e);
      }
    }
    return [];
  }
);

// --- Sponsors ---
export const selectSponsors = (state: any) =>
  state.selectedCountry?.sponsors;

// --- App Layout Direction ---
export const selectAppLayoutDirection = (state: any) =>
  state.selectedCountry?.AppLayoutDirection;