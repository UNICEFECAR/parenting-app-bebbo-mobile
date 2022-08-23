import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface variableDataType {
    variableData:string;
}
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
      state.variableData=JSON.stringify(action.payload);
    }
  },
  
});

export const {getVariableData} = variableSlice.actions;
export default variableSlice.reducer;
