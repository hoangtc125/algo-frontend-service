import { createSlice } from '@reduxjs/toolkit';

const cameraSlice = createSlice({
  name: 'camera',
  initialState: { ip: "192.168.1.9", images: [] },
  reducers: {
    changeIP: (state, action) => {
      state.ip = action.payload;
    },
    addImage: (state, action) => {
      state.images.push(action.payload)
    },
    clearImage: (state, action) => {
      state.images = []
    },
  },
});

export default cameraSlice;
