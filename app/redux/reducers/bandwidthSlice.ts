import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NetworkType {
  lowbandWidth:boolean;
}
const initialState: NetworkType = {
  lowbandWidth:false
};

export const bandWidthSlice = createSlice({
  name: 'bandWidthData',
  initialState,
  reducers: {
    onNetworkStateChange: (state, action: PayloadAction<any>):any => {
         state.lowbandWidth=action.payload;      
    }
  }
});

export const {onNetworkStateChange} = bandWidthSlice.actions;
export default bandWidthSlice.reducer;
