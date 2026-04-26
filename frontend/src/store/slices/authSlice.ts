import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { setAccessToken, refreshAccessToken } from "@/lib/api";
import { followUser, unfollowUser } from "./profileSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  bio?: string;
  interests?: string[];
  followers?: string[];
  following?: string[];
  token?: string; // Optional during transit
}

interface AuthState {
  user: Omit<User, "token"> | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  isInitialized: boolean;
}

// Get user from localStorage
const userStr = localStorage.getItem("user");
const user: Omit<User, "token"> | null = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
  user: user,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  isInitialized: false,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const token = await refreshAccessToken();
    if (!token) throw new Error("Failed to refresh token");
    return token;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setUser: (state, action: PayloadAction<User>) => {
      const { token, ...userData } = action.payload;
      if (token) setAccessToken(token);
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },
    logout: (state) => {
      state.user = null;
      setAccessToken(null);
      localStorage.removeItem("user");
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isSuccess = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        
        // If localStorage user is gone (cleared by refreshAccessToken), sync state
        const hasUser = localStorage.getItem("user");
        if (!hasUser) {
          state.user = null;
        }
      })
      // Listen to follow/unfollow actions from profileSlice
      .addCase(followUser.fulfilled, (state, action) => {
        const { targetId } = action.payload;
        if (state.user) {
          if (!state.user.following) state.user.following = [];
          if (!state.user.following.includes(targetId)) {
            state.user.following.push(targetId);
            localStorage.setItem("user", JSON.stringify(state.user));
          }
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { targetId } = action.payload;
        if (state.user && state.user.following) {
          state.user.following = state.user.following.filter(id => id !== targetId);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});

export const { reset, setUser, logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;
