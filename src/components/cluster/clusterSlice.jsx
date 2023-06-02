import { createSlice } from '@reduxjs/toolkit';

const clusterSlice = createSlice({
  name: 'cluster',
  initialState: { file: [], dataset: [], header: [] },
  reducers: {
    clear: (state, action) => {
      state.file = []
      state.dataset = []
      state.header = []
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
        state.file[0] = {...state.file[0], status: "done"}
      }
    },
  },
});

export default clusterSlice;
