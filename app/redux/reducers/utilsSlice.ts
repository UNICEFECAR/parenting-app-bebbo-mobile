import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { basicPagesUniqueName } from '@types/apiConstants';
// import {RootState} from './../../../App';

interface hardcodedDataType {
  // name: string;
  taxonomy: { 
    allTaxonomyData: string;
    languageCode: string;
    standardDevData: string;
  },
  aboutus:{
    id:string;
    title:string;
    body:string;
    unique_name:string;
  },
  terms:{
    id:string;
    title:string;
    body:string;
    unique_name:string;
  },
  privacypolicy:{
    id:string;
    title:string;
    body:string;
    unique_name:string;
  },
  IsWeightModalOpened:boolean,
  IsHeightModalOpened:boolean,
  IsArticleModalOpened:boolean,
  dailymessages:string,
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: hardcodedDataType = {
  // name: 'Rest of the world',
  taxonomy: { 
    allTaxonomyData: '',
    languageCode: 'en',
    standardDevData: '',
  },
  aboutus:{
    id:'',
    title:'',
    body:'',
    unique_name:''
  },
  terms:{
    id:'',
    title:'',
    body:'',
    unique_name:''
  },
  privacypolicy:{
    id:'',
    title:'',
    body:'',
    unique_name:''
  },
  IsWeightModalOpened:true,
  IsHeightModalOpened:true,
  IsArticleModalOpened:true,
  dailymessages:''
};
export const utilsSlice = createSlice({
  name: 'utilsData',
  initialState,
  reducers: {
    setDailyMessagesData:(  state,
      action: PayloadAction<any>,)=>{
        console.log(action.payload,"actionpayload");
        (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
        if(action.payload.length>0)
        {
          state.dailymessages = (typeof action.payload == 'object') ? (JSON.stringify(action.payload)) : (action.payload);
        }
          // console.log("dailyMessages data---",state);
          // const allDailyMessages = action.payload;
          // let allRecords = allDailyMessages
          // //console.log(allRecords,"allDailyMessages");
          // state.dailymessages =allRecords;
          // (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
          // console.log(state);
          // state.dailymessages = action.payload[0];
          // action.payload.map((x:any)=> {
          //  console.log(x.id,x.title)
          // })
    //  console.log(action.payload,action.payload[0],"--",typeof action.payload);
    //     if(action.payload[0])
    //     {
    //     state.dailymessages = (typeof action.payload[0].dailyMessages == 'object') ? (JSON.stringify(action.payload[0].dailyMessages)) : (action.payload[0].dailyMessages);
    //     }
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
        state.taxonomy.standardDevData = (typeof action.payload[0].standardDevData == 'object') ? (JSON.stringify(action.payload[0].standardDevData)) : (action.payload[0].standardDevData);
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
      }
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

export const {setAllTaxonomyData,setAllTermsData,setInfoModalOpened,setDailyMessagesData} = utilsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default utilsSlice.reducer;
