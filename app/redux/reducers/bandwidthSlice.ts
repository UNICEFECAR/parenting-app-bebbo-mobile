import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface networkType {
  lowbandWidth:boolean
}
const initialState: networkType = {
  lowbandWidth:false
};

export const bandWidthSlice = createSlice({
  name: 'bandWidthData',
  initialState,
  reducers: {
    onNetworkStateChange: (state, action: PayloadAction<any>) => {
         state.lowbandWidth=action.payload;      
    }
  }
});

export const {onNetworkStateChange} = bandWidthSlice.actions;
export default bandWidthSlice.reducer;
