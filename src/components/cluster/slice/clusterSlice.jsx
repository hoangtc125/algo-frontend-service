import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

const clusterStorage = JSON.parse(sessionStorage.getItem("clusterData"))

const clusterSlice = createSlice({
  name: 'cluster',
  initialState: {
    header: clusterStorage?.header || [],
    collDiffData: clusterStorage?.collDiffData || [],
    dataset: clusterStorage?.dataset || [],
    vectorset: clusterStorage?.vectorset || [],
    selectedRecord: clusterStorage?.selectedRecord || [],
    supervisedSet: clusterStorage?.supervisedSet || [],
    supervisedOptions: clusterStorage?.supervisedOptions || [
      { id: v4(), value: "Cụm 1" },
      { id: v4(), value: "Cụm 2" },
      { id: v4(), value: "Cụm 3" },
      { id: v4(), value: "Cụm 4" },
      { id: v4(), value: "Cụm 5" },
    ],
    roundResults: clusterStorage?.roundResults || [],
  },
  reducers: {
    clear: (state, action) => {
      state.header = []
      state.dataset = []
      state.vectorset = []
      state.selectedRecord = []
      state.supervisedSet = []
      state.supervisedOptions = [
        { id: v4(), value: "Cụm 1" },
        { id: v4(), value: "Cụm 2" },
        { id: v4(), value: "Cụm 3" },
        { id: v4(), value: "Cụm 4" },
        { id: v4(), value: "Cụm 5" },
      ]
      state.collDiffData = []
      state.roundResults = []
    },
    setDataset: (state, action) => {
      state.dataset = action.payload
      state.supervisedSet = Array(action.payload.length).fill(null)
    },
    setRoundResult: (state, action) => {
      state.roundResults = action.payload
    },
    setVectorset: (state, action) => {
      state.vectorset = Array.from({ length: action.payload.dataset }, () => Array(action.payload.header).fill({
        "text": [],
        "numerical": [],
        "categorical": [],
      }));
    },
    updateVectorset: (state, action) => {
      const headers = Object.keys(action.payload);
      headers.forEach(header => {
        const vectors = action.payload[header];
        vectors.data.forEach(vector => {
          state.vectorset[vector.id][header][vectors.type] = vector.data
        });
      });
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
    clearSupervisedSet: (state, action) => {
      state.supervisedSet = Array(state.dataset.length).fill(null)
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
