import { createSlice } from '@reduxjs/toolkit';

const clusterHistoryStorage = JSON.parse(sessionStorage.getItem("clusterHistory"))

const clusterHistorySlice = createSlice({
  name: 'clusterHistory',
  initialState: {
    histories: clusterHistoryStorage || [],
  },
  reducers: {
    clear: (state, action) => {
      state.histories = []
    },
    pushHistory: (state, action) => {
      // sessionStorage.setItem("clusterHistory", JSON.stringify([...state.histories, action.payload]))
      state.histories.push(action.payload)
    },
  },
});

export default clusterHistorySlice;
