import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import recommendationsReducer from "./slices/recommendationsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import chatReducer from "./slices/chatSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    recommendations: recommendationsReducer,
    notifications: notificationsReducer,
    chat: chatReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
