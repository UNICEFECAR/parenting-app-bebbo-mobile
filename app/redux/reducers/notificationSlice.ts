import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface NotiDataType {
  notifications: Array<any>;
  growthEnabled: boolean;
  developmentEnabled: boolean;
  vchcEnabled: boolean;
  localNotifications: Array<any>;
  scheduledlocalNotifications: Array<any>;
  localNotificationGenerateType: {
    generateFlag: boolean;
    generateType: string;
    childuuid: string;
  };
}
const initialState: NotiDataType = {
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
    ):any => {
      state.notifications = (action.payload);
    },
    toggleNotificationFlags: (state: any,
      action: PayloadAction<any>,):any => {
      state[action.payload.key] = action.payload.value;
    },
    setAllLocalNotificationData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      console.log(JSON.stringify(action.payload),"action.payload localNotifications---");
      state.localNotifications = (action.payload);
    },
    setAllScheduledLocalNotificationData: (
      state,
      action: PayloadAction<any>,
    ):any => {
      console.log(JSON.stringify(action.payload),"action.payload scheduledlocalNotifications---");
      state.scheduledlocalNotifications = (action.payload);
    },
    setAllLocalNotificationGenerateType:( state:any,
      action: PayloadAction<any>,):any=>{
        console.log(JSON.stringify(action.payload),"action.payload---");
        state.localNotificationGenerateType = action.payload;
      },
  },
});

export const { setAllNotificationData, toggleNotificationFlags, setAllLocalNotificationData,setAllLocalNotificationGenerateType, setAllScheduledLocalNotificationData } = notificationSlice.actions;
export default notificationSlice.reducer;
