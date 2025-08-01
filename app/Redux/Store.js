import { configureStore } from '@reduxjs/toolkit';
import authSlice, { authApi } from '@/app/Redux/services/AuthApi';

export const Store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
