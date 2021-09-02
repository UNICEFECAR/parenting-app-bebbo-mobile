import { ConfigSettingsEntity, ConfigSettingsSchema } from './../database/schema/ConfigSettingsSchema';

import { userRealmCommon } from './../database/dbquery/userRealmCommon';
import RNFS from 'react-native-fs';
import { appConfig } from '../assets/translations/appOfflineData/apiConstants';

import axios, { AxiosResponse } from "axios";
import { SagaReturnType } from "redux-saga/effects";
import { RootState, useAppSelector } from "../../App";
import { commonApiInterface } from "../interface/interface";
import { finalUrl } from "../assets/translations/appOfflineData/apiConstants";
import axiosService from "./axiosService";
import { store } from "../../App";
import ImageStorage from "../downloadImages/ImageStorage";
import { Alert } from "react-native";
import CountryLanguageConfirmation from '../screens/localization/CountryLanguageConfirmation';
import downloadImages from '../downloadImages/ImageStorage';
import { setSponsorStore } from '../redux/reducers/localizationSlice';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import getAllDataToStore, { getAllDataOnRetryToStore } from '@assets/translations/appOfflineData/getDataToStore';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { receiveAPIFailure } from '../redux/sagaMiddleware/sagaSlice';
import i18n from 'i18next';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { CommonActions } from '@react-navigation/native';

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
     // console.log("errcodeee");
      responseData.data = err.message
      responseData.status = err.response.status;
      return responseData;
      // if (err.code == 'ECONNABORTED' || err.message == 'Network Error') {
      //  return null;
      // } else {
      //    return null;
      // }
    });
}
export const onAddEditChildSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage:string,activeChild: any) => {
 response = response[0];
 console.log(response,"..resonse..");
 navigation.navigate('ChildProfileScreen');
 if(response.data && response.data.status && response.data.status == 200)
 {
 let insertData = response.data.data;
 let Entity:any;
  Entity=Entity as ArticleEntity;
  let EntitySchema = ArticleEntitySchema;
  let pinnedArticle = "";
  //let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
//   try{
//     // let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
//     // console.log(createresult,"..createresult..");
//     // // const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage,activeChild);
//     // console.log(allDatatoStore,"..allDatatoStore..")
//     // console.log(new Date(),"in insert success---",response);
//     navigation.navigate('ChildProfileScreen');
// }
// catch(e) {
//     let errorArr = [];
//     console.log("in insert catch---",response);
//     errorArr.push(response);
//     navigation.navigate('ChildProfileScreen');
//     dispatch(receiveAPIFailure(errorArr));
// }
 }
 
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

  if (response[0].apiEndpoint == appConfig.sponsors) {
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

    
      console.log(sponsarsObj, "..sponsarsObj..");
      dispatch(setSponsorStore(sponsarsObj));
    }
    // const country= new CountryLanguageConfirmation();
    // country.dispatchSponsors();
  }
  console.log("in commonapi sponsor ---", response);
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
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
  console.log("in commonapi onOnLoadApiSuccess ---", response);
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  let allJsonData =await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  if (allJsonData?.length>0) {
    navigation.navigate('ChildSetupList');
  }
  else {
    navigation.navigate('ChildSetup');
  }
}
export const onChildSetuppiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string,activeChild: any) => {
  // navigation.navigate('HomeDrawerNavigator');
  console.log("in commonapi onChildSetuppiSuccess ---", response);
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage,activeChild);
  // console.log(allDatatoStore,"..allDatatoStore..")
  navigation.reset({
    index: 0,
    routes: [
      {
        name: 'HomeDrawerNavigator',
      },
    ],
  });
}
export const onHomeapiSuccess = async (response: any, dispatch: any, navigation: any,languageCode: string,prevPage: string,activeChild: any, oldErrorObj:any) => {
  // navigation.navigate('HomeDrawerNavigator');
  console.log(response,"--oldErrorObj---",oldErrorObj);
  // const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage);
  // console.log(allDatatoStore,"..allDatatoStore..")
  const resolvedPromises =  oldErrorObj.map(async (x:any) => {
      if(x.apiEndpoint == appConfig.sponsors){
        const sponsorresp = response.filter((y:any)=>y.apiEndpoint == appConfig.sponsors);
        const sponsorrespnew = sponsorresp ? sponsorresp[0] : [];
        if(sponsorrespnew.data && sponsorrespnew.data.status && sponsorrespnew.data.status == 200)
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
  const results = await Promise.all(resolvedPromises);
  console.log("done--",results);
  // navigation.setParams({fromPage:'Loading'});
  dispatch(setInfoModalOpened({key:'showDownloadPopup', value: false}));
  // navigation.reset({
  //   index: 0,
  //   routes: [
  //     {
  //       name: 'HomeDrawerNavigator',
  //       // params: {prevPage}
  //     },
  //   ],
  // });
  // navigation.dispatch(
  //   CommonActions.reset({
  //     index: 0,
  //     routes: [
  //       // { name: 'Home' },
  //       {
  //         name: 'HomeDrawerNavigator',
  //         params: { prevPage: prevPage },
  //       },
  //     ],
  //   })
  // );
  navigation.navigate('Home',
    {
      screen:"Home",
      params:{prevPage:prevPage},
    });
}
export const onApiFail = (error: any) => {
  console.log(error, "..error..");

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
export const retryAlert1 = (bandwidth: string,toggle: string) => {
  return new Promise((resolve, reject) => {
    Alert.alert(bandwidth, "Do you want to switch"+toggle+"data saver mode?",
      [
        {
          text: "cancel",
          onPress: () => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text:"yes", onPress: () => resolve("yes") }
      ]
    );
  });
}
export const deleteArticleNotPinned= async () => {
  let createresult = await dataRealmCommon.delete(ArticleEntitySchema.name, "isarticle_pinned!='1'");
  return createresult;
  // let createresult = await userRealmCommon.delete(ArticleEntitySchema, recordId, filterCondition);
}
export default commonApiService;
