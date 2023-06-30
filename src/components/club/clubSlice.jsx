import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { del, post, put } from '../../utils/request';
import { errorNotification, successNotification } from '../../utils/notification';

const clubSlice = createSlice({
  name: 'club',
  initialState: {
    id: null,
    info: {},
    members: [],
    groups: [],
    select: null,
    selectedUser: [],
    events: [],
  },
  reducers: {
    clear: (state, action) => {
      state.id = null
      state.info = {}
      state.members = []
      state.groups = []
      state.select = null
      state.selectedUser = []
      state.events = []
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
    setSelectOnly: (state, action) => {
      state.select = action.payload;
    },
    setSelect: (state, action) => {
      state.select = action.payload;
      state.selectedUser = []
    },
    setSelectedUserRadio: (state, action) => {
      state.selectedUser = [action.payload];
    },
    setSelectedUserSelect: (state, action) => {
      state.selectedUser = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMember.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          let member = state.members.find(e => e.member.id == action.payload["data"]["member_id"])
          member.member = { ...member.member, ...action.payload["data"]["member_update"] }
        } else {
          errorNotification(action.payload["status_code"], action.payload["msg"], "bottomRight")
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
      .addCase(deleteMember.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          state.members = state.members.filter(e => e.member.id != action.payload["data"])
        } else {
          errorNotification(action.payload["status_code"], action.payload["msg"], "bottomRight")
        }
      })
      .addCase(createMember.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          state.members.push(action.payload["data"])
        } else {
          errorNotification(action.payload["status_code"], action.payload["msg"], "bottomRight")
        }
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          successNotification("Thành công", "", "bottomRight")
        } else {
          errorNotification(action.payload["status_code"], action.payload["msg"], "bottomRight")
        }
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        if (action.payload["status_code"] == 200) {
          successNotification("Thành công", "", "bottomRight")
          state.events.push(action.payload["data"])
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

export const deleteMember = createAsyncThunk(
  'club/deleteMember',
  async ({ member_id }) => {
    const data = await del(`/club/member/delete?member_id=${member_id}`)
    return data;
  }
);

export const createMember = createAsyncThunk(
  'club/createMember',
  async (payload) => {
    const data = await post(`/club/member/create`, payload)
    return data;
  }
);


export const updateEvent = createAsyncThunk(
  'club/updateEvent',
  async ({event_id, payload}) => {
    const data = await put(`/recruit/event/update?event_id=${event_id}`, payload)
    return data;
  }
);

export const createEvent = createAsyncThunk(
  'club/createEvent',
  async (payload) => {
    const data = await post(`/recruit/event/create`, payload)
    return data;
  }
);

export default clubSlice;
