import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";

const useToGetOfflineData = async (languageCode:string,dispatch:any,SchemaToUse:ObjectSchema,SchemaEntity:any,jsonData:any,setAllHardcodedData:Function,sortBy:any) => {
    // const [taxonomyData,setTaxonomyData] = React.useState();
  //  console.log(languageCode,"languageCode in taxonomy file");
    //Get data from db and if it exists then use db data or use const data in this file.  
    let databaselistener:any;
    // async function fetchData() {
        let databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse,sortBy);
            if(databaseData2?.length > 0)
            {
                // dispatch(setAllHardcodedData(databaseData2));
                databaseData2.removeAllListeners();
                databaselistener = databaseData2.addListener(() => {
                    //console.log("in if listener called--",databaseData2);
                    dispatch(setAllHardcodedData(databaseData2))
                });
            }else {
                // databaseData3.push({langCode:languageCode,allData:JSON.stringify(data[languageCode]),standardDevData:{}})
                dispatch(setAllHardcodedData(JSON.stringify(jsonData[languageCode])));
                databaseData2.removeAllListeners();
                databaselistener = databaseData2.addListener(() => {
                   // console.log("in else listener called");
                    if(databaseData2?.length > 0)
                    {
                       // console.log("in else if listener called--",databaseData2[0]);
                        dispatch(setAllHardcodedData(databaseData2))
                    }
                });
            }
    // }
    // fetchData()
    return [databaseData2];
}

  
export default useToGetOfflineData;