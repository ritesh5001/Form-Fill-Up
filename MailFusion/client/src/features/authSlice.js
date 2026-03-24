import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('mailfusion_user') || 'null');
const token = localStorage.getItem('mailfusion_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    token,
  },
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('mailfusion_user', JSON.stringify(action.payload.user));
      localStorage.setItem('mailfusion_token', action.payload.token);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('mailfusion_user');
      localStorage.removeItem('mailfusion_token');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
