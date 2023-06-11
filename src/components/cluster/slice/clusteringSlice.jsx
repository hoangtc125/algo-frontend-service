import { createSlice } from '@reduxjs/toolkit';

const clusteringStorage = JSON.parse(sessionStorage.getItem("clustering"))

const clusteringSlice = createSlice({
  name: 'clustering',
  initialState: {
    id: clusteringStorage?.id || null,
    process: clusteringStorage?.process || 0,
    deployLog: clusteringStorage?.deployLog || [],
    clusteringLog: clusteringStorage?.clusteringLog || [],
    membership: clusteringStorage?.membership || [],
    predLabels: clusteringStorage?.predLabels || [],
  },
  reducers: {
    clear: (state, action) => {
      state.id = null
      state.process = 0
      state.deployLog = []
      state.clusteringLog = []
      state.membership = []
      state.predLabels = []
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setProcess: (state, action) => {
      state.process = action.payload;
    },
    setDeployLog: (state, action) => {
      state.deployLog.push(action.payload);
    },
    setClusteringLog: (state, action) => {
      state.clusteringLog.push(action.payload);
    },
    setMembership: (state, action) => {
      state.membership = action.payload
    },
    setPredLabels: (state, action) => {
      state.predLabels = action.payload
    },
  },
});

export default clusteringSlice;
