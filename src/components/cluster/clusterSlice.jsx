import { createSlice } from '@reduxjs/toolkit';

const clusterFileStorage = JSON.parse(sessionStorage.getItem("clusterFile"))

const clusterSlice = createSlice({
  name: 'cluster',
  initialState: {
    file: clusterFileStorage?.file || [],
    dataset: clusterFileStorage?.dataset || [],
    header: clusterFileStorage?.header || [],
    nameCol: clusterFileStorage?.nameCol || ``,
    emailCol: clusterFileStorage?.emailCol || ``,
  },
  reducers: {
    clear: (state, action) => {
      state.file = []
      state.dataset = []
      state.header = []
      state.nameCol = ``
      state.emailCol = ``
    },
    setFile: (state, action) => {
      state.file = [action.payload];
    },
    setDataset: (state, action) => {
      state.dataset = action.payload
    },
    setHeader: (state, action) => {
      state.header = action.payload
      if (state.file) {
        state.file[0] = { ...state.file[0], status: "done" }
      }
    },
    updateFile: (state, action) => {
      state.file[0] = { ...state.file[0], ...action.payload }
    },
    updateHeader: (state, action) => {
      const index = state.header.findIndex(e => e.id == action.payload.id)
      state.header[index] = { ...state.header[index], ...action.payload.header }
    },
    setNameCol: (state, action) => {
      state.nameCol = action.payload
    },
    setEmailCol: (state, action) => {
      state.emailCol = action.payload
    },
  },
});

export default clusterSlice;
