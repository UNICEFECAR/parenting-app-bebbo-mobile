import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../../../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../../../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../../../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../../../database/schema/ChildDevelopmentSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../../../database/schema/DailyHomeMessagesSchema";
import { FAQsEntity, FAQsSchema } from "../../../database/schema/FAQsSchema";
import { MilestonesEntity, MilestonesSchema } from "../../../database/schema/MilestonesSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../../../database/schema/PinnedChildDevelopmentSchema";
import { StandardDevHeightForAgeEntity, StandardDevHeightForAgeSchema } from "../../../database/schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightEntity, StandardDevWeightForHeightSchema } from "../../../database/schema/StandardDevWeightForHeightSchema";
import { SurveysSchema } from '../../../database/schema/SurveysSchema';
import { TaxonomyEntity, TaxonomySchema } from "../../../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../../../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../../../database/schema/VideoArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { setAllActivitiesData, setAllChildDevData, setAllFaqsData, setAllHealthCheckupsData, setAllMileStonesData, setAllPinnedChildDevData, setAllSurveyData, setAllTaxonomyData, setAllTermsData, setAllVaccineData, setAllVideoArticlesData, setDailyMessagesData, setStandardDevHFAData, setStandardDevWFHData } from "../../../redux/reducers/utilsSlice";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from './../../../database/schema/HealthCheckUpsSchema';
import { SurveysEntity } from './../../../database/schema/SurveysSchema';
import { appConfig, both_child_gender, both_parent_gender} from "./apiConstants";
import { basicPagesData, taxonomydata, articledata, dailyHomeNotificationdata, standardDevData, vaccineData, healthCheckupsData, ChildDevelopmentData, PinnedChildDevData, MileStonesData, VideoArticleData, ActivitiesData, SurveyData, FaqsData } from '../../../dynamicImports';
// const getAllDataToStore = async (languageCode:string,dispatch:any,apiEndpoint:string) => {
const getAllDataToStore = async (languageCode: string, dispatch: any, prevPage: string, activeChild?: any) => {
  //  console.log(prevPage, "..prevPage..")
    return new Promise(async (resolve, reject) => {
        // if(apiEndpoint == appConfig.basicPages || apiEndpoint == appConfig.activities || apiEndpoint == appConfig.milestones)
        // console.log("getAllDataToStore--");
        if (prevPage == "CountryLanguageSelection") {
            // try {
            let Entity: any;
            const basicData = await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
            const taxonomyData = await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
            //taxonomy
            //sponsor
            // console.log("success");
            resolve("success");
            // } catch (e) {
            //     reject();
            // }
        }
        else if (prevPage == "AddEditChild") {
            let Entity: any;
           // console.log(activeChild, "..currentChildData..")
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            //console.log(currentChildData, "..currentChildData..")
            const artData = await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("nocall");
        }
        else if (prevPage == "Terms") {
            let Entity: any;
            const alldailyNotiData = await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
            const allstanDevWFHData = await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
            const allstanDevHFAData = await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
            const allVaccinesData = await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
            const allHealthCheckupsData = await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
            const allChildDevlopmentData = await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
            const allPinnedChildDevlopmentData = await getDataToStore(languageCode, dispatch, PinnedChildDevelopmentSchema, Entity as PinnedChildDevelopmentEntity, PinnedChildDevData, setAllPinnedChildDevData);
            const allMileStonesData = await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
            const allVideoArticlesData = await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
            const allActivitiesData = await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
            const allSurveyData = await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
            const allFaqsData = await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);

            resolve("nocall");
        } else if (prevPage == "ChilSetup") {
            let Entity: any;
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            const artData = await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("nocall");
        } else {
            resolve("fail");
        }
    });


}

export const getAllDataOnRetryToStore = async (apiEndpoint: string, languageCode: string, dispatch: any, prevPage: string, activeChild?: any) => {
    return new Promise(async (resolve, reject) => {
        let Entity: any;
        if (apiEndpoint == appConfig.basicPages) {
            const basicData = await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.taxonomies) {
            const taxonomyData = await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.dailyMessages) {
            const alldailyNotiData = await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
            resolve("success");
        }
        else if (apiEndpoint == appConfig.standardDeviation) {
            const allstanDevWFHData = await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
            const allstanDevHFAData = await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.vaccinations) {
            const allVaccinesData = await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.healthCheckupData) {
            const allHealthCheckupsData = await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.childDevelopmentData) {
            const allChildDevlopmentData = await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.childdevBoyPinnedContent || apiEndpoint == appConfig.childdevGirlPinnedContent) {
            const allPinnedChildDevlopmentData = await getDataToStore(languageCode, dispatch, PinnedChildDevelopmentSchema, Entity as PinnedChildDevelopmentEntity, PinnedChildDevData, setAllPinnedChildDevData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.milestones) {
            const allMileStonesData = await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.videoArticles) {
            const allVideoArticlesData = await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.activities) {
            const allActivitiesData = await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.surveys) {
            const allSurveyData = await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.faqs) {
            const allFaqsData = await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.articles) {
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            const artData = await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("success");
        } else {
            resolve("fail");
        }
    });
}

export const getDataToStore = async (languageCode: string, dispatch: any, SchemaToUse: ObjectSchema, SchemaEntity: any, jsonData: any, setAllHardcodedData: Function, sortBy?: any, currentChildData?: any, queryText?: any) => {
    return new Promise(async (resolve, reject) => {
       // console.log(currentChildData, "..currentChildData..")
        // console.log("getDataToStore--",SchemaToUse);
        let databaselistener: any;
        let dataToStore: any;
        let offlineData: any;
        if (SchemaToUse.name == StandardDevWeightForHeightSchema.name) {
            offlineData = jsonData[languageCode] ? jsonData[languageCode][0].weight_for_height : undefined;
            // console.log(offlineData);
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                // offlineData = jsonData['en'][0].weight_for_height;
                offlineData = [];
            }
        }
        else if (SchemaToUse.name == StandardDevHeightForAgeSchema.name) {
            offlineData = jsonData[languageCode] ? jsonData[languageCode][0].height_for_age : undefined;
            // console.log(offlineData);
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                // offlineData = jsonData['en'][0].height_for_age;
                offlineData = [];
            }
        }
        else if(SchemaToUse.name == FAQsSchema.name) {
            offlineData = jsonData[languageCode];
            console.log('FAQsSchema--',offlineData);
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                offlineData = [];
            }
        }
        else {
            offlineData = jsonData[languageCode];
            // console.log(offlineData);
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                // offlineData = jsonData['en'];
                offlineData = [];
            }
        }
        let databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse, sortBy);
        if (SchemaToUse.name == ArticleEntitySchema.name) {
            if (currentChildData && currentChildData != "") {
                let filterQuery = '';
                if (currentChildData.taxonomyData && currentChildData.taxonomyData.id) {
                    filterQuery += '(child_age == ' + currentChildData.taxonomyData.id + ' || ';
                }
                if (filterQuery != '') {
                    filterQuery += 'child_age == 0)';

                }
                else {
                    filterQuery += 'child_age == 0';
                }
                if (currentChildData.parent_gender != "" && currentChildData.parent_gender != 0 && currentChildData.parent_gender != "0") {
                    filterQuery += '&& (parent_gender==' + parseInt(currentChildData.parent_gender) + ' || parent_gender == ' + both_parent_gender + ' || parent_gender == ' + String(both_parent_gender) + '  || parent_gender == 0)';
                }
                if (currentChildData.gender != "" && currentChildData.gender != 0 && currentChildData.gender != "0") {
                    filterQuery += '&& (child_gender==' + parseInt(currentChildData.gender) + ' || child_gender == ' + both_child_gender + ' || child_gender == ' + String(both_child_gender) + '  || child_gender == 0)';
                }
                // console.log(queryText,"..queryText");
                // if (queryText != "" && queryText != null && queryText != undefined) {
                //     filterQuery += ' && title CONTAINS[c]"' + queryText + '" || summary CONTAINS[c] "' + queryText + '" || body CONTAINS[c] "' + queryText + '"';
                // }
                // title CONTAINS 'Pe' && summary CONTAINS 'Ac' && body CONTAINS 'About'
                //const filterQuery='((child_age == 43 || child_age == 0) && (parent_gender == 60 || parent_gender == both) && (child_gender == 59 || child_gender == both)'
                //console.log(filterQuery, "..11filterQuery..");
                let databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse, filterQuery);
                //console.log(databaseData.length);
                dataToStore = databaseData;
            } else {
                dataToStore = databaseData2;
            }
        }
        else {
            dataToStore = databaseData2;
        }
        // databaseData2.removeAllListeners();
        // databaselistener = databaseData2.addListener(() => {
        // console.log("listener called");
        if (dataToStore?.length > 0) {
            // console.log("in if  getDataToStore");
            dispatch(setAllHardcodedData(dataToStore));
            resolve(dataToStore);
        } else {
            // console.log("in else  getDataToStore");
            dispatch(setAllHardcodedData(JSON.stringify(offlineData)));
            resolve(offlineData);
        }
        // });
    });
}


export default getAllDataToStore;