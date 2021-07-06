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
import { appConfig, isArticlePinned } from "../types/apiConstants";

export const addApiDataInRealm = async (response: any) => {
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
    else if(response.payload.apiEndpoint == appConfig.pinnedContent)
    {
        insertData = response.payload.data.data;
        Entity= Entity as ArticleEntity;
        EntitySchema = ArticleEntitySchema;
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
        // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
        if(EntitySchema == ArticleEntitySchema)
        {
            // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
            let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
        }else {
            let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
        }
       // console.log(new Date()," result is ",createresult);
}
export const formatDate=(dateData:any)=>{
  return DateTime.fromISO(dateData).toFormat('dd LLL yyyy');
}


export const validateForm=(param:any,birthDate:any,isPremature:any,relationship:any,plannedTermDate:any,name?:any,gender?:any)=>{
   // console.log(param,birthDate,isPremature,relationship,plannedTermDate,name,gender);
    if(birthDate==null || birthDate==undefined){
    //    return 'Please enter birth date.';
    return false;
      }
      else{
        if(param==0){
            if(relationship =='' || relationship ==null || relationship ==undefined){
                // return 'Please enter relationship.';
                return false;
            }
        }
        if(param==1){
            if(name =='' || name ==null || name ==undefined){
                // return 'Please enter name.';
                return false;
            }
            if(gender =='' || gender ==null || gender ==undefined){
                // return 'Please enter gender.';
                return false;
            }
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
            return true;
        }
      }
}
export const onRealmDataDbChange = (collection: any, changes: any) => {
    //console.log("Realm listener called--",collection.name);
   // console.log("Realm listener called--",collection.schema);
    //console.log("Realm listener called string--",changes);
    // console.log("Realm listener called Schema--",Schema);
}
 
