import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface childDataType {
  // name: string;
  childDataSet: { 
    allChild: string;
    activeChild:string;
  }
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: childDataType = {
  // name: 'Rest of the world',
  childDataSet: { 
    allChild: '',
    activeChild:''
  }
};
export const childSlice = createSlice({
  name: 'childData',
  initialState,
  reducers: {
    setActiveChildData: (
      state,
      action: PayloadAction<any>,
    ) => {
    //  console.log("child data---",state);
    // console.log("child data length---",action.payload);
      (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
      (typeof action.payload == 'object') ? state.childDataSet.activeChild = JSON.stringify(action.payload) : state.childDataSet.activeChild = action.payload;
     
    },
    setAllChildData: (
      state,
      action: PayloadAction<any>,
    ) => {
    //  console.log("child data---",state);
    // console.log("child data length---",action.payload);
      (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
      (typeof action.payload == 'object') ? state.childDataSet.allChild = JSON.stringify(action.payload) : state.childDataSet.allChild = action.payload;
     
    },
    removeChild: (
      state,
      action: PayloadAction<any>,
    ) => {

     //  console.log("before child data---",state.childDataSet.allChild);
      // console.log(typeof action.payload);
      // console.log(typeof state.childDataSet.allChild);
      state.childDataSet.allChild != '' ? JSON.parse(state.childDataSet.allChild).splice(action.payload, 1) : state.childDataSet.allChild;
     // console.log(state.childDataSet.allChild,"before--------");
      (typeof state.childDataSet.allChild == 'object') ? state.childDataSet.allChild = JSON.stringify(state.childDataSet.allChild) : state.childDataSet.allChild;
    //  console.log(state.childDataSet.allChild,"after--------");
    }
  },
  
});

export const {setAllChildData,removeChild,setActiveChildData} = childSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default childSlice.reducer;
