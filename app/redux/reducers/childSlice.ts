import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { store } from '../../../App';
// import {RootState} from './../../../App';
import analytics from '@react-native-firebase/analytics';
interface childDataType {
  // name: string;
  childDataSet: { 
    allChild: string;
    activeChild:string;
    bufferAgeBracket:Array<any>;
    favoriteadvices:Array<any>;
    favoritegames:Array<any>;
    chatBotData:string;
  }
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: childDataType = {
  // name: 'Rest of the world',
  childDataSet: { 
    allChild: '',
    activeChild:'',
    bufferAgeBracket:[],
    favoriteadvices:[],
    favoritegames:[],
    chatBotData:''
  }
};
function stringifyWithFunctions(object: any) {
  return JSON.stringify(object, (key, val) => {
    if (typeof val === 'function') {
      return `(${val})`; // make it a string, surround it by parenthesis to ensure we can revive it as an anonymous function
    }
    return val;
  });
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
    },
    setDownloadedBufferAgeBracket: (
      state,
      action: PayloadAction<any>,
    ) => {
    // console.log("bufferAgeBracket",action.payload.length);
    //console.log("state.bufferAgeBracket---",state.childDataSet.bufferAgeBracket);
      // state.bufferAgeBracket = action.payload;
      // if(state.childDataSet.bufferAgeBracket)
      // {
        if(action.payload.length > 0)
        {
          action.payload.map((value:any)=>{
            const i = state.childDataSet.bufferAgeBracket.findIndex(_item => _item === value);
            if(i == -1){
              state.childDataSet.bufferAgeBracket.push(value) 
            }
          });
        }else {
          state.childDataSet.bufferAgeBracket = [];
        }
      // }else {
      //   state.childDataSet.bufferAgeBracket = action.payload;
      // }
     
    },
    setFavouriteAdvices: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.childDataSet.favoriteadvices = action.payload;
    },
    setFavouriteGames: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.childDataSet.favoritegames = action.payload;
    },
    setchatBotData: (
      state,
      action: PayloadAction<any>,
    ) => {
      // console.log("stringifyWithFunctions----",stringifyWithFunctions(action.payload));
      state.childDataSet.chatBotData = stringifyWithFunctions(action.payload);
    },
  },
  
});

export const {setAllChildData,removeChild,setActiveChildData, setDownloadedBufferAgeBracket, setFavouriteAdvices, setFavouriteGames,setchatBotData} = childSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default childSlice.reducer;
