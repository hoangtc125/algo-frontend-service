import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../utils/request';

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
      .addCase(loginFirebase.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loginFirebase.fulfilled, (state, action) => {
        if (!action.payload["status_code"]) {
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

export const aboutMe = createAsyncThunk(
  'app/aboutMe',
  async () => {
    const data = await get(`/account/me`)
    return data.data;
  }
);

export default appSlice;
