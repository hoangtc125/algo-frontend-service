import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../utils/request';
import { openNotification } from '../utils/notification';

const appSlice = createSlice({
  name: 'app',
  initialState: { token: null, account: null, api_permissions: null, loading: false },
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
    },
    addAccount: (state, action) => {
      state.account = action.payload["account"]
      state.api_permissions = action.payload["api_permissions"]
    },
    removeAccount: (state, action) => {
      state.account = null
      state.api_permissions = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!action.payload["status_code"] && action.payload["token_type"] && action.payload["token_type"]) {
          const token = `${action.payload["token_type"]} ${action.payload["access_token"]}`;
          state.token = token
          localStorage.setItem("accessToken", token)
        }
      })
      .addCase(loginFirebase.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loginFirebase.fulfilled, (state, action) => {
        if (!action.payload["status_code"] && action.payload["token_type"] && action.payload["token_type"]) {
          const token = `${action.payload["token_type"]} ${action.payload["access_token"]}`;
          state.token = token
          localStorage.setItem("accessToken", token)
        }
      })
      .addCase(aboutMe.fulfilled, (state, action) => {
        state.account = action.payload["account"]
        state.api_permissions = action.payload["api_permissions"]
        state.loading = false
        localStorage.setItem("account", JSON.stringify(action.payload))
      })
      .addCase(aboutMe.rejected, (state, action) => {
        state.loading = false
      })
  },
});

export const loginFirebase = createAsyncThunk(
  'app/loginWithFirebase',
  async (accessToken) => {
    const data = await post(`/account/login-firebase?firebase_token=${accessToken}`)
    return data;
  }
);

export const login = createAsyncThunk(
  'app/login',
  async (body) => {
    const data = await post(`/account/login`, body, {"Content-Type": "application/x-www-form-urlencoded"})
    if (data?.status_code != 200) {
      openNotification(data.status_code, data.msg, "bottomRight")
    }
    return data;
  }
);

export const aboutMe = createAsyncThunk(
  'app/aboutMe',
  async () => {
    const data = await get(`/account/me`)
    if (data?.status_code != 200) {
      openNotification(data.status_code, data.msg, "bottomRight")
    }
    return data.data;
  }
);

export default appSlice;
