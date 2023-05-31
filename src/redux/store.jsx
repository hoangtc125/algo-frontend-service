import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../layouts/appSlice';
import cameraSlice from '../components/camera/cameraSlice';
import formSlice from '../components/form/formSlice';
import formStoreSlice from '../components/formStore/formStoreSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    camera: cameraSlice.reducer,
    form: formSlice.reducer,
    formStore: formStoreSlice.reducer,
  },
});

export default store;
