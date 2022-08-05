
import { appConfig } from "@assets/translations/appOfflineData/apiConstants";
import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

// interface ArrayObj { data: any, apiEndpoint: any, status: any };
// let errorarray: WritableDraft<[]> = [];
export const sagaSlice = createSlice({
  name: 'sagaReducer',
  initialState: {
    errorObj: []
  },
  reducers: {
    receiveAPIFailure: (state, action) => {
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
          const i = state.errorObj.findIndex(_item => _item.apiEndpoint === value.apiEndpoint);
          if (i == -1) {
            state.errorObj.push(value)
          }
        });
      }
    }
  }
});
export const { receiveAPIFailure } = sagaSlice.actions;

export default sagaSlice.reducer;
