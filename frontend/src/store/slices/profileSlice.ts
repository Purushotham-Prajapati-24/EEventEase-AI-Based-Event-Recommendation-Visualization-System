import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface ProfileState {
  currentProfile: any | null;
  followers: any[];
  following: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  followers: [],
  following: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
});

export const followUser = createAsyncThunk("profile/followUser", async (userId: string) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
