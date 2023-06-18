import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { put } from '../../utils/request';
import { errorNotification } from '../../utils/notification';

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMember.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          let member = state.members.find(e => e.member.id == action.payload["data"]["member_id"])
          member.member = { ...member.member, ...action.payload["data"]["member_update"] }
        }
      })
      .addCase(updateMemberGroup.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          let member = state.members.find(e => e.member.id == action.payload["data"]["member_id"])
          let group_id = member.member.group_id
          if (action.payload["data"]["add"]) {
            group_id.push(action.payload["data"]["group_id"])
          } else {
            group_id = group_id.filter(e => e != action.payload["data"]["group_id"])
          }
          member.member = { ...member.member, "group_id": group_id }
        } else {
          errorNotification(action.payload["status_code"], action.payload["msg"], "bottomRight")
        }
      })
  },
});

export const updateMember = createAsyncThunk(
  'club/updateMember',
  async ({ id, input }) => {
    const data = await put(`/club/member/update?member_id=${id}`, input)
    return data;
  }
);

export const updateMemberGroup = createAsyncThunk(
  'club/updateMemberGroup',
  async ({ member_id, group_id, add }) => {
    const data = await put(`/club/member/update-group?member_id=${member_id}&group_id=${group_id}&add=${add}`)
    return data;
  }
);

export default clubSlice;
