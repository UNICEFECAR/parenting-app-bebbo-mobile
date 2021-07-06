import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface variableDataType {
    variableData:string;
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: variableDataType = {
  variableData:''
};
export const variableSlice = createSlice({
  name: 'variableData',
  initialState,
  reducers: {
    getVariableData: (
      state,
      action: PayloadAction<any>,
    ) => {
     // console.log("action.payload",action.payload);
      state.variableData=JSON.stringify(action.payload);
    }
  },
  
});

export const {getVariableData} = variableSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default variableSlice.reducer;
