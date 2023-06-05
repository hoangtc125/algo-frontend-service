import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

const clusterStorage = JSON.parse(sessionStorage.getItem("clusterData"))

const clusterSlice = createSlice({
  name: 'cluster',
  initialState: {
    header: clusterStorage?.header || [],
    collDiffData: clusterStorage?.collDiffData || [],
    dataset: clusterStorage?.dataset || [],
    selectedRecord: clusterStorage?.selectedRecord || [],
    supervisedSet: clusterStorage?.supervisedSet || [],
    supervisedOptions: clusterStorage?.supervisedOptions || [{ id: v4(), value: "Cụm 1" }, { id: v4(), value: "Cụm 2" }],
  },
  reducers: {
    clear: (state, action) => {
      state.header = []
      state.dataset = []
      state.selectedRecord = []
      state.supervisedSet = []
      state.supervisedOptions = [{ id: v4(), value: "Cụm 1" }, { id: v4(), value: "Cụm 2" }]
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
      const newSupervisedSet = state.supervisedSet.map(tagId => {
        return action.payload.map(e => e.id).includes(tagId) ? tagId : null
      })
      state.supervisedSet = newSupervisedSet
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
