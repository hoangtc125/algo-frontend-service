import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../layouts/appSlice';
import cameraSlice from '../components/camera/cameraSlice';
import formSlice from '../components/formBuilder/formSlice';
import formStoreSlice from '../components/formStore/formStoreSlice';
import clusterSlice from '../components/cluster/clusterSlice';
import clusterFileSlice from '../components/cluster/clusterFileSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    camera: cameraSlice.reducer,
    form: formSlice.reducer,
    formStore: formStoreSlice.reducer,
    cluster: clusterSlice.reducer,
    clusterFile: clusterFileSlice.reducer,
  },
});

export default store;
