
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

interface ArrayObj{data:any,apiEndpoint:any,status:any};
// let initialState:[] as ArrayObj[];
let errorarray: WritableDraft<[]> = [];
  export const sagaSlice = createSlice({
    name: 'sagaReducer',
    initialState:{
      errorObj:""
    },
    reducers: {
            
            receiveOnloadAPIFailure: (state, action) => {
              // console.log(state);
              // console.log("receiveOnloadAPIFailure--",action.payload);
              state.errorObj = JSON.stringify(action.payload);
            }
        }
    });
     export const {receiveOnloadAPIFailure} = sagaSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default sagaSlice.reducer;
