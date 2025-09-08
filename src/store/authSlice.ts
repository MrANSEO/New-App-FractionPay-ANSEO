import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  idToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  idToken: localStorage.getItem('idToken'),
  isAuthenticated: !!localStorage.getItem('idToken'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.idToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('idToken', action.payload);
    },
    logout: (state) => {
      state.idToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('idToken');
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('idToken');
      state.idToken = token;
      state.isAuthenticated = !!token;
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;