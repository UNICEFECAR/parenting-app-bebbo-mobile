import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';

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
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const {increment, decrement, incrementByAmount} = themeSlice.actions;
export const selectCount = (state: RootState) => state.theme.value;

export default themeSlice.reducer;
