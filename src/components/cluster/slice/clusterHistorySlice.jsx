import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post } from '../../../utils/request';

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
  extraReducers: (builder) => {
    builder
      .addCase(getAllCluster.fulfilled, (state, action) => {
        state.histories = action.payload.data
      })
  }
});

export const getAllCluster = createAsyncThunk(
  'clusterHistory/getAllCluster',
  async ({ idRound, eventId, clubId }) => {
    const data = await post(`/recruit/cluster/get-all`, { club_id: clubId, event_id: eventId, round_id: idRound })
    if (data?.status_code && data?.status_code != 200) {
      errorNotification(data.status_code, data.msg, "bottomRight")
    }
    return data;
  }
);

export default clusterHistorySlice;
