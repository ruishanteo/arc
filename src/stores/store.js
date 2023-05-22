import { configureStore } from "@reduxjs/toolkit";
import { notificationsReducer } from "../Notifications";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});
