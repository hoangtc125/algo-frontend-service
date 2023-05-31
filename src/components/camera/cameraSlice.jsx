import { createSlice } from '@reduxjs/toolkit';

const cameraSlice = createSlice({
  name: 'camera',
  initialState: { single: false, ip: "192.168.1.9", images: [], loading: false },
  reducers: {
    changeIP: (state, action) => {
      state.ip = action.payload;
    },
    addImage: (state, action) => {
      if (!state.images.includes(action.payload.uid)) {
        state.images.push(action.payload)
      }
    },
    addSingleImage: (state, action) => {
      state.images = [action.payload]
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setSingle: (state, action) => {
      state.single = action.payload
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(item => item.uid != action.payload.uid);
    },
    clear: (state, action) => {
      state.images = []
      state.single = false
      state.ip = "192.168.1.9"
      state.loading = false
    },
  },
});

export default cameraSlice;
