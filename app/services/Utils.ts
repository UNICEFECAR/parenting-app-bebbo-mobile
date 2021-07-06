import { DateTime } from "luxon";
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ArticleEntity, ArticleEntitySchema } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
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
        console.log('dailyMeassages',response.payload.data.data)
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
       // console.log(allData);
        // insertData = response.payload.data.langcode;
        insertData.push({langCode:response.payload.data.langcode,allData:JSON.stringify(allData),standardDevData:JSON.stringify(response.payload.data.data.standard_deviation)});
       // console.log("insertData--",insertData);
        Entity= Entity as TaxonomyEntity;
        EntitySchema = TaxonomySchema;
    }
        // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
        // let deleteresult2 = await dataRealmCommon.deleteAll(CoverImage);
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
 
