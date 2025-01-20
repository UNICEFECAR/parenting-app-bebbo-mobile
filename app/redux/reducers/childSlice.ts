import {createSlice, PayloadAction} from '@reduxjs/toolkit';
interface ChildDataType {
  childDataSet: { 
    allChild: string;
    activeChild:string;
    bufferAgeBracket:Array<any>;
    favoriteadvices:Array<any>;
    favoritegames:Array<any>;
    chatBotData:string;
  };
}
const initialState: ChildDataType = {
  childDataSet: { 
    allChild: '',
    activeChild:'',
    bufferAgeBracket:[],
    favoriteadvices:[],
    favoritegames:[],
    chatBotData:''
  }
};
function stringifyWithFunctions(object: any):any {
  return JSON.stringify(object, (key, val) => {
    if (typeof val === 'function') {
      return `(${val})`; // make it a string, surround it by parenthesis to ensure we can revive it as an anonymous function
    }
    return val;
  });
}
export const childSlice = createSlice({
  name: 'childData',
  initialState,
  reducers: {
    setActiveChildData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
      (typeof action.payload == 'object') ? state.childDataSet.activeChild = JSON.stringify(action.payload) : state.childDataSet.activeChild = action.payload;

    },
    setAllChildData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      (typeof action.payload == 'string') ? (action.payload = JSON.parse(action.payload)) : null;
      (typeof action.payload == 'object') ? state.childDataSet.allChild = JSON.stringify(action.payload) : state.childDataSet.allChild = action.payload;
      console.log('setAllChildData for all', action.payload)
    },
    removeChild: (
      state,
      action: PayloadAction<any>,
    ):any => {

      state.childDataSet.allChild != '' ? JSON.parse(state.childDataSet.allChild).splice(action.payload, 1) : state.childDataSet.allChild;
      (typeof state.childDataSet.allChild == 'object') ? state.childDataSet.allChild = JSON.stringify(state.childDataSet.allChild) : state.childDataSet.allChild;
    },
    setDownloadedBufferAgeBracket: (
      state,
      action: PayloadAction<any>,
    ):any => {
        state.childDataSet.bufferAgeBracket = action.payload;     
    },
    setFavouriteAdvices: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.childDataSet.favoriteadvices = action.payload;
    },
    setFavouriteGames: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.childDataSet.favoritegames = action.payload;
    },
    setchatBotData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.childDataSet.chatBotData = stringifyWithFunctions(action.payload);
    },
  },
  
});

export const {setAllChildData,removeChild,setActiveChildData, setDownloadedBufferAgeBracket, setFavouriteAdvices, setFavouriteGames,setchatBotData} = childSlice.actions;
export default childSlice.reducer;
