import getAllDataToStore, { getAllDataOnRetryToStore } from '@assets/translations/appOfflineData/getDataToStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { DateTime } from 'luxon';
import { Alert, Image } from "react-native";
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import { store } from "../../App";
import { appConfig, finalUrl } from '../assets/translations/appOfflineData/apiConstants';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../database/schema/ActivitiesSchema';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { BasicPagesEntity, BasicPagesSchema } from '../database/schema/BasicPagesSchema';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from '../database/schema/PinnedChildDevelopmentSchema';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../database/schema/VideoArticleSchema';
import downloadImages from '../downloadImages/ImageStorage';
import { commonApiInterface } from "../interface/interface";
import { setDailyArticleGamesCategory, setShowedDailyDataCategory } from '../redux/reducers/articlesSlice';
import { setchatBotData, setDownloadedBufferAgeBracket } from '../redux/reducers/childSlice';
import { setSponsorStore } from '../redux/reducers/localizationSlice';
import { setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setIncrementalSyncDT, setInfoModalOpened, setSyncDate } from '../redux/reducers/utilsSlice';
import axiosService from './axiosService';


export const client =
  'https://raw.githubusercontent.com/UNICEFECAR/parent-buddy-mobile/master/src/translations/';

const commonApiService: commonApiInterface = async (apiEndpoint: string, methodname: any, postdata: object) => {
  //  console.log("apinameapiname")
  //  console.log(apiname,methodname,postdata);
  const storedata = store.getState();
  //console.log("store val--", storedata)

  let selectedLang, selectedCountry;
  selectedCountry = storedata.selectedCountry.countryId;
  selectedLang = storedata.selectedCountry.languageCode;
  let newurl = finalUrl(apiEndpoint, selectedCountry, selectedLang)
 // console.log("newurl--", newurl);
  let responseData: any = {};
  responseData.apiEndpoint = apiEndpoint;
  return await axiosService({
    method: methodname,
    url: newurl,
    params: postdata
  })
    .then((response: any) => {
      //console.log("successsssss");
      //  console.log(response.data);
      responseData.data = response.data,
        responseData.status = response.status
      return responseData;
      // return response;
    })
    .catch((err: any) => {
     //console.log("errcodeee");
     console.log('err--',err);
      responseData.data = err?.message
      responseData.status = err?.response?.status;
      return responseData;
      // if (err.code == 'ECONNABORTED' || err.message == 'Network Error') {
      //  return null;
      // } else {
      //    return null;
      // }
    });
}
export const updateIncrementalSyncDT = async(response: any, dispatch: any, navigation: any,languageCode: string,prevPage:string) => {
  const articleresp = response.find((y:any)=>y.apiEndpoint == appConfig.articles);
  const videoarticleresp = response.find((y:any)=>y.apiEndpoint == appConfig.videoArticles);
  const activitiesresp = response.find((y:any)=>y.apiEndpoint == appConfig.activities);
  const faqpinnedresp = response.find((y:any)=>y.apiEndpoint == appConfig.faqPinnedContent);
  const faqsresp = response.find((y:any)=>y.apiEndpoint == appConfig.faqs);
  const faqupdatedpinnedresp = response.find((y:any)=>y.apiEndpoint == appConfig.faqUpdatedPinnedContent);
  const archiveresp = response.find((y:any)=>y.apiEndpoint == appConfig.archive);
// console.log(faqupdatedpinnedresp,"faqupdatedpinnedresp---",articleresp);
  if(articleresp && articleresp != {} && articleresp.data) {
    if(prevPage != "AddEditChild") {
      dispatch(setIncrementalSyncDT({key: 'articlesDatetime', value: articleresp.data.datetime}));
    }
  }
  if(videoarticleresp && videoarticleresp != {} && videoarticleresp.data) {
    dispatch(setIncrementalSyncDT({key: 'videoArticlesDatetime', value: videoarticleresp.data.datetime}));
  }
  if(activitiesresp && activitiesresp != {} && activitiesresp.data) {
    dispatch(setIncrementalSyncDT({key: 'activitiesDatetime', value: activitiesresp.data.datetime}));
  }
  if(faqpinnedresp && faqpinnedresp != {} && faqpinnedresp.data) {
    dispatch(setIncrementalSyncDT({key: 'faqPinnedContentDatetime', value: faqpinnedresp.data.datetime}));
  }
  if(faqsresp && faqsresp != {} && faqsresp.data) {
    dispatch(setIncrementalSyncDT({key: 'faqsDatetime', value: faqsresp.data.datetime}));
  }
  if(faqupdatedpinnedresp && faqupdatedpinnedresp != {} && faqupdatedpinnedresp.data) {
    dispatch(setIncrementalSyncDT({key: 'faqUpdatedPinnedContentDatetime', value: faqupdatedpinnedresp.data.datetime}));
  }
  if(archiveresp && archiveresp != {} && archiveresp.data) {
    dispatch(setIncrementalSyncDT({key: 'archiveDatetime', value: archiveresp.data.datetime}));
  }
}
export const onAddEditChildSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage:string,activeChild: any,oldErrorObj:any) => {
//  response = response[0];
 //console.log(response,"..resonse..");
//  deactivateKeepAwake();
console.log(oldErrorObj,"in commonapi onAddEditChildSuccess ---", response);
const artresp = response.find((x:any)=> x.apiEndpoint == 'articles' && x.status == 200);
if(artresp && artresp != {})
{
  const artobj = oldErrorObj.find((x:any) => x.apiEndpoint == 'articles');
  if(artobj && artobj != {}){
    const storedata = store.getState();
    const bufferAgeBracket = storedata.childData.childDataSet.bufferAgeBracket;
    // console.log("keep awake deactivated--",bufferAgeBracket);
    // console.log("storedata.utilsData.taxonomy.allTaxonomyData--",storedata.utilsData.taxonomy.allTaxonomyData);
    const childagearray = storedata.utilsData.taxonomy.allTaxonomyData  != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age:[];
    const agesarr = artobj.postdata.childAge == 'all' ? childagearray.map(x=>x.id) : artobj.postdata.childAge.split(',').map(Number);
    const mergedarray = [...new Set([...agesarr,...bufferAgeBracket])];
    // console.log("mergedarray---",mergedarray);
    dispatch(setDownloadedBufferAgeBracket(mergedarray))
  }
}

 navigation.navigate('ChildProfileScreen');
}
export const onSponsorApiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage:string) => {
  // async function* onSponsorApiSuccess(response: any,dispatch: (arg0: { payload: any; type: string; }) => void,navigation: any){
  //console.log(response, "..response..");
  //console.log(dispatch, "..dispatch..");
  // const sponsorobj = [...response.data.data];
  // const filteredArray=response.data.data[0].find((item:any)=>{
  //   item['country_flag'] && item['country_sponsor_logo'] && item['country_national_partner']
  // })
  // console.log(filteredArray,"..filteredArray..");

  if (response && response[0] && response[0].apiEndpoint == appConfig.sponsors) {
    response = response[0];
    if(response.data && response.data.status && response.data.status == 200)
    {
      
      // let obj=[];
      // type:val.type,title:val.title,id:val.id,
      const sponsorObj = response.data.data.map((val: any) => {
        if(val['country_flag'] && val['country_flag'] != null && val['country_flag'].url != "")
        {
          return ({ country_flag: { srcUrl: val['country_flag'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_flag'].name } })
        }else {
          return null;
        }
      })
      const partnerObj = response.data.data.map((val: any) => {
        if(val['country_sponsor_logo'] && val['country_sponsor_logo'] != null && val['country_sponsor_logo'].url != "")
        {
          return ({ country_sponsor_logo: { srcUrl: val['country_sponsor_logo'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_sponsor_logo'].name } })
        }else {
          return null;
        }
      })
      const logoObj = response.data.data.map((val: any) => {
        if(val['country_national_partner'] && val['country_national_partner'] != null && val['country_national_partner'].url != "")
        {
          return ({ country_national_partner: { srcUrl: val['country_national_partner'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_national_partner'].name } })
        }else {
          return null;
        }
      })
      let sponsarsObj:any={};
      if(logoObj && logoObj != null && logoObj[0])
      {
        const ImageArray = [];
        ImageArray.push(logoObj[0].country_national_partner)
        const imagesDownloadResult = await downloadImages(ImageArray);
        if(imagesDownloadResult && imagesDownloadResult[0].success==true){
          sponsarsObj.country_national_partner='file://' +imagesDownloadResult[0].args.destFolder +'/' +imagesDownloadResult[0].args.destFilename; 
        }
        else{
          sponsarsObj.country_national_partner=null;
        }
      }
      else{
        sponsarsObj.country_national_partner=null;
      }
      if(partnerObj && partnerObj != null && partnerObj[0])
      {
        const ImageArray = [];
        ImageArray.push(partnerObj[0].country_sponsor_logo)
        const imagesDownloadResult = await downloadImages(ImageArray);
        if(imagesDownloadResult && imagesDownloadResult[0].success==true){
          sponsarsObj.country_sponsor_logo='file://' +imagesDownloadResult[0].args.destFolder +'/' +imagesDownloadResult[0].args.destFilename; 
        }
        else{
          sponsarsObj.country_sponsor_logo=null;
        }
      }
      else{
         sponsarsObj.country_sponsor_logo=null;
       }
      // if(sponsorObj && sponsorObj != null && sponsorObj[0])
      // {
      //   const ImageArray = [];
      //   ImageArray.push(sponsorObj[0].country_flag)
      //   const imagesDownloadResult = await downloadImages(ImageArray);
      //   if(imagesDownloadResult && imagesDownloadResult[0].success==true){
      //     sponsarsObj.country_flag='file://' +imagesDownloadResult[0].args.destFolder +'/' +imagesDownloadResult[0].args.destFilename; 
      //   }
      //   else{
      //     sponsarsObj.country_flag=null;
      //   }
      // }
      // else{
      //   sponsarsObj.country_flag=null;
      // }

    
     // console.log(sponsarsObj, "..sponsarsObj..");
      dispatch(setSponsorStore(sponsarsObj));
    }
    // const country= new CountryLanguageConfirmation();
    // country.dispatchSponsors();
  }
 // console.log("in commonapi sponsor ---", response);
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  // deactivateKeepAwake();
  // console.log(allDatatoStore,"--allDatatoStore");
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: 'Walkthrough'}],
    // });
    navigation.navigate('Walkthrough');
}
export const onOnLoadApiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string) => {
  // navigation.navigate('ChildSetup');
  //let userEnteredChildData = await dataRealmCommon.getData<ConfigSettingsEntity>(ConfigSettingsSchema);
  //console.log(userEnteredChildData, "..userEnteredChildData..");
  // console.log("in onOnLoadApiSuccess");
  // console.log("in commonapi onOnLoadApiSuccess ---", response);
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  let allJsonData =await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  // deactivateKeepAwake();
  if (allJsonData?.length>0) {
    navigation.navigate('ChildSetupList');
  }
  else {
    navigation.navigate('ChildSetup');
  }
}
export const onChildSetuppiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string,activeChild: any,oldErrorObj:any) => {
  // navigation.navigate('HomeDrawerNavigator');
  console.log(oldErrorObj,"in commonapi onChildSetuppiSuccess ---", response);
  const artresp = response.find((x:any)=> x.apiEndpoint == 'articles' && x.status == 200);
  if(artresp && artresp != {})
  {
    const artobj = oldErrorObj.find((x:any) => x.apiEndpoint == 'articles');
    if(artobj && artobj != {}){
      const storedata = store.getState();
      console.log("storedata.utilsData.taxonomy.allTaxonomyData--",storedata.utilsData.taxonomy.allTaxonomyData);
      const childagearray = storedata.utilsData.taxonomy.allTaxonomyData  != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age:[];
      console.log("childagearray--",childagearray);
      const artarray = artobj.postdata.childAge == 'all' ? childagearray.map(x=>x.id) : artobj.postdata.childAge.split(',').map(Number)
      dispatch(setDownloadedBufferAgeBracket(artarray))
    }
  }
  //setDownloadedBufferAgeBracket save data from apiJsonData
  // if(prevPage== "AddEditChild") {
  //   //append agebrakcet into existing
  // }else {
  //   //just replace with new agebracket
  // }
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage,activeChild);
  // console.log(allDatatoStore,"..allDatatoStore..")
  // deactivateKeepAwake();
  navigation.reset({
    index: 0,
    routes: [
      {
        name: 'HomeDrawerNavigator',
      },
    ],
  });
  // navigation.navigate('Home',
  //   {
  //     screen:"Home",
  //     params:{prevPage:prevPage},
  //   });
}
export const onHomeapiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string,activeChild: any, oldErrorObj:any,forceupdatetime:any,downloadWeeklyData:any,downloadMonthlyData:any,enableImageDownload:any) => {
  // navigation.navigate('HomeDrawerNavigator');
  console.log(prevPage,"--prevPage in onHomeapiSuccess---",response);
  // const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  // console.log(allDatatoStore,"..allDatatoStore..")
  const resolvedPromises =  oldErrorObj.map(async (x:any) => {
      if(x.apiEndpoint == appConfig.sponsors){
        const sponsorresp = response.filter((y:any)=>y.apiEndpoint == appConfig.sponsors);
        const sponsorrespnew = sponsorresp ? sponsorresp[0] : [];
        if(sponsorrespnew && sponsorrespnew.data && sponsorrespnew.data.status && sponsorrespnew.data.status == 200)
        {
          // const ImageArray = [];
          // let obj=[];
          // type:val.type,title:val.title,id:val.id,
          const sponsorObj = sponsorrespnew.data.data.map((val: any) => {
            if(val['country_flag'] && val['country_flag'] != null && val['country_flag'].url != "")
            {
              return ({ country_flag: { srcUrl: val['country_flag'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_flag'].name } })
            }else {
              return null;
            }
          })
          const partnerObj = sponsorrespnew.data.data.map((val: any) => {
            if(val['country_sponsor_logo'] && val['country_sponsor_logo'] != null && val['country_sponsor_logo'].url != "")
            {
              return ({ country_sponsor_logo: { srcUrl: val['country_sponsor_logo'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_sponsor_logo'].name } })
            }else {
              return null;
            }
          })
          const logoObj = sponsorrespnew.data.data.map((val: any) => {
            if(val['country_national_partner'] && val['country_national_partner'] != null && val['country_national_partner'].url != "")
            {
              return ({ country_national_partner: { srcUrl: val['country_national_partner'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_national_partner'].name } })
            }else {
              return null;
            }
          })
      let sponsarsObj:any={};
      if(logoObj && logoObj != null && logoObj[0])
      {
        const ImageArray = [];
        ImageArray.push(logoObj[0].country_national_partner)
        const imagesDownloadResult = await downloadImages(ImageArray);
        if(imagesDownloadResult && imagesDownloadResult[0].success==true){
          sponsarsObj.country_national_partner='file://' +imagesDownloadResult[0].args.destFolder +'/' +imagesDownloadResult[0].args.destFilename; 
        }
        else{
          sponsarsObj.country_national_partner=null;
        }
      }
      else{
        sponsarsObj.country_national_partner=null;
      }
      if(partnerObj && partnerObj != null && partnerObj[0])
      {
        const ImageArray = [];
        ImageArray.push(partnerObj[0].country_sponsor_logo)
        const imagesDownloadResult = await downloadImages(ImageArray);
        if(imagesDownloadResult && imagesDownloadResult[0].success==true){
          sponsarsObj.country_sponsor_logo='file://' +imagesDownloadResult[0].args.destFolder +'/' +imagesDownloadResult[0].args.destFilename; 
        }
        else{
          sponsarsObj.country_sponsor_logo=null;
        }
      }
      else{
         sponsarsObj.country_sponsor_logo=null;
       }
          // if(logoObj && logoObj != null && logoObj[0])
          // {
          //   ImageArray.push(logoObj[0].country_national_partner)
          // }
          // if(partnerObj && partnerObj != null && partnerObj[0])
          // {
          //   ImageArray.push(partnerObj[0].country_sponsor_logo)
          // }
          // if(sponsorObj && sponsorObj != null && sponsorObj[0])
          // {
          //   ImageArray.push(sponsorObj[0].country_flag)
          // }

          //const imagesDownloadResult = await downloadImages(ImageArray);
        // console.log(imagesDownloadResult, "..image result..");
          dispatch(setSponsorStore(sponsarsObj));
          return sponsarsObj;
        }else {
          return "success";
        }
      }else {
        const allDatatoStore = await getAllDataOnRetryToStore(x.apiEndpoint,languageCode,dispatch,prevPage,activeChild);
        return allDatatoStore;
      }
  })
  const forceUpdateData = [
    {
      apiEndpoint: appConfig.checkUpdate,
      method: 'get',
      postdata: {},
      saveinDB: false,
    }
  ];
  const results = await Promise.all(resolvedPromises);
  //console.log("done--",results);
  // navigation.setParams({fromPage:'Loading'});
  dispatch(setInfoModalOpened({key:'showDownloadPopup', value: false}));
  //delete all notifications from slice for all child
  // console.log("CLEARNOTIFICATIONS_LANGUAGECHANGE")
  // console.log(setAllNotificationData([]))
  const currentDate = DateTime.now().toMillis();
  if(prevPage == "CountryLangChange" || prevPage == "DownloadUpdate" || prevPage == "ForceUpdate" || prevPage == "DownloadAllData") {
    dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
    dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    if(prevPage == 'ForceUpdate'){
      AsyncStorage.setItem('forceUpdateTime',forceupdatetime);
    }
  }
  if(prevPage == "PeriodicSync") {
    if(downloadWeeklyData == true)
    {
      dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
    }
    if(downloadMonthlyData == true)
    {
      dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    }
  }
  
  if(prevPage == 'DownloadAllData' || prevPage == 'ImportScreen' || prevPage == 'CountryLangChange'){
    const artresp = response.find((x:any)=> x.apiEndpoint == 'articles' && x.status == 200);
    if(artresp && artresp != {})
    {
      const artobj = oldErrorObj.find((x:any) => x.apiEndpoint == 'articles');
      if(artobj && artobj != {}){
        const storedata = store.getState();
        const childagearray = storedata.utilsData.taxonomy.allTaxonomyData  != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age:[];
        const artarray = artobj.postdata.childAge == 'all' ? childagearray.map(x=>x.id) : artobj.postdata.childAge.split(',').map(Number)
        console.log(artarray,"---childagearray--",childagearray);
        dispatch(setDownloadedBufferAgeBracket(artarray))
      }
    }
  }


  if(prevPage == 'CountryLangChange' || prevPage == 'ImportScreen'){
    const favverified = await userRealmCommon.verifyFavorites();
   // console.log("favverified---",favverified);
    dispatch(setDailyArticleGamesCategory({}));
    dispatch(setShowedDailyDataCategory({}));
    dispatch(setAllNotificationData([]));
    dispatch(setchatBotData([]));
    dispatch(setInfoModalOpened({key:'allDataDownloadFlag', value: false}));
    let notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    if(prevPage == 'CountryLangChange') {
      const apiresponse = await commonApiService(forceUpdateData[0].apiEndpoint,forceUpdateData[0].method,forceUpdateData[0].postdata);
      let forceUpdateTime = apiresponse && apiresponse.data && apiresponse.data.updated_at ? apiresponse.data.updated_at : '0';
      AsyncStorage.setItem('forceUpdateTime',forceUpdateTime);
    }
  }
  // deactivateKeepAwake();
  const storedata = store.getState();
  const errorObj = storedata.failedOnloadApiObjReducer.errorObj;
  // console.log("keep awake deactivated--",storedata.failedOnloadApiObjReducer.errorObj);
  let msgtext = '';
  response.map((x:any)=> {
      msgtext += x.apiEndpoint+" count "
      if(x.data != null && x.data != undefined && x.data?.data != null && x.data?.data != undefined){
        msgtext += Object.keys(x.data.data).length+`\n`;
      }else {
        msgtext +=  x.data.message+`\n`;
      }
  });
  // console.log("after---",msgtext);
  if(prevPage == 'DownloadUpdate' && errorObj?.length == 0) {
    Alert.alert(i18n.t('downloadUpdateSuccessPopupTitle'), i18n.t('downloadUpdateSuccessPopupText')+' '+msgtext,
      [
        { text:i18n.t('downloadUpdateSuccessOkBtn'), onPress: async () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeDrawerNavigator',
                  // params: {prevPage}
                },
              ],
            });
          }
        }
      ]
    );
  }
  else if(prevPage == 'DownloadAllData' && errorObj?.length == 0) {
    if(enableImageDownload){
      const allImagesucc = await downloadArticleImages();
        Alert.alert(i18n.t('downloadAllSuccessPopupTitle'), i18n.t('downloadAllSuccessPopupText')+' '+msgtext,
        [
          { text:i18n.t('downloadAllSuccessOkBtn'), onPress: async () => {
              dispatch(setInfoModalOpened({key:'allDataDownloadFlag', value: true}));
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeDrawerNavigator',
                    // params: {prevPage}
                  },
                ],
              });
            }
          }
        ]
      );
    }else {
        Alert.alert(i18n.t('downloadAllSuccessPopupTitle'), i18n.t('downloadAllSuccessPopupText')+' '+msgtext,
        [
          { text:i18n.t('downloadAllSuccessOkBtn'), onPress: async () => {
            dispatch(setInfoModalOpened({key:'allDataDownloadFlag', value: true}));
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeDrawerNavigator',
                    // params: {prevPage}
                  },
                ],
              });
            }
          }
        ]
      );
    }
        
  }
  else {
    Alert.alert(i18n.t('downloadUpdateSuccessPopupTitle'), i18n.t('downloadUpdateSuccessPopupText')+' '+msgtext,
      [
        { text:i18n.t('downloadUpdateSuccessOkBtn'), onPress: async () => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeDrawerNavigator',
                  // params: {prevPage}
                },
              ],
            });
          }
        }
      ]
    );
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'HomeDrawerNavigator',
    //       // params: {prevPage}
    //     },
    //   ],
    // });
  }
}
export const onHomeSurveyapiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string,activeChild: any, oldErrorObj:any) => {
 // console.log(response,"--oldErrorObj survey---",oldErrorObj);
  // const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  // console.log(allDatatoStore,"..allDatatoStore..")
  const resolvedPromises =  oldErrorObj.map(async (x:any) => {
      const allDatatoStore = await getAllDataOnRetryToStore(x.apiEndpoint,languageCode,dispatch,prevPage,activeChild);
      return allDatatoStore;
  });
  const results = await Promise.all(resolvedPromises);
  // deactivateKeepAwake();
 // console.log("survey done--",results);
}
export const downloadArticleImages = async() => {
  return new Promise(async (resolve, reject) => {
      let databaseData = await dataRealmCommon.getData<ArticleEntity>(ArticleEntitySchema);
      let databaseDataact = await dataRealmCommon.getData<ActivitiesEntity>(ActivitiesEntitySchema);
      let databaseDatabasicpg = await dataRealmCommon.getData<BasicPagesEntity>(BasicPagesSchema);
      let databaseDatapinnedCD = await dataRealmCommon.getData<PinnedChildDevelopmentEntity>(PinnedChildDevelopmentSchema);
      let databaseDatavideoart = await dataRealmCommon.getData<VideoArticleEntity>(VideoArticleEntitySchema);
      let imageArray: any[] = [];
      databaseData.map((x:any)=>{
        if(x.embedded_images && x.embedded_images.length > 0) {
          x.embedded_images.map((y:any)=>{
            if((y.split('https://')[1] || y.split('http://')[1])) {
              imageArray.push({uri:y})
            }
          });
          //console.log("hgdj23--",imageArray);
        }
        if(x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
          imageArray.push({uri:x.cover_image.url})
        }
      })
      databaseDataact.map((x:any)=>{
        if(x.embedded_images && x.embedded_images.length > 0) {
          x.embedded_images.map((y:any)=>{
            if((y.split('https://')[1] || y.split('http://')[1])) {
              imageArray.push({uri:y})
            }
          });
          // console.log("hgdj23--",imageArray);
        }
        if(x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
          imageArray.push({uri:x.cover_image.url})
        }
      })
      databaseDatabasicpg.map((x:any)=>{
        if(x.embedded_images && x.embedded_images.length > 0) {
          x.embedded_images.map((y:any)=>{
            if((y.split('https://')[1] || y.split('http://')[1])) {
              imageArray.push({uri:y})
            }
          });
          //console.log("hgdj23--",imageArray);
        }
        if(x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
          imageArray.push({uri:x.cover_image.url})
        }
      })
      databaseDatapinnedCD.map((x:any)=>{
        if(x.embedded_images && x.embedded_images.length > 0) {
          x.embedded_images.map((y:any)=>{
            if((y.split('https://')[1] || y.split('http://')[1])) {
              imageArray.push({uri:y})
            }
          });
          // console.log("hgdj23--",imageArray);
        }
        if(x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
          imageArray.push({uri:x.cover_image.url})
        }
      })
      databaseDatavideoart.map((x:any)=>{
        if(x.embedded_images && x.embedded_images.length > 0) {
          x.embedded_images.map((y:any)=>{
            if((y.split('https://')[1] || y.split('http://')[1])) {
              imageArray.push({uri:y})
            }
          });
          // console.log("hgdj23--",imageArray);
        }
        if(x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
          imageArray.push({uri:x.cover_image.url})
        }
      })
      
      // console.log(imageArray.length,"Imagearray212--",imageArray);
      FastImage.preload(imageArray,()=>{
        // console.log("in progress");
        //return 'success';
      },
      ()=>{
        // console.log("after complete")
        resolve('complete');
      })

    //   console.log("Imagearray212--",imageArray);
    //   var i: number,j, temporary, chunk = 10;
    //   const promises = [];
    //   for (i = 0,j = imageArray.length; i < j; i += chunk) {
    //     promises.push(new Promise((resolve) => {
    //         temporary = imageArray.slice(i, i + chunk);
    //         // do whatever
    //         FastImage.preload(temporary,()=>{
    //           console.log("in progress");
    //           //return 'success';
    //         },
    //         ()=>{
    //           console.log("after complete")
    //           resolve('complete');
    //         })
    //       }))
    //   }

    // const results = await Promise.all(promises);
    // console.log("promise all complete--",results);
      
  });
}
export const onApiFail = (error: any) => {
 // console.log(error, "..error..");

}
export const retryAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert(i18n.t('retryPopupTitle'), i18n.t('retryPopupText'),
      [
        {
          text: i18n.t('retryCancelPopUpBtn'),
          onPress: () => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text: i18n.t('retryRetryBtn'), onPress: () => resolve("Retry success") }
      ]
    );
  });
}
export const cancelRetryAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert(i18n.t('cancelRetryPopupTitle'), i18n.t('cancelPopupText'),
      [
        { text: i18n.t('cancelPopUpBtn'), onPress: () => resolve("cancelRetry success") }
      ]
    );
  });
}
export const retryAlert1 = (bandwidth: any,toggle: any) => {
  return new Promise((resolve, reject) => {
    if(bandwidth==1){
      bandwidth=i18n.t('lowBandwidth');
    }
    else{
      bandwidth=i18n.t('highBandwidth');
    }
    if(toggle==1){
      toggle= i18n.t('dataSaveron');
    }
    else{
      toggle= i18n.t('dataSaveroff');
    }
    //"Do you want to switch"+toggle+"data saver mode?"
    setTimeout(() => {
   // Alert.alert(bandwidth, i18n.t('dataSaver',{toggle:toggle}),
    Alert.alert(bandwidth,toggle,
      [
        {
          text: i18n.t('retryCancelPopUpBtn'),
          onPress: () => resolve("cancel"),
          style: "cancel"
        },
        { text: i18n.t('vcIsMeasuredOption1'), onPress: () => resolve("yes") }
      ]
    );
  },2500);
  });
}
export const deleteArticleNotPinned= async () => {
  let createresult = await dataRealmCommon.delete(ArticleEntitySchema.name, "isarticle_pinned!='1'");
  return createresult;
  // let createresult = await userRealmCommon.delete(ArticleEntitySchema, recordId, filterCondition);
}
export default commonApiService;
