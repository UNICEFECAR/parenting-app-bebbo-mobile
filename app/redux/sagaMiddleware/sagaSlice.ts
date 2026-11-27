
import { appConfig } from "../../instances";
import { createSlice } from "@reduxjs/toolkit";

// Include parameters: a failed full download must survive a successful delta request.
const requestKey = (request: any): string => JSON.stringify([
  request.apiEndpoint, request.method,
  Object.entries(request.postdata || {}).sort(([a], [b]) => a.localeCompare(b)),
  request.saveinDB,
]);

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
      const {errorArr = [], attempted = [], fromPage} = action.payload;
      // Explicit reset is reserved for changing the content language.
      if (fromPage === "OnLoad" && errorArr.length === 0) {
        state.errorObj = [];
        return;
      }
      const failed = errorArr.filter((item: any) => item.apiEndpoint !== appConfig.apiConfig.surveys);
      const succeeded = attempted.filter((item: any) =>
        !failed.some((failure: any) => requestKey(failure) === requestKey(item)));
      state.errorObj = state.errorObj.filter((item: any) =>
        !succeeded.some((success: any) => requestKey(success) === requestKey(item)));
      for (const item of failed) {
        if (!state.errorObj.some((pending: any) => requestKey(pending) === requestKey(item))) {
          state.errorObj.push(item as never);
        }
      }
    },
  }
});
export const { receiveAPIFailure, receiveAPISuccess,fetchAPIStart } = sagaSlice.actions;

export default sagaSlice.reducer;
