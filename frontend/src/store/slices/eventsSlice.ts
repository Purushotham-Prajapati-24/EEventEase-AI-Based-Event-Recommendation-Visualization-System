import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "@/lib/api";

export interface Event {
  _id: string;
  title: string;
  description: string;
  organizer: string;
  date: string;
  location: string;
  tags: string[];
  capacity: number;
  registeredAttendees: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

interface EventsState {
  events: Event[];
  event: Event | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: EventsState = {
  events: [],
  event: null,
  isLoading: false,
  isError: false,
  message: "",
};

export const getEvents = createAsyncThunk("events/getAll", async (_, thunkAPI) => {
  try {
    return await fetchWithAuth("/api/events");
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getEvent = createAsyncThunk("events/getOne", async (id: string, thunkAPI) => {
  try {
    return await fetchWithAuth(`/api/events/${id}`);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const eventsSlice = createSlice({
  name: "events",
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
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = eventsSlice.actions;
export default eventsSlice.reducer;
