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
import getAllDataToStore from '@assets/translations/appOfflineData/getDataToStore';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { receiveAPIFailure } from '../redux/sagaMiddleware/sagaSlice';

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
 console.log(response,"..resonse..")
 if(response.data && response.data.status && response.data.status == 200)
 {
 let insertData = response.data.data;
 let Entity:any;
  Entity=Entity as ArticleEntity;
  let EntitySchema = ArticleEntitySchema;
  let pinnedArticle = "";
  //let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
  try{
    let createresult = await dataRealmCommon.createArticles<typeof Entity>(EntitySchema, insertData,pinnedArticle);
    console.log(createresult,"..createresult..");
    // const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage,activeChild);
    // console.log(allDatatoStore,"..allDatatoStore..")
    // console.log(new Date(),"in insert success---",response);
    navigation.navigate('ChildProfileScreen');
}
catch(e) {
    let errorArr = [];
    console.log("in insert catch---",response);
    errorArr.push(response);
    navigation.navigate('ChildProfileScreen');
    dispatch(receiveAPIFailure(errorArr));

}
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
      const ImageArray = [];
      // let obj=[];
      // type:val.type,title:val.title,id:val.id,
      const sponsorObj = response.data.data.map((val: any) => {
        return ({ country_flag: { srcUrl: val['country_flag'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_flag'].name } })
      })
      const partnerObj = response.data.data.map((val: any) => {
        return ({ country_sponsor_logo: { srcUrl: val['country_sponsor_logo'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_sponsor_logo'].name } })
      })
      const logoObj = response.data.data.map((val: any) => {
        return ({ country_national_partner: { srcUrl: val['country_national_partner'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_national_partner'].name } })
      })
      ImageArray.push(logoObj[0].country_national_partner)
      ImageArray.push(partnerObj[0].country_sponsor_logo)
      ImageArray.push(sponsorObj[0].country_flag)

      const imagesDownloadResult = await downloadImages(ImageArray);
    // console.log(imagesDownloadResult, "..image result..");
      dispatch(setSponsorStore(imagesDownloadResult));
    }
    // const country= new CountryLanguageConfirmation();
    // country.dispatchSponsors();
  }
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
  const allDatatoStore = await getAllDataToStore(languageCode,dispatch,prevPage,activeChild);
  console.log(allDatatoStore,"..allDatatoStore..")
  navigation.reset({
    index: 0,
    routes: [
      {
        name: 'HomeDrawerNavigator',
      },
    ],
  });
}
export const onApiFail = (error: any) => {
  console.log(error, "..error..");

}
export const retryAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert('Retry', "All content is not downloaded.Please Retry.",
      [
        {
          text: "Cancel",
          onPress: () => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text: "Retry", onPress: () => resolve("Retry success") }
      ]
    );
  });
}

export const cancelRetryAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert('Warning', "Data is not downloaded and app will use offline data.",
      [
        { text: "OK", onPress: () => resolve("cancelRetry success") }
      ]
    );
  });
}

export default commonApiService;
