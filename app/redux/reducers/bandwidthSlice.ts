import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface networkType {
  // name: string;
  lowbandWidth:boolean
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: networkType = {
  lowbandWidth:false
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = createAsyncThunk<
//   number,
//   number,
//   {state: {counter: CounterState}}
// >('counter/fetchCount', async (amount: number, {getState}) => {
//   const {value} = getState().counter;
//   const response = await fetchCount(value, amount);
//   return response.data;
// });

export const bandWidthSlice = createSlice({
  name: 'bandWidthData',
  initialState,
  reducers: {
    // getAllLocalizationData: (state) => {
    //   state = localization;
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   // state.value += 1;
    // },
    onNetworkStateChange: (state, action: PayloadAction<any>) => {
        console.log(action.payload,"..action.payload..");
         state.lowbandWidth=action.payload;
        // state.networkState=action.payload.networkState;
        // state.connectionStrength=action.payload.connectionStrength
      
    }
  }
});

export const {onNetworkStateChange} = bandWidthSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default bandWidthSlice.reducer;
