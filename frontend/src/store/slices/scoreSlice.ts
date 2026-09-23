import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScoreState {
  scores: any[];
}

const initialState: ScoreState = {
  scores: [],
};

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScores(state, action: PayloadAction<any[]>) {
      state.scores = action.payload;
    }
  },
});

export const { setScores } = scoreSlice.actions;
export default scoreSlice.reducer;
