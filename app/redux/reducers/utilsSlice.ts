import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface selectedLocalizationType {
  // name: string;
  allTaxonomyData: string;
  languageCode: string;
  standardDevData: string;
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: selectedLocalizationType = {
  // name: 'Rest of the world',
  allTaxonomyData: '',
  languageCode: 'en',
  standardDevData: '',
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
        state.allTaxonomyData = action.payload[0].allData;
        state.languageCode = action.payload[0].langCode;
      }
      // state.countryId = action.payload.countryId;
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

export const {setAllTaxonomyData} = utilsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default utilsSlice.reducer;
