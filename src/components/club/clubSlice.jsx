import { createSlice } from '@reduxjs/toolkit';

const clubSlice = createSlice({
  name: 'club',
  initialState: {
    id: null,
    info: {},
    members: [],
    groups: [],
  },
  reducers: {
    clear: (state, action) => {
      state.id = null
      state.info = {}
      state.members = []
      state.groups = []
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setMember: (state, action) => {
      state.members = action.payload;
    },
    setGroup: (state, action) => {
      state.groups = action.payload;
    },
  }
});


export default clubSlice;
