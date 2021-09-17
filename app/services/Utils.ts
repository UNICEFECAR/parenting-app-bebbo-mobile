import { CHILDREN_PATH } from "@types/types";
import RNFS from 'react-native-fs';
import { ObjectSchema } from "realm";
import { v4 as uuidv4 } from 'uuid';
import { store, useAppSelector } from "../../App";
import { appConfig, isArticlePinned } from "../assets/translations/appOfflineData/apiConstants";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../database/schema/ChildDevelopmentSchema";
import { ChildGrowthEntity, ChildGrowthSchema } from "../database/schema/ChildGrowthSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from "../database/schema/HealthCheckUpsSchema";
import { MilestonesEntity, MilestonesSchema } from "../database/schema/MilestonesSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../database/schema/PinnedChildDevelopmentSchema";
import { StandardDevWeightForHeightSchema } from "../database/schema/StandardDevWeightForHeightSchema";
import { SurveysEntity, SurveysSchema } from "../database/schema/SurveysSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../database/schema/VideoArticleSchema";
import { receiveAPIFailure } from "../redux/sagaMiddleware/sagaSlice";
import { isFutureDate } from "./childCRUD";
const IntlPolyfill = require('intl');
export const addApiDataInRealm = async (response: any) => {
    return new Promise(async (resolve, reject) => {
        // console.log(new Date()," response in utils-",response);
        let EntitySchema = <ObjectSchema>{};
        let Entity: any;
        let insertData = [];
        let pinnedArticle = "";
        if (response.payload.apiEndpoint == appConfig.articles) {
            insertData = response.payload.data.data;
            Entity = Entity as ArticleEntity;
            EntitySchema = ArticleEntitySchema;
            pinnedArticle = "";
        }
        else if (response.payload.apiEndpoint == appConfig.vaccinePinnedContent ||
            response.payload.apiEndpoint == appConfig.childGrowthPinnedContent ||
            response.payload.apiEndpoint == appConfig.healthcheckupPinnedContent ||
            response.payload.apiEndpoint == appConfig.milestoneRelatedArticle) {
            insertData = response.payload.data.data;
            Entity = Entity as ArticleEntity;
            EntitySchema = ArticleEntitySchema;
            pinnedArticle = isArticlePinned;
        }
        else if (response.payload.apiEndpoint == appConfig.childdevGirlPinnedContent ||
            response.payload.apiEndpoint == appConfig.childdevBoyPinnedContent) {
            insertData = response.payload.data.data;
            Entity = Entity as PinnedChildDevelopmentEntity;
            EntitySchema = PinnedChildDevelopmentSchema;
            pinnedArticle = isArticlePinned;
        }
        else if (response.payload.apiEndpoint == appConfig.videoArticles) {
            insertData = response.payload.data.data;
            Entity = Entity as VideoArticleEntity;
            EntitySchema = VideoArticleEntitySchema;
        }
        else if (response.payload.apiEndpoint == appConfig.dailyMessages) {
            // console.log('dailyMeassages',response.payload.data.data)
            insertData = response.payload.data.data;
            Entity = Entity as DailyHomeMessagesEntity;
            EntitySchema = DailyHomeMessagesSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.basicPages) {
            insertData = response.payload.data.data;
            Entity = Entity as BasicPagesEntity;
            EntitySchema = BasicPagesSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.taxonomies) {
            const { standard_deviation, ...allData } = response.payload.data.data;
            insertData.push({ langCode: response.payload.data.langcode, allData: JSON.stringify(allData), standardDevData: JSON.stringify(response.payload.data.data.standard_deviation) });
            Entity = Entity as TaxonomyEntity;
            EntitySchema = TaxonomySchema;
        }
        else if (response.payload.apiEndpoint == appConfig.activities) {
            insertData = response.payload.data.data;
            Entity = Entity as ActivitiesEntity;
            EntitySchema = ActivitiesEntitySchema;
        }
        else if (response.payload.apiEndpoint == appConfig.surveys) {
            insertData = response.payload.data.data;
            Entity = Entity as SurveysEntity;
            EntitySchema = SurveysSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.milestones) {
            insertData = response.payload.data.data;
            Entity = Entity as MilestonesEntity;
            EntitySchema = MilestonesSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.childDevelopmentData) {
            insertData = response.payload.data.data;
            Entity = Entity as ChildDevelopmentEntity;
            EntitySchema = ChildDevelopmentSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.childGrowthData) {
            insertData = response.payload.data.data;
            Entity = Entity as ChildGrowthEntity;
            EntitySchema = ChildGrowthSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.vaccinations) {
            insertData = response.payload.data.data;
            Entity = Entity as VaccinationEntity;
            EntitySchema = VaccinationSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.healthCheckupData) {
            insertData = response.payload.data.data;
            Entity = Entity as HealthCheckUpsEntity;
            EntitySchema = HealthCheckUpsSchema;
        }
        else if (response.payload.apiEndpoint == appConfig.standardDeviation) {
            insertData = response.payload.data.data;
            // Entity= Entity as ArticleEntity;
            EntitySchema = StandardDevWeightForHeightSchema;
        }
        // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
        if (EntitySchema == ArticleEntitySchema || EntitySchema == PinnedChildDevelopmentSchema) {
            // let deleteresult = await dataRealmCommon.deleteAll(EntitySchema);
            try {
                let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData, pinnedArticle);
                // console.log(new Date(),"in insert success---",response);
                resolve("successinsert");
            } catch (e) {
                let errorArr = [];
                console.log("in insert catch---", response.payload);
                errorArr.push(response.payload);
                let payload = { errorArr: errorArr, fromPage: 'OnLoad' }
                response.dispatch(receiveAPIFailure(payload));
                reject();
            }
        } else if (EntitySchema == StandardDevWeightForHeightSchema) {
            try {
                let createresult = await dataRealmCommon.createStandardDev<typeof Entity>(insertData);
                // console.log(new Date(),"in insert success---",response);
                resolve("successinsert");
            } catch (e) {
                let errorArr = [];
                console.log("in insert catch---", response.payload);
                errorArr.push(response.payload);
                let payload = { errorArr: errorArr, fromPage: 'OnLoad' }
                response.dispatch(receiveAPIFailure(payload));
                reject();
            }
        } else {
            try {
                let createresult = await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
                // console.log(new Date(),"in insert success---",response);
                resolve("successinsert");
            } catch (e) {
                let errorArr = [];
                console.log("in insert catch---", response.payload);
                errorArr.push(response.payload);
                let payload = { errorArr: errorArr, fromPage: 'OnLoad' }
                response.dispatch(receiveAPIFailure(payload));
                reject();
            }
        }
        // console.log(new Date()," result is ",createresult);
    });
}
// export const formatDate=(dateData:any,luxonLocale:string)=>{
//   return DateTime.fromISO(dateData).setLocale(luxonLocale).toFormat('dd LLL yyyy');
// }
// export const formatStringDate=(dateData:any,luxonLocale:string)=>{
//     //new Intl.DateTimeFormat('de-DE', options).format(date)
//     return DateTime.fromJSDate(new Date(dateData)).setLocale(luxonLocale).toFormat('dd LLL yyyy');
//   }
export const formatDate = (dateData: any, luxonLocale: string) => {
    // return new IntlPolyfill.DateTimeFormat(luxonLocale, {day:'2-digit', month: 'short',year:'numeric' }).format(new Date(dateData))
    let day = new IntlPolyfill.DateTimeFormat(luxonLocale, { day: '2-digit' }).format(new Date(dateData));
    let month = new IntlPolyfill.DateTimeFormat(luxonLocale, { month: 'short' }).format(new Date(dateData));
    let year = new IntlPolyfill.DateTimeFormat(luxonLocale, { year: 'numeric' }).format(new Date(dateData));
    let dateView = day + " " + month + " " + year;
    return dateView;
}
export const formatStringDate = (dateData: any, luxonLocale: string) => {
    let day = new IntlPolyfill.DateTimeFormat(luxonLocale, { day: '2-digit' }).format(new Date(dateData));
    let month = new IntlPolyfill.DateTimeFormat(luxonLocale, { month: 'short' }).format(new Date(dateData));
    let year = new IntlPolyfill.DateTimeFormat(luxonLocale, { year: 'numeric' }).format(new Date(dateData));
    let dateView = day + " " + month + " " + year;
    return dateView;
}

export const formatStringTime = (dateData: any, luxonLocale: string) => {
    // let hour=new IntlPolyfill.DateTimeFormat(luxonLocale, {hour:'2-digit'}).format(new Date(dateData));
    // let minute=new IntlPolyfill.DateTimeFormat(luxonLocale, {minute:'2-digit',hour12: true}).format(new Date(dateData));
    // let period=new IntlPolyfill.DateTimeFormat(luxonLocale, {hour:"numeric",minute:'numeric',second:"numeric",hour12: true}).format(new Date(dateData)).split(" ")[1];
    // // console.log(period,"..period")
    // let timeView=hour+":"+minute+" "+period;
    //   return timeView;
    
    return new IntlPolyfill.DateTimeFormat(luxonLocale, { hour: 'numeric', minute: 'numeric', hour12: false }).format(new Date(dateData));
    // return DateTime.fromJSDate(new Date(dateData)).setLocale(luxonLocale).toFormat('hh:mm a');
}
export const validateForm = (param: any, birthDate: any, isPremature: any, relationship: any, plannedTermDate: any, name?: any, gender?: any) => {
    // console.log(param,birthDate,isPremature,relationship,plannedTermDate,name,gender);
    if (birthDate == null || birthDate == undefined) {
        //    return 'Please enter birth date.';
        return false;
    }
    else {
        if (param == 0) {
            console.log(gender, "..gender11..");
            console.log(relationship, "..relationship11..");
            if (relationship == '' || relationship == null || relationship == undefined || gender == '' || gender == 0 || gender == null || gender == undefined) {
                // return 'Please enter relationship.';
                return false;
            }
        }
        if (param == 1) {
            if (name == '' || name == null || name == undefined) {
                // return 'Please enter name.';
                return false;
            }
            if (gender == '' || gender == 0 || gender == null || gender == undefined) {
                // return 'Please enter gender.';
                return false;
            }
        }
        if (param == 2) {
            console.log(gender, "..gender..");
            if (gender == '' || gender == 0 || gender == null || gender == undefined) {
                // return 'Please enter relationship.';
                return false;
            }
        }
        if (param == 3) {
            console.log(gender, "..gender..");
            if (relationship == '' || relationship == null || relationship == undefined) {
                // return 'Please enter relationship.';
                return false;
            }
        }
        if (param == 4) {
            console.log(gender, "..gender..");
            // if(relationship =='' || relationship ==null || relationship ==undefined){
            //     // return 'Please enter relationship.';
            //     return false;
            // }
        }
        if (isPremature == "true") {
            if (plannedTermDate == null || plannedTermDate == undefined) {
                // return 'Please enter due date';
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log(gender, "..gender112..");
            console.log(relationship, "..relationship112..");
            return true;
        }
    }
}

/**
 * Get YouTube video ID from given url.
 */

export const getYoutubeId = (url: string): string => {
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
export const getVimeoId = (url: string): string => {
    let rval: string = url;

    let re = new RegExp('vimeo.com/([0-9]+)[^0-9]*', 'img');
    let result = re.exec(url)

    if (result && result[1]) {
        rval = result[1];
    }

    return rval;
}
const isAnyKeyValueFalse = (o: { [x: string]: any; }) => !!Object.keys(o).find(k => !o[k]);
const formatImportedMeasures = (measures: any) => {
    console.log(measures, "formatImportedMeasures")
    // console.log(typeof measures === 'object' && measures !== null)
    // if (typeof measure === 'string' || measure instanceof String){
    //imported from old app
    if (measures == "" || measures == [] || measures == null) {
        return [];
    } else {
        if (typeof measures === 'object' && measures !== null) {
            //import from new app's exported files
            // console.log("is array")
            return measures;
        } else {
            //import from old app's exported files
            let importedMeasures = JSON.parse(measures);
            importedMeasures.forEach((measure: any) => {
                // console.log(measure, "importedmeasures",measure.vaccineIds)
                measure.uuid = uuidv4();
                if (measure.didChildGetVaccines == false)
                    measure.vaccineIds = ""
                else {
                    let allmeausreVaccineIds: any[] = [];
                    measure.vaccineIds.forEach((element, index) => {
                        // added for testing 
                        // allmeausreVaccineIds.push(index==0?{uuid:"6b016c1c-64fa-4e47-adbd-93e0a7255e65"}:{uuid:element})
                        allmeausreVaccineIds.push({ uuid: element })
                    });
                    measure.vaccineIds = JSON.stringify(allmeausreVaccineIds);
                    // console.log(allmeausreVaccineIds, "allmeausreVaccineIds", measure.vaccineIds)


                }
                if (typeof measure?.measurementPlace === 'string' || measure?.measurementPlace instanceof String) {
                    if (measure?.measurementPlace == "doctor") {
                        measure.measurementPlace = 0
                    } else {
                        measure.measurementPlace = 1
                    }
                } //titleDateInMonth
                if ("length" in measure) {
                    measure.weight = measure.weight == "" ? "" : parseFloat(measure?.weight / 1000).toFixed(2);
                    measure.height = measure.length == "" ? "" : parseFloat(measure?.length).toFixed(2);
                    delete measure.length;
                }

            });
            // console.log(importedMeasures);
            return importedMeasures;
        }
    }
    // }else{
    //     return measures;
    // }
}
const formatImportedReminders = (reminders: any) => {
    if (reminders == "" || reminders == [] || reminders == null) {
        // in old app reminders were string, new app has reminders array
        return [];
    } else {
        if (typeof reminders === 'object' && reminders !== null) {
            //import from new app's exported files
            return reminders;
        } else {
            //import from old app's exported files
            let importedReminders = JSON.parse(reminders);
            importedReminders.forEach((reminder: any) => {
                console.log(reminders, "importedReminders")
                reminder.reminderDate = Number(reminder.date);
                reminder.reminderTime = Number(reminder.time);
                reminder.reminderType = "healthCheckup";
                reminder.uuid = (reminder.uuid);
                delete reminder.date;
                delete reminder.time;
            });
            return importedReminders;
        }
    }
}
export const getDataSet=(key:any,uniquename:any)=>{
 const storedata = store.getState();
  const relationshipData =storedata.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData)[key]:[];
  console.log(relationshipData,"..articles from utils");
  return getIdSetByUniqueName(relationshipData,uniquename);
}
//find array by uniquename
export const getIdByUniqueName=(array:any,subarray:any)=>{
   
console.log(array,"..array");
console.log(subarray,"..subarray");
return array.filter(g => subarray.includes(g.unique_name)).map(g => g.id);
}
//find id by uniquename
export const getIdSetByUniqueName=(array:any,uniquename:any)=>{
         let dataset= array.filter(x => x.unique_name == uniquename);
       if(dataset.length>0){
        return dataset[0].id;
       }
}
//find uniquename by id
export const getUniqueNameById=(array:any,id:any)=>{
    console.log(array,"..getUniqueNameId..")
    console.log(id,"..uniquename..")
    let dataset=array.filter(x => x.id == id)
    if(dataset.length>0){
     return dataset[0].unique_name;
    }
   
 }
//child data get
export const getChild = async (child: any, genders: any) => {
    const photoUri = await RNFS.exists(CHILDREN_PATH + child.photoUri);
    const childmeasures: any[] = await formatImportedMeasures(child.measures)
    const childreminders: any[] = await formatImportedReminders(child.reminders)
    console.log(photoUri, "..photoUri..", childmeasures, childreminders);
    console.log(child, "..childname..");
    console.log("name" in child, "..child.hasOwnProperty..");
    //const childName:any=child.hasOwnProperty("name") ? child.name:child.childName;
    const childName: any = ("name" in child) === true ? child.name : ("childName" in child) === true ? child.childName : ""
    console.log(childName, "..childname..");
    let genderValue: any = child.gender;
    console.log(typeof genderValue, "..typeof genderValue")
    if (typeof genderValue === 'string' || genderValue instanceof String) {
        console.log(typeof genderValue, "..11typeof genderValue")
        // console.log(genders.find((genderset:any) => genderset.name == child.gender).id,"/idset");
        if (genders.length > 0 && genderValue != "") {
            genderValue = genders.find((genderset) => genderset.name.toLowerCase() == child.gender.toLowerCase()).id
        }
        else {
            genderValue = 0;
        }
        console.log(genderValue, "..22typeof genderValue")
    }
    console.log(genderValue, "..genderValue..");
    const inFuture = isFutureDate(child.birthDate);
    //child.isExpected?child.isExpected:"false"
    //mayur
    //planned will be date of birth se aage ka and birthdate ka diff 4weeks and above hai then premature true
    return {
        uuid: child.uuid,
        childName: childName,
        gender: genderValue,
        photoUri: photoUri ? child.photoUri : "",
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
        plannedTermDate: child.plannedTermDate,
        birthDate: child.birthDate,
        babyRating: child.babyRating,
        //mayur
        measures: childmeasures,
        comment: child.comment,
        checkedMilestones: child.checkedMilestones,
        //mayur
        reminders: childreminders,
        isMigrated: true,
        isPremature: 'false', //calcualte if its premature or not?
        isExpected: inFuture == true ? 'true' : 'false'
        //relationship:''
    };
}


