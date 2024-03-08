import { CHILDREN_PATH } from "@types/types";
import { DateTime } from "luxon";
import { Platform } from "react-native";
import RNFS from 'react-native-fs';
import { requestNotifications } from "react-native-permissions";
import { ObjectSchema, PrimaryKey } from "realm";
import { v4 as uuidv4 } from 'uuid';
import { appConfig, isArticlePinned, luxonDefaultLocale } from "../assets/translations/appOfflineData/apiConstants";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../database/schema/ChildDevelopmentSchema";
import { ChildGrowthEntity, ChildGrowthSchema } from "../database/schema/ChildGrowthSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../database/schema/DailyHomeMessagesSchema";
import { FAQsEntity, FAQsSchema } from "../database/schema/FAQsSchema";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from "../database/schema/HealthCheckUpsSchema";
import { MilestonesEntity, MilestonesSchema } from "../database/schema/MilestonesSchema";
import { StandardDevWeightForHeightSchema } from "../database/schema/StandardDevWeightForHeightSchema";
import { SurveysEntity, SurveysSchema } from "../database/schema/SurveysSchema";
import { TaxonomyEntity, TaxonomySchema } from "../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../database/schema/VideoArticleSchema";
import { receiveAPIFailure } from "../redux/sagaMiddleware/sagaSlice";
import { isFutureDate } from "./childCRUD";
import PushNotification from 'react-native-push-notification';
const requestNotificationPermission= async (): Promise<any>=>{
    const status= await requestNotifications([]);
    console.log(status,"..status..");
   
  }
export const  notiPermissionUtil= async ():Promise<any>=>{
    setTimeout(()=>{
        if(Platform.OS=="android"){
          requestNotificationPermission();
        }
        else{
          PushNotification.requestPermissions(); 
        }  
      },100);
}
export const addApiDataInRealm = async (response: any): Promise<any> => {
    // return new Promise(async (resolve, reject) => {
    let EntitySchema: ObjectSchema = { name: "", properties: {} };
    let EntitySchema2: ObjectSchema = { name: "", properties: {} };
    let EntitySchema3: ObjectSchema = { name: "", properties: {} };
    let EntitySchema4: ObjectSchema = { name: "", properties: {} };
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
        response.payload.apiEndpoint == appConfig.faqPinnedContent ||
        response.payload.apiEndpoint == appConfig.faqUpdatedPinnedContent ||
        response.payload.apiEndpoint == appConfig.milestoneRelatedArticle) {
        insertData = response.payload.data.data;
        Entity = Entity as ArticleEntity;
        EntitySchema = ArticleEntitySchema;
        pinnedArticle = isArticlePinned;
    }
    else if (response.payload.apiEndpoint == appConfig.archive) {
        insertData = response.payload.data.data;
        Entity = Entity as VideoArticleEntity;
        EntitySchema = VideoArticleEntitySchema;
        EntitySchema2 = ArticleEntitySchema;
        EntitySchema3 = ActivitiesEntitySchema;
        EntitySchema4 = FAQsSchema;
    }
    else if (response.payload.apiEndpoint == appConfig.videoArticles) {
        insertData = response.payload.data.data;
        Entity = Entity as VideoArticleEntity;
        EntitySchema = VideoArticleEntitySchema;
    }
    else if (response.payload.apiEndpoint == appConfig.dailyMessages) {
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
        const { ...allData } = response.payload.data.data;
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
        EntitySchema = StandardDevWeightForHeightSchema;
    }
    else if (response.payload.apiEndpoint == appConfig.faqs) {
        insertData = response.payload.data.data;
        Entity = Entity as FAQsEntity;
        EntitySchema = FAQsSchema;
    }
    if (EntitySchema == ArticleEntitySchema) {
        try {
            await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData, pinnedArticle);
            return "successinsert";
        } catch (e) {
            const errorArr = [];
            errorArr.push(response.payload);
            const payload = { errorArr: errorArr, fromPage: 'OnLoad' }
            response.dispatch(receiveAPIFailure(payload));
            return '';
        }
    }
    else if (EntitySchema == VideoArticleEntitySchema && response.payload.apiEndpoint == appConfig.archive) {
        try {
            await dataRealmCommon.deleteDeltaData(EntitySchema.name, EntitySchema2.name, EntitySchema3.name, EntitySchema4.name, insertData);
            return "successinsert";
        } catch (e) {
            const errorArr = [];
            errorArr.push(response.payload);
            const payload = { errorArr: errorArr, fromPage: 'OnLoad' }
            response.dispatch(receiveAPIFailure(payload));
            return '';
        }
    }
    else if (EntitySchema == StandardDevWeightForHeightSchema) {
        try {
            await dataRealmCommon.createStandardDev<typeof Entity>(insertData);
            return "successinsert";
        } catch (e) {
            const errorArr = [];
            errorArr.push(response.payload);
            const payload = { errorArr: errorArr, fromPage: 'OnLoad' }
            response.dispatch(receiveAPIFailure(payload));
            return '';
        }
    } else {
        try {
            await dataRealmCommon.create<typeof Entity>(EntitySchema, insertData);
            return "successinsert";
        } catch (e) {
            const errorArr = [];
            errorArr.push(response.payload);
            const payload = { errorArr: errorArr, fromPage: 'OnLoad' }
            response.dispatch(receiveAPIFailure(payload));
            return '';
        }
    }

    // });
}
export const addSpaceToHtml = (htmlInput: any): any => {
    if (htmlInput !== null && htmlInput !== undefined) {
        let html = htmlInput;
        html = html.replace(/<[/]strong> /g, " </strong>");
        html = html.replace(/<[/]em> /g, " </em>");
        html = html.replace(/<[/]i> /g, " </i>");
        html = html.replace(/<[/]s> /g, " </s>");
        html = html.replace(/<[/]u> /g, " </u>");
        html = html.replace(/<[/]span> /g, " </span>");
        html = html.replace(/<[/]strong> /g, " </strong>");
        html = html.replace(/<[/]em> /g, " </em>");
        html = html.replace(/<[/]i> /g, " </i>");
        html = html.replace(/<[/]s> /g, " </s>");
        html = html.replace(/<[/]u> /g, " </u>");
        html = html.replace(/<[/]span> /g, " </span>");
        return html;
    }
}
const getTwoDigits = (number: any): string => {
    return (number < 10 ? '0' : '') + number;
}
export const formatDate = (dateData: any): any => {
    dateData = DateTime.fromJSDate(new Date(dateData));
    console.log(dateData, "..before")
    // if (typeof dateData == "number") {
    //     dateData = DateTime.fromMillis(dateData)
    // }
    //console.log(DateTime.fromISO(dateData),".DateTime.fromISO(dateData)")
    // const day = DateTime.fromISO(dateData).day;
    // const month = DateTime.fromISO(dateData).month;
    // const year = DateTime.fromISO(dateData).year;
    //console.log(day+"."+month+"."+year,"..after");
    // const day = new Intl.DateTimeFormat(luxonDefaultLocale, { day: '2-digit' }).format(new Date(dateData));
    // const month = new Intl.DateTimeFormat(luxonDefaultLocale, { month: '2-digit' }).format(new Date(dateData));
    // const year = new Intl.DateTimeFormat(luxonDefaultLocale, { year: 'numeric' }).format(new Date(dateData));
    const dateView = getTwoDigits(dateData.day) + "." + getTwoDigits(dateData.month) + "." + dateData.year;
    return dateView;
}
export const formatStringDate = (dateData: any): any => {
    dateData = DateTime.fromJSDate(new Date(dateData));
    //console.log(dateData,"..before1");
    // if (typeof dateData == "number") {
    //     dateData = DateTime.fromMillis(dateData)
    // }
    //console.log(DateTime.fromISO(dateData),".DateTime.fromISO(dateData)")

    //dateData=DateTime.fromJSDate(new Date(dateData));
    // const day = DateTime.fromISO(dateData).day;
    // const month = DateTime.fromISO(dateData).month;
    // const year = DateTime.fromISO(dateData).year;
    //console.log(day+"."+month+"."+year,"..after1")
    // const day = new Intl.DateTimeFormat(luxonDefaultLocale, { day: '2-digit' }).format(new Date(dateData));
    // const month = new Intl.DateTimeFormat(luxonDefaultLocale, { month: '2-digit' }).format(new Date(dateData));
    // const year = new Intl.DateTimeFormat(luxonDefaultLocale, { year: 'numeric' }).format(new Date(dateData));
    const dateView = getTwoDigits(dateData.day) + "." + getTwoDigits(dateData.month) + "." + dateData.year;
    return dateView;
}


export const formatStringTime = (dateData: any): any => {
    //console.log(dateData, "dateData");
    if (typeof dateData == "number") {
        dateData = DateTime.fromMillis(dateData)
    }
    const hour = DateTime.fromISO(dateData).hour;
    const minute = DateTime.fromISO(dateData).minute;

    const formattedTime = getTwoDigits(hour) + ":" + getTwoDigits(minute)

    //console.log(formattedTime);
    return formattedTime;
}
export const removeParams = (sParam: any): any => {
    if (sParam.indexOf("?") != -1) {
        const url = sParam.split('?')[0];
        return url;
    }
    else {
        return sParam;
    }
}
export const validateForm = (param: any, birthDate: any, isPremature: any, relationship: any, plannedTermDate: any, name?: any, gender?: any): any => {
    if (birthDate == null || birthDate == undefined) {
        return false;
    }
    else {
        if (name == '' || name == null || name == undefined) {
            return false;
        }
        if (param == 0) {
            if (relationship == '' || relationship == null || relationship == undefined || gender == '' || gender == 0 || gender == null || gender == undefined) {
                return false;
            }
        }
        if (param == 1) {

            if (gender == '' || gender == 0 || gender == null || gender == undefined) {
                return false;
            }
        }
        if (param == 2) {
            if (gender == '' || gender == 0 || gender == null || gender == undefined) {
                return false;
            }
        }
        if (param == 3) {
            if (relationship == '' || relationship == null || relationship == undefined) {
                return false;
            }
        }
        if (param == 4) {
            console.log("param 4");
        }

        if (isPremature == "true") {
            if (plannedTermDate == null || plannedTermDate == undefined) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
}
export const trimWhiteSpacePayload = (str:any):any => {
    return str.length ? str.trim(): str
  }
export const randomArrayShuffle = (array: any): any => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/**
 * Get YouTube video ID from given url.
 */

export const getYoutubeId = (url: string): string => {
    let rval: string = url;

    if (url?.indexOf('youtu.be') === -1) {
        const re = new RegExp('v=([^&]+)', 'img');
        const result = re.exec(url)

        if (result && result[1]) {
            rval = result[1];
        }
    }

    if (url?.indexOf('youtu.be') !== -1) {
        const re = new RegExp('youtu.be/([^?]+)', 'img');
        const result = re.exec(url)

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

    const re = new RegExp('vimeo.com/([0-9]+)[^0-9]*', 'img');
    const result = re.exec(url)

    if (result && result[1]) {
        rval = result[1];
    }

    return rval;
}
const formatImportedMeasures = async (measures: any): Promise<any>=> {
    console.log(' here us')
    console.log('measurement length is', measures.length)
    //imported from old app
    if (measures.length ==0) {
        console.log('here us1...')
        return measures;
    } else {
        if (typeof measures === 'object' && measures !== null) {
            //import from new app's exported files
            console.log('here us1')
            return measures;
        } else {
            //import from old app's exported files
            const importedMeasures = JSON.parse(measures);
            importedMeasures.forEach((measure: any) => {
                measure.uuid = uuidv4();
                if (measure.didChildGetVaccines == false)
                    measure.vaccineIds = ""
                else {
                    const allmeausreVaccineIds: any[] = [];
                    measure.vaccineIds.forEach((element: any) => {
                        // added for testing 
                        allmeausreVaccineIds.push({ uuid: element })
                    });
                    measure.vaccineIds = JSON.stringify(allmeausreVaccineIds);

                }
                if (typeof measure?.measurementPlace === 'string' || measure?.measurementPlace instanceof String) {
                    if (measure?.measurementPlace == "doctor") {
                        measure.measurementPlace = 0
                    } else {
                        measure.measurementPlace = 1
                    }
                } //titleDateInMonth
                if ("length" in measure && measure.length != null && measure.length != undefined) {
                    if (isNaN(parseFloat(measure.length)) || isNaN(parseFloat(measure.weight))) {
                        measure.isChildMeasured = false;
                    } else {
                        measure.weight = measure.weight == "" ? "" : (parseFloat(measure?.weight) / 1000).toFixed(2);
                        measure.height = measure.length == "" ? "" : parseFloat(measure?.length).toFixed(2);
                        measure.isChildMeasured = true;
                        delete measure.length;
                    }

                }

            });
            return importedMeasures;
        }
    }
}
const callAsyncOperationdatetime = async (rem: any): Promise<any> => {
    const remnew = {
        reminderDate: rem?.reminderDate,
        reminderTime: rem?.reminderTime,
        reminderType: rem?.reminderType,
        uuid: rem?.uuid,
        reminderDateDefined: rem.reminderDateDefined && rem.reminderDateDefined > 0 ? rem.reminderDateDefined : rem.reminderDate,
        reminderTimeDefined: rem.reminderTimeDefined && rem.reminderTimeDefined > 0 ? rem.reminderTimeDefined : rem.reminderTime - 60000
    };
    return await remnew;
}

const formatImportedReminders = async (reminders: any): Promise<any> => {
    console.log('remideer length is', reminders.length)
    if (reminders.length==0) {
        // in old app reminders were string, new app has reminders array
        return reminders;
    } else {
        if (typeof reminders === 'object' && reminders !== null) {
            //import from new app's exported files
            const importedReminders: any[] = [...reminders];
            const results: any[] = await Promise.all(importedReminders.map(async (item: any): Promise<any> => {
                const item2 = await callAsyncOperationdatetime(item);
                return item2;
            }));
            return results;
        } else {
            //import from old app's exported files
            const importedReminders = JSON.parse(reminders);
            importedReminders.forEach((reminder: any) => {
                const reminderUUID = (reminder.uuid);
                reminder.reminderDate = Number(reminder.date);
                reminder.reminderTime = Number(reminder.time);
                reminder.reminderDateDefined = Number(reminder.date);
                reminder.reminderTimeDefined = Number(reminder.time) - 60000;
                reminder.reminderType = "healthCheckup";
                reminder.uuid = reminderUUID;
                delete reminder.date;
                delete reminder.time;
            });
            return importedReminders;
        }
    }
}
const checkFileExistence = async (filePath:string) => {
    console.log('Existskkkkkkk');
    try {
      const exists = await RNFS.exists(filePath);
      console.log('Exists:', exists);
  
      if (exists) {
        console.log('File exists');
      } else {
        console.log('File does not exist');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
//child data get
export const getChild = async (child: any, genders: any): Promise<any> => {
    try {
        const checkPhotoUri = child.photoUri!=null? CHILDREN_PATH +child.photoUri : CHILDREN_PATH;
        const photoUri  = await RNFS.exists(String(checkPhotoUri));     
        const childmeasures  = await formatImportedMeasures(child.measures)
        console.log("reminders output---", childmeasures);
        const childreminders = await formatImportedReminders(child.reminders)
        console.log("reminders output---", childreminders);
        const isPremature: any = child.isPremature == "true" ? "true" : "false";
        const childName: any = ("name" in child) === true ? child.name : ("childName" in child) === true ? child.childName : ""
        console.log(isPremature, "..isPremature..");
        let genderValue: any = child.gender;
        if (typeof genderValue === 'string' || genderValue instanceof String) {
            if (genders.length > 0 && genderValue != "") {
                genderValue = genders.find((genderset: any) => genderset.unique_name.toLowerCase() == child.gender.toLowerCase()).id
            }
            else {
                genderValue = 0;
            }
        }
        let favoriteadvices: any[] = [], favoritegames: any[] = []
        if (child && child.favoriteadvices && child.favoriteadvices.length > 0) {
            favoriteadvices = [...child.favoriteadvices];
        } else {
            favoriteadvices = [];
        }
        if (child && child.favoritegames && child.favoritegames.length > 0) {
            favoritegames = [...child.favoritegames];
        } else {
            favoritegames = [];
        }
        const inFuture = isFutureDate(child.birthDate);
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
        measures: childmeasures,
        comment: child.comment,
        checkedMilestones: child.checkedMilestones,
        reminders: childreminders,
        isMigrated: true,
        isPremature: isPremature,
        isExpected: inFuture == true ? 'true' : 'false',
        favoriteadvices: favoriteadvices,
        favoritegames: favoritegames
    };
    } catch (error) {
        console.error('Error in getChild:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}



