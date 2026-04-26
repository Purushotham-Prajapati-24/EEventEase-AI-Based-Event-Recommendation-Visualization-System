import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface ChatState {
  chats: any[];
  messages: any[];
  activeChat: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  messages: [],
  activeChat: null,
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const response = await api.get("/chats");
  return response.data;
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId: string) => {
  const response = await api.get(`/chats/${chatId}/messages`);
  return response.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((m) => m._id === messageId);
      if (message) {
        message.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setActiveChat, addMessage, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
