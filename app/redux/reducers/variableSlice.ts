import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface VariableDataType {
    variableData:string;
}
const initialState: VariableDataType = {
  variableData:''
};
export const variableSlice = createSlice({
  name: 'variableData',
  initialState,
  reducers: {
    getVariableData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.variableData=JSON.stringify(action.payload);
    }
  },
  
});

export const {getVariableData} = variableSlice.actions;
export default variableSlice.reducer;
