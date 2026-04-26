import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface Notification {
  _id: string;
  sender: { name: string };
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  items: Notification[];
  loading: boolean;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async () => {
    const response = await api.get("/notifications");
    return response;
  }
);

export const markRead = createAsyncThunk(
  "notifications/markRead",
  async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    return id;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(markRead.fulfilled, (state, action: PayloadAction<string>) => {
        const item = state.items.find((i) => i._id === action.payload);
        if (item) item.isRead = true;
      });
  },
});

export default notificationsSlice.reducer;
