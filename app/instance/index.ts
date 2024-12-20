const flavor = process.env.FLAVOR || 'bebbo';
import 'intl';
export const localization = require(`./${flavor}/assets/localization`).default;
export const sponsors = require(`./${flavor}/assets/sponsors`).default;
// Dynamically import assets
export const bebboLogoShape = require(`./${flavor}/assets/images/logo/bebbo_logo_shape.svg`);
export const bebboLogoShapeNew = require(`./${flavor}/assets/images/logo/bebbo_logo_shape1.svg`);
export const adviceLogo = require(`./${flavor}/assets/images/advice_feature_logo.svg`);
export const toolsLogo = require(`./${flavor}/assets/images/tools_features_logo.svg`);
export const activityLogo = require(`./${flavor}/assets/images/activity_feature_logo.svg`);
export const imgLogoChatbotNew = require(`./${flavor}/assets/images/logo/img-logo-chatbot-new.svg`);
export const cameraProfileImage = require(`./${flavor}/assets/images/camera_profile.svg`);
export const AVAILABLE_LANGUAGES = require(`./${flavor}/assets/locale/availableLanguage`).default;
export const taxonomydata = require(`./${flavor}/assets/offlinecontent/taxonomies`).taxonomydata;
export const countryData = require(`./${flavor}/assets/offlinecontent/countryData`).countryData;
export const ActivitiesData = require(`./${flavor}/assets/offlinecontent/ActivitiesData`).ActivitiesData;
export const articledata = require(`./${flavor}/assets/offlinecontent/article`).articledata;
export const basicPagesData = require(`./${flavor}/assets/offlinecontent/basicPages`).basicPagesData;
export const ChildDevelopmentData = require(`./${flavor}/assets/offlinecontent/ChildDevelopmentData`).ChildDevelopmentData;
export const FaqsData = require(`./${flavor}/assets/offlinecontent/FaqsData`).FaqsData;
export const healthCheckupsData = require(`./${flavor}/assets/offlinecontent/healthCheckupsData`).healthCheckupsData;
export const dailyHomeNotificationdata = require(`./${flavor}/assets/offlinecontent/dailyHomeNotification`).dailyHomeNotificationdata;
export const MileStonesData = require(`./${flavor}/assets/offlinecontent/MileStonesData`).MileStonesData;
export const standardDevData = require(`./${flavor}/assets/offlinecontent/standardDevData`).standardDevData;
export const SurveyData = require(`./${flavor}/assets/offlinecontent/SurveyData`).SurveyData;
export const vaccineData = require(`./${flavor}/assets/offlinecontent/vaccineData`).vaccineData;
export const VideoArticleData = require(`./${flavor}/assets/offlinecontent/VideoArticleData`).VideoArticleData;
export const appConfig = require(`./${flavor}/config/appConfig`).default;


