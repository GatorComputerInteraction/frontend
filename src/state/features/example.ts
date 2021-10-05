import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Creates an example Redux reducer, a counter.

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  // Reducer name
  name: "counter",
  // Initial State
  initialState,
  // Any associated actions for the reducer (see pages/Schedule.tsx for usage)
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
