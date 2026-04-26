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
  return await api.get(`/users/${userId}`);
});

export const updateProfile = createAsyncThunk(
  "profile/updateProfile", 
  async ({ userId, data }: { userId: string, data: any }) => {
    return await api.put(`/users/${userId}`, data);
  }
);

export const followUser = createAsyncThunk("profile/followUser", async (userId: string) => {
  return await api.post(`/users/${userId}/follow`);
});

export const unfollowUser = createAsyncThunk("profile/unfollowUser", async (userId: string) => {
  return await api.post(`/users/${userId}/unfollow`);
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
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        // Optimistic UI or refetch? Let's assume refetch or manual update
        if (state.currentProfile) {
          // Update followers locally if needed
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
