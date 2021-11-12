import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Creates an example Redux reducer, a counter.

interface StudentState {
  id: number;
}

const initialState: StudentState = {
  id: 10001000,
};

export const studentSlice = createSlice({
  // Reducer name
  name: "student",
  // Initial State
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setId } = studentSlice.actions;
export default studentSlice.reducer;
