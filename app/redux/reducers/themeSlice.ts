import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    increment: (state):any => {
      state.value += 1;
    },
    decrement: (state):any => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>):any => {
      state.value += action.payload;
    },
  },
});

export const {increment, decrement, incrementByAmount} = themeSlice.actions;
export const selectCount = (state: any):any => state.theme.value;

export default themeSlice.reducer;
