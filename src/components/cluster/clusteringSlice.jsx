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
  },
  reducers: {
    clear: (state, action) => {
      state.id = null
      state.process = 0
      state.deployLog = []
      state.clusteringLog = []
      state.membership = []
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setProcess: (state, action) => {
      state.process = action.payload;
    },
    setDeployLog: (state, action) => {
      state.deployLog = action.payload;
    },
    setClusteringLog: (state, action) => {
      state.clusteringLog = action.payload
    },
    setMembership: (state, action) => {
      state.membership = action.payload
    },
  },
});

export default clusteringSlice;
