import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '@/features/auth/types';

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Khôi phục từ localStorage nếu có
const savedUser = localStorage.getItem('adminUser');
const savedToken = localStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken');
const savedRefreshToken =
  localStorage.getItem('adminRefreshToken') || localStorage.getItem('refreshToken');

let parsedUser: AdminUser | null = null;
if (savedUser) {
  try {
    parsedUser = JSON.parse(savedUser);
  } catch (e) {
    console.error('Failed to parse adminUser from localStorage', e);
  }
}

const initialState: AuthState = {
  user: parsedUser,
  accessToken: savedToken,
  refreshToken: savedRefreshToken,
  isAuthenticated: !!(savedToken && parsedUser && (parsedUser.role === 'ADMIN' || parsedUser.role === 'MODERATOR')),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AdminUser;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = user.role === 'ADMIN' || user.role === 'MODERATOR';

      localStorage.setItem('adminUser', JSON.stringify(user));
      localStorage.setItem('adminAccessToken', accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('refreshToken');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
