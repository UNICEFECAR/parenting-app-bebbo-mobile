import { DateTime } from "luxon";
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ArticleEntity, ArticleEntitySchema, CoverImage, } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../database/schema/VideoArticleSchema";
import { appConfig } from "../types/apiConstants";

export const addApiDataInRealm = async (response: any) => {
   // console.log(new Date()," response in utils-",response);
    let EntitySchema=<ObjectSchema>{};
   let Entity:any;
   let insertData = [];
    if(response.payload.apiEndpoint == appConfig.articles)
    {
        insertData = response.payload.data.data;
        Entity= Entity as ArticleEntity;
        EntitySchema = ArticleEntitySchema;
    }
    else if(response.payload.apiEndpoint == appConfig.videoArticles)
    {
        insertData = response.payload.data.data;
        Entity= Entity as VideoArticleEntity;
        EntitySchema = VideoArticleEntitySchema;
    }
    else if(response.payload.apiEndpoint == appConfig.dailyMessages)
    {
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
        let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
        // let deleteresult2 = await dataRealmCommon.deleteAll(CoverImage);
        let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
       // console.log(new Date()," result is ",createresult);
}
export const formatDate=(dateData:any)=>{
    return DateTime.fromISO(dateData).toFormat('dd LLL yyyy');
}
export const validateForm=(param:any,birthDate:any,isPremature:any,relationship:any,plannedTermDate:any,name?:any,gender?:any)=>{
    if(birthDate==null || birthDate==undefined){
       return 'Please enter birth date.';
      }
      else{
        console.log(typeof(isPremature),"..isPremature..");
        if(param==0){
            if(relationship =='' || relationship ==null || relationship ==undefined){
                return 'Please enter relationship.';
            }
        }
        if(param==1){
            if(name =='' || name ==null || name ==undefined){
                return 'Please enter name.';
            }
            if(gender =='' || gender ==null || gender ==undefined){
                return 'Please enter gender.';
            }
        }
        if(isPremature=="true"){
          if(plannedTermDate==null || plannedTermDate==undefined){
            return 'Please enter due date';
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
 
