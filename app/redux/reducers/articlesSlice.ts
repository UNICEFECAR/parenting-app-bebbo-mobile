import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface articleDataType {
  // name: string;
  article: {
    articles: string;
  },
  dailyDataCategory: {
    advice:number,
    games:number,
    currentadviceid:number,
    currentgamesid:number,
    currentDate:string

  },
  showedDailyDataCategory: {
    advice:Array<any>,
    games:Array<any>
  }
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: articleDataType = {
  // name: 'Rest of the world',
  article: { 
    articles: '',
  },
  dailyDataCategory: {
    advice:0,
    games:0,
    currentadviceid:0,
    currentgamesid:0,
    currentDate:''
  },
  showedDailyDataCategory: {
    advice:[],
    games:[]
  }
};
export const articlesSlice = createSlice({
  name: 'articlesData',
  initialState,
  reducers: {
    setAllArticleData: (
      state,
      action: PayloadAction<any>,
    ) => {
     // console.log("articles data---",state);
      //console.log(typeof action.payload);
      // console.log(action.payload.map(user => user));
      (typeof action.payload == 'object') ? state.article.articles = JSON.stringify(action.payload) : state.article.articles = action.payload;
      // if(action.payload)
      // {
      //   state.article.articles = JSON.stringify(action.payload);
      // }
    },
    setDailyArticleGamesCategory: (
      state,
      action: PayloadAction<any>,
    ) => {
     console.log("Daily data---",state);
      console.log(action.payload);
      // console.log(action.payload.map(user => user));
      // dailyDataCategory
      // if(action.payload)
      // {
        state.dailyDataCategory = action.payload;
      // }
    },
    setShowedDailyDataCategory: (
      state,
      action: PayloadAction<any>,
    ) => {
     console.log("Daily data---",state);
      console.log(action.payload);
      // console.log(action.payload.map(user => user));
      // dailyDataCategory
      // if(action.payload)
      // {
        state.showedDailyDataCategory = action.payload;
      // }
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

export const {setAllArticleData, setDailyArticleGamesCategory, setShowedDailyDataCategory} = articlesSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default articlesSlice.reducer;
