import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../layouts/appSlice';
import cameraSlice from '../components/camera/cameraSlice';
import formSlice from '../components/formBuilder/formSlice';
import formStoreSlice from '../components/formStore/formStoreSlice';
import clusterSlice from '../components/cluster/slice/clusterSlice';
import clusterFileSlice from '../components/cluster/slice/clusterFileSlice';
import clusteringSlice from '../components/cluster/slice/clusteringSlice';
import clusterHistorySlice from '../components/cluster/slice/clusterHistorySlice';
import mapSlice from '../components/map/mapSlice';
import clubSlice from '../components/club/clubSlice';

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    camera: cameraSlice.reducer,
    form: formSlice.reducer,
    formStore: formStoreSlice.reducer,
    cluster: clusterSlice.reducer,
    clusterFile: clusterFileSlice.reducer,
    clustering: clusteringSlice.reducer,
    clusterHistory: clusterHistorySlice.reducer,
    map: mapSlice.reducer,
    club: clubSlice.reducer,
  },
});

export default store;
