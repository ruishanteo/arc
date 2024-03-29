import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [] },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        key: new Date().getTime() + Math.random(),
        variant: "default",
        options: {},
        ...action.payload,
      });
    },
    dismissNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== action.payload
      );
    },
  },
});

export const { addNotification, dismissNotification } =
  notificationSlice.actions;
export const notificationsReducer = notificationSlice.reducer;
