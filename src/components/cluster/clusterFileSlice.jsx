import { createSlice } from '@reduxjs/toolkit';

const clusterFileStorage = JSON.parse(sessionStorage.getItem("clusterFile"))

const clusterFileSlice = createSlice({
  name: 'clusterFile',
  initialState: {
    file: clusterFileStorage?.file || [],
    emailCol: clusterFileStorage?.emailCol || ``,
  },
  reducers: {
    clear: (state, action) => {
      state.file = []
      state.emailCol = ``
    },
    setFile: (state, action) => {
      state.file = [action.payload];
    },
    setEmailCol: (state, action) => {
      state.emailCol = action.payload
    },
  },
});

export default clusterFileSlice;
