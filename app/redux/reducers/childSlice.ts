import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ChildEntity } from '../../database/schema/ChildDataSchema';
interface childDataSet {
    allChild:Array<ChildEntity>,
    activeChild:ChildEntity
}
const initialState: childDataSet = {
   allChild:[],
   activeChild:{} as ChildEntity
};


export const childSlice = createSlice({
  name: 'childData',
  initialState,
  reducers: {
    setActiveChildData: (
      state,
      action: PayloadAction<any>,
    ) => {
      console.log("taxonomy data---",state);
      console.log(action.payload);
      if(action.payload[0])
      {
        // state.childData.activeChild = action.payload[0];
      }
    },
    setAllChildData: (
      state,
      action: PayloadAction<any>,
    ) => {
      if(action.payload?.length>0)
      {
        console.log(action.payload,"..action.payload..");
        state.allChild=action.payload;
      //   action.payload.map((value:ChildEntity)=>{
      //     //{name:value.name,uuid:value.uuid}
      //  console.log(value.birthDate,"..birthDate..");
      //    state.childData.allChild.push(value);
      //   })
      }
    },
    removeChild:(
      state,
      action: PayloadAction<any>,
    ) => {
       if(state.allChild?.length>0){
       state.allChild.splice(action.payload, 1);
       }
     }
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

 export const {setActiveChildData,setAllChildData,removeChild} = childSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default childSlice.reducer;
