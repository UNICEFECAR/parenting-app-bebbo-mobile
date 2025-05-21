import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ArticleDataType {
  article: {
    articles: string;
    isSearchIndex: boolean;
    searchIndex: any;
  };
  dailyDataCategory: any;
  showedDailyDataCategory: any;
}
const initialState: ArticleDataType = {
  article: {
    articles: "",
    isSearchIndex: true,
    searchIndex: null,
  },
  dailyDataCategory: {},
  showedDailyDataCategory: {},
};
export const articlesSlice = createSlice({
  name: "articlesData",
  initialState,
  reducers: {
    setAllArticleData: (state, action: PayloadAction<any>): any => {
      typeof action.payload == "object"
        ? (state.article.articles = JSON.stringify(action.payload))
        : (state.article.articles = action.payload);
    },
    setDailyArticleGamesCategory: (state, action: PayloadAction<any>): any => {
      state.dailyDataCategory = action.payload;
    },
    setShowedDailyDataCategory: (state, action: PayloadAction<any>): any => {
      state.showedDailyDataCategory = action.payload;
    },
    setSearchIndex: (state, action: PayloadAction<any>): any => {
      console.log("[test]", action);
      state.article.searchIndex = action.payload;
    },
    resetSearchIndex: (state, action: PayloadAction<any>): any => {
      state.article.isSearchIndex = action.payload;
    },
  },
});

export const {
  setAllArticleData,
  setDailyArticleGamesCategory,
  setShowedDailyDataCategory,
  resetSearchIndex,
  setSearchIndex,
} = articlesSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default articlesSlice.reducer;
