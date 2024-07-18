
import { appConfig } from "@assets/translations/appOfflineData/apiConstants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  data: null,
  error: null,
  errorObj: []
};
export const sagaSlice = createSlice({
  name: 'sagaReducer',
  initialState,
  reducers: {
    fetchAPIStart(state) {
      state.status = 'loading';
    },
    receiveAPISuccess(state, action) {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    receiveAPIFailure: (state, action):any => {
      action.payload.errorArr = action.payload.errorArr.filter((_item: any) => _item.apiEndpoint !== appConfig.surveys);
      //write code to check if element already in array.
      if (action.payload?.fromPage == "OnLoad") {
        state.errorObj = []
      }
      else if (action.payload?.fromPage == "Home") {
        if (action.payload?.errorArr?.length > 0) {
          state.errorObj = action.payload?.errorArr;
        } else {
          state.errorObj = []
        }
      } else {
        action.payload.errorArr.map((value: any) => {
          const i = state.errorObj.findIndex((_item:any) => _item.apiEndpoint === value.apiEndpoint);
          if (i == -1) {
            state.errorObj.push(value as never)
          }
        });
      }
    },
  }
});
export const { receiveAPIFailure, receiveAPISuccess,fetchAPIStart } = sagaSlice.actions;

export default sagaSlice.reducer;
