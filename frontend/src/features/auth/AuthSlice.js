import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    username: username || null,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;