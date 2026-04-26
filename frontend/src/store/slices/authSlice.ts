import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { setAccessToken } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  interests?: string[];
  token?: string; // Optional during transit
}

interface AuthState {
  user: Omit<User, "token"> | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
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
};

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
  },
});

export const { reset, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
