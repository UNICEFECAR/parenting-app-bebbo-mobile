
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "./dataRealmCommon";
import RNFS from 'react-native-fs';
import downloadImages from "../../downloadImages/ImageStorage";
import { ApiImageData } from "@types/types";

export const getChildArticleData = async (languageCode:string,dispatch:any,SchemaToUse:ObjectSchema,SchemaEntity:any,jsonData:any,setAllHardcodedData:Function,currentChildData:any) => {
    // const [taxonomyData,setTaxonomyData] = React.useState();
    // console.log(languageCode,"languageCode in taxonomy file");
    //Get data from db and if it exists then use db data or use const data in this file.  
    let databaselistener:any;
    let databaseallData:any,databaseData:any;
    // const filterQuery = 'child_age == "'+currentChildData.taxonomyData.id+'" LIMIT(20)';
    const filterQuery = '(child_age == "'+currentChildData.taxonomyData.id+'" || child_age == "") && (category == "2" || category == "4" || category == "1" || category == "55" || category == "56" || category == "3") LIMIT(20)';
    console.log(filterQuery,"..filterQuery..")
    //actual query to use is below one.
    // const filterQuery = 'parent_gender == "'+currentChildData.parent_gender+'" AND child_age == "'+currentChildData.taxonomyData.id+'"';
//    console.log(filterQuery);
    // async function fetchData() {
        const imageArray:ApiImageData[] = []
        databaseallData = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse);
        // databaseData = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse);
        databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse,filterQuery);
        // databaseData.map((val: any) => {
        //     // console.log("value--",val['cover_image']);
            // if(val['cover_image'] != "")
            // {
            //     imageArray.push({
            //         srcUrl: JSON.parse(val['cover_image']).url, 
            //         destFolder: RNFS.DocumentDirectoryPath + '/content', 
            //         destFilename: (JSON.parse(val['cover_image']).url).split('/').pop()
            //     })
            // }
        // })
        // console.log(imageArray,"  db length--",databaseData?.length);
        // const imagesDownloadResult = await downloadImages(imageArray);
        // console.log(imagesDownloadResult, "..image result..");
        // console.log(databaseData.map(user => user));
        if(databaseData?.length > 0)
        {
            // dispatch(setAllHardcodedData(databaseData2));
            databaseallData.removeAllListeners();
            databaselistener = databaseallData.addListener(() => {
                // console.log(databaseData?.length,"in if listener called--",databaseData);
                dispatch(setAllHardcodedData(databaseData))
            });
        }else {
            // databaseData3.push({langCode:languageCode,allData:JSON.stringify(data[languageCode]),standardDevData:{}})
            dispatch(setAllHardcodedData(JSON.stringify(jsonData[languageCode])));
            databaseallData.removeAllListeners();
            databaselistener = databaseallData.addListener(() => {
                // console.log("in else listener called");
                if(databaseData?.length > 0)
                {
                    // console.log(databaseData?.length,"in else if listener called--",databaseData[0]);
                    dispatch(setAllHardcodedData(databaseData))
                }
            });
        }
    // }
    // fetchData()
    return [databaseData];
    // return [imagesDownloadResult];
}

  
// export default useToGetOfflineData;