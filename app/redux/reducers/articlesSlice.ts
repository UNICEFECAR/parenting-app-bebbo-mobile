import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface articleDataType {
  // name: string;
  article: { 
    articles: string;
  }
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: articleDataType = {
  // name: 'Rest of the world',
  article: { 
    articles: '',
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
      console.log("articles data---",state);
      console.log(typeof action.payload);
      // console.log(action.payload.map(user => user));
      (typeof action.payload == 'object') ? state.article.articles = JSON.stringify(action.payload) : state.article.articles = action.payload;
      // if(action.payload)
      // {
      //   state.article.articles = JSON.stringify(action.payload);
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

export const {setAllArticleData} = articlesSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default articlesSlice.reducer;
