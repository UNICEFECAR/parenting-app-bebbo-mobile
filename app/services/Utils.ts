import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ArticleEntity, ArticleEntitySchema, CoverImage, } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema, DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { appConfig } from "../types/apiConstants";

export const addApiDataInRealm = async (response: any) => {
    console.log(new Date()," response in utils-",response);
    let EntitySchema=<ObjectSchema>{};
   let Entity:any;
    if(response.payload.apiEndpoint == appConfig.articles)
    {
        Entity= Entity as ArticleEntity;
        EntitySchema = ArticleEntitySchema;
    }
    else if(response.payload.apiEndpoint == appConfig.dailyMessages)
    {
        Entity= Entity as DailyHomeMessagesEntity;
        EntitySchema = DailyHomeMessagesSchema;
    }
    else if(response.payload.apiEndpoint == appConfig.basicPages)
    {
        Entity= Entity as BasicPagesEntity;
        EntitySchema = BasicPagesSchema;
    }
    let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
    // let deleteresult2 = await dataRealmCommon.deleteAll(CoverImage);
    let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, response.payload.data.data);
    console.log(new Date()," result is ",createresult);
    // let closedresult = await dataRealmCommon.closeRealm();
    // let getresult = await dataRealmCommon.getData<typeof Entity>(EntitySchema);
    // console.log("getresult is ", Array.from(getresult));
    
}