
import axios, { AxiosResponse } from "axios";
import { SagaReturnType } from "redux-saga/effects";
import { RootState, useAppSelector } from "../../App";
import { commonApiInterface } from "../interface/interface";
import { finalUrl } from "../types/apiConstants";
import axiosService from "./axiosService";
import { store } from "../../App";
import ImageStorage from "../downloadImages/ImageStorage";

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
  export const onApiSuccess=(response:any)=>{
    console.log(response,"..response..");
    ImageStorage(response);
  }
  export const onApiFail=(error:any)=>{
    console.log(error,"..error..");
  
  }
  export const onRetryAlert=(data:any)=>{
    console.log(data,"..data..");
  
  }
  export default commonApiService;
