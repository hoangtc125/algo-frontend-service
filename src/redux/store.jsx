import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../layouts/appSlice';
import cameraSlice from '../components/camera/cameraSlice';
import formSlice from '../components/form/formSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    camera: cameraSlice.reducer,
    form: formSlice.reducer,
  },
});

export default store;
