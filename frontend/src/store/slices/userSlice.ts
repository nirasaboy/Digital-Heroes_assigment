import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  role: string | null;
  subscriptionStatus: string | null;
}

const initialState: UserState = {
  id: null,
  role: null,
  subscriptionStatus: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.subscriptionStatus = action.payload.subscriptionStatus;
    },
    logout(state) {
      state.id = null;
      state.role = null;
      state.subscriptionStatus = null;
    }
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
