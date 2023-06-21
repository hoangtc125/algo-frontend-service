import { v4 } from 'uuid';
import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    position: null,
    edit: false,
  },
  reducers: {
    clear: (state, action) => {
      state.position = null;
      state.edit= false
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
  }
});


export default mapSlice;
