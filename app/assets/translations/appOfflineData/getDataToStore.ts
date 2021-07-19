import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { ArticleEntity, ArticleEntitySchema } from "../../../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../../../database/schema/BasicPagesSchema";
import { DailyHomeMessagesSchema, DailyHomeMessagesEntity } from "../../../database/schema/DailyHomeMessagesSchema";
import { StandardDevHeightForAgeEntity, StandardDevHeightForAgeSchema } from "../../../database/schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightEntity, StandardDevWeightForHeightSchema } from "../../../database/schema/StandardDevWeightForHeightSchema";
import { TaxonomyEntity, TaxonomySchema } from "../../../database/schema/TaxonomySchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { setAllTaxonomyData, setAllTermsData, setDailyMessagesData, setStandardDevHFAData, setStandardDevWFHData } from "../../../redux/reducers/utilsSlice";
import { appConfig } from "./apiConstants";
import { articledata } from "./article";
import basicPagesData from "./basicPages";
import { dailyHomeNotificationdata } from "./dailyHomeNotification";
import standardDevData from "./standardDevData";
import { taxonomydata } from "./taxonomies";

// const getAllDataToStore = async (languageCode:string,dispatch:any,apiEndpoint:string) => {
const getAllDataToStore = async (languageCode:string,dispatch:any,prevPage:string,activeChild?:any) => {
    return new Promise(async (resolve, reject) => {
        // if(apiEndpoint == appConfig.basicPages || apiEndpoint == appConfig.activities || apiEndpoint == appConfig.milestones)
        // console.log("getAllDataToStore--");
        if(prevPage == "CountryLanguageSelection")
        {
            // try {
                let Entity:any;
                const basicData = await getDataToStore(languageCode,dispatch,BasicPagesSchema,Entity as BasicPagesEntity,basicPagesData,setAllTermsData);
                const taxonomyData = await getDataToStore(languageCode,dispatch,TaxonomySchema,Entity as TaxonomyEntity,taxonomydata,setAllTaxonomyData);
                //taxonomy
                //sponsor
                // console.log("success");
                resolve("success");
            // } catch (e) {
            //     reject();
            // }
        } else if(prevPage == "Terms"){
            let Entity:any;
            const alldailyNotiData = await getDataToStore(languageCode,dispatch,DailyHomeMessagesSchema,Entity as DailyHomeMessagesEntity,dailyHomeNotificationdata,setDailyMessagesData,'id');
            const allstanDevWFHData = await getDataToStore(languageCode,dispatch,StandardDevWeightForHeightSchema,Entity as StandardDevWeightForHeightEntity,standardDevData,setStandardDevWFHData);
            const allstanDevHFAData = await getDataToStore(languageCode,dispatch,StandardDevHeightForAgeSchema,Entity as StandardDevHeightForAgeEntity,standardDevData,setStandardDevHFAData);

            resolve("nocall");
        } else if(prevPage == "ChilSetup"){
            let Entity:any;
            const currentChildData = {
                "gender":activeChild.gender,
                "parent_gender":activeChild.parent_gender,
                "taxonomyData":activeChild.taxonomyData
              }
            const artData = await getDataToStore(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,"",currentChildData);
            resolve("nocall");
        }
    });


}
const getDataToStore = async (languageCode:string,dispatch:any,SchemaToUse:ObjectSchema,SchemaEntity:any,jsonData:any,setAllHardcodedData:Function,sortBy?:any,currentChildData?:any) => {
    return new Promise(async (resolve, reject) => {
        // console.log("getDataToStore--",SchemaToUse);
        let databaselistener:any;
        let dataToStore:any;
        let offlineData:any;
        if(SchemaToUse.name == StandardDevWeightForHeightSchema.name)
        {
            offlineData = jsonData[languageCode][0].weight_for_height;
            // console.log(offlineData);
        }
        else if(SchemaToUse.name == StandardDevHeightForAgeSchema.name)
        {
            offlineData = jsonData[languageCode][0].height_for_age;
            // console.log(offlineData);
        }
        else {
            offlineData = jsonData[languageCode];
            // console.log(offlineData);
        }
        let databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse,sortBy);
        if(SchemaToUse.name == ArticleEntitySchema.name)
        {
            if(currentChildData && currentChildData != "")
            {
                const filterQuery = '(child_age == '+currentChildData.taxonomyData.id+' || child_age == 0)';
                console.log(filterQuery,"..filterQuery..");
                let databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse,filterQuery);
                console.log(databaseData.length);
                dataToStore = databaseData;
            }else {
                dataToStore = databaseData2;
            }
        }
        else {
            dataToStore = databaseData2;
        }
            databaseData2.removeAllListeners();
            databaselistener = databaseData2.addListener(() => {
                // console.log("listener called");
                if(dataToStore?.length > 0)
                {
                    // console.log("in if  getDataToStore");
                    dispatch(setAllHardcodedData(dataToStore));
                    resolve(dataToStore);
                }else {
                    // console.log("in else  getDataToStore");
                    dispatch(setAllHardcodedData(JSON.stringify(offlineData)));
                    resolve(offlineData);
                }
            });
    });
}

  
export default getAllDataToStore;