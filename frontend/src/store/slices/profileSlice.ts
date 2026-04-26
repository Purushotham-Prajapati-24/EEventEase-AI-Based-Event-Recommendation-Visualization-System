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

export const followUser = createAsyncThunk(
  "profile/followUser", 
  async ({ targetId, currentUserId }: { targetId: string; currentUserId: string }) => {
    await api.post(`/users/${targetId}/follow`);
    return { targetId, currentUserId };
  }
);

export const unfollowUser = createAsyncThunk(
  "profile/unfollowUser", 
  async ({ targetId, currentUserId }: { targetId: string; currentUserId: string }) => {
    await api.post(`/users/${targetId}/unfollow`);
    return { targetId, currentUserId };
  }
);

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
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
        state.currentProfile = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { targetId, currentUserId } = action.payload;
        
        // Update the profile being viewed if it's the target
        if (state.currentProfile && state.currentProfile._id === targetId) {
          if (!state.currentProfile.followers.includes(currentUserId)) {
            state.currentProfile.followers.push(currentUserId);
          }
        }
        
        // Update the profile being viewed if it's the current user (my following list)
        if (state.currentProfile && state.currentProfile._id === currentUserId) {
          if (!state.currentProfile.following.includes(targetId)) {
            state.currentProfile.following.push(targetId);
          }
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { targetId, currentUserId } = action.payload;
        
        // Update the profile being viewed if it's the target
        if (state.currentProfile && state.currentProfile._id === targetId) {
          state.currentProfile.followers = state.currentProfile.followers.filter(
            (id: string) => id !== currentUserId
          );
        }
        
        // Update the profile being viewed if it's the current user (my following list)
        if (state.currentProfile && state.currentProfile._id === currentUserId) {
          state.currentProfile.following = state.currentProfile.following.filter(
            (id: string) => id !== targetId
          );
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
