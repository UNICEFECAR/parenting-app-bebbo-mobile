import { DateTime } from "luxon";
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema, } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../database/schema/ChildDevelopmentSchema";
import { ChildGrowthEntity, ChildGrowthSchema } from "../database/schema/ChildGrowthSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from "../database/schema/HealthCheckUpsSchema";
import { MilestonesEntity, MilestonesSchema } from "../database/schema/MilestonesSchema";
import { SurveysEntity, SurveysSchema } from "../database/schema/SurveysSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../database/schema/VideoArticleSchema";
import { appConfig, isArticlePinned } from "../assets/translations/appOfflineData/apiConstants";
import { receiveAPIFailure } from "../redux/sagaMiddleware/sagaSlice";
import { StandardDevWeightForHeightSchema } from "../database/schema/StandardDevWeightForHeightSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../database/schema/PinnedChildDevelopmentSchema";

export const addApiDataInRealm = async (response: any) => {
    return new Promise(async (resolve, reject) => {
        // console.log(new Date()," response in utils-",response);
            let EntitySchema=<ObjectSchema>{};
        let Entity:any;
        let insertData = [];
        let pinnedArticle = "";
            if(response.payload.apiEndpoint == appConfig.articles)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ArticleEntity;
                EntitySchema = ArticleEntitySchema;
                pinnedArticle = "";
            }
            else if(response.payload.apiEndpoint == appConfig.vaccinePinnedContent || 
                response.payload.apiEndpoint == appConfig.childGrowthPinnedContent || 
                response.payload.apiEndpoint == appConfig.healthcheckupPinnedContent)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ArticleEntity;
                EntitySchema = ArticleEntitySchema;
                pinnedArticle = isArticlePinned;
            }
            else if(response.payload.apiEndpoint == appConfig.childdevGirlPinnedContent || 
                response.payload.apiEndpoint == appConfig.childdevBoyPinnedContent)
            {
                insertData = response.payload.data.data;
                Entity= Entity as PinnedChildDevelopmentEntity;
                EntitySchema = PinnedChildDevelopmentSchema;
                pinnedArticle = isArticlePinned;
            }
            else if(response.payload.apiEndpoint == appConfig.videoArticles)
            {
                insertData = response.payload.data.data;
                Entity= Entity as VideoArticleEntity;
                EntitySchema = VideoArticleEntitySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.dailyMessages)
            {
            // console.log('dailyMeassages',response.payload.data.data)
                insertData = response.payload.data.data;
                Entity= Entity as DailyHomeMessagesEntity;
                EntitySchema = DailyHomeMessagesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.basicPages)
            {
                insertData = response.payload.data.data;
                Entity= Entity as BasicPagesEntity;
                EntitySchema = BasicPagesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.taxonomies)
            {
                const {standard_deviation, ...allData} = response.payload.data.data;
                insertData.push({langCode:response.payload.data.langcode,allData:JSON.stringify(allData),standardDevData:JSON.stringify(response.payload.data.data.standard_deviation)});
                Entity= Entity as TaxonomyEntity;
                EntitySchema = TaxonomySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.activities)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ActivitiesEntity;
                EntitySchema = ActivitiesEntitySchema;
            }
            else if(response.payload.apiEndpoint == appConfig.surveys)
            {
                insertData = response.payload.data.data;
                Entity= Entity as SurveysEntity;
                EntitySchema = SurveysSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.milestones)
            {
                insertData = response.payload.data.data;
                Entity= Entity as MilestonesEntity;
                EntitySchema = MilestonesSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.childDevelopmentData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ChildDevelopmentEntity;
                EntitySchema = ChildDevelopmentSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.childGrowthData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as ChildGrowthEntity;
                EntitySchema = ChildGrowthSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.vaccinations)
            {
                insertData = response.payload.data.data;
                Entity= Entity as VaccinationEntity;
                EntitySchema = VaccinationSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.healthCheckupData)
            {
                insertData = response.payload.data.data;
                Entity= Entity as HealthCheckUpsEntity;
                EntitySchema = HealthCheckUpsSchema;
            }
            else if(response.payload.apiEndpoint == appConfig.standardDeviation)
            {
                insertData = response.payload.data.data;
                // Entity= Entity as ArticleEntity;
                EntitySchema = StandardDevWeightForHeightSchema;
            }
                // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
                if(EntitySchema == ArticleEntitySchema || EntitySchema == PinnedChildDevelopmentSchema)
                {
                    // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
                    try{
                        let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }else if(EntitySchema == StandardDevWeightForHeightSchema) {
                    try{
                        let createresult = await dataRealmCommon.createStandardDev<typeof Entity>(insertData);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }else {
                    try{
                        let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
                        // console.log(new Date(),"in insert success---",response);
                        resolve("successinsert");
                    }catch(e) {
                        let errorArr = [];
                        console.log("in insert catch---",response.payload);
                        errorArr.push(response.payload);
                        let payload = {errorArr:errorArr,fromPage:'OnLoad'}
                        response.dispatch(receiveAPIFailure(payload));
                        reject();
                    }
                }
            // console.log(new Date()," result is ",createresult);
    });
}
export const formatDate=(dateData:any)=>{
  return DateTime.fromISO(dateData).toFormat('dd LLL yyyy');
}
export const formatStringDate=(dateData:any)=>{
    console.log(dateData,"..dateData..")
    return DateTime.fromJSDate(dateData as Date).toFormat('dd LLL yyyy');
  }

export const validateForm=(param:any,birthDate:any,isPremature:any,relationship:any,plannedTermDate:any,name?:any,gender?:any)=>{
   // console.log(param,birthDate,isPremature,relationship,plannedTermDate,name,gender);
    if(birthDate==null || birthDate==undefined){
    //    return 'Please enter birth date.';
    return false;
      }
      else{
        if(param==0){
            console.log(gender,"..gender11..");
            console.log(relationship,"..relationship11..");
            if(relationship =='' || relationship ==null || relationship ==undefined || gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==1){
            if(name =='' || name ==null || name ==undefined){
                // return 'Please enter name.';
                return false;
            }
            if(gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter gender.';
                return false;
            }
        }
        if(param==2){
            console.log(gender,"..gender..");
            if(gender =='' || gender ==0 || gender ==null || gender ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==3){
            console.log(gender,"..gender..");
            if(relationship =='' || relationship ==null || relationship ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==4){
            console.log(gender,"..gender..");
            // if(relationship =='' || relationship ==null || relationship ==undefined){
            //     // return 'Please enter relationship.';
            //     return false;
            // }
        }
        if(isPremature=="true"){
          if(plannedTermDate==null || plannedTermDate==undefined){
            // return 'Please enter due date';
            return false;
          }
          else{
           return true;
          }
        }
        else{
            console.log(gender,"..gender112..");
            console.log(relationship,"..relationship112..");
            return true;
        }
      }
}

    /**
     * Get YouTube video ID from given url.
     */
    export const  getYoutubeId = (url: string): string => {
        let rval: string = url;

        // https://www.youtube.com/watch?v=LjkSW_j6-hA
        if (url?.indexOf('youtu.be') === -1) {
            let re = new RegExp('v=([^&]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        // https://youtu.be/uMcgJR8ESRc
        if (url?.indexOf('youtu.be') !== -1) {
            let re = new RegExp('youtu.be/([^?]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        return rval;
    }

    /**
     * Get Vimeo video ID from given url.
     * 
     * url = https://vimeo.com/277586602?foo=bar
     */
     export const  getVimeoId = (url: string): string => {
        let rval: string = url;

        let re = new RegExp('vimeo.com/([0-9]+)[^0-9]*', 'img');
        let result = re.exec(url)

        if (result && result[1]) {
            rval = result[1];
        }

        return rval;
    }

 
