import {createSlice, PayloadAction} from '@reduxjs/toolkit';
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
  },
  terms:{
    id:string;
    title:string;
    body:string;
  },
  privacypolicy:{
    id:string;
    title:string;
    body:string;
  }
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
  },
  terms:{
    id:'',
    title:'',
    body:'',
  },
  privacypolicy:{
    id:'',
    title:'',
    body:'',
  }
};
export const utilsSlice = createSlice({
  name: 'utilsData',
  initialState,
  reducers: {
    setAllTaxonomyData: (
      state,
      action: PayloadAction<any>,
    ) => {
      console.log("taxonomy data---",state);
      console.log(action.payload);
      if(action.payload[0])
      {
        state.taxonomy.allTaxonomyData = action.payload[0].allData;
        state.taxonomy.languageCode = action.payload[0].langCode;
        state.taxonomy.standardDevData = action.payload[0].standardDevData;
      }
    },
    setAllTermsData: (
      state,
      action: PayloadAction<any>,
    ) => {
      console.log("setAllTermsData data---",state);
      console.log(action.payload);
      if(action.payload[0])
      {
        state.aboutus.id = action.payload[0].id;
        state.aboutus.title = action.payload[0].title;
        state.aboutus.body = action.payload[0].body;
      }
      if(action.payload[1])
      {
        state.terms.id = action.payload[0].id;
        state.terms.title = action.payload[0].title;
        state.terms.body = action.payload[0].body;
      }
      if(action.payload[2])
      {
        state.privacypolicy.id = action.payload[0].id;
        state.privacypolicy.title = action.payload[0].title;
        state.privacypolicy.body = action.payload[0].body;
      }
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

export const {setAllTaxonomyData,setAllTermsData} = utilsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default utilsSlice.reducer;
