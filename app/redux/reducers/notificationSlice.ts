import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {RootState} from './../../../App';
interface notiDataType {
  // name: string;
  notifications: Array<any>
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: notiDataType = {
  // name: 'Rest of the world',
  notifications: []
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
      console.log(action.payload, "notifications");
      // console.log(action.payload.map(user => user));
      state.notifications = (action.payload);
      // if(action.payload)|| Array.isArray(action.payload)
      // {
      //   state.article.articles = JSON.stringify(action.payload);
      // }
    },
    // toggleNotificationRead:(  state,
    //     action: PayloadAction<any>,)=>{
    //       state.notifications =(action.payload);

    // },
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

export const { setAllNotificationData } = notificationSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default notificationSlice.reducer;
