import { CountryItem } from '@components/CountryItem';
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../../../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../../../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../../../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../../../database/schema/ChildDevelopmentSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../../../database/schema/DailyHomeMessagesSchema";
import { FAQsEntity, FAQsSchema } from "../../../database/schema/FAQsSchema";
import { MilestonesEntity, MilestonesSchema } from "../../../database/schema/MilestonesSchema";
import { StandardDevHeightForAgeEntity, StandardDevHeightForAgeSchema } from "../../../database/schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightEntity, StandardDevWeightForHeightSchema } from "../../../database/schema/StandardDevWeightForHeightSchema";
import { SurveysSchema } from '../../../database/schema/SurveysSchema';
import { TaxonomyEntity, TaxonomySchema } from "../../../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../../../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../../../database/schema/VideoArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { setAllActivitiesData, setAllChildDevData, setAllFaqsData, setAllHealthCheckupsData, setAllMileStonesData, setAllSurveyData, setAllTaxonomyData, setAllTermsData, setAllVaccineData, setAllVideoArticlesData, setDailyMessagesData, setStandardDevHFAData, setStandardDevWFHData } from "../../../redux/reducers/utilsSlice";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from './../../../database/schema/HealthCheckUpsSchema';
import { SurveysEntity } from './../../../database/schema/SurveysSchema';
import { appConfig } from "../../../instances";
import { basicPagesData, taxonomydata, articledata, dailyHomeNotificationdata, standardDevData, vaccineData, healthCheckupsData, ChildDevelopmentData, MileStonesData, VideoArticleData, ActivitiesData, SurveyData, FaqsData, countryData } from '../../../instances';
import { Country, CountrySchema } from "../../../database/schema/CountrySchema";
import { setCountriesStore } from '../../../redux/reducers/localizationSlice';

export const getDataToStore = async (languageCode: string, dispatch: any, SchemaToUse: ObjectSchema, SchemaEntity: any, jsonData: any, setAllHardcodedData: any, sortBy?: any, currentChildData?: any): Promise<any> => {
    // return new Promise((resolve) => {
    //let dataToStore: any;
    let offlineData: any;
    if (SchemaToUse.name == StandardDevWeightForHeightSchema.name) {
        offlineData = jsonData[languageCode] ? jsonData[languageCode][0].weight_for_height : undefined;
        if (!offlineData) {
            offlineData = [];
        }
    }
    else if (SchemaToUse.name == StandardDevHeightForAgeSchema.name) {
        offlineData = jsonData[languageCode] ? jsonData[languageCode][0].height_for_age : undefined;
        if (!offlineData) {
            offlineData = [];
        }
    }
    else {
        offlineData = jsonData[languageCode];
        if (offlineData == undefined || offlineData == "" || offlineData == null) {
            offlineData = [];
        }
    }
    const databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse, sortBy);
    // if (SchemaToUse.name == ArticleEntitySchema.name) {
    //     if (currentChildData && currentChildData != "") {
    //         let filterQuery = '';
    //         if (currentChildData.taxonomyData && currentChildData.taxonomyData.id) {
    //             filterQuery += '(child_age == ' + currentChildData.taxonomyData.id + ' || ';
    //         }
    //         if (filterQuery != '') {
    //             filterQuery += 'child_age == 0)';

    //         }
    //         else {
    //             filterQuery += 'child_age == 0';
    //         }
    //         if (currentChildData.parent_gender != "" && currentChildData.parent_gender != 0 && currentChildData.parent_gender != "0") {
    //             filterQuery += '&& (parent_gender==' + parseInt(currentChildData.parent_gender) + ' || parent_gender == ' + bothParentGender + ' || parent_gender == ' + String(bothParentGender) + '  || parent_gender == 0)';
    //         }
    //         if (currentChildData.gender != "" && currentChildData.gender != 0 && currentChildData.gender != "0") {
    //             filterQuery += '&& (child_gender==' + parseInt(currentChildData.gender) + ' || child_gender == ' + bothChildGender + ' || child_gender == ' + String(bothChildGender) + '  || child_gender == 0)';
    //         }
    //         // title CONTAINS 'Pe' && summary CONTAINS 'Ac' && body CONTAINS 'About'
    //         const databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse, filterQuery);
    //         dataToStore = databaseData;
    //     } else {
    //         dataToStore = databaseData2;
    //     }
    // }
    // else {
    //     dataToStore = databaseData2;
    // }
    const dataToStore = databaseData2;
    // console.log('offlineData is',offlineData)
    // console.log('stringify offlineData is',JSON.stringify(offlineData))
    if (dataToStore?.length > 0) {
        dispatch(setAllHardcodedData(dataToStore))
        return dataToStore;
    } else {
        dispatch(setAllHardcodedData(JSON.stringify(offlineData)));
        return offlineData;
    }
    // });
}
const getAllDataToStore = async (languageCode: string, dispatch: any, prevPage: string, activeChild?: any): Promise<any> => {
    // return new Promise(async (resolve) => {
    if (prevPage == "CountryLanguageSelection") {
        // try {
        let Entity: any;
        await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
        await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
        return "success";
    }
    else if (prevPage == "AddEditChild") {
        let Entity: any;
        const currentChildData = {
            "gender": activeChild.gender,
            "parent_gender": activeChild.parent_gender,
            "taxonomyData": activeChild.taxonomyData
        }
        await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
        return "success";
    }
    else if (prevPage == "") {
        let Entity: any;
        console.log(countryData, 'Prevpage is', prevPage, languageCode);
        // await getDataToStore(languageCode, dispatch, CountrySchema, Entity as Country, countryData, setCountriesStore);
        return "success";
    }
    else if (prevPage == "Terms") {
        let Entity: any;
        await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
        await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
        await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
        await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
        await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
        await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
        await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
        await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
        await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
        await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
        await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);
        return "success";
    } else if (prevPage == "ChildSetup") {
        let Entity: any;
        const currentChildData = {
            "gender": activeChild.gender,
            "parent_gender": activeChild.parent_gender,
            "taxonomyData": activeChild.taxonomyData
        }
        await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
        return "success";
    } else {
        return "fail";
    }
    // });


}

export const getAllDataOnRetryToStore = async (apiEndpoint: string, languageCode: string, dispatch: any, _prevPage: string, activeChild?: any): Promise<any> => {
    // return new Promise(async (resolve) => {
    let Entity: any;
    if (apiEndpoint == appConfig.apiConfig.basicPages) {
        try {
            await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
        } catch (error) {
            console.error('Error fetching basic pages data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.taxonomies) {
        try {
            await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
        } catch (error) {
            console.error('Error fetching taxonomies data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.countryGroups) {
        try {
            await getDataToStore(languageCode, dispatch, CountrySchema, Entity as Country, countryData, setCountriesStore);
        } catch (error) {
            console.error('Error fetching countryGroups data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.dailyMessages) {
        try {
            await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
        } catch (error) {
            console.error('Error fetching dailyMessages data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.standardDeviation) {
        try {
            await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
            await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
        } catch (error) {
            console.error('Error fetching standardDeviation data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.vaccinations) {
        try {
            await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
        } catch (error) {
            console.error('Error fetching vaccinations data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.healthCheckupData) {
        try {
            await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
        } catch (error) {
            console.error('Error fetching healthCheckupData data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.childDevelopmentData) {
        try {
            await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
        } catch (error) {
            console.error('Error fetching childDevelopmentData data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.milestones) {
        try {
            await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
        } catch (error) {
            console.error('Error fetching milestones data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.videoArticles) {
        try {
            await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
        } catch (error) {
            console.error('Error fetching videoArticles data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.activities) {
        try {
            await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
        } catch (error) {
            console.error('Error fetching activities data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.surveys) {
        try {
            await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
        } catch (error) {
            console.error('Error fetching surveys data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.faqs) {
        try {
            await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);
        } catch (error) {
            console.error('Error fetching faqs data:', error);
        }

        return "success";
    }
    else if (apiEndpoint === appConfig.apiConfig.articles) {
        try {
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
        } catch (error) {
            console.error('Error fetching articles data:', error);
        }
        return "success";
    } else {
        return "success";
    }
}

export default getAllDataToStore;