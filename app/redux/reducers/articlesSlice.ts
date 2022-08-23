import {createSlice, PayloadAction} from '@reduxjs/toolkit';
interface ArticleDataType {
  article: {
    articles: string;
  };
  dailyDataCategory:any;
  showedDailyDataCategory:any;
}
const initialState: ArticleDataType = {
  article: { 
    articles: '',
  },
  dailyDataCategory:{},
  showedDailyDataCategory:{}
};
export const articlesSlice = createSlice({
  name: 'articlesData',
  initialState,
  reducers: {
    setAllArticleData: (
      state,
      action: PayloadAction<any>,
    ) => {
      (typeof action.payload == 'object') ? state.article.articles = JSON.stringify(action.payload) : state.article.articles = action.payload;
    },
    setDailyArticleGamesCategory: (
      state,
      action: PayloadAction<any>,
    ) => {
        state.dailyDataCategory = action.payload;
    },
    setShowedDailyDataCategory: (
      state,
      action: PayloadAction<any>,
    ) => {
        state.showedDailyDataCategory = action.payload;
    }
  },
});

export const {setAllArticleData, setDailyArticleGamesCategory, setShowedDailyDataCategory} = articlesSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default articlesSlice.reducer;