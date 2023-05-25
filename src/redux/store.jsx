import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../layouts/appSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
