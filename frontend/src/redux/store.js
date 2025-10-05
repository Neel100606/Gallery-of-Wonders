import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice'; // Path adjusted
import authSliceReducer from './features/authSlice.js'; // Path adjusted

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;