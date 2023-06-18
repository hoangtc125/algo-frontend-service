import { createSlice } from '@reduxjs/toolkit';

const clubSlice = createSlice({
  name: 'club',
  initialState: {
    id: null,
    info: {},
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
  }
});


export default clubSlice;
