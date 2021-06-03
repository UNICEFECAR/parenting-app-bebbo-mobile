import axios, { AxiosResponse } from "axios";
import { SagaReturnType } from "redux-saga/effects";
import { RootState, useAppSelector } from "../../App";
import { commonApiInterface } from "../interface/interface";
import { finalUrl } from "../types/apiConstants";
import axiosService from "./axiosService";
import { store } from "../../App";

export const client =
  'https://raw.githubusercontent.com/UNICEFECAR/parent-buddy-mobile/master/src/translations/';
  
const commonApiService:commonApiInterface = async (apiEndpoint:string,methodname:any,postdata:object) => {
  //  console.log("apinameapiname")
//  console.log(apiname,methodname,postdata);
  const storedata = store.getState();
  console.log("store val--",storedata)

  let selectedLang,selectedCountry;
  if(storedata.selectedCountry.callingCode == 0)
  {
      selectedCountry = 1;
  }
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

  export default commonApiService;
