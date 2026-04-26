import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

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
  return await api.get("/chats");
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId: string) => {
  return await api.get(`/chats/${chatId}/messages`);
});

export const accessChat = createAsyncThunk("chat/accessChat", async (userId: string) => {
  return await api.post("/chats", { userId });
});

export const fetchChatById = createAsyncThunk("chat/fetchChatById", async (chatId: string) => {
  return await api.get(`/chats/${chatId}`);
});


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      state.messages = [];
    },
    addMessage: (state, action) => {
      const exists = state.messages.find((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((m) => m._id === messageId);
      if (message) message.status = status;
    },
    addChat: (state, action) => {
      const exists = state.chats.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.chats.unshift(action.payload);
      }
    },
    updateMessageReadBy: (state, action) => {
      const { messageId, userId, readAt } = action.payload;
      const message = state.messages.find((m) => m._id === messageId);
      if (message) {
        if (!message.readBy) message.readBy = [];
        const alreadyRead = message.readBy.some((r: any) => (r.user?._id || r.user) === userId);
        if (!alreadyRead) {
          message.readBy.push({ user: userId, readAt });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.loading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchChats.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch chats";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        const exists = state.chats.find((c) => c._id === action.payload._id);
        if (!exists) state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        const exists = state.chats.find((c) => c._id === action.payload._id);
        if (!exists) state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      });
  },
});

export const { setActiveChat, addMessage, updateMessageStatus, addChat, updateMessageReadBy } = chatSlice.actions;
export default chatSlice.reducer;
