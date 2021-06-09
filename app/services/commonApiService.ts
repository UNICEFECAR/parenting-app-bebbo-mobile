import  RNFS  from 'react-native-fs';
import { appConfig } from './../types/apiConstants';

import axios, { AxiosResponse } from "axios";
import { SagaReturnType } from "redux-saga/effects";
import { RootState, useAppSelector } from "../../App";
import { commonApiInterface } from "../interface/interface";
import { finalUrl } from "../types/apiConstants";
import axiosService from "./axiosService";
import { store } from "../../App";
import ImageStorage from "../downloadImages/ImageStorage";
import { Alert } from "react-native";
import CountryLanguageConfirmation from '../screens/localization/CountryLanguageConfirmation';
import downloadImages from '../downloadImages/ImageStorage';

export const client =
  'https://raw.githubusercontent.com/UNICEFECAR/parent-buddy-mobile/master/src/translations/';
  
const commonApiService:commonApiInterface = async (apiEndpoint:string,methodname:any,postdata:object) => {
  //  console.log("apinameapiname")
//  console.log(apiname,methodname,postdata);
  const storedata = store.getState();
  console.log("store val--",storedata)

  let selectedLang,selectedCountry;
  selectedCountry = storedata.selectedCountry.countryId;
  selectedLang = storedata.selectedCountry.languageCode;
    let newurl = finalUrl(apiEndpoint,selectedCountry,selectedLang)
    console.log("newurl--",newurl);
   let responseData:any = {};
   responseData.apiEndpoint = apiEndpoint;
    return await  axiosService({
    method:methodname,
    url:newurl,
    params: postdata
    })
    .then((response: any) => {
     console.log("successsssss");
    //  console.log(response.data);
    responseData.data = response.data,
    responseData.status = response.status
      return responseData;
    // return response;
    })
    .catch((err: any) => {
      console.log("errcodeee");
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
  export const onApiSuccess=async (response:any)=>{
    console.log(response,"..response..");
    response=response[0];
  if(response.apiEndpoint==appConfig.sponsors){
    const ImageArray=[{
      srcUrl: 'http://parentbuddy2fz6bm64mba.devcloud.acquia-sites.com/sites/default/files/2021-06/flag-round-250.png',
      destFolder: RNFS.DocumentDirectoryPath + '/content',
      destFilename: 'countryFlag.png',
    }]
    const imagesDownloadResult = await downloadImages(ImageArray);
   console.log(imagesDownloadResult,"..image result..")
    // const country= new CountryLanguageConfirmation();
    // country.dispatchSponsars();
  }
  }
  export const onApiFail=(error:any)=>{
    console.log(error,"..error..");
  
  }
  export const retryAlert=()=>{
    return new Promise((resolve, reject) => {
      Alert.alert('Retry',"All content is not downloaded.Please Retry.",
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
 
  export default commonApiService;
