import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/lib/api";
import type { Event } from "./eventsSlice";

interface Recommendation {
  event: Event;
  score: number;
  reason: string;
}

interface RecommendationsState {
  recommendations: Recommendation[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: RecommendationsState = {
  recommendations: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const getRecommendations = createAsyncThunk("recommendations/get", async (userId: string, thunkAPI) => {
  try {
    return await fetchWithAuth(`/api/recommendations/${userId}`);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
