import { createSlice } from '@reduxjs/toolkit';

const clusterStorage = JSON.parse(sessionStorage.getItem("clusterData"))

const clusterSlice = createSlice({
  name: 'cluster',
  initialState: {
    header: clusterStorage?.header || [],
    collDiffData: clusterStorage?.collDiffData || [],
    dataset: clusterStorage?.dataset || [],
    selectedRecord: clusterStorage?.selectedRecord || [],
    supervisedSet: clusterStorage?.supervisedSet || [],
    supervisedOptions: clusterStorage?.supervisedOptions || [],
  },
  reducers: {
    clear: (state, action) => {
      state.header = []
      state.dataset = []
      state.selectedRecord = []
      state.supervisedSet = []
      state.supervisedOptions = []
      state.collDiffData = []
    },
    setDataset: (state, action) => {
      state.dataset = action.payload
      state.supervisedSet = Array(action.payload.length).fill(null)
    },
    setCollDiffData: (state, action) => {
      state.collDiffData = action.payload;
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload
    },
    setSupervisedOptions: (state, action) => {
      state.supervisedOptions = action.payload
    },
    setSupervisedSet: (state, action) => {
      state.supervisedSet[action.payload.index] = action.payload.supervisedSet
    },
    setHeader: (state, action) => {
      state.header = action.payload
    },
    updateHeader: (state, action) => {
      const index = state.header.findIndex(e => e.id == action.payload.id)
      state.header[index] = { ...state.header[index], ...action.payload.header }
    },
  },
});

export default clusterSlice;
