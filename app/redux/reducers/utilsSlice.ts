import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { basicPagesUniqueName } from '@assets/translations/appOfflineData/apiConstants';
// import {RootState} from './../../../App';

interface hardcodedDataType {
  // name: string;
  acceptTerms:boolean,
  userIsOnboarded:boolean,
  taxonomy: { 
    allTaxonomyData: string;
    languageCode: string;
    // standardDevData: string;
  },
  aboutus:{
    id:number;
    title:string;
    body:string;
    unique_name:string;
  },
  terms:{
    id:number;
    title:string;
    body:string;
    unique_name:string;
  },
  privacypolicy:{
    id:number;
    title:string;
    body:string;
    unique_name:string;
  },
  weight_for_height:string,
  height_for_age:string,
  IsWeightModalOpened:boolean,
  IsHeightModalOpened:boolean,
  IsArticleModalOpened:boolean,
  IsActivityModalOpened:boolean,
  IsChildDevModalOpened:boolean,
  showDownloadPopup:boolean,
  dailymessages:string,
  vaccineData:{
    id: number,
    type: string,
    title: string,
    pinned_article: number,
    growth_period: number,
    created_at: string,
    updated_at: string
  }
  healthCheckupsData:{
    id: number,
    type: string,
    title: string,
    pinned_article: number,
    growth_period: number,
    created_at: string,
    updated_at: string
  },
  ChildDevData:{
    id: number,
    type: string,
    title: string,
    child_age: number[],
    boy_video_article: number,
    girl_video_article: number,
    milestone: string,
    created_at: string,
    updated_at: string,
    mandatory: number
  },
  PinnedChildDevData:{},
  MileStonesData:{},
  VideoArticlesData:{},
  ActivitiesData:{},
  surveryData:{},

}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: hardcodedDataType = {
  // name: 'Rest of the world',
  acceptTerms:false,
  userIsOnboarded:false,
  taxonomy: { 
    allTaxonomyData: '',
    languageCode: 'en',
    // standardDevData: '',
  },
  aboutus:{
    id:0,
    title:'',
    body:'',
    unique_name:''
  },
  terms:{
    id:0,
    title:'',
    body:'',
    unique_name:''
  },
  privacypolicy:{
    id:0,
    title:'',
    body:'',
    unique_name:''
  },
  weight_for_height:'',
  height_for_age:'',
  IsWeightModalOpened:true,
  IsHeightModalOpened:true,
  IsArticleModalOpened:true,
  IsActivityModalOpened:true,
  IsChildDevModalOpened:true,
  showDownloadPopup:true,
  dailymessages:'',
  vaccineData:{
    id: 0,
    type: '',
    title: '',
    pinned_article: 0,
    growth_period: 0,
    created_at: '',
    updated_at: ''
  },
  healthCheckupsData:{
    id: 0,
    type: '',
    title: '',
    pinned_article: 0,
    growth_period: 0,
    created_at: '',
    updated_at: ''
  },

  ChildDevData:{
    id: 0,
    type: '',
    title: '',
    child_age: [],
    boy_video_article: 0,
    girl_video_article: 0,
    milestone: '',
    created_at: '',
    updated_at: '',
    mandatory: 0
  },
  PinnedChildDevData:{},
  MileStonesData:{},
  VideoArticlesData:{},
  ActivitiesData:{},
  surveryData:{},
};
export const utilsSlice = createSlice({
  name: 'utilsData',
  initialState,
  reducers: {
    setAcceptTerms:(  state,
      action: PayloadAction<any>,)=>{
        console.log(action.payload,"actionpayload setAcceptTerms");
          state.acceptTerms = action.payload;
    },
    setuserIsOnboarded:(  state,
      action: PayloadAction<any>,)=>{
        console.log(action.payload,"actionpayload setuserIsOnboarded");
          state.userIsOnboarded = action.payload;
    },
    setDailyMessagesData:(  state,
      action: PayloadAction<any>,)=>{
        // console.log(action.payload,"actionpayload");
        (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
        if(action.payload.length>0)
        {
          state.dailymessages = (typeof action.payload == 'object') ? (JSON.stringify(action.payload)) : (action.payload);
        }
    },
    setAllTaxonomyData: (
      state,
      action: PayloadAction<any>,
    ) => {
     // console.log("taxonomy data---",state);
     // console.log(action.payload[0],"--",typeof action.payload);
      (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
    //  console.log(action.payload[0],"-- after",typeof action.payload);
      if(action.payload[0])
      {
        state.taxonomy.allTaxonomyData = (typeof action.payload[0].allData == 'object') ? (JSON.stringify(action.payload[0].allData)) : (action.payload[0].allData);
        state.taxonomy.languageCode = action.payload[0].langCode;
        // state.taxonomy.standardDevData = (typeof action.payload[0].standardDevData == 'object') ? (JSON.stringify(action.payload[0].standardDevData)) : (action.payload[0].standardDevData);
      }
    },
    setAllTermsData: (
      state,
      action: PayloadAction<any>,
    ) => {
    //  console.log("setAllTermsData data---",state);
     // console.log(action.payload);
     (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
     action.payload.map((x:any)=> {
        if(x.unique_name == basicPagesUniqueName.aboutus)
        {
          state.aboutus.id = x.id;
          state.aboutus.title = x.title;
          state.aboutus.body = x.body;
          state.aboutus.unique_name = x.unique_name;
        }else if(x.unique_name == basicPagesUniqueName.terms)
        {
          state.terms.id = x.id;
          state.terms.title = x.title;
          state.terms.body = x.body;
          state.terms.unique_name = x.unique_name;
        }
        else if(x.unique_name == basicPagesUniqueName.privacypolicy)
        {
          state.privacypolicy.id = x.id;
          state.privacypolicy.title = x.title;
          state.privacypolicy.body = x.body;
          state.privacypolicy.unique_name = x.unique_name;
        }
     })
      
    },
    setInfoModalOpened:( state:any,
      action: PayloadAction<any>,)=>{
        state[action.payload.key]=action.payload.value;
      },
      setStandardDevWFHData: (
        state,
        action: PayloadAction<any>,
      ) => {
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.weight_for_height = action.payload;
      },
      setStandardDevHFAData: (
        state,
        action: PayloadAction<any>,
      ) => {
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.height_for_age = action.payload;
      },
      setAllVaccineData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllVaccineData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.vaccineData = action.payload;
      },
      setAllHealthCheckupsData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllHealthCheckupsData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.healthCheckupsData = action.payload;
      },
      setAllChildDevData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllChildDevData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.ChildDevData = action.payload;
      },
      setAllPinnedChildDevData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllPinnedChildDevData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.PinnedChildDevData = action.payload;
      },
      setAllMileStonesData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllMileStonesData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.MileStonesData = action.payload;
      },
      setAllVideoArticlesData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllVideoArticlesData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.VideoArticlesData = action.payload;
      },
      setAllActivitiesData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllActivitiesData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.ActivitiesData = action.payload;
      },
      setAllSurveyData: (
        state,
        action: PayloadAction<any>,
      ) => {
        // console.log(action.payload,"setAllSurveyData");
       (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.surveryData = action.payload;
      },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value = action.payload;
  //     });
  // },
});

export const {setAcceptTerms,setuserIsOnboarded,setAllTaxonomyData,setAllTermsData,setInfoModalOpened,setDailyMessagesData,setStandardDevWFHData,setStandardDevHFAData,setAllVaccineData,setAllHealthCheckupsData,setAllChildDevData,setAllPinnedChildDevData,setAllMileStonesData,setAllVideoArticlesData,setAllActivitiesData,setAllSurveyData} = utilsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default utilsSlice.reducer;
