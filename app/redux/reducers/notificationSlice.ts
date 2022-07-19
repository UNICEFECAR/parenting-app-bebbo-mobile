import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {RootState} from './../../../App';
interface notiDataType {
  // name: string;
  notifications: Array<any>,
  growthEnabled: boolean,
  developmentEnabled: boolean,
  vchcEnabled: boolean,
  localNotifications: Array<any>,
  scheduledlocalNotifications: Array<any>,
  localNotificationGenerateType: {
    generateFlag: boolean,
    generateType: string,
    childuuid: string
  }
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: notiDataType = {
  // name: 'Rest of the world',
  notifications: [],
  growthEnabled: true,
  developmentEnabled: true,
  vchcEnabled: true,
  localNotifications:[],
  scheduledlocalNotifications:[],
  localNotificationGenerateType: {
    generateFlag: true,
    generateType: 'add',
    childuuid: 'all'
  }
};
export const notificationSlice = createSlice({
  name: 'notificationData',
  initialState,
  reducers: {
    setAllNotificationData: (
      state,
      action: PayloadAction<any>,
    ) => {
      // console.log("articles data---",state);
     // console.log(action.payload, "notifications");
      // console.log(action.payload.map(user => user));
      state.notifications = (action.payload);
      // if(action.payload)|| Array.isArray(action.payload)
      // {
      //   state.article.articles = JSON.stringify(action.payload);
      // }
    },
    toggleNotificationFlags: (state: any,
      action: PayloadAction<any>,) => {
      state[action.payload.key] = action.payload.value;
    },
    setAllLocalNotificationData: (
      state,
      action: PayloadAction<any>,
    ) => {
      console.log(JSON.stringify(action.payload),"action.payload localNotifications---");
      state.localNotifications = (action.payload);
    },
    setAllScheduledLocalNotificationData: (
      state,
      action: PayloadAction<any>,
    ) => {
      console.log(JSON.stringify(action.payload),"action.payload scheduledlocalNotifications---");
      state.scheduledlocalNotifications = (action.payload);
    },
    setAllLocalNotificationGenerateType:( state:any,
      action: PayloadAction<any>,)=>{
        console.log(JSON.stringify(action.payload),"action.payload---");
        state.localNotificationGenerateType = action.payload;
      },
    // toggleNotificationDelete:(  state,
    //     action: PayloadAction<any>,)=>{
    //       state.notifications =(action.payload);
    //     // action.payload.chiluuid,action.payload.item
    // }
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value = action.payload;
  //     });
  // },
});

export const { setAllNotificationData, toggleNotificationFlags, setAllLocalNotificationData,setAllLocalNotificationGenerateType, setAllScheduledLocalNotificationData } = notificationSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default notificationSlice.reducer;
